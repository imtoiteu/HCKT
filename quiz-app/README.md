# Ôn thi HC-KT 2026 — web app luyện thi Đội tuyển

Ứng dụng web ôn luyện cho **Thi Đội tuyển** trong Hội thi tập trung ngành Hậu cần –
Kỹ thuật năm 2026: ghi nhớ **244 câu hỏi trắc nghiệm** (8 ngành), ôn trọng tâm
**80 câu nguyên văn của 4 "Bộ đề" mô phỏng thi Đội tuyển**, và mô phỏng đúng
cấu trúc, thời gian, cách tính điểm của **Vòng sơ khảo** và **Vòng chung khảo**
theo Quy chế Hội thi (Điều 12–15).

**URL công khai:** http://139.180.211.252/

> VPS trước đó (80.241.217.122) đã mất; dự án được khôi phục từ GitHub
> (`https://github.com/imtoiteu/HCKT.git`) sang VPS mới ngày 05/11/2026. Không
> có bản sao cục bộ nào mới hơn commit `990b8c6` trên GitHub, nên phần sửa quy
> chế/nội dung kể từ 31/10/2026 (nếu có) được thực hiện lại trong lần khôi phục
> này — xem mục "Nhật ký khôi phục 05/11/2026" bên dưới.

> **Phạm vi:** ứng dụng phục vụ riêng phần **Thi Đội tuyển**. Quy chế còn mô tả
> "Thi Chủ nhiệm HC-KT" (bảo vệ kế hoạch cá nhân, không phải trắc nghiệm) và chấm
> điểm đơn vị (Mục I) — hai phần này **chưa** được xây dựng vì nằm ngoài phạm vi đã
> xác nhận và/hoặc thiếu căn cứ văn bản đầy đủ, xem mục "Quy chế & giới hạn dữ liệu"
> bên dưới.

---

## Nguồn dữ liệu

| Tệp gốc | Vai trò |
|---|---|
| `Bo_cau_hoi_Hoi_thi_0001.pdf` (53 trang) | 228 câu trắc nghiệm gốc + đáp án |
| `Thang_cham_diem_Hoi_thi_0001.pdf` (23 trang) | Phụ lục thang điểm chấm **đơn vị chính quy** (Mục I) — không áp dụng trực tiếp cho Đội tuyển, đưa vào tab "Quy chế" dưới dạng ảnh quét đầy đủ để tham khảo |
| `CamScanner 31-10-26 12.43.pdf` (5 trang, đánh số gốc 4–8) | Trích Điều 11–15 Quy chế Hội thi — căn cứ duy nhất cho cấu trúc/thời gian/cách tính điểm của tab "Đội tuyển"; ảnh quét ở `public/ref/dt-01..05.jpg` |
| `CamScanner 5-11-26 07.17.pdf` (16 trang, không nằm trong repo — chỉ xử lý cục bộ trên VPS) | 4 "Bộ đề" mô phỏng thi Đội tuyển (mỗi bộ 20 câu: Khởi động 5 + Tăng tốc 5 + Gói riêng 5 + Gói chung 5). Đối chiếu từng câu với 228 câu trên cho thấy **64/80 câu trùng nội dung/đáp án** với ngân hàng cũ (chỉ khác cách rút gọn câu hỏi) — không nhập lại các câu này để tránh trùng lặp; **16 câu thực sự mới** đã được thêm vào ngân hàng (xem "Nhật ký khôi phục 05/11/2026"). Bản bóc tách đầy đủ cả 80 câu (kèm chú thích câu nào trùng `dupOf`/`addedAs` câu nào) nằm ở `data/raw/dethi-doituyen-2026-11-05.json` để đối chiếu sau này. |

Cả 3 PDF câu hỏi là bản quét (không có lớp văn bản), nội dung được bóc tách thủ
công theo từng trang/ảnh. Đáp án đúng trong tài liệu gốc được đánh dấu bằng
**gạch chân** (mục I–VII, và toàn bộ `CamScanner 5-11-26`) hoặc dòng
**"\* Đáp án đúng: x"** (mục VIII của `Bo_cau_hoi_Hoi_thi_0001.pdf`).

### Phân bố câu hỏi

| Mục | Ngành | Số câu |
|---|---|---|
| I | Tham mưu | 16 |
| II | Quân nhu | 32 |
| III | Quân y | 22 |
| IV | Doanh trại | 37 |
| V | Xăng dầu | 21 |
| VI | Xe máy – Vận tải | 20 |
| VII | Các chuyên ngành Kỹ thuật | 63 |
| VIII | Truyền thống ngành HC, KT | 33 |
| | **Tổng** | **244** |

### Lưu ý về dữ liệu

- **9 câu có nhiều đáp án đúng** (tài liệu gốc gạch chân/đánh dấu từ 2 ý trở lên):
  I‑10, VII‑1, VII‑34, VII‑43, VII‑49, VII‑53, VIII‑26, VIII‑29, VIII‑30.
  Ứng dụng đánh dấu "Chọn nhiều đáp án" và chỉ tính đúng khi chọn đủ.
- **1 câu không có đáp án trong tài liệu gốc**: **VII‑12**
  (*"Quy định khám sức khỏe định kỳ đối với người lao động làm nghề, công việc
  nặng nhọc, độc hại, nguy hiểm ít nhất?"* — trang 37–38 không gạch chân ý nào).
  Câu này **được loại khỏi mọi lượt luyện tập/thi thử**, chỉ hiển thị trong tab
  "Tra cứu" kèm cảnh báo. Nếu có đáp án chính thức, sửa trường `ans` của
  `VII-12` trong `public/data/questions.json`.
- 16 câu mới từ `CamScanner 5-11-26 07.17.pdf` (ID: VIII‑33, VII‑53..VII‑63,
  II‑31, II-32, IV‑36, IV‑37) hiển thị nguồn là **"Bộ đề Đội tuyển số N (bổ sung
  5/11/2026)"** thay vì "Trang X tài liệu gốc", vì chúng không nằm trong
  `Bo_cau_hoi_Hoi_thi_0001.pdf` 53 trang.
- Toàn bộ 80/80 câu trong `CamScanner 5-11-26 07.17.pdf` đã được đối chiếu lại
  **trực tiếp với từng trang ảnh quét** (không chỉ tra từ khoá) ngày 05/11/2026:
  64 câu trùng chính xác với ngân hàng cũ (`dupOf`), 16 câu mới đã thêm
  (`addedAs`) — không còn câu nào chưa xác định trùng/mới. Xem mục "Ôn 4 đề
  trọng tâm" bên dưới để biết cách toàn bộ 80 câu gốc (kể cả 64 câu trùng) vẫn
  được giữ nguyên, không bị loại bỏ, trong một khu vực ôn tập riêng.

## Tính năng

### Đội tuyển (mô phỏng Hội thi) — tab mới
- **Vòng sơ khảo**: Khởi động (5 câu tự luận, 90s/câu, **chấm tự động**) +
  Tăng tốc (5 câu trắc nghiệm, 60s/câu) → **Điểm ĐT1**/100. Đúng theo
  Điều 13.2.b, 14.2.a (trang 5–7).
- **Vòng chung khảo**: Gói câu hỏi riêng + Gói câu hỏi chung (mỗi gói 5 câu,
  20s/câu, tự luận, **tự chấm thủ công** như trước) → cộng vào mốc Điểm ĐT1
  gần nhất thành **Điểm ĐT2 ước tính**/100. Đúng theo Điều 13.2.b, 14.2.b
  (trang 6–8).
- **Đồng hồ đếm ngược bắt buộc, theo đúng quy chế, tính riêng từng câu** (Điều
  13.2.b quy định thời gian theo mỗi câu, không phải cho cả phần thi, nên mỗi
  câu mới hợp lệ có đồng hồ riêng — không phải "reset để gian lận"): Khởi động
  90s/câu (trang 5–6), Tăng tốc 60s/câu (trang 6), Gói riêng/Gói chung 20s/câu
  (trang 6). Hiển thị cạnh số câu trên thanh điều hướng của bài làm (đổi màu
  cảnh báo khi còn dưới 1/3 thời gian). Hết giờ tự khoá câu, lưu lại bài đã
  làm/đã chọn và tự chuyển bước đúng như khi bấm nộp tay — không mất câu trả
  lời đã nhập. Không bị chậm/dừng khi chuyển tab hay thu nhỏ trình duyệt (tính
  theo mốc thời gian tuyệt đối, không cộng dồn theo số lần tick). Tải lại
  trang giữa lượt mô phỏng không lấy thêm được giờ — toàn bộ trạng thái chỉ ở
  bộ nhớ trình duyệt, tải lại sẽ mất luôn lượt làm đó (có hộp thoại cảnh báo
  trước khi rời/tải lại trang để tránh mất bài do vô ý).
- Vì quy chế mô tả thi đấu **nhiều đội cùng lúc** (xếp hạng theo tốc độ, bấm
  chuông giành quyền trả lời), khi luyện một mình ứng dụng chỉ mô phỏng được nội
  dung, thời gian và đúng/sai của riêng người dùng — **không** mô phỏng việc
  tranh chuông/trừ điểm giữa các đội. Mọi điểm số trong tab này là **điểm luyện
  tập cá nhân**, ứng dụng luôn ghi chú rõ đây không phải điểm thi chính thức.
- Câu hỏi được ưu tiên chọn theo hộp Leitner thấp nhất (câu còn yếu) trước.
- Tab "Quy chế" hiển thị nguyên văn bản quét 5 trang làm căn cứ, kèm trích dẫn
  điều/trang cho từng quy tắc hiển thị trong tab Đội tuyển.

#### Chấm tự luận tự động (Khởi động) — so khớp CHÍNH XÁC, nhị phân

Chỉ phần **Khởi động** (Vòng sơ khảo, và phần Khởi động trong mỗi "Bộ đề" ở
tab "Ôn 4 đề trọng tâm") được chấm tự động; Gói câu hỏi riêng/chung ở Vòng
chung khảo vẫn tự chấm thủ công như trước (không có định dạng rõ ràng trong
quy chế để xác định đáp án chuẩn một cách chắc chắn).

**Công thức** (xem `normWords`, `lcsAlign`, `wordsEqual`, `gradeRecall` trong
`app.js` — dùng chung cho cả tab "Đội tuyển" và tab "Ôn 4 đề trọng tâm"):
1. Chuẩn hoá cả đáp án chuẩn và câu trả lời: Unicode NFC → chữ thường → bỏ dấu
   câu (`\p{P}`: `. , ; : ! ? ( ) " ' …`, thay bằng khoảng trắng để dấu câu
   dùng ngăn cách từ không làm dính hai từ) → gộp khoảng trắng/tab/xuống dòng
   thừa. **Không bỏ dấu tiếng Việt, không sửa chính tả, không đoán nghĩa.**
2. Tách thành mảng từ theo khoảng trắng, giữ nguyên thứ tự.
3. **Kết quả Đúng/Sai = so khớp CHÍNH XÁC toàn bộ mảng từ** (cùng số từ, cùng
   từng từ, cùng thứ tự) với đáp án chuẩn. Thiếu từ, thừa từ, sai từ, hoặc đảo
   thứ tự từ — tất cả đều tính **Sai**, không có điểm một phần. **Điểm câu hỏi
   = Đúng → 10đ theo đúng cách chấm nhị phân của Điều 14.2.a / Sai → 0đ.**
4. Song song đó, vẫn tính thêm **dãy con chung dài nhất (LCS)** giữa đáp án
   chuẩn và câu trả lời (thuật toán quy hoạch động O(n·m), giữ đúng thứ tự từ,
   không cho từ đảo vị trí hay từ thừa làm tăng tỷ lệ) để ra **tỷ lệ khớp (%)**
   — tỷ lệ này **chỉ hiển thị làm phản hồi tham khảo** giúp người học thấy
   mình còn thiếu/sai/thừa từ nào, **không** được dùng để thay thế kết quả
   Đúng/Sai nhị phân ở bước 3.
- Câu hỏi nhiều đáp án đúng (9/244 câu, mục "chọn nhiều đáp án") bị **loại khỏi
  Khởi động** vì nối nhiều đáp án trắc nghiệm rời rạc thành 1 chuỗi "đáp án
  chuẩn" sẽ không đáng tin cậy — các câu này vẫn xuất hiện bình thường ở Tăng
  tốc (trắc nghiệm, không đổi). Câu VII-12 (không có đáp án trong tài liệu gốc)
  tiếp tục bị loại khỏi mọi vòng như từ trước.
- Hỗ trợ kỹ thuật nhiều đáp án chuẩn cho 1 câu (ưu tiên biến thể khớp chính
  xác; nếu không biến thể nào khớp chính xác, hiển thị biến thể có tỷ lệ LCS
  cao nhất để so sánh), tuy hiện ngân hàng câu hỏi chỉ có đúng 1 cách diễn
  đạt/câu nên tạm thời luôn dùng 1 biến thể.
- Màn hình kết quả hiển thị **Đúng/Sai**, đáp án chuẩn, câu trả lời của bạn,
  tỷ lệ khớp (%, chỉ tham khảo), và highlight từng từ: xanh = khớp, đỏ gạch
  ngang = thiếu (có ở đáp án chuẩn nhưng bạn chưa viết), đỏ gạch chân =
  sai/thừa. Đáp án chuẩn **không** hiển thị trước khi nộp bài hoặc hết giờ. Có
  nút "Thử lại câu này" để luyện đến khi thuộc chính xác — kết quả giữ lại ưu
  tiên **Đúng** nếu đã từng trả lời đúng ít nhất 1 lần, nếu chưa bao giờ đúng
  thì giữ lần có tỷ lệ khớp cao nhất để xem phản hồi.

### Ôn 4 đề trọng tâm — tab mới, khu vực nổi bật trên Trang chủ

Ôn đúng **nguyên văn 80 câu** trong **4 "Bộ đề"** mô phỏng thi Đội tuyển, trích
từ `CamScanner 5-11-26 07.17.pdf` (xem `public/data/dethi4.json`), **giữ
nguyên toàn bộ câu hỏi, đúng phần thi và thứ tự gốc trong từng đề** — kể cả 64
câu trùng nội dung với 228 câu cũ hoặc trùng giữa các đề với nhau (không loại
bỏ/không bỏ qua câu nào chỉ vì trùng). Mỗi câu gắn ID riêng dạng
`DT{số đề}-{KD|TT|GR|GC}-{số câu gốc}` (ví dụ `DT2-GR-4` = Bộ đề 2, Gói câu
hỏi riêng, câu 4), tách biệt hoàn toàn khỏi 244 câu ngân hàng chính và khỏi
tab "Đội tuyển" — tiến độ ghi nhớ (hộp Leitner) của 80 câu này được theo dõi
riêng.

**Lọc theo vòng** (chọn "Vòng" trên màn hình thiết lập — độc lập với đề/chế độ
ôn bên dưới, kết hợp tự do với cả hai):
- **Sơ khảo** — chỉ lấy câu thuộc phần Khởi động + Tăng tốc (đúng vòng 1 theo
  Điều 13.2.a).
- **Chung khảo** — chỉ lấy câu thuộc Gói câu hỏi riêng + Gói câu hỏi chung
  (đúng vòng 2). Vào thẳng Chung khảo được, **không cần hoàn thành Sơ khảo
  trước**.
- **Toàn bộ** — cả 80 câu như trước.
- Áp dụng được cả khi ôn riêng 1 đề lẫn khi trộn/đảo cả 4 đề — ví dụ "Sơ khảo"
  + "Cả 4 đề" + "Đảo thứ tự" = trộn luân phiên đúng 40 câu Khởi động/Tăng tốc
  của cả 4 đề, không lẫn câu Gói riêng/Gói chung vào. Đã kiểm tra bằng script
  độc lập: 0 câu lọt sai vòng trên toàn bộ 15 tổ hợp (5 phạm vi đề × 3 vòng).

**3 chế độ ôn** (chọn "Đề" + "Chế độ ôn" trên màn hình thiết lập):
- **Theo thứ tự gốc** — ôn riêng 1 đề, đúng thứ tự gốc trong phạm vi vòng đã
  chọn (Khởi động → Tăng tốc → Gói riêng → Gói chung, hoặc chỉ nửa đầu/nửa sau
  nếu đã lọc vòng).
- **Đảo thứ tự câu** — xáo trộn thứ tự câu trong 1 đề đã chọn; chọn đề = "Cả 4
  đề" để **trộn luân phiên cả 4 đề**, vẫn giữ nguyên từng lượt xuất hiện của
  câu trùng (một câu xuất hiện ở 2 đề thì vẫn được hỏi 2 lần riêng biệt).
- **Chỉ câu sai / chưa thuộc** — lọc theo tiến độ ghi nhớ của riêng 80 câu
  này (đã từng trả lời sai, hoặc hộp Leitner ≤ 2), trong phạm vi đề/vòng đã
  chọn.
- Màn hình kết quả ghi rõ mỗi câu **thuộc đề nào, phần nào, số câu gốc** (ví
  dụ "Đề 3 · Gói câu hỏi riêng · Câu 2 gốc").
- **Không tính vào Điểm ĐT1/ĐT2** — đây là khu vực ôn luyện, tách biệt khỏi
  tab "Đội tuyển" (mô phỏng mới là nơi giữ đúng cấu trúc/thời gian/cách tính
  điểm chính thức *bắt buộc* của quy chế). Phần Khởi động dùng chung công
  thức chấm nhị phân chính xác ở mục trên; phần Tăng tốc/Gói riêng/Gói chung
  chấm trắc nghiệm đúng/sai bình thường.
- **Đồng hồ đếm ngược ở đây là tuỳ chọn** (gạt công tắc "Thời gian" trên màn
  hình thiết lập, mặc định **tắt** để ôn chậm không giới hạn giờ). Khi bật,
  dùng đúng thời lượng/cách tính của Điều 13.2.b như tab "Đội tuyển" (Khởi
  động 90s/câu, Tăng tốc 60s/câu, Gói riêng/Gói chung 20s/câu — theo đúng
  `stage` của từng câu, không phụ thuộc đề/vòng/chế độ ôn đã chọn), chỉ bắt
  đầu đếm khi câu đã hiển thị, hết giờ tự khoá và chấm bằng bài đã làm (không
  mất câu trả lời), không bị chậm khi chuyển tab, và chuyển câu không reset
  "để gian lận" vì quy chế vốn tính theo từng câu chứ không theo cả phần thi.
- Toàn bộ 80 câu đã được đối chiếu trực tiếp với ảnh quét 16 trang ngày
  05/11/2026 — **0 câu còn chưa xác minh được đáp án**; nếu phát hiện sai sót,
  sửa `public/data/dethi4.json` (và `data/raw/dethi-doituyen-2026-11-05.json`
  để giữ bản đối chiếu đồng bộ).

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
  đánh số gốc 4–8**. Không có trang 1–3 (nhiều khả năng chứa Mục I, Điều 1–10).
  Điều 15 (Cách tính thành tích) đọc được **trọn vẹn đến hết mục "Thành tích cá
  nhân"** ở cuối trang 8 (câu cuối kết thúc bằng dấu chấm, không bị cắt giữa
  chừng) — nhưng tiêu đề Chương III là "CÁCH TÍNH THÀNH TÍCH, **XẾP LOẠI, KHEN
  THƯỞNG**" trong khi 5 trang hiện có chỉ chứa nội dung "cách tính thành tích";
  nhiều khả năng còn Điều 16+ về xếp loại/khen thưởng ở (các) trang sau trang 8
  mà tài liệu hiện có không bao gồm. Phần "Thi Đội tuyển" (Điều 12–14, phạm vi
  ứng dụng) đã đọc được đầy đủ. Ứng dụng **chỉ dùng đúng phần đã đọc được** và
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
│   ├── app.js                # router, quiz engine, SRS, Đội tuyển (mô phỏng), Ôn 4 đề, thống kê
│   ├── styles.css
│   ├── data/questions.json   # 244 câu — ngân hàng chính (Luyện tập/Thẻ nhớ/Tra cứu/Luyện tốc độ/Đội tuyển)
│   ├── data/dethi4.json      # 80 câu nguyên văn 4 "Bộ đề" — riêng cho tab "Ôn 4 đề trọng tâm"
│   └── ref/
│       ├── tcd-01..23.jpg    # ảnh quét phụ lục thang điểm chấm đơn vị
│       └── dt-01..05.jpg     # ảnh quét thể lệ Đội tuyển (Điều 11–15, trang gốc 4–8)
├── data/raw/chunk-*.json              # bản bóc tách gốc 228 câu theo từng cụm trang (để đối chiếu)
├── data/raw/dethi-doituyen-2026-11-05.json  # bản bóc tách đầy đủ 80 câu từ CamScanner 5-11-26 (nguồn của dethi4.json, kèm dupOf/addedAs để đối chiếu với ngân hàng chính)
└── deploy/k8s-ingress.yaml   # route k3s/Traefik của VPS cũ — không áp dụng trên VPS mới, giữ lại để tham khảo
```

## Vận hành

Chạy như một systemd service, tự khởi động lại và tự bật khi reboot:

```bash
systemctl status hckt-quiz      # trạng thái
systemctl restart hckt-quiz     # khởi động lại
journalctl -u hckt-quiz -f      # log
```

Cấu hình: `/etc/systemd/system/hckt-quiz.service` (`PORT=80`, `HOST=0.0.0.0`).
Trên VPS mới (139.180.211.252), cổng 80 đang rảnh (không có nginx/k3s/docker
nào chiếm dụng — đã kiểm tra bằng `ss -tlnp` trước khi cấu hình), nên dùng
thẳng cổng 80 để có URL gọn `http://139.180.211.252/`, không cần ingress/k3s
như cấu hình VPS cũ (`deploy/k8s-ingress.yaml` chỉ còn mang tính tham khảo).

## Cập nhật nội dung câu hỏi

- Ngân hàng chính: sửa `public/data/questions.json` (hoặc sửa
  `data/raw/chunk-*.json` rồi dựng lại), sau đó tăng số phiên bản `?v=` trong
  `public/index.html` **và** trong lệnh gọi `fetch('data/questions.json?v=N')`
  ở `public/app.js`.
- 4 Bộ đề trọng tâm: sửa `public/data/dethi4.json` (giữ đúng cấu trúc
  `sets[].stages.{khoidong,tangtoc,rieng,chung}[]`, giữ thứ tự gốc), đồng thời
  sửa `data/raw/dethi-doituyen-2026-11-05.json` tương ứng để hai file không
  lệch nhau, rồi tăng số phiên bản `?v=` trong lệnh gọi
  `fetch('data/dethi4.json?v=N')` ở `public/app.js`.
- Dù sửa file nào, cũng cần tăng số phiên bản `app.js?v=N` trong
  `public/index.html` nếu có sửa `app.js`, để trình duyệt tải lại cache (mọi
  file tĩnh được server cache 7 ngày). Không cần khởi động lại service sau khi
  sửa nội dung — chỉ cần khởi động lại khi sửa `server.js`.

## Nhật ký khôi phục 05/11/2026

- VPS cũ (80.241.217.122) mất; khôi phục bằng `git clone` từ
  `https://github.com/imtoiteu/HCKT.git` (nhánh `main`, commit `990b8c6`) vào
  `/root/imtoiteu/HCKT` trên VPS mới (139.180.211.252) — không có dữ liệu cục
  bộ nào mới hơn để giữ lại, không có thay đổi chưa commit nào bị mất.
- Đối chiếu lại Điều 11–15 quy chế (đọc trực tiếp ảnh quét, không dựa vào
  README cũ) — nội dung Đội tuyển (TEAM_RULES, hạn mức thời gian, số câu từng
  phần) trong `app.js` đã khớp chính xác với bản quét. Một chỗ **được bổ
  sung**: công thức tính điểm chi tiết từng câu của Điều 14.2.a (nhị phân
  10đ/0đ cho Khởi động; `10 − (n−1)×1,0` cho Tăng tốc; trừ 5,0đ khi giành
  chuông sai ở Gói riêng/chung) có trong bản quét (trang 7–8) nhưng trước đó
  chưa được trích dẫn trong tab "Đội tuyển" — đã thêm rule `diem_ct` vào
  `TEAM_RULES` trong `app.js` kèm trích dẫn điều/trang.
- Nạp thêm bộ đề mới `CamScanner 5-11-26 07.17.pdf` (4 "Bộ đề", 80 câu dạng mô
  phỏng Đội tuyển): đối chiếu từng câu với 228 câu cũ, phát hiện 64/80 câu
  trùng nội dung + đáp án (chỉ khác cách rút gọn văn bản câu hỏi) — không nhập
  lại để tránh trùng lặp theo đúng yêu cầu. 16 câu là nội dung mới, đã thêm
  vào `questions.json` (ID mới: `VIII-33`, `VII-53`..`VII-63`, `II-31`,
  `II-32`, `IV-36`, `IV-37`), nâng tổng số câu từ 228 lên 244. Không có câu
  nào bị bỏ ngỏ đáp án trong số 16 câu mới được thêm. **4 câu** còn chưa xác
  nhận được là trùng hay mới hoàn toàn sau khi tra từ khoá thủ công — **chưa
  đưa vào** ngân hàng chính, giữ nguyên trong file bóc tách kèm ghi chú để
  người có bản gốc đầy đủ đối chiếu lại sau. *(Lưu ý: dòng này mô tả đúng
  trạng thái tại thời điểm viết — xem mục "05/11/2026 (tiếp) — đối chiếu lại
  toàn bộ 80 câu với ảnh quét" bên dưới để biết các sửa đổi tiếp theo trong
  cùng ngày, trong đó câu Bộ đề 3/Tăng tốc/câu 1 hoá ra CÓ gạch chân rõ chứ
  không phải suy luận từ câu `I-2` như ghi chú ban đầu.)*
  - *Kiểm tra lại sau khi nhập:* đối chiếu độc lập toàn bộ 20 câu được đánh
    dấu "không trùng" trong lần bóc tách đầu tiên với 244 câu hiện có bằng
    tra từ khoá theo từng câu — phát hiện 4 câu trong số đó thực ra **trùng
    chính xác** với câu đã có (`VIII-4`, `VII-25`, `V-13`, `VII-17`) nhưng bị
    bỏ sót cờ `dupOf` ở lần bóc tách đầu, và 1 câu (`II-32`, về hệ số ăn thêm
    ngày lễ/tết theo Nghị định 02/2026/NĐ-CP) là **câu mới thật sự nhưng bị bỏ
    sót, chưa được thêm** — đã bổ sung câu này vào `questions.json` sau khi
    đối chiếu lại trực tiếp với ảnh trang 5 của bản quét. Đã cập nhật cờ
    `dupOf`/`addedAs` tương ứng trong file bóc tách.
- Toàn bộ 80 câu bóc tách (kể cả 64 câu trùng, có ghi chú `dupOf`, và câu đã
  thêm có ghi chú `addedAs`) được lưu ở `data/raw/dethi-doituyen-2026-11-05.json`
  để đối chiếu/kiểm tra lại sau này, không bị xoá.

### 05/11/2026 (tiếp) — đối chiếu lại toàn bộ 80 câu với ảnh quét, xây khu vực "Ôn 4 đề trọng tâm"

Yêu cầu tiếp theo trong ngày: ưu tiên cao nhất là ôn tập **đầy đủ và chính
xác cả 4 bộ đề**, giữ nguyên mọi câu kể cả câu trùng (không loại bỏ như cách
tiếp cận gộp vào ngân hàng chính ở trên), và tách hẳn khỏi chế độ mô phỏng
thi chính thức.

- **Đối chiếu lại trực tiếp cả 16 trang ảnh quét** (không chỉ tra từ khoá) cho
  toàn bộ 80 câu của 4 "Bộ đề" — từng câu, từng phương án, từng đáp án gạch
  chân. Kết quả: 79/80 câu khớp chính xác với lần bóc tách trước; phát hiện
  **1 lỗi thật sự**: câu Bộ đề 3/Tăng tốc/câu 1 ("Chủ đề thực hiện nhiệm vụ
  chủ yếu... Kế hoạch số 160/KH-HCKT...") bị ghi nhầm là "không có ý nào gạch
  chân" ở lần bóc tách trước, trong khi ảnh trang 9–10 thực ra có gạch chân rõ
  ở phương án b ("Quyết tâm nghiên cứu, sản xuất vũ khí trang bị tiên tiến,
  hiện đại.") — đã sửa lại `uncertain:false`, `ans:["b"]` trong
  `data/raw/dethi-doituyen-2026-11-05.json`, không còn câu nào `uncertain`
  trong 80 câu.
- Xây `public/data/dethi4.json`: toàn bộ 80 câu, giữ nguyên thứ tự gốc (Khởi
  động → Tăng tốc → Gói riêng → Gói chung, câu 1→5 mỗi phần) trong từng Bộ đề
  1–4, **không loại bỏ câu trùng**, ID riêng `DT{đề}-{KD|TT|GR|GC}-{câu}` tách
  biệt khỏi 244 câu ngân hàng chính.
- Thêm tab/khu vực nổi bật **"Ôn 4 đề trọng tâm"** trên Trang chủ và thanh điều
  hướng (`V.dethi4` trong `app.js`) — 3 chế độ ôn (thứ tự gốc / đảo thứ tự
  trong 1 đề hoặc trộn luân phiên cả 4 đề / chỉ câu sai-chưa thuộc), không có
  đồng hồ đếm ngược, không tính vào Điểm ĐT1/ĐT2, màn hình kết quả ghi rõ
  "Đề N · Phần · Câu M gốc" cho từng câu.
- **Đổi cách chấm Khởi động sang nhị phân chính xác** (áp dụng cho cả tab
  "Đội tuyển" lẫn "Ôn 4 đề trọng tâm", dùng chung một hàm `gradeRecall`):
  trước đây tính điểm theo tỷ lệ % khớp LCS (được điểm một phần); nay **chỉ
  tính Đúng (10đ) khi khớp chính xác toàn bộ** sau chuẩn hoá — thiếu/thừa/sai
  từ hoặc đảo thứ tự đều tính Sai (0đ). Tỷ lệ khớp % vẫn hiển thị nhưng chỉ để
  tham khảo, không dùng để tính điểm — đúng theo yêu cầu "chỉ tính khớp hoàn
  toàn khi hai câu trả lời giống nhau sau chuẩn hoá" và đúng với cách chấm
  nhị phân chính thức của Điều 14.2.a tại tab "Đội tuyển".
- **Kiểm thử**: viết test độc lập bằng Node (ngoài trình duyệt) xác nhận hàm
  chấm nhị phân đúng mọi trường hợp biên (dấu câu không làm dính từ, giữ dấu
  tiếng Việt, từ đảo thứ tự → Sai, từ thừa → Sai, câu trống → Sai). Vì VPS
  không có trình duyệt/X server, đã cài tạm `jsdom` qua `npm` để mô phỏng DOM
  thật, tải trang qua HTTP từ chính service đang chạy, và **click qua toàn bộ
  80 câu** ở chế độ "Cả 4 đề · Theo thứ tự gốc" bằng câu trả lời đúng xác
  minh — 0 lỗi, kết quả 100%, tag "Đề N · Phần · Câu M gốc" khớp đúng từng
  câu; kiểm thêm luồng trả lời sai (cả tự luận lẫn trắc nghiệm, kể cả câu
  nhiều đáp án) hiển thị đúng "Sai"/đáp án đúng. Gói `jsdom`/`npm` cài thêm
  trong lần kiểm thử này chỉ phục vụ việc này, không phải phụ thuộc runtime
  của ứng dụng (ứng dụng vẫn 0 dependency, chạy bằng `node server.js` thuần).

### 05/11/2026 (tiếp 2) — lọc theo Vòng (Sơ khảo / Chung khảo) trong "Ôn 4 đề trọng tâm"

- Thêm bộ lọc **"Chọn vòng"** (Sơ khảo / Chung khảo / Toàn bộ) vào màn hình
  thiết lập của tab "Ôn 4 đề trọng tâm", độc lập và kết hợp tự do với bộ lọc
  "Chọn đề" và "Chế độ ôn" đã có — không đổi giao diện/bố cục các phần khác
  (`d4Pool`, `D4_ROUND_STAGES` trong `app.js`: Sơ khảo = `khoidong+tangtoc`,
  Chung khảo = `rieng+chung`, đúng cách chia vòng của Quy chế Điều 13.2.a và
  đúng cách tab "Đội tuyển" đã chia từ trước).
- Vào thẳng "Chung khảo" được, không cần hoàn thành "Sơ khảo" trước — không
  có cổng chặn nào được thêm.
- Giữ nguyên hoàn toàn nội dung câu hỏi, đáp án, cách chấm (nhị phân chính xác
  cho Khởi động) và việc giữ câu trùng — bộ lọc chỉ chọn tập con câu hỏi theo
  `stage`, không sửa dữ liệu.
- **Kiểm tra không lẫn câu giữa hai vòng**: viết script Node độc lập duyệt cả
  15 tổ hợp (5 phạm vi đề × 3 lựa chọn vòng), xác nhận đúng số câu kỳ vọng
  (10/40 cho Sơ khảo hoặc Chung khảo theo phạm vi 1-đề/4-đề, 20/80 cho Toàn
  bộ) và **0 câu lọt sai `stage`**; xác nhận tập Sơ khảo và Chung khảo không
  giao nhau và hợp lại đúng bằng tập Toàn bộ, với mọi phạm vi đề. Lặp lại kiểm
  tra bằng `jsdom` bấm qua giao diện thật (5 tổ hợp phạm vi×vòng×chế độ) qua
  HTTP tới service đang chạy — 0 câu bị gắn sai "Đề N · Phần · Câu M gốc"
  trong toàn bộ các lượt duyệt.

### 05/11/2026 (tiếp 3) — đồng hồ đếm ngược theo quy chế

- **Đọc lại Điều 13.2.b** (trang 5–6 bản quét) để xác nhận thời lượng chính
  xác trước khi code: quy chế tính thời gian **theo từng câu**, không phải
  cho cả phần thi — Khởi động "tổng thời gian đọc câu hỏi và trả lời của mỗi
  câu: 90s", Tăng tốc "...mỗi câu: 60s", Gói riêng "Thời gian chuẩn bị tối đa
  của mỗi câu hỏi là 20s", Gói chung "...trong vòng 20s". Không có mốc thời
  gian nào tính cho cả vòng/phần thi trong văn bản — nên yêu cầu "chuyển câu
  không được reset thời gian nếu tính cho cả phần" không áp dụng ở đây: mỗi
  câu có đồng hồ riêng là đúng quy chế.
- Tab **"Đội tuyển"** đã có sẵn đồng hồ đúng các mốc trên từ trước (không
  phải xây mới); lần này kiểm tra/siết lại cho khớp các yêu cầu mới: chỉ bắt
  đầu đếm khi câu đã hiển thị (đồng hồ khởi động bằng `setTimeout` trễ 1 nhịp
  sau khi gắn vào DOM, không tính giờ "chết" trước khi hiển thị), tính theo
  mốc `Date.now()` tuyệt đối nên không chậm khi chuyển tab/thu nhỏ cửa sổ,
  hết giờ tự khoá + lưu bài đã làm (giữ nguyên câu đã gõ/đã chọn, không mất),
  và bổ sung chặn **nộp bài hai lần** (xem dưới).
- Thêm đồng hồ **tuỳ chọn** (mặc định tắt) vào tab "Ôn 4 đề trọng tâm" — dùng
  lại đúng hàm `startTeamTimer`/`teamSeconds` của tab "Đội tuyển" (chỉ thêm
  tham số `elId` để dùng chung 1 cơ chế đếm giờ cho cả hai tab, vì chúng không
  bao giờ hiển thị đồng thời), cùng thời lượng/trích dẫn Điều 13.2.b, áp dụng
  đúng cho mọi tổ hợp đề/vòng/chế độ ôn đã chọn (thời gian theo `stage` của
  từng câu, độc lập với các bộ lọc khác).
- **Phát hiện khi kiểm thử**: bấm rất nhanh 2 lần vào nút "Câu tiếp theo"
  (bằng tham chiếu DOM cũ, qua `jsdom`) có thể gọi `d4Advance()`/`teamAdvance()`
  hai lần, nhảy 2 câu thay vì 1. Không tái hiện được bằng thao tác thật của
  người dùng trong trình duyệt (nút cũ đã bị `render()` gỡ khỏi màn hình
  trước khi trình duyệt kịp gửi sự kiện click thứ 2), nhưng vẫn sửa cho chắc:
  thêm hàm bọc `once()` cho mọi nút nộp bài/chuyển câu có tác dụng phụ (nộp tự
  luận, nộp trắc nghiệm tự chấm, "Câu tiếp theo"/"Xem kết quả" ở cả tab "Đội
  tuyển" lẫn "Ôn 4 đề trọng tâm") và thêm chặn tái vào ở `gradeAndReveal`/
  `doGrade` (`if (it.revealed) return`) — chạy lại kiểm thử sau khi sửa: bấm
  đúp không còn nhảy câu nữa.
- **Kiểm thử** (qua `jsdom`, bấm thật trên service đang chạy, giả lập trôi
  thời gian bằng cách ghi đè `Date.now` thay vì chờ thật 90s): xác nhận đồng
  hồ hiện đúng 01:30/01:00/00:20 kèm đúng chú thích điều/trang cho từng phần;
  xác nhận hết giờ tự khoá câu tự luận và chấm "Sai" dựa trên bài đã gõ (rỗng
  → Sai, đúng theo cách chấm nhị phân); xác nhận câu hỏi tiếp theo luôn có
  đồng hồ mới đúng thời lượng phần đó; xác nhận bật/tắt đồng hồ hoạt động cả
  hai chiều ở "Ôn 4 đề trọng tâm"; chạy lại toàn bộ bộ kiểm thử cũ (80 câu
  đúng → 100%, bộ lọc vòng không lẫn câu, tab "Đội tuyển"/"Luyện tập") để xác
  nhận không có hồi quy.
- Thêm cảnh báo `beforeunload` khi đang có lượt mô phỏng Đội tuyển hoặc lượt
  ôn 4 đề có bật giờ còn dang dở — tải lại/đóng tab giữa chừng vẫn **không lấy
  thêm được giờ** (toàn bộ trạng thái chỉ ở bộ nhớ, tải lại mất hết lượt làm,
  không phải "được reset đồng hồ"); cảnh báo chỉ để tránh mất bài do vô ý.
