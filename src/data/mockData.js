// src/data/mockData.js

export const MOCK_USERS = [
  { id: '1', username: 'admin', full_name: 'Đại tá Nguyễn Văn An', unit: 'Phòng Kỹ thuật Hình sự', role: 'admin', password: 'admin123', lastLogin: '2026-04-24T08:30:00' },
  { id: '2', username: 'tran.huu.duc', full_name: 'Thiếu tá Trần Hữu Đức', unit: 'Đội Điều tra Kinh tế', role: 'user', password: 'duc123', lastLogin: '2026-04-24T09:15:00' },
  { id: '3', username: 'le.thi.mai', full_name: 'Thượng úy Lê Thị Mai', unit: 'Phòng Cảnh sát Hình sự', role: 'user', password: 'mai123', lastLogin: '2026-04-23T14:20:00' },
  { id: '4', username: 'pham.quoc.hung', full_name: 'Trung úy Phạm Quốc Hùng', unit: 'Đội Điều tra Ma túy', role: 'user', password: 'hung123', lastLogin: '2026-04-23T16:45:00' },
  { id: '5', username: 'nguyen.thi.lan', full_name: 'Thiếu úy Nguyễn Thị Lan', unit: 'Phòng Hồ sơ', role: 'user', password: 'lan123', lastLogin: '2026-04-22T10:00:00' },
  { id: '6', username: 'vo.dinh.thanh', full_name: 'Trung tá Võ Đình Thành', unit: 'Đội Điều tra Tham nhũng', role: 'user', password: 'thanh123', lastLogin: '2026-04-24T07:50:00' },
  { id: '7', username: 'hoang.van.minh', full_name: 'Thiếu tá Hoàng Văn Minh', unit: 'Phòng Kỹ thuật Hình sự', role: 'user', password: 'minh123', lastLogin: '2026-04-21T13:30:00' },
  { id: '8', username: 'bui.thi.huong', full_name: 'Đại úy Bùi Thị Hương', unit: 'Đội Điều tra Kinh tế', role: 'user', password: 'huong123', lastLogin: '2026-04-20T09:00:00' },
];

export const MOCK_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Bộ luật Tố tụng Hình sự năm 2015',
    issue_number: 'Luật số 101/2015/QH13',
    category: 'to-tung-hinh-su',
    categoryLabel: 'Tố tụng Hình sự',
    summary: 'Quy định trình tự, thủ tục tiếp nhận, giải quyết tố giác, tin báo về tội phạm, kiến nghị khởi tố; khởi tố, điều tra, truy tố, xét xử và thi hành án hình sự.',
    updatedAt: '2026-01-15',
    drive_link: 'https://drive.google.com/file/d/demo1',
    content: {
      chapters: [
        {
          id: 'ch1',
          title: 'Chương I: NHỮNG QUY ĐỊNH CHUNG',
          articles: [
            { id: 'art1', title: 'Điều 1. Phạm vi điều chỉnh', text: 'Bộ luật này quy định trình tự, thủ tục tiếp nhận, giải quyết tố giác, tin báo về tội phạm, kiến nghị khởi tố; khởi tố, điều tra, truy tố, xét xử và một số thủ tục thi hành án hình sự; nhiệm vụ, quyền hạn và mối quan hệ giữa các cơ quan có thẩm quyền tiến hành tố tụng; nhiệm vụ, quyền hạn và trách nhiệm của người có thẩm quyền tiến hành tố tụng; quyền và nghĩa vụ của người tham gia tố tụng, cơ quan, tổ chức, cá nhân; hợp tác quốc tế trong tố tụng hình sự.' },
            { id: 'art2', title: 'Điều 2. Nhiệm vụ của Bộ luật Tố tụng hình sự', text: 'Bộ luật Tố tụng hình sự có nhiệm vụ bảo đảm phát hiện chính xác, nhanh chóng và xử lý công minh, kịp thời mọi hành vi phạm tội, phòng ngừa, ngăn chặn tội phạm, không để lọt tội phạm, không làm oan người vô tội; góp phần bảo vệ công lý, bảo vệ quyền con người, quyền công dân, bảo vệ chế độ xã hội chủ nghĩa, bảo vệ lợi ích của Nhà nước, quyền và lợi ích hợp pháp của tổ chức, cá nhân, giáo dục mọi người ý thức tuân theo pháp luật, đấu tranh phòng ngừa và chống tội phạm.' },
            { id: 'art3', title: 'Điều 3. Hiệu lực của Bộ luật Tố tụng hình sự', text: 'Bộ luật Tố tụng hình sự có hiệu lực đối với mọi hoạt động tố tụng hình sự trên lãnh thổ nước Cộng hòa xã hội chủ nghĩa Việt Nam. Hoạt động tố tụng hình sự đối với người nước ngoài phạm tội trên lãnh thổ nước Cộng hòa xã hội chủ nghĩa Việt Nam được tiến hành theo quy định của Bộ luật này và điều ước quốc tế mà Cộng hòa xã hội chủ nghĩa Việt Nam là thành viên.' },
            { id: 'art4', title: 'Điều 4. Giải thích từ ngữ', text: 'Trong Bộ luật này, các từ ngữ dưới đây được hiểu như sau:\n1. Cơ quan có thẩm quyền tiến hành tố tụng gồm Cơ quan điều tra, Viện kiểm sát, Tòa án.\n2. Người có thẩm quyền tiến hành tố tụng gồm Thủ trưởng, Phó Thủ trưởng Cơ quan điều tra, Điều tra viên, Cán bộ điều tra; Viện trưởng, Phó Viện trưởng Viện kiểm sát, Kiểm sát viên, Kiểm tra viên; Chánh án, Phó Chánh án Tòa án, Thẩm phán, Hội thẩm, Thư ký Tòa án, Thẩm tra viên.\n3. Người tham gia tố tụng gồm người bị tố giác, người bị kiến nghị khởi tố; bị can; bị cáo; bị hại; nguyên đơn dân sự; bị đơn dân sự; người có quyền lợi, nghĩa vụ liên quan đến vụ án; người làm chứng; người chứng kiến; người giám định; người định giá tài sản; người phiên dịch, người dịch thuật; người bào chữa; người bảo vệ quyền và lợi ích hợp pháp của bị hại, đương sự; người bảo vệ quyền và lợi ích hợp pháp của người bị tố giác, bị kiến nghị khởi tố.' },
          ]
        },
        {
          id: 'ch2',
          title: 'Chương II: NGUYÊN TẮC CƠ BẢN',
          articles: [
            { id: 'art5', title: 'Điều 7. Bảo đảm pháp chế xã hội chủ nghĩa trong tố tụng hình sự', text: 'Mọi hoạt động tố tụng hình sự phải được thực hiện theo quy định của Bộ luật này. Không được giải quyết nguồn tin về tội phạm, khởi tố, điều tra, truy tố, xét xử ngoài những căn cứ và trình tự, thủ tục do Bộ luật này quy định.' },
            { id: 'art6', title: 'Điều 8. Tôn trọng và bảo vệ quyền con người, quyền và lợi ích hợp pháp của cá nhân', text: 'Khi tiến hành tố tụng hình sự, trong phạm vi nhiệm vụ, quyền hạn của mình, cơ quan, người có thẩm quyền tiến hành tố tụng phải tôn trọng và bảo vệ quyền con người, bảo đảm lợi ích hợp pháp của mọi cá nhân tham gia hoặc có liên quan đến hoạt động tố tụng hình sự, nghiêm cấm mọi hành vi xâm phạm trái pháp luật đến tính mạng, sức khỏe, danh dự, nhân phẩm, tài sản và các quyền và lợi ích hợp pháp khác của họ.' },
            { id: 'art7', title: 'Điều 9. Bảo đảm quyền bình đẳng trước pháp luật', text: 'Tố tụng hình sự được tiến hành theo nguyên tắc mọi người đều bình đẳng trước pháp luật, không phân biệt dân tộc, giới tính, tín ngưỡng, tôn giáo, thành phần và địa vị xã hội. Bất cứ người nào phạm tội đều bị xử lý theo pháp luật. Bất cứ tổ chức, cá nhân nào xâm phạm quyền và lợi ích hợp pháp của cơ quan, tổ chức, cá nhân đều phải bị xử lý theo pháp luật.' },
            { id: 'art8', title: 'Điều 13. Suy đoán vô tội', text: 'Người bị buộc tội được coi là không có tội cho đến khi được chứng minh theo trình tự, thủ tục do Bộ luật này quy định và có bản án kết tội của Tòa án đã có hiệu lực pháp luật. Khi không đủ và không thể làm sáng tỏ căn cứ để buộc tội, kết tội theo trình tự, thủ tục do Bộ luật này quy định thì cơ quan, người có thẩm quyền tiến hành tố tụng phải kết luận người bị buộc tội không có tội.' },
          ]
        },
        {
          id: 'ch3',
          title: 'Chương III: CƠ QUAN CÓ THẨM QUYỀN TIẾN HÀNH TỐ TỤNG',
          articles: [
            { id: 'art9', title: 'Điều 33. Cơ quan điều tra', text: 'Cơ quan điều tra trong Công an nhân dân được tổ chức thành Cơ quan Cảnh sát điều tra và Cơ quan An ninh điều tra.\nCơ quan Cảnh sát điều tra Bộ Công an, Cơ quan Cảnh sát điều tra Công an cấp tỉnh, Cơ quan Cảnh sát điều tra Công an cấp huyện điều tra vụ án hình sự về các tội phạm trật tự xã hội, kinh tế, ma túy và các tội phạm khác theo quy định của pháp luật.\nCơ quan An ninh điều tra Bộ Công an, Cơ quan An ninh điều tra Công an cấp tỉnh điều tra vụ án hình sự về các tội xâm phạm an ninh quốc gia, tội phá hoại hòa bình, chống loài người và tội phạm chiến tranh theo quy định của pháp luật.' },
            { id: 'art10', title: 'Điều 36. Thẩm quyền điều tra của Cơ quan điều tra', text: 'Cơ quan Cảnh sát điều tra Công an cấp huyện điều tra vụ án hình sự về tội phạm ít nghiêm trọng, tội phạm nghiêm trọng và tội phạm rất nghiêm trọng xảy ra trên địa bàn quản lý, trừ các vụ án hình sự thuộc thẩm quyền điều tra của Cơ quan Cảnh sát điều tra Công an cấp tỉnh hoặc các vụ án hình sự về các tội phạm đặc biệt nghiêm trọng.\nCơ quan Cảnh sát điều tra Công an cấp tỉnh điều tra vụ án hình sự về tội phạm đặc biệt nghiêm trọng, tội phạm phức tạp xảy ra trên địa bàn tỉnh, thành phố trực thuộc trung ương, trừ những vụ án hình sự thuộc thẩm quyền điều tra của Cơ quan Cảnh sát điều tra Bộ Công an.' },
          ]
        }
      ]
    }
  },
  {
    id: 'doc-002',
    title: 'Bộ luật Hình sự năm 2015 (sửa đổi 2017)',
    issue_number: 'Luật số 100/2015/QH13',
    category: 'hinh-su',
    categoryLabel: 'Hình sự',
    summary: 'Quy định về tội phạm và hình phạt. Bộ luật này là cơ sở pháp lý để đấu tranh phòng chống tội phạm, bảo vệ chủ quyền quốc gia, quyền con người, quyền công dân.',
    updatedAt: '2026-02-10',
    drive_link: 'https://drive.google.com/file/d/demo2',
    content: {
      chapters: [
        {
          id: 'ch1',
          title: 'Chương I: ĐIỀU KHOẢN CƠ BẢN',
          articles: [
            { id: 'art1', title: 'Điều 1. Nhiệm vụ của Bộ luật Hình sự', text: 'Bộ luật Hình sự có nhiệm vụ bảo vệ chủ quyền quốc gia, an ninh của đất nước, bảo vệ chế độ xã hội chủ nghĩa, quyền con người, quyền công dân, bảo vệ quyền bình đẳng giữa đồng bào các dân tộc, bảo vệ lợi ích của Nhà nước, tổ chức, bảo vệ trật tự pháp luật, chống mọi hành vi phạm tội; giáo dục mọi người ý thức tuân theo pháp luật, phòng ngừa và đấu tranh chống tội phạm.' },
            { id: 'art2', title: 'Điều 2. Cơ sở của trách nhiệm hình sự', text: 'Chỉ người nào phạm một tội đã được Bộ luật Hình sự quy định mới phải chịu trách nhiệm hình sự. Chỉ pháp nhân thương mại nào phạm một tội đã được quy định tại Điều 76 của Bộ luật này mới phải chịu trách nhiệm hình sự.' },
            { id: 'art3', title: 'Điều 8. Khái niệm tội phạm', text: 'Tội phạm là hành vi nguy hiểm cho xã hội được quy định trong Bộ luật Hình sự, do người có năng lực trách nhiệm hình sự hoặc pháp nhân thương mại thực hiện một cách cố ý hoặc vô ý, xâm phạm độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ Tổ quốc, xâm phạm chế độ chính trị, chế độ kinh tế, nền văn hóa, quốc phòng, an ninh, trật tự, an toàn xã hội, quyền, lợi ích hợp pháp của tổ chức, xâm phạm quyền con người, quyền, lợi ích hợp pháp của công dân, xâm phạm những lĩnh vực khác của trật tự pháp luật xã hội chủ nghĩa mà theo quy định của Bộ luật này phải bị xử lý hình sự.' },
          ]
        },
        {
          id: 'ch2',
          title: 'Chương XI: CÁC TỘI XÂM PHẠM TÍNH MẠNG, SỨC KHỎE, NHÂN PHẨM, DANH DỰ',
          articles: [
            { id: 'art4', title: 'Điều 123. Tội giết người', text: '1. Người nào giết người thuộc một trong các trường hợp sau đây, thì bị phạt tù từ 12 năm đến 20 năm, tù chung thân hoặc tử hình:\na) Giết 02 người trở lên;\nb) Giết người dưới 16 tuổi;\nc) Giết phụ nữ mà biết là có thai;\nd) Giết người đang thi hành công vụ hoặc vì lý do công vụ của nạn nhân;\nđ) Giết ông, bà, cha, mẹ, người nuôi dưỡng, thầy giáo, cô giáo của mình;\ne) Giết người mà liền trước đó hoặc ngay sau đó lại thực hiện một tội phạm rất nghiêm trọng hoặc tội phạm đặc biệt nghiêm trọng;\ng) Để thực hiện hoặc che giấu tội phạm khác;\nh) Để lấy bộ phận cơ thể của nạn nhân;\ni) Thực hiện tội phạm một cách man rợ;\nk) Bằng cách lợi dụng nghề nghiệp;\nl) Bằng phương pháp có khả năng làm chết nhiều người;\nm) Thuê giết người hoặc giết người thuê;\nn) Có tính chất côn đồ;\no) Có tổ chức;\np) Tái phạm nguy hiểm.\n2. Phạm tội không thuộc các trường hợp quy định tại khoản 1 Điều này, thì bị phạt tù từ 07 năm đến 15 năm.\n3. Người chuẩn bị phạm tội này, thì bị phạt tù từ 01 năm đến 05 năm.\n4. Người phạm tội còn có thể bị cấm hành nghề hoặc làm công việc nhất định từ 01 năm đến 05 năm, phạt quản chế hoặc cấm cư trú từ 01 năm đến 05 năm.' },
            { id: 'art5', title: 'Điều 134. Tội cố ý gây thương tích hoặc gây tổn hại cho sức khỏe của người khác', text: '1. Người nào cố ý gây thương tích hoặc gây tổn hại cho sức khỏe của người khác mà tỷ lệ tổn thương cơ thể từ 11% đến 30% hoặc dưới 11% nhưng thuộc một trong các trường hợp sau đây, thì bị phạt cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng đến 03 năm:\na) Dùng vũ khí, vật liệu nổ, hung khí nguy hiểm hoặc thủ đoạn có khả năng gây nguy hại cho nhiều người;\nb) Dùng a-xít nguy hiểm hoặc hóa chất nguy hiểm;\nc) Đối với người dưới 16 tuổi, phụ nữ mà biết là có thai, người cao tuổi hoặc người không có khả năng tự vệ;\nd) Đối với ông, bà, cha, mẹ, người nuôi dưỡng, thầy giáo, cô giáo của mình;\nđ) Có tổ chức;\ne) Lợi dụng chức vụ, quyền hạn;\ng) Trong thời gian đang bị giữ, tạm giữ, tạm giam, đang chấp hành án phạt tù, đang chấp hành biện pháp tư pháp giáo dục tại trường giáo dưỡng hoặc đang chấp hành biện pháp xử lý vi phạm hành chính đưa vào cơ sở giáo dục bắt buộc, đưa vào trường giáo dưỡng;\nh) Thuê gây thương tích hoặc gây thương tích thuê;\ni) Có tính chất côn đồ;\nk) Tái phạm nguy hiểm;\nl) Đối với người đang thi hành công vụ hoặc vì lý do công vụ của nạn nhân.' },
          ]
        },
        {
          id: 'ch3',
          title: 'Chương XVIII: CÁC TỘI PHẠM VỀ MA TÚY',
          articles: [
            { id: 'art6', title: 'Điều 249. Tội tàng trữ trái phép chất ma túy', text: '1. Người nào tàng trữ trái phép chất ma túy mà không nhằm mục đích mua bán, vận chuyển, sản xuất trái phép chất ma túy thuộc một trong các trường hợp sau đây, thì bị phạt tù từ 01 năm đến 05 năm:\na) Đã bị xử phạt vi phạm hành chính về hành vi quy định tại Điều này hoặc đã bị kết án về tội này, chưa được xóa án tích mà còn vi phạm;\nb) Nhựa thuốc phiện, nhựa cần sa hoặc cao côca có khối lượng từ 01 gam đến dưới 500 gam;\nc) Heroin, Cocaine, Methamphetamine, Amphetamine, MDMA hoặc XLR-11 có khối lượng từ 0,1 gam đến dưới 05 gam;\nd) Lá cây côca có khối lượng từ 10 kilôgam đến dưới 25 kilôgam.' },
            { id: 'art7', title: 'Điều 251. Tội mua bán trái phép chất ma túy', text: '1. Người nào mua bán trái phép chất ma túy, thì bị phạt tù từ 02 năm đến 07 năm.\n2. Phạm tội thuộc một trong các trường hợp sau đây, thì bị phạt tù từ 07 năm đến 15 năm:\na) Có tổ chức;\nb) Có tính chất chuyên nghiệp;\nc) Đối với người từ đủ 13 tuổi đến dưới 18 tuổi;\nd) Đối với phụ nữ mà biết là có thai;\nđ) Đối với người đang cai nghiện;\ne) Gây tổn hại cho sức khỏe của người khác mà tỷ lệ tổn thương cơ thể từ 31% đến 60%;\ng) Heroin, Cocaine, Methamphetamine, Amphetamine, MDMA hoặc XLR-11 có khối lượng từ 05 gam đến dưới 30 gam.' },
          ]
        }
      ]
    }
  },
  {
    id: 'doc-003',
    title: 'Thông tư 28/2020/TT-BCA - Quy trình thu thập, bảo quản vật chứng',
    issue_number: 'TT 28/2020/TT-BCA',
    category: 'huong-dan-dieu-tra',
    categoryLabel: 'Hướng dẫn điều tra',
    summary: 'Hướng dẫn chi tiết quy trình tiếp nhận, thu thập, bảo quản, vận chuyển và xử lý vật chứng trong điều tra vụ án hình sự theo quy định hiện hành.',
    updatedAt: '2026-03-01',
    drive_link: '',
    content: {
      chapters: [
        {
          id: 'ch1',
          title: 'Chương I: QUY ĐỊNH CHUNG',
          articles: [
            { id: 'art1', title: 'Điều 1. Phạm vi điều chỉnh', text: 'Thông tư này quy định về trình tự, thủ tục thu thập, bảo quản, vận chuyển, xử lý vật chứng trong điều tra, truy tố, xét xử vụ án hình sự của Cơ quan điều tra trong Công an nhân dân.' },
            { id: 'art2', title: 'Điều 2. Nguyên tắc thu thập vật chứng', text: 'Việc thu thập vật chứng phải tuân theo các nguyên tắc sau:\n1. Đúng quy trình, thủ tục pháp luật quy định.\n2. Kịp thời, đầy đủ, không bỏ sót.\n3. Bảo đảm tính nguyên vẹn, không làm thay đổi đặc tính của vật chứng.\n4. Lập biên bản thu giữ vật chứng đầy đủ, chính xác.\n5. Giao nhận vật chứng có chữ ký của các bên liên quan.' },
          ]
        },
        {
          id: 'ch2',
          title: 'Chương II: QUY TRÌNH THU THẬP VẬT CHỨNG TẠI HIỆN TRƯỜNG',
          articles: [
            { id: 'art3', title: 'Điều 5. Bảo vệ hiện trường', text: 'Khi tiếp nhận tin báo tội phạm, lực lượng đầu tiên có mặt tại hiện trường phải:\n1. Ngay lập tức khoanh vùng, bảo vệ hiện trường bằng hàng rào hoặc băng cảnh báo.\n2. Không cho phép bất kỳ người nào không có thẩm quyền vào khu vực hiện trường.\n3. Ghi nhận vị trí, trạng thái ban đầu của mọi vật thể tại hiện trường.\n4. Lập tức báo cáo cho cơ quan điều tra có thẩm quyền.\n5. Ghi lại danh sách những người đã có mặt tại hiện trường trước khi lực lượng đến.' },
            { id: 'art4', title: 'Điều 6. Khám nghiệm hiện trường', text: 'Khám nghiệm hiện trường được tiến hành theo các bước:\nBước 1: Quan sát tổng thể hiện trường, xác định phạm vi.\nBước 2: Chụp ảnh, quay video hiện trường theo phương pháp từ xa đến gần, từ toàn cảnh đến chi tiết.\nBước 3: Ghi chép, lập sơ đồ hiện trường.\nBước 4: Tiến hành thu thập dấu vết, vật chứng theo thứ tự ưu tiên từ dễ bị phá hủy đến bền vững.\nBước 5: Đánh số, ghi nhãn, bảo quản từng vật chứng riêng biệt.\nBước 6: Lập biên bản khám nghiệm hiện trường.' },
            { id: 'art5', title: 'Điều 7. Thu thập dấu vân tay', text: 'Việc thu thập dấu vân tay thực hiện theo trình tự:\n1. Xác định vị trí có khả năng lưu dấu vân tay (bề mặt nhẵn, cứng).\n2. Dùng đèn UV hoặc ánh sáng nghiêng để phát hiện dấu vân tay tiềm ẩn.\n3. Áp dụng bột than đen (bề mặt sáng) hoặc bột nhôm (bề mặt tối) để hiện dấu vân tay.\n4. Sử dụng cyanoacrylate (keo 502) để cố định dấu vân tay trên bề mặt không phẳng.\n5. Chụp ảnh dấu vân tay trước khi thu thập.\n6. Dùng băng dính chuyên dụng nâng dấu vân tay và đặt lên thẻ thu thập.\n7. Ghi nhãn đầy đủ: vị trí thu thập, người thu thập, thời gian.' },
          ]
        },
        {
          id: 'ch3',
          title: 'Chương III: BẢO QUẢN VÀ VẬN CHUYỂN VẬT CHỨNG',
          articles: [
            { id: 'art6', title: 'Điều 10. Yêu cầu về bao gói vật chứng', text: 'Vật chứng phải được bao gói theo quy định:\n1. Vật chứng sinh học (máu, mô, tóc): Đựng trong túi giấy sạch, không dùng túi nilon vì sẽ gây ẩm và phân hủy DNA.\n2. Vật chứng ướt (quần áo dính máu): Phải sấy khô tự nhiên trước khi đóng gói.\n3. Vật chứng điện tử (điện thoại, máy tính): Tắt nguồn, bọc trong túi chống tĩnh điện, không sạc pin.\n4. Vật chứng dạng lỏng: Đựng trong hộp kín, chịu nhiệt, có nhãn cảnh báo.\n5. Vũ khí: Tháo đạn, đóng gói cẩn thận, dán nhãn nguy hiểm.' },
            { id: 'art7', title: 'Điều 12. Chuỗi kiểm soát vật chứng (Chain of Custody)', text: 'Chuỗi kiểm soát vật chứng phải được duy trì liên tục và có hồ sơ đầy đủ:\n1. Mỗi lần tiếp nhận, chuyển giao vật chứng phải lập biên bản giao nhận.\n2. Biên bản giao nhận phải có: Tên vật chứng, số hiệu, trạng thái, thời gian, địa điểm, chữ ký người giao và người nhận.\n3. Không được để vật chứng ngoài tầm kiểm soát.\n4. Mọi cá nhân tiếp xúc với vật chứng phải được ghi lại trong hồ sơ.\n5. Vi phạm chuỗi kiểm soát vật chứng có thể dẫn đến vật chứng bị coi là không hợp lệ tại tòa.' },
          ]
        }
      ]
    }
  },
  {
    id: 'doc-004',
    title: 'Luật Phòng, chống tham nhũng năm 2018',
    issue_number: 'Luật số 36/2018/QH14',
    category: 'hinh-su',
    categoryLabel: 'Hình sự',
    summary: 'Quy định về phòng ngừa, phát hiện tham nhũng; xử lý tham nhũng và hành vi khác vi phạm pháp luật về phòng, chống tham nhũng.',
    updatedAt: '2026-01-20',
    drive_link: 'https://drive.google.com/file/d/demo3',
    content: {
      chapters: [
        {
          id: 'ch1',
          title: 'Chương I: NHỮNG QUY ĐỊNH CHUNG',
          articles: [
            { id: 'art1', title: 'Điều 3. Các hành vi tham nhũng', text: 'Các hành vi tham nhũng trong khu vực nhà nước gồm:\n1. Tham ô tài sản;\n2. Nhận hối lộ;\n3. Lạm dụng chức vụ, quyền hạn chiếm đoạt tài sản;\n4. Lợi dụng chức vụ, quyền hạn trong khi thi hành nhiệm vụ, công vụ vì vụ lợi;\n5. Lạm quyền trong khi thi hành nhiệm vụ, công vụ vì vụ lợi;\n6. Lợi dụng chức vụ, quyền hạn gây ảnh hưởng đối với người khác để trục lợi;\n7. Giả mạo trong công tác vì vụ lợi;\n8. Đưa hối lộ, môi giới hối lộ để giải quyết công việc của cơ quan, tổ chức, đơn vị hoặc địa phương vì vụ lợi;\n9. Lợi dụng chức vụ, quyền hạn sử dụng trái phép tài sản công vì vụ lợi;\n10. Nhũng nhiễu vì vụ lợi;\n11. Không thực hiện, thực hiện không đúng hoặc không đầy đủ nhiệm vụ, công vụ vì vụ lợi;\n12. Lợi dụng chức vụ, quyền hạn để bao che cho người có hành vi vi phạm pháp luật vì vụ lợi; cản trở, can thiệp trái pháp luật vào việc giám sát, kiểm tra, thanh tra, kiểm toán, điều tra, truy tố, xét xử, thi hành án vì vụ lợi.' },
          ]
        }
      ]
    }
  },
  {
    id: 'doc-005',
    title: 'Quy trình Hỏi cung bị can theo BLTTHS 2015',
    issue_number: 'HD 15/2022/BCA',
    category: 'huong-dan-dieu-tra',
    categoryLabel: 'Hướng dẫn điều tra',
    summary: 'Hướng dẫn kỹ thuật hỏi cung bị can, lấy lời khai người làm chứng đúng quy định pháp luật, đảm bảo tính hợp pháp và hiệu quả của hoạt động tố tụng.',
    updatedAt: '2026-03-15',
    drive_link: '',
    content: {
      chapters: [
        {
          id: 'ch1',
          title: 'Chương I: NGUYÊN TẮC HỎI CUNG',
          articles: [
            { id: 'art1', title: 'Điều 1. Nguyên tắc chung', text: 'Hoạt động hỏi cung bị can phải tuân thủ nghiêm ngặt các nguyên tắc:\n1. Tôn trọng quyền im lặng của bị can.\n2. Không được dùng bạo lực, đe dọa, mớm cung, dụ cung.\n3. Phải lập biên bản hỏi cung cho mỗi lần hỏi.\n4. Biên bản phải được đọc lại và ký xác nhận.\n5. Bị can có quyền yêu cầu người bào chữa có mặt.\n6. Thời gian hỏi cung trong một ngày không quá 8 giờ.' },
            { id: 'art2', title: 'Điều 2. Quyền của bị can trong hỏi cung', text: 'Bị can có các quyền sau trong quá trình hỏi cung:\n1. Quyền không khai tội - bị can không buộc phải tự buộc tội mình.\n2. Quyền có người bào chữa - luật sư hoặc người bào chữa được chỉ định.\n3. Quyền đọc và ký biên bản - đồng ý hoặc ghi ý kiến không đồng ý.\n4. Quyền yêu cầu bổ sung, sửa chữa nội dung biên bản.\n5. Quyền nghỉ ngơi - không hỏi cung liên tục quá 4 giờ không nghỉ.\n6. Quyền được cung cấp nước uống và điều kiện vệ sinh cơ bản.' },
          ]
        },
        {
          id: 'ch2',
          title: 'Chương II: KỸ THUẬT HỎI CUNG',
          articles: [
            { id: 'art3', title: 'Điều 5. Chuẩn bị trước hỏi cung', text: 'Trước khi tiến hành hỏi cung, điều tra viên phải:\n1. Nghiên cứu kỹ hồ sơ vụ án, nắm rõ các tình tiết đã có.\n2. Xác định mục tiêu, nội dung cần khai thác trong buổi hỏi cung.\n3. Lập kế hoạch hỏi cung với các câu hỏi theo trình tự logic.\n4. Chuẩn bị tài liệu, vật chứng sẽ sử dụng khi đối chất.\n5. Kiểm tra phòng hỏi cung đảm bảo có camera ghi hình (nếu có).\n6. Thông báo cho người bào chữa về thời gian, địa điểm hỏi cung (nếu bị can có yêu cầu).' },
            { id: 'art4', title: 'Điều 6. Kỹ thuật đặt câu hỏi', text: 'Điều tra viên cần áp dụng các kỹ thuật đặt câu hỏi hiệu quả:\n1. Câu hỏi mở: Bắt đầu bằng "Hãy kể...", "Mô tả...", "Điều gì xảy ra..." để bị can tự trần thuật.\n2. Câu hỏi làm rõ: Theo sau câu hỏi mở để làm rõ chi tiết cụ thể.\n3. Câu hỏi đóng: Chỉ dùng khi cần xác nhận thông tin cụ thể (Có/Không).\n4. Không dùng câu hỏi gợi ý (Leading questions) vì có thể bị phản bác tại tòa.\n5. Lắng nghe tích cực - quan sát ngôn ngữ cơ thể của bị can.\n6. Ghi chép đầy đủ, chính xác lời khai nguyên văn.' },
          ]
        }
      ]
    }
  }
];

export const MOCK_LOGS = [
  { id: 'log-001', user_id: '2', username: 'tran.huu.duc', full_name: 'Thiếu tá Trần Hữu Đức', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-24T09:15:22' },
  { id: 'log-002', user_id: '2', username: 'tran.huu.duc', full_name: 'Thiếu tá Trần Hữu Đức', action: 'SEARCH', details: 'tội giết người điều 123', created_at: '2026-04-24T09:16:45' },
  { id: 'log-003', user_id: '2', username: 'tran.huu.duc', full_name: 'Thiếu tá Trần Hữu Đức', action: 'VIEW_DOC', details: 'doc-002', created_at: '2026-04-24T09:17:30' },
  { id: 'log-004', user_id: '3', username: 'le.thi.mai', full_name: 'Thượng úy Lê Thị Mai', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-23T14:20:10' },
  { id: 'log-005', user_id: '3', username: 'le.thi.mai', full_name: 'Thượng úy Lê Thị Mai', action: 'SEARCH', details: 'thu thập vật chứng hiện trường', created_at: '2026-04-23T14:22:00' },
  { id: 'log-006', user_id: '3', username: 'le.thi.mai', full_name: 'Thượng úy Lê Thị Mai', action: 'VIEW_DOC', details: 'doc-003', created_at: '2026-04-23T14:23:15' },
  { id: 'log-007', user_id: '4', username: 'pham.quoc.hung', full_name: 'Trung úy Phạm Quốc Hùng', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-23T16:45:00' },
  { id: 'log-008', user_id: '4', username: 'pham.quoc.hung', full_name: 'Trung úy Phạm Quốc Hùng', action: 'SEARCH', details: 'ma tuy methamphetamine', created_at: '2026-04-23T16:46:30' },
  { id: 'log-009', user_id: '4', username: 'pham.quoc.hung', full_name: 'Trung úy Phạm Quốc Hùng', action: 'VIEW_DOC', details: 'doc-002', created_at: '2026-04-23T16:48:00' },
  { id: 'log-010', user_id: '6', username: 'vo.dinh.thanh', full_name: 'Trung tá Võ Đình Thành', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-24T07:50:00' },
  { id: 'log-011', user_id: '6', username: 'vo.dinh.thanh', full_name: 'Trung tá Võ Đình Thành', action: 'SEARCH', details: 'tham nhũng nhận hối lộ', created_at: '2026-04-24T07:52:15' },
  { id: 'log-012', user_id: '6', username: 'vo.dinh.thanh', full_name: 'Trung tá Võ Đình Thành', action: 'VIEW_DOC', details: 'doc-004', created_at: '2026-04-24T07:54:00' },
  { id: 'log-013', user_id: '1', username: 'admin', full_name: 'Đại tá Nguyễn Văn An', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-24T08:30:00' },
  { id: 'log-014', user_id: '5', username: 'nguyen.thi.lan', full_name: 'Thiếu úy Nguyễn Thị Lan', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-22T10:00:00' },
  { id: 'log-015', user_id: '5', username: 'nguyen.thi.lan', full_name: 'Thiếu úy Nguyễn Thị Lan', action: 'SEARCH', details: 'quy trinh hoi cung bi can', created_at: '2026-04-22T10:05:00' },
  { id: 'log-016', user_id: '5', username: 'nguyen.thi.lan', full_name: 'Thiếu úy Nguyễn Thị Lan', action: 'VIEW_DOC', details: 'doc-005', created_at: '2026-04-22T10:07:30' },
  { id: 'log-017', user_id: '7', username: 'hoang.van.minh', full_name: 'Thiếu tá Hoàng Văn Minh', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-21T13:30:00' },
  { id: 'log-018', user_id: '7', username: 'hoang.van.minh', full_name: 'Thiếu tá Hoàng Văn Minh', action: 'SEARCH', details: 'to tung hinh su khoi to', created_at: '2026-04-21T13:32:00' },
  { id: 'log-019', user_id: '7', username: 'hoang.van.minh', full_name: 'Thiếu tá Hoàng Văn Minh', action: 'VIEW_DOC', details: 'doc-001', created_at: '2026-04-21T13:35:00' },
  { id: 'log-020', user_id: '8', username: 'bui.thi.huong', full_name: 'Đại úy Bùi Thị Hương', action: 'LOGIN', details: 'Đăng nhập thành công', created_at: '2026-04-20T09:00:00' },
];

export const DOC_TITLES = {
  'doc-001': 'Bộ luật Tố tụng Hình sự năm 2015',
  'doc-002': 'Bộ luật Hình sự năm 2015',
  'doc-003': 'TT 28/2020/TT-BCA - Quy trình vật chứng',
  'doc-004': 'Luật PCTN năm 2018',
  'doc-005': 'Quy trình Hỏi cung bị can',
};
