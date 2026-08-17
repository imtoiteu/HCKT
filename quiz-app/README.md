# Ôn thi HC-KT 2026 — web app luyện & ghi nhớ bộ câu hỏi

Ứng dụng web luyện tập, ghi nhớ **228 câu hỏi trắc nghiệm** thuộc 8 ngành trong
*"Bộ câu hỏi, đáp án Hội thi ngành Hậu cần – Kỹ thuật năm 2026"*.

**URL công khai:** http://80.241.217.122:8080/

---

## Nguồn dữ liệu

| Tệp gốc | Vai trò |
|---|---|
| `Bo_cau_hoi_Hoi_thi_0001.pdf` (53 trang) | Toàn bộ 228 câu trắc nghiệm + đáp án |
| `Thang_cham_diem_Hoi_thi_0001.pdf` (23 trang) | Thang điểm chấm thi — **không chứa câu trắc nghiệm**, được đưa vào tab "Thang điểm" dưới dạng ảnh quét đầy đủ |

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

- **Luyện tập** — chọn ngành, số câu, xáo trộn đáp án; biết đúng/sai ngay; lọc
  theo *câu đến hạn ôn / câu từng sai / câu đã đánh dấu ★*.
- **Thi thử** — 15/30/50 câu có đồng hồ đếm ngược, nộp bài, chấm điểm, xem lại.
- **Thẻ ghi nhớ** — lật thẻ, tự đánh giá "đã nhớ / chưa thuộc".
- **Lặp lại ngắt quãng** (Leitner 5 hộp: 0 → 1 → 3 → 7 → 21 ngày). Trả lời đúng
  đẩy câu ra xa, trả lời sai đưa về hộp 1 để gặp lại ngay.
- **Tra cứu** — tìm kiếm không dấu trên toàn bộ câu hỏi & đáp án, lọc theo ngành.
- **Tiến độ** — % thông thạo từng ngành, phân bố 5 hộp, chuỗi ngày học, lịch sử.
- **Thang điểm** — 23 trang phụ lục thang điểm chấm thi.
- Giao diện sáng/tối, responsive cho điện thoại (thanh điều hướng dưới),
  phím tắt trên máy tính (`1–9` hoặc `a–e` chọn ý, `Enter` tiếp, `S` đánh dấu).

Tiến độ học lưu tại **localStorage** của trình duyệt — không có backend, không
gửi dữ liệu đi đâu. Mỗi thiết bị có tiến độ riêng.

## Kiến trúc

Static SPA thuần (không framework, không bước build) + một static server Node
không phụ thuộc thư viện ngoài.

```
quiz-app/
├── server.js                 # static server (gzip, cache, SPA fallback), 0 dependency
├── public/
│   ├── index.html
│   ├── app.js                # toàn bộ logic: router, quiz engine, SRS, thống kê
│   ├── styles.css
│   ├── data/questions.json   # 228 câu — nguồn dữ liệu duy nhất của app
│   └── ref/tcd-01..23.jpg    # ảnh quét thang điểm chấm thi
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
