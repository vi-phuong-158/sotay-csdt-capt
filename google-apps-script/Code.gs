function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ["users", "documents", "activity_logs"];
  var headers = {
    users: [
      "id",
      "username",
      "password",
      "full_name",
      "unit",
      "role",
      "lastLogin",
    ],
    documents: [
      "id",
      "title",
      "issue_number",
      "doc_date",
      "issuing_authority",
      "summary",
      "category",
      "categoryLabel",
      "drive_link",
      "drive_link_type",
      "updatedAt",
      "created_at",
    ],
    activity_logs: [
      "id",
      "timestamp",
      "username",
      "action",
      "details",
      "created_at",
    ],
  };

  sheets.forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers[name]);
      sheet
        .getRange(1, 1, 1, headers[name].length)
        .setFontWeight("bold")
        .setBackground("#e2f0e8");
    } else {
      var lastCol = sheet.getLastColumn();
      var existingHeaders =
        lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
      var missingHeaders = headers[name].filter(function (h) {
        return existingHeaders.indexOf(h) === -1;
      });

      if (missingHeaders.length > 0) {
        sheet
          .getRange(1, lastCol + 1, 1, missingHeaders.length)
          .setValues([missingHeaders])
          .setFontWeight("bold")
          .setBackground("#fff2cc");
      }
    }
  });

  var userSheet = ss.getSheetByName("users");
  formatPlainTextColumns(userSheet, ["id", "username", "password"]);
  if (userSheet.getLastRow() < 2) {
    appendObjectRow(userSheet, {
      id: "admin-001",
      username: "admin",
      password: "admin123",
      full_name: "Quáº£n trá»‹ viÃªn",
      unit: "Há»‡ thá»‘ng",
      role: "admin",
      lastLogin: new Date().toISOString(),
    });
    /*
    userSheet.appendRow([
      "admin-001",
      "admin",
      "admin123",
      "Quản trị viên",
      "Hệ thống",
      "admin",
      new Date().toISOString(),
    ]);
    */
  }

  return "Đã thiết lập và cập nhật cấu trúc các bảng thành công!";
}

var SECRET_KEY = "CSDT_CAPT_SECRET";
var UPLOAD_FOLDER_ID = "1wk_kBZtz9Fq6XqWDpcnI1QoFbMWaY5yv";

function doGet(e) {
  try {
    var action = e.parameter.action;
    var sheetName = e.parameter.sheet;

    if (!action || !sheetName) {
      return responseJson({ error: "Missing action or sheet parameter" }, 400);
    }

    if (sheetName === "users") {
      return responseJson({ error: "Unauthorized access to users sheet" }, 403);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return responseJson({ error: "Sheet not found: " + sheetName }, 404);
    }

    if (action === "get") {
      var data = getSheetDataAsObjects(sheet);
      return responseJson({ success: true, rows: data }, 200);
    }

    return responseJson({ error: "Invalid GET action" }, 400);
  } catch (error) {
    return responseJson({ error: error.toString() }, 500);
  }
}

function validateToken(token) {
  if (!token) return null;
  try {
    token = String(token).trim();
    var decodedBytes;
    try {
      decodedBytes = Utilities.base64DecodeWebSafe(token);
    } catch (webSafeError) {
      decodedBytes = Utilities.base64Decode(token);
    }
    var decoded = Utilities.newBlob(decodedBytes).getDataAsString("UTF-8");
    var parts = decoded.split(":");

    if (parts.length < 3) return null;

    var username = parts[0];
    var timestamp = parts[1];
    var key = parts.slice(2).join(":");

    if (key !== SECRET_KEY) return null;

    var now = new Date().getTime();
    if (now - parseInt(timestamp) > 24 * 60 * 60 * 1000) return null;

    return username;
  } catch (e) {
    console.error("Token validation error: " + e.toString());
    return null;
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    if (!action) {
      return responseJson({ error: "Missing action in body" }, 400);
    }

    if (action === "login") {
      var username = body.username;
      var password = body.password;

      if (!username || !password)
        return responseJson({ error: "Thiếu thông tin đăng nhập" }, 400);

      var userSheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
      var users = getSheetDataAsObjects(userSheet);

      var user = users.find(function (u) {
        return String(u.username) === String(username) && String(u.password) === String(password);
      });

      if (user) {
        var timestamp = new Date().getTime();
        var rawToken = username + ":" + timestamp + ":" + SECRET_KEY;
        var token = Utilities.base64EncodeWebSafe(
          Utilities.newBlob(rawToken).getBytes(),
        );

        var rowIndex = findRowIndexById(userSheet, user.id);
        var headers = getHeaders(userSheet);
        var loginIdx = headers.indexOf("lastLogin");
        if (loginIdx !== -1) {
          userSheet
            .getRange(rowIndex, loginIdx + 1)
            .setValue(new Date().toISOString());
        }

        return responseJson(
          {
            success: true,
            token: token,
            user: {
              id: user.id,
              username: user.username,
              full_name: user.full_name,
              unit: user.unit,
              role: user.role,
            },
          },
          200,
        );
      } else {
        return responseJson(
          { success: false, error: "Sai tên đăng nhập hoặc mật khẩu" },
          401,
        );
      }
    }

    var usernameFromToken = validateToken(body.token);
    if (!usernameFromToken) {
      return responseJson(
        {
          error:
            "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
        },
        403,
      );
    }

    if (action === "change_password") {
      var oldPass = body.oldPassword;
      var newPass = body.newPassword;

      if (!oldPass || !newPass) {
        return responseJson({ error: "Thiếu thông tin mật khẩu" }, 400);
      }

      var userSheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
      var users = getSheetDataAsObjects(userSheet);
      var user = users.find(function (u) {
        return String(u.username) === String(usernameFromToken) && String(u.password) === String(oldPass);
      });

      if (!user) {
        return responseJson(
          { success: false, error: "Mật khẩu cũ không chính xác" },
          401,
        );
      }

      var rowIndex = findRowIndexById(userSheet, user.id);
      var headers = getHeaders(userSheet);
      var passIdx = headers.indexOf("password");
      if (passIdx !== -1) {
        userSheet
          .getRange(rowIndex, passIdx + 1)
          .setNumberFormat("@")
          .setValue(String(newPass));
        return responseJson({ success: true }, 200);
      }
      return responseJson({ error: "Cột mật khẩu không tìm thấy" }, 500);
    }

    if (action === "admin_get_users") {
      var userSheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
      var data = getSheetDataAsObjects(userSheet);
      data.forEach(function (u) {
        delete u.password;
      });
      return responseJson({ success: true, rows: data }, 200);
    }

    if (action === "upload") {
      var fileName = body.fileName;
      var mimeType = body.mimeType;
      var dataBase64 = body.data;

      if (!fileName || !dataBase64)
        return responseJson({ error: "Missing file data" }, 400);

      var decodedData = Utilities.base64Decode(dataBase64);
      var blob = Utilities.newBlob(
        decodedData,
        mimeType || "application/pdf",
        fileName,
      );

      var uploadFolder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      var file = uploadFolder.createFile(blob);
      file.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW,
      );

      return responseJson({ success: true, url: file.getUrl() }, 200);
    }

    var sheetName = body.sheet;
    if (!sheetName) {
      return responseJson({ error: "Missing sheet in body" }, 400);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return responseJson({ error: "Sheet not found: " + sheetName }, 404);
    }

    if (action === "append") {
      var rowObj = body.row;
      if (!rowObj) return responseJson({ error: "Missing row data" }, 400);

      var headers = getHeaders(sheet);

      if (headers.length === 0) {
        headers = Object.keys(rowObj);
        sheet.appendRow(headers);
      }

      appendObjectRow(sheet, rowObj, headers);
      return responseJson({ success: true }, 200);
    }

    if (action === "update") {
      var id = body.id;
      var updates = body.updates;
      if (!id || !updates)
        return responseJson({ error: "Missing id or updates" }, 400);

      var rowIndex = findRowIndexById(sheet, id);
      if (rowIndex === -1)
        return responseJson({ error: "Row not found with id: " + id }, 404);

      var headers = getHeaders(sheet);
      for (var key in updates) {
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          var val = updates[key];
          if (typeof val === "object" && val !== null)
            val = JSON.stringify(val);
          var cell = sheet.getRange(rowIndex, colIndex + 1);
          if (shouldWriteAsPlainText(sheet.getName(), key)) {
            cell.setNumberFormat("@").setValue(String(val === undefined ? "" : val));
          } else {
            cell.setValue(val);
          }
        }
      }
      return responseJson({ success: true }, 200);
    }

    if (action === "delete") {
      var id = body.id;
      if (!id) return responseJson({ error: "Missing id" }, 400);

      var rowIndex = findRowIndexById(sheet, id);
      if (rowIndex === -1)
        return responseJson({ error: "Row not found with id: " + id }, 404);

      sheet.deleteRow(rowIndex);
      return responseJson({ success: true }, 200);
    }

    return responseJson({ error: "Invalid POST action" }, 400);
  } catch (error) {
    return responseJson({ error: error.toString() }, 500);
  }
}

function responseJson(data, code) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function getSheetDataAsObjects(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow < 2 || lastCol === 0) return [];

  var headers = getHeaders(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  var result = [];
  for (var i = 0; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = values[i][j];
      if (
        typeof val === "string" &&
        (val.startsWith("{") || val.startsWith("["))
      ) {
        try {
          val = JSON.parse(val);
        } catch (e) {}
      }
      if (shouldWriteAsPlainText(sheet.getName(), headers[j])) {
        val = val === null || val === undefined ? "" : String(val);
      }
      obj[headers[j]] = val;
    }
    result.push(obj);
  }
  return result;
}

function findRowIndexById(sheet, id) {
  var headers = getHeaders(sheet);
  var idColIndex = headers.indexOf("id");

  if (idColIndex === -1) return -1;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var idValues = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < idValues.length; i++) {
    if (String(idValues[i][0]) === String(id)) {
      return i + 2;
    }
  }
  return -1;
}

function appendObjectRow(sheet, rowObj, headers) {
  headers = headers || getHeaders(sheet);

  if (headers.length === 0) {
    headers = Object.keys(rowObj);
    sheet.appendRow(headers);
  }

  var rowData = headers.map(function (h) {
    var val = rowObj[h];
    if (typeof val === "object" && val !== null) {
      return JSON.stringify(val);
    }
    if (shouldWriteAsPlainText(sheet.getName(), h)) {
      return val === undefined || val === null ? "" : String(val);
    }
    return val === undefined ? "" : val;
  });

  var nextRow = sheet.getLastRow() + 1;
  var range = sheet.getRange(nextRow, 1, 1, rowData.length);
  formatPlainTextColumns(sheet, headers.filter(function (h) {
    return shouldWriteAsPlainText(sheet.getName(), h);
  }), nextRow, 1);
  range.setValues([rowData]);
}

function shouldWriteAsPlainText(sheetName, header) {
  return (
    sheetName === "users" &&
    ["id", "username", "password"].indexOf(header) !== -1
  );
}

function formatPlainTextColumns(sheet, headersToFormat, startRow, numRows) {
  if (!sheet || !headersToFormat || headersToFormat.length === 0) return;

  var headers = getHeaders(sheet);
  if (headers.length === 0) return;

  var row = startRow || 2;
  var rows = numRows || Math.max(sheet.getMaxRows() - row + 1, 1);
  headersToFormat.forEach(function (header) {
    var colIndex = headers.indexOf(header);
    if (colIndex !== -1) {
      sheet.getRange(row, colIndex + 1, rows, 1).setNumberFormat("@");
    }
  });
}
