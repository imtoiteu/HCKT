# Ôn thi HC-KT 2026 — web app luyện thi Đội tuyển

Ứng dụng web ôn luyện cho **Thi Đội tuyển** trong Hội thi tập trung ngành Hậu cần –
Kỹ thuật năm 2026: vừa ghi nhớ **228 câu hỏi trắc nghiệm** (8 ngành), vừa mô phỏng
đúng cấu trúc, thời gian và cách tính điểm của **Vòng sơ khảo** và **Vòng chung
khảo** theo Quy chế Hội thi (Điều 12–15).

**URL công khai:** http://80.241.217.122:8080/

> **Phạm vi:** ứng dụng phục vụ riêng phần **Thi Đội tuyển**. Quy chế còn mô tả
> "Thi Chủ nhiệm HC-KT" (bảo vệ kế hoạch cá nhân, không phải trắc nghiệm) và chấm
> điểm đơn vị (Mục I) — hai phần này **chưa** được xây dựng vì nằm ngoài phạm vi đã
> xác nhận và/hoặc thiếu căn cứ văn bản đầy đủ, xem mục "Quy chế & giới hạn dữ liệu"
> bên dưới.

---

## Nguồn dữ liệu

| Tệp gốc | Vai trò |
|---|---|
| `Bo_cau_hoi_Hoi_thi_0001.pdf` (53 trang) | Toàn bộ 228 câu trắc nghiệm + đáp án |
| `Thang_cham_diem_Hoi_thi_0001.pdf` (23 trang) | Phụ lục thang điểm chấm **đơn vị chính quy** (Mục I) — không áp dụng trực tiếp cho Đội tuyển, đưa vào tab "Quy chế" dưới dạng ảnh quét đầy đủ để tham khảo |
| `CamScanner 31-10-26 12.43.pdf` (5 trang, đánh số gốc 4–8) | Trích Điều 11–15 Quy chế Hội thi — căn cứ duy nhất cho cấu trúc/thời gian/cách tính điểm của tab "Đội tuyển"; ảnh quét ở `public/ref/dt-01..05.jpg` |

Cả hai PDF là bản quét (không có lớp văn bản), nội dung được bóc tách thủ công
theo từng trang. Đáp án đúng trong tài liệu gốc được đánh dấu bằng **gạch chân**
(mục I–VII) hoặc dòng **"\* Đáp án đúng: x"** (mục VIII).

### Phân bố câu hỏi

| Mục | Ngành | Số câu |
|---|---|---|
| I | Tham mưu | 16 |
| II | Quân nhu | 30 |
| III | Quân y | 22 |
| IV | Doanh trại | 35 |
| V | Xăng dầu | 21 |
| VI | Xe máy – Vận tải | 20 |
| VII | Các chuyên ngành Kỹ thuật | 52 |
| VIII | Truyền thống ngành HC, KT | 32 |
| | **Tổng** | **228** |

### Lưu ý về dữ liệu

- **8 câu có nhiều đáp án đúng** (tài liệu gốc gạch chân từ 2 ý trở lên):
  I‑10, VII‑1, VII‑34, VII‑43, VII‑49, VIII‑26, VIII‑29, VIII‑30.
  Ứng dụng đánh dấu "Chọn nhiều đáp án" và chỉ tính đúng khi chọn đủ.
- **1 câu không có đáp án trong tài liệu gốc**: **VII‑12**
  (*"Quy định khám sức khỏe định kỳ đối với người lao động làm nghề, công việc
  nặng nhọc, độc hại, nguy hiểm ít nhất?"* — trang 37–38 không gạch chân ý nào).
  Câu này **được loại khỏi mọi lượt luyện tập/thi thử**, chỉ hiển thị trong tab
  "Tra cứu" kèm cảnh báo. Nếu có đáp án chính thức, sửa trường `ans` của
  `VII-12` trong `public/data/questions.json`.

## Tính năng

### Đội tuyển (mô phỏng Hội thi) — tab mới
- **Vòng sơ khảo**: Khởi động (5 câu tự luận, 90s/câu, **chấm tự động**) +
  Tăng tốc (5 câu trắc nghiệm, 60s/câu) → **Điểm ĐT1**/100. Đúng theo
  Điều 13.2.b, 14.2.a (trang 5–7).
- **Vòng chung khảo**: Gói câu hỏi riêng + Gói câu hỏi chung (mỗi gói 5 câu,
  20s/câu, tự luận, **tự chấm thủ công** như trước) → cộng vào mốc Điểm ĐT1
  gần nhất thành **Điểm ĐT2 ước tính**/100. Đúng theo Điều 13.2.b, 14.2.b
  (trang 6–8).
- Vì quy chế mô tả thi đấu **nhiều đội cùng lúc** (xếp hạng theo tốc độ, bấm
  chuông giành quyền trả lời), khi luyện một mình ứng dụng chỉ mô phỏng được nội
  dung, thời gian và đúng/sai của riêng người dùng — **không** mô phỏng việc
  tranh chuông/trừ điểm giữa các đội. Mọi điểm số trong tab này là **điểm luyện
  tập cá nhân**, ứng dụng luôn ghi chú rõ đây không phải điểm thi chính thức.
- Câu hỏi được ưu tiên chọn theo hộp Leitner thấp nhất (câu còn yếu) trước.
- Tab "Quy chế" hiển thị nguyên văn bản quét 5 trang làm căn cứ, kèm trích dẫn
  điều/trang cho từng quy tắc hiển thị trong tab Đội tuyển.

#### Chấm tự luận tự động (Khởi động)

Chỉ phần **Khởi động** (Vòng sơ khảo) được chấm tự động; Gói câu hỏi riêng/chung
ở Vòng chung khảo vẫn tự chấm thủ công như bản trước (hai phần này không có
định dạng rõ ràng trong quy chế để xác định đáp án chuẩn một cách chắc chắn).

**Công thức** (xem `normWords`, `lcsAlign`, `gradeRecall` trong `app.js`):
1. Chuẩn hoá cả đáp án chuẩn và câu trả lời: Unicode NFC → chữ thường → bỏ dấu
   câu (`\p{P}`: `. , ; : ! ? ( ) " ' …` …) → gộp khoảng trắng/tab/xuống dòng
   thừa. **Không bỏ dấu tiếng Việt, không sửa chính tả, không đoán nghĩa.**
2. Tách thành mảng từ theo khoảng trắng.
3. Tìm **dãy con chung dài nhất (LCS)** giữa 2 mảng từ — thuật toán quy hoạch
   động O(n·m), giữ đúng thứ tự từ, bỏ qua từ đảo vị trí (không tính khớp) và
   không cho từ thừa làm tăng điểm.
4. **Tỷ lệ khớp (%) = |LCS| / số từ đáp án chuẩn × 100**, làm tròn 1 chữ số
   thập phân.
5. **Điểm câu hỏi = round(tỷ lệ khớp / 100 × 10)** — đây là *điểm luyện tập tự
   động*, khác với cách chấm **nhị phân Đúng=10đ/Sai=0đ** mà Điều 14.2.a quy
   định chính thức tại hội thi; ứng dụng luôn ghi chú rõ sự khác biệt này.
- Câu hỏi nhiều đáp án đúng (8/228 câu, mục "chọn nhiều đáp án") bị **loại khỏi
  Khởi động** vì nối nhiều đáp án trắc nghiệm rời rạc thành 1 chuỗi "đáp án
  chuẩn" sẽ không đáng tin cậy — các câu này vẫn xuất hiện bình thường ở Tăng
  tốc (trắc nghiệm, không đổi). Câu VII-12 (không có đáp án trong tài liệu gốc)
  tiếp tục bị loại khỏi mọi vòng như từ trước.
- Hỗ trợ kỹ thuật nhiều đáp án chuẩn cho 1 câu (lấy kết quả khớp cao nhất), tuy
  hiện ngân hàng câu hỏi chỉ có đúng 1 cách diễn đạt/câu nên tạm thời luôn dùng
  1 biến thể.
- Màn hình kết quả hiển thị đáp án chuẩn, câu trả lời của bạn, tỷ lệ khớp,
  điểm, và highlight từng từ: xanh = khớp, đỏ gạch ngang = thiếu (có ở đáp án
  chuẩn nhưng bạn chưa viết), đỏ gạch chân = sai/thừa. Đáp án chuẩn **không**
  hiển thị trước khi nộp bài hoặc hết giờ. Có nút "Thử lại câu này" để luyện
  đến khi thuộc chính xác — điểm giữ lại là điểm **cao nhất** trong các lần thử.

### Ôn tập nền tảng (không đổi)
- **Luyện tập** — chọn ngành, số câu, xáo trộn đáp án; biết đúng/sai ngay; lọc
  theo *câu đến hạn ôn / câu từng sai / câu đã đánh dấu ★*.
- **Luyện tốc độ** (trước gọi là "Thi thử") — 15/30/50 câu có đồng hồ đếm
  ngược, nộp bài, chấm điểm, xem lại. Bài tập bổ sung để ôn rộng, không phải
  định dạng chính thức của Hội thi.
- **Thẻ ghi nhớ** — lật thẻ, tự đánh giá "đã nhớ / chưa thuộc".
- **Lặp lại ngắt quãng** (Leitner 5 hộp: 0 → 1 → 3 → 7 → 21 ngày). Trả lời đúng
  đẩy câu ra xa, trả lời sai đưa về hộp 1 để gặp lại ngay — áp dụng cho cả
  Luyện tập và phần Tăng tốc trong tab Đội tuyển.
- **Tra cứu** — tìm kiếm không dấu trên toàn bộ câu hỏi & đáp án, lọc theo ngành.
- **Tiến độ** — % thông thạo từng ngành, phân bố 5 hộp, chuỗi ngày học, lịch sử,
  điểm ĐT1/ĐT2 cao nhất.
- **Quy chế** — bản quét gốc thể lệ Đội tuyển (5 trang) + phụ lục thang điểm
  chấm đơn vị (23 trang, chỉ để tham khảo).
- Giao diện sáng/tối, responsive cho điện thoại (thanh điều hướng dưới),
  phím tắt trên máy tính (`1–9` hoặc `a–e` chọn ý, `Enter` tiếp, `S` đánh dấu).

Tiến độ học lưu tại **localStorage** của trình duyệt — không có backend, không
gửi dữ liệu đi đâu. Mỗi thiết bị có tiến độ riêng.

## Quy chế & giới hạn dữ liệu

- File quy chế được cung cấp (`CamScanner 31-10-26 12.43.pdf`) chỉ có **5 trang,
  đánh số gốc 4–8**. Không có trang 1–3 (nhiều khả năng chứa Mục I, Điều 1–10)
  và không rõ có trang nào sau trang 8 hay không (Điều 15 dường như chưa hết ở
  cuối trang 8). Ứng dụng **chỉ dùng đúng phần đã đọc được** (Điều 11–15) và
  không suy đoán thêm nội dung thiếu.
- Phạm vi đã xác nhận với người dùng: **chỉ xây dựng cho "Thi Đội tuyển"**
  (Điều 12 khoản 2). "Thi Chủ nhiệm HC-KT" (Điều 12 khoản 1 — bảo vệ kế hoạch cá
  nhân trước BGK) và phần chấm điểm đơn vị (Mục I) có trong quy chế nhưng
  **chưa được xây dựng** trong ứng dụng.
- Giả định (không phải quy định minh thị trong quy chế): 228 câu trong
  `Bo_cau_hoi_Hoi_thi_0001.pdf` là nguồn câu hỏi BGK sử dụng cho Khởi động/Tăng
  tốc/gói câu hỏi — quy chế không nêu rõ nguồn câu hỏi. Nếu có bộ câu hỏi chính
  thức khác cho các phần thi này, cần cập nhật lại.
- Cơ chế **xếp hạng theo tốc độ giữa nhiều đội** (Tăng tốc) và **giành
  chuông/trừ điểm** (Vòng chung khảo) không thể mô phỏng khi luyện một mình —
  ứng dụng chỉ tính đúng/sai cho phần trả lời của người dùng và luôn ghi chú rõ
  đây là điểm luyện tập, không phải điểm thi chính thức.

## Kiến trúc

Static SPA thuần (không framework, không bước build) + một static server Node
không phụ thuộc thư viện ngoài.

```
quiz-app/
├── server.js                 # static server (gzip, cache, SPA fallback), 0 dependency
├── public/
│   ├── index.html
│   ├── app.js                # router, quiz engine, SRS, Đội tuyển (mô phỏng), thống kê
│   ├── styles.css
│   ├── data/questions.json   # 228 câu — nguồn dữ liệu duy nhất của app
│   └── ref/
│       ├── tcd-01..23.jpg    # ảnh quét phụ lục thang điểm chấm đơn vị
│       └── dt-01..05.jpg     # ảnh quét thể lệ Đội tuyển (Điều 11–15, trang gốc 4–8)
├── data/raw/chunk-*.json     # bản bóc tách gốc theo từng cụm trang (để đối chiếu)
└── deploy/k8s-ingress.yaml   # (tuỳ chọn) route cổng 80 qua Traefik — chưa áp dụng
```

## Vận hành

Chạy như một systemd service, tự khởi động lại và tự bật khi reboot:

```bash
systemctl status hckt-quiz      # trạng thái
systemctl restart hckt-quiz     # khởi động lại
journalctl -u hckt-quiz -f      # log
tail -f /var/log/hckt-quiz.log
```

Cấu hình: `/etc/systemd/system/hckt-quiz.service` (`PORT=8080`, `HOST=0.0.0.0`).

### Vì sao là cổng 8080 chứ không phải 80?

Cổng 80 của máy chủ đang do **Traefik ingress của k3s** chiếm (service
`kube-system/traefik`, external IP `80.241.217.122`), phục vụ ứng dụng
`vstep-test.80-241-217-122.sslip.io`. Ứng dụng này chạy ở cổng 8080 để **không
đụng chạm** dịch vụ đang có.

Muốn dùng URL gọn `http://80.241.217.122/` (không kèm cổng), áp dụng route bổ
sung — chỉ khớp Host là địa chỉ IP trần nên không che các route theo tên miền
hiện có:

```bash
k3s kubectl apply -f deploy/k8s-ingress.yaml
# gỡ bỏ: k3s kubectl delete -f deploy/k8s-ingress.yaml
```

## Cập nhật nội dung câu hỏi

Sửa `public/data/questions.json` (hoặc sửa `data/raw/chunk-*.json` rồi dựng lại),
sau đó tăng số phiên bản `?v=` trong `public/index.html` để trình duyệt tải lại
cache. Không cần khởi động lại service.
