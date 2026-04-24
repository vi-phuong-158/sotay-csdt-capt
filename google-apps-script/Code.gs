/**
 * Google Apps Script - Cẩm Nang Pháp Luật Backend
 *
 * Yêu cầu:
 * 1. Tạo một Google Sheet có 3 tab (sheet): "users", "documents", "activity_logs"
 * 2. Copy code này vào Extensions > Apps Script
 * 3. Chạy hàm setup() một lần (chọn setup trong toolbar và nhấn Run) để tạo các bảng tự động
 * 4. Deploy > New deployment > Web app > Anyone (cho phép truy cập public)
 */

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ["users", "documents", "activity_logs"];
  var headers = {
    "users": ["id", "username", "password", "full_name", "unit", "role", "lastLogin"],
    "documents": ["id", "title", "issue_number", "category", "categoryLabel", "summary", "drive_link", "content", "updatedAt", "created_at"],
    "activity_logs": ["id", "timestamp", "username", "action", "details", "created_at"]
  };

  sheets.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers[name]);
      // Định dạng header cho đẹp
      sheet.getRange(1, 1, 1, headers[name].length).setFontWeight("bold").setBackground("#e2f0e8");
    }
  });
  
  // Tạo tài khoản admin mặc định nếu sheet users trống
  var userSheet = ss.getSheetByName("users");
  if (userSheet.getLastRow() < 2) {
    userSheet.appendRow(["admin-001", "admin", "admin123", "Quản trị viên", "Hệ thống", "admin", new Date().toISOString()]);
  }
  
  return "Đã thiết lập xong các bảng!";
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var sheetName = e.parameter.sheet;

    if (!action || !sheetName) {
      return responseJson({ error: "Missing action or sheet parameter" }, 400);
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

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    if (!action) {
      return responseJson({ error: "Missing action in body" }, 400);
    }

    // Xử lý upload file lên Drive
    if (action === "upload") {
      var fileName = body.fileName;
      var mimeType = body.mimeType;
      var dataBase64 = body.data;

      if (!fileName || !dataBase64) return responseJson({ error: "Missing file data" }, 400);

      var decodedData = Utilities.base64Decode(dataBase64);
      var blob = Utilities.newBlob(decodedData, mimeType || 'application/pdf', fileName);
      
      var file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
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
      
      // Nếu sheet chưa có header, tự động tạo header từ object keys
      if (headers.length === 0) {
        headers = Object.keys(rowObj);
        sheet.appendRow(headers);
      }

      var rowData = headers.map(function(h) {
        var val = rowObj[h];
        // Handle nested objects (like document content)
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val);
        }
        return val === undefined ? "" : val;
      });

      sheet.appendRow(rowData);
      return responseJson({ success: true }, 200);
    }

    if (action === "update") {
      var id = body.id;
      var updates = body.updates;
      if (!id || !updates) return responseJson({ error: "Missing id or updates" }, 400);

      var rowIndex = findRowIndexById(sheet, id);
      if (rowIndex === -1) return responseJson({ error: "Row not found with id: " + id }, 404);

      var headers = getHeaders(sheet);
      for (var key in updates) {
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          var val = updates[key];
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          sheet.getRange(rowIndex, colIndex + 1).setValue(val);
        }
      }
      return responseJson({ success: true }, 200);
    }

    if (action === "delete") {
      var id = body.id;
      if (!id) return responseJson({ error: "Missing id" }, 400);

      var rowIndex = findRowIndexById(sheet, id);
      if (rowIndex === -1) return responseJson({ error: "Row not found with id: " + id }, 404);

      sheet.deleteRow(rowIndex);
      return responseJson({ success: true }, 200);
    }

    return responseJson({ error: "Invalid POST action" }, 400);

  } catch (error) {
    return responseJson({ error: error.toString() }, 500);
  }
}

// ================= Helpers =================

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
      // Try parsing JSON if possible (for document content)
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try {
          val = JSON.parse(val);
        } catch(e) {}
      }
      obj[headers[j]] = val;
    }
    result.push(obj);
  }
  return result;
}

function findRowIndexById(sheet, id) {
  var headers = getHeaders(sheet);
  var idColIndex = headers.indexOf('id');
  
  if (idColIndex === -1) return -1;
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var idValues = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < idValues.length; i++) {
    if (idValues[i][0] === id) {
      return i + 2; // +2 because array is 0-indexed and row 1 is header
    }
  }
  return -1;
}
