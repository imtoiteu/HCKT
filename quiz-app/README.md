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
- **Vòng sơ khảo**: Khởi động (5 câu tự luận, 90s/câu — tính cả thời gian trả
  lời, **chấm tự động**) + Tăng tốc (5 câu trắc nghiệm, 60s/câu) → **Điểm
  ĐT1**/100. Đúng theo Điều 13.2.b, 14.2.a (trang 5–7).
- **Vòng chung khảo**: Gói câu hỏi riêng + Gói câu hỏi chung (mỗi gói 5 câu)
  → cộng vào mốc Điểm ĐT1 gần nhất thành **Điểm ĐT2 ước tính**/100. Đúng theo
  Điều 13.2.b, 14.2.b (trang 6–8). **Điều 13.2.b gọi 2 phần này là "trả lời
  trực tiếp"**, không mô tả là trắc nghiệm/trên máy tính như Khởi động/Tăng
  tốc — mặc định ứng dụng dùng **ô nhập tự do** (không hiện sẵn phương án),
  chấm tự động bằng cùng tiêu chí so khớp chữ ở mục dưới (trừ câu nhiều đáp
  án đúng — tự chấm thủ công). Có thể bật tuỳ chọn **"Ôn có gợi ý"** để hiện
  lại các phương án A/B/C/D in trong bộ đề dưới dạng trắc nghiệm — ứng dụng
  ghi rõ đây **là lựa chọn mô phỏng hỗ trợ học**, quy chế không mô tả hình
  thức chọn đáp án cho 2 phần này nên không được gọi là "đúng quy chế".
- **Đồng hồ đếm ngược bắt buộc, theo đúng quy chế, tính riêng từng câu** (Điều
  13.2.b quy định thời gian theo mỗi câu, không phải cho cả phần thi, nên mỗi
  câu mới hợp lệ có đồng hồ riêng — không phải "reset để gian lận"):
  - Khởi động: 90s/câu, **tính cả thời gian trả lời** (trang 5–6) — không đổi.
  - Tăng tốc: 60s/câu (trang 6) — không đổi.
  - **Gói câu hỏi riêng: 20s là thời gian CHUẨN BỊ trước khi trả lời**, không
    phải hạn nộp bài (trang 6). Màn hình hiện pha "Đang chuẩn bị…" (không có ô
    nhập), hết 20s tự chuyển sang ô trả lời — hoặc bấm "Trả lời ngay" để vào
    sớm hơn. Sau đó **không giới hạn thêm thời gian trả lời** vì quy chế không
    nêu thời lượng trình bày câu trả lời.
  - **Gói câu hỏi chung: 20s là cửa sổ GIÀNH QUYỀN trả lời** (bấm chuông),
    không phải hạn nộp bài (trang 6). Màn hình hiện nút **"🔔 Bấm chuông"**;
    bấm trong 20s để chuyển sang ô trả lời (không giới hạn thêm giờ); hết 20s
    mà chưa bấm thì coi là **không giành được quyền trả lời câu đó** (0đ) —
    quy chế không mô tả bước giành lại quyền cho trường hợp không ai bấm
    chuông, nên không tự suy ra một bước như vậy.
  - Hiển thị cạnh số câu trên thanh điều hướng của bài làm (đổi màu cảnh báo
    khi còn dưới 1/3 thời gian). Hết giờ tự khoá câu, lưu lại bài đã
    làm/đã chọn và tự chuyển bước đúng như khi bấm nộp tay — không mất câu trả
    lời đã nhập. Không bị chậm/dừng khi chuyển tab hay thu nhỏ trình duyệt
    (tính theo mốc thời gian tuyệt đối, không cộng dồn theo số lần tick). Tải
    lại trang giữa lượt mô phỏng không lấy thêm được giờ — toàn bộ trạng thái
    chỉ ở bộ nhớ trình duyệt, tải lại sẽ mất luôn lượt làm đó (có hộp thoại
    cảnh báo trước khi rời/tải lại trang để tránh mất bài do vô ý).
- **Pha "giành lại quyền trả lời" (10s) KHÔNG bị biến thành lượt thử lại của
  chính đội vừa trả lời sai** — Điều 13.2.b mô tả đây là cơ hội cho MỘT ĐỘI
  KHÁC, không phải thêm giờ cho đội đã trả lời sai, nên ứng dụng không tự
  cộng nối 20s + 10s thành 30s cho cùng một lượt. Có tuỳ chọn riêng **"Luyện
  thêm tình huống Giành quyền trả lời (10s)"**: sau khi trả lời sai/không có
  câu trả lời, nếu bật tuỳ chọn này sẽ hiện thêm một bài tập **tách biệt, cần
  bấm mới bắt đầu**, có đồng hồ 10s riêng — kết quả hiển thị riêng, **không**
  cộng vào điểm hay thời gian của câu chính.
- Vì quy chế mô tả thi đấu **nhiều đội cùng lúc** (xếp hạng theo tốc độ, bấm
  chuông giành quyền trả lời), khi luyện một mình ứng dụng chỉ mô phỏng được nội
  dung, thời gian và đúng/sai của riêng người dùng — **không** mô phỏng việc
  tranh chuông/trừ điểm giữa các đội thật sự cùng lúc. Mọi điểm số trong tab
  này là **điểm luyện tập cá nhân**, ứng dụng luôn ghi chú rõ đây không phải
  điểm thi chính thức.
- Câu hỏi được ưu tiên chọn theo hộp Leitner thấp nhất (câu còn yếu) trước.
- Tab "Quy chế" hiển thị nguyên văn bản quét 5 trang làm căn cứ, kèm trích dẫn
  điều/trang cho từng quy tắc hiển thị trong tab Đội tuyển.

#### Chấm tự luận tự động — so khớp CHÍNH XÁC, nhị phân

Áp dụng cho **Khởi động** (Vòng sơ khảo, và phần Khởi động trong mỗi "Bộ đề"
ở tab "Ôn 4 đề trọng tâm") và **Gói câu hỏi riêng/Gói câu hỏi chung** khi
không bật "Ôn có gợi ý" (trừ câu nhiều đáp án đúng — quy chế không mô tả cách
xác định đáp án chuẩn khi phải ghép nhiều ý trắc nghiệm rời rạc thành 1 câu
trả lời tự do, nên các câu này **tự chấm thủ công** bằng 2 nút Đúng/Sai, như
Khởi động từng làm với câu nhiều đáp án).

**Quan trọng — đây là tiêu chí luyện thuộc của ứng dụng, không phải cách BGK
chấm chính thức**: Điều 14.2.a/b chỉ quy định **cơ cấu điểm nhị phân** (đúng
= 10đ, sai = 0đ, không có điểm một phần) — quy chế **không** quy định thuật
toán xác định "đúng/sai" cho câu trả lời trực tiếp bằng lời nói (BGK thực tế
là giám khảo con người, có thể chấp nhận cách diễn đạt khác nghĩa tương
đương). Việc dùng tiêu chí "khớp chính xác từng chữ" dưới đây là **lựa chọn
của ứng dụng** để luyện nhớ đúng câu chữ, được ghi chú rõ trong giao diện.

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
   = Đúng → 10đ theo đúng cơ cấu điểm nhị phân của Điều 14.2.a/b / Sai → 0đ.**
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
  điểm chính thức *bắt buộc* của quy chế).
- **Hình thức Khởi động/Tăng tốc không đổi** (tự luận chấm tự động / trắc
  nghiệm). **Gói câu hỏi riêng/Gói câu hỏi chung mặc định dùng ô nhập tự do**
  (không hiện sẵn phương án) để đúng với "trả lời trực tiếp" theo Điều
  13.2.b — chấm tự động bằng cùng tiêu chí so khớp chữ (trừ câu nhiều đáp án
  đúng — tự chấm thủ công). Bật tuỳ chọn **"Ôn có gợi ý"** trên màn hình thiết
  lập để quay lại hiện phương án A/B/C/D như trước, có ghi chú rõ đây là lựa
  chọn mô phỏng hỗ trợ học, không phải hình thức thi thật.
- **Đồng hồ đếm ngược ở đây là tuỳ chọn** (gạt công tắc "Thời gian" trên màn
  hình thiết lập, mặc định **tắt** để ôn chậm không giới hạn giờ). Khi bật,
  dùng đúng thời lượng/cách tính của Điều 13.2.b như tab "Đội tuyển": Khởi
  động 90s/câu (tính cả thời gian trả lời), Tăng tốc 60s/câu, **Gói câu hỏi
  riêng 20s CHUẨN BỊ trước khi trả lời** (nút "Trả lời ngay" để vào sớm hơn,
  không giới hạn thêm giờ trả lời), **Gói câu hỏi chung 20s GIÀNH QUYỀN** (nút
  "Bấm chuông"; hết giờ chưa bấm = không giành được quyền, 0đ; sau khi bấm thì
  không giới hạn thêm giờ trả lời) — áp dụng theo đúng `stage` của từng câu,
  không phụ thuộc đề/vòng/chế độ ôn đã chọn. Hết giờ tự khoá và chấm bằng bài
  đã làm (không mất câu trả lời), không bị chậm khi chuyển tab, và chuyển câu
  không reset "để gian lận" vì quy chế vốn tính theo từng câu chứ không theo
  cả phần thi.
- **Tuỳ chọn "Luyện thêm tình huống Giành quyền trả lời" (10s)**: sau khi trả
  lời sai/không có câu trả lời ở Gói riêng/chung, nếu bật sẽ hiện thêm một bài
  tập tách biệt (cần bấm mới bắt đầu, đồng hồ 10s riêng) mô phỏng việc một đội
  khác giành quyền (Điều 13.2.b) — kết quả hiển thị riêng, **không** cộng vào
  điểm/thời gian của câu chính, không tự động nối tiếp thành 30 giây.
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

### 05/11/2026 (tiếp 4) — sửa lại hình thức Gói câu hỏi riêng/chung: không phải trắc nghiệm

Người dùng đặt câu hỏi: "Chung khảo có thực sự là trắc nghiệm, mỗi câu 20
giây không?" sau khi thấy tab "Ôn 4 đề trọng tâm" hiển thị trắc nghiệm cho
Gói câu hỏi riêng/chung. **Đọc lại trực tiếp cả hai PDF** (không dựa vào code
hiện có làm bằng chứng) cho kết quả: **không** — Điều 13.2.a–b (trang 5–6)
gọi 2 phần này là **"trả lời trực tiếp"**, dùng cụm "đưa ra câu trả lời" /
"bấm chuông giành quyền trả lời" — khác hẳn cách diễn đạt "trên máy tính
(soạn thảo đáp án)" của Khởi động và "trắc nghiệm trên máy tính (lựa chọn
đáp án đúng)" của Tăng tốc ngay trên cùng trang. Chính `CamScanner 5-11-26`
cũng tự đặt tiêu đề mục này là *"Vòng chung khảo (Trả lời trực tiếp, nếu sai
các đội bấm chuông giành quyền trả lời)"* ở cả 4 Bộ đề. "20 giây" có thật
nhưng là 2 ý nghĩa khác nhau (chuẩn bị ở Gói riêng, giành quyền/bấm chuông ở
Gói chung), không phải thời hạn chọn đáp án, và còn thiếu một pha 10 giây
"giành lại quyền trả lời" mà bản trước chưa có. Các phương án A/B/C/D in
trong bộ đề nhiều khả năng là tài liệu chuẩn bị/đối chiếu cho BGK chứ không
phải lựa chọn hiển thị cho thí sinh — nhưng quy chế không khẳng định minh thị
điều này, nên README chỉ ghi là suy luận có căn cứ, không phải sự thật đã xác
nhận 100%.

**Thay đổi đã triển khai** (áp dụng nhất quán cho cả tab "Đội tuyển" và "Ôn 4
đề trọng tâm", giữ nguyên giao diện/bố cục tổng thể, giữ nguyên bộ lọc Sơ
khảo-Chung khảo, chức năng đảo câu, câu trùng):
1. Gói câu hỏi riêng/chung mặc định dùng ô nhập tự do, không hiện sẵn phương
   án; nộp bài mới hiện đáp án chuẩn. Thêm tuỳ chọn **"Ôn có gợi ý"** (tắt
   theo mặc định) để quay lại hiện trắc nghiệm, ghi rõ đây là mô phỏng hỗ trợ
   học, không phải hình thức thi thật — dùng lại `teamMCView`/`d4RenderMC` đã
   có, chỉ tổng quát hoá để nhận đúng thời lượng theo `stage` thay vì cố định
   cho Tăng tốc.
2. Vẫn dùng đáp án gạch chân đã đối chiếu từng câu với ảnh quét (0/40 câu Gói
   riêng/chung còn chưa rõ đáp án — xem log "tiếp 2") để chấm theo tiêu chí so
   khớp chữ đã thống nhất; 2 câu nhiều đáp án đúng (`DT1-GC-2`, `DT4-GC-1`)
   không tự chấm được theo cách này nên chuyển sang tự chấm thủ công (2 nút
   Đúng/Sai), như cách Khởi động đã làm với câu nhiều đáp án từ trước. Diễn
   giải trong giao diện (`teamAutoGradeBox`) nay ghi rõ: cơ cấu điểm nhị phân
   là theo Điều 14.2.a/b, còn **cách xác định đúng/sai bằng so khớp chữ là
   lựa chọn của ứng dụng để luyện thuộc, không phải cách BGK thực tế chấm**.
3. Sửa lại ý nghĩa đồng hồ: thêm `rcPhaseUI` — Gói riêng vẽ pha "Đang chuẩn
   bị…" (nút "Trả lời ngay" để vào sớm), Gói chung vẽ pha "Giành quyền trả
   lời" với nút "🔔 Bấm chuông"; sau khi vào ô trả lời thì **không đặt thêm
   giới hạn giờ nào** vì quy chế không nêu thời lượng trình bày câu trả lời.
   Hết 20s mà Gói chung chưa bấm chuông → `rcMissedBox()` báo "Không giành
   được quyền trả lời", không tự chuyển sang ô trả lời.
4. Thêm `renderStealPractice` (tuỳ chọn, tắt theo mặc định): sau khi trả lời
   sai/không có câu trả lời ở Gói riêng/chung, hiện nút riêng để luyện tình
   huống "Giành quyền trả lời (10s)" — phải bấm mới bắt đầu, có đồng hồ 10s
   và ô nhập riêng, kết quả hiển thị tách biệt (`it.steal`), **không** cộng
   vào `it.points`/`it.ok` của câu chính.
5. README không còn khẳng định các phương án A/B/C/D "chỉ dành cho BGK" như
   một sự thật — đã nêu rõ đây là suy luận từ cách hành văn, tách bạch phần
   quy chế nêu trực tiếp (hình thức "trả lời trực tiếp", bấm chuông, mốc thời
   gian, cách cộng/trừ điểm) với phần là lựa chọn mô phỏng của ứng dụng (ô
   nhập mặc định, chế độ gợi ý, tiêu chí chấm so khớp chữ, bài tập giành
   quyền luyện thêm).

**Kiểm thử** bằng `jsdom` bấm thật qua service đang chạy: chạy lại trọn vẹn
80 câu ở chế độ mặc định (ô nhập tự do, không giờ) — 0 lỗi, điểm 100%, bao
gồm cả 2 câu nhiều đáp án qua luồng tự chấm thủ công mới; xác nhận chế độ có
giờ cho Gói riêng hiện đúng pha "chuẩn bị" (không có ô nhập) rồi nút "Trả lời
ngay" chuyển đúng sang ô nhập và chấm đúng; xác nhận Gói chung hiện đúng nút
"Bấm chuông", và giả lập hết 20s không bấm (ghi đè `Date.now`) cho đúng kết
quả "Không giành được quyền trả lời"; xác nhận bật "Ôn có gợi ý" quay lại
đúng giao diện trắc nghiệm có ghi chú rõ là mô phỏng; xác nhận tuỳ chọn luyện
"Giành quyền trả lời" hiện đúng bài tập tách biệt và **không** làm thay đổi
điểm của câu chính sau khi nộp; lặp lại ở tab "Đội tuyển" (luôn bắt buộc có
giờ) với cùng các kịch bản, xác nhận trích dẫn đổi đúng giữa Điều 14.2.a
(Khởi động) và 14.2.b (Gói riêng/chung); chạy lại bộ lọc Sơ khảo/Chung khảo
(15 tổ hợp phạm vi×vòng) — vẫn 0 câu lẫn vòng; chạy lại luồng "Luyện tập" cũ
— không hồi quy.

### 05/11/2026 (tiếp 5) — sửa đáp án chuẩn tham chiếu cho chế độ trả lời tự do

Lỗi được báo: Đề 3 → Khởi động → Câu 3 gốc ("Theo Nghị định số 02/2026/NĐ-CP,
tiêu chuẩn diện tích nhà trong quân đội được quy định theo?") dùng **"Cả hai
phương án trên."** làm đáp án chuẩn để chấm ở chế độ nhập tự do, trong khi
người học không nhìn thấy các phương án a)/b) để biết "hai phương án trên" là
gì — không thể gõ đúng được.

**Rà soát toàn bộ 80 câu** (không chỉ câu được báo) tìm mọi đáp án đúng có
dạng tham chiếu ("Cả…", "Tất cả…", "…trên", "A và B đúng"…) bằng regex quét cả
2 lượt (hẹp rồi mở rộng, cùng kết quả) rồi đối chiếu thủ công — phát hiện
đúng **4 câu** đáp án đúng là tham chiếu kiểu này (loại các trường hợp cụm từ
"cả"/"tất cả" chỉ xuất hiện trong phương án SAI, không phải đáp án đúng, nên
không cần sửa):

| Đề | Phần | Câu gốc | ID | Đáp án trước (chỉ tham chiếu) | Đáp án sau dùng để chấm/hiển thị ở chế độ tự do |
|---|---|---|---|---|---|
| 3 | Khởi động | 3 | `DT3-KD-3` | "Cả hai phương án trên." | "Cấp bậc quân hàm và chức vụ." |
| 2 | Gói câu hỏi chung | 1 | `DT2-GC-1` | "Cả a, b, c, d." | "Lần đầu trước khi đưa đối tượng kiểm định vào sử dụng; định kỳ khi đối tượng kiểm định đến hạn kiểm định lại; sau khi lắp đặt lại đối tượng kiểm định hoặc có cải tạo, sửa chữa làm thay đổi kết cấu, thông số kỹ thuật của đối tượng kiểm định; theo yêu cầu của đơn vị sử dụng hoặc theo yêu cầu của Cơ quan An toàn, bảo hộ lao động quân đội." |
| 3 | Gói câu hỏi chung | 3 | `DT3-GC-3` | "Cả a, b, c." | "Kiểm tra tình trạng kỹ thuật và đồng bộ của trang bị kỹ thuật; bảo quản trang bị kỹ thuật và dụng cụ, thiết bị khác, sửa chữa hỏng hóc nếu có; kiểm tra hồ sơ, ghi chép sổ sách đăng ký thống kê." |
| 1 | Tăng tốc | 3 | `DT1-TT-3` | "Cả a, b, c" | *(không sửa — xem lý do bên dưới)* |

Nội dung mở rộng lấy nguyên văn các phương án được tham chiếu, ghép theo đúng
thứ tự gốc (a → b → c → d), không đổi số liệu/đơn vị/điều kiện, chỉ nối bằng
dấu `;` hoặc "và" cho liền mạch — không tự suy đoán hay bịa thêm nội dung.
`DT1-TT-3` **không cần sửa** vì Tăng tốc luôn là trắc nghiệm ở cả 2 tab (dù
bật/tắt "Ôn có gợi ý" cũng không đổi), người học luôn nhìn thấy đủ phương án
a/b/c nên tham chiếu "Cả a, b, c" không gây ra lỗi tương tự. Không gặp câu
nào dạng "Không phương án nào đúng" trong 80 câu — nếu phát sinh sau này,
quy ước là đánh dấu `uncertain` thay vì tự ghép các phương án sai lại.

**Triển khai**: thêm trường mới `ansFull` (mảng, có thể nhiều biến thể) vào
đúng 3 câu trên trong `public/data/dethi4.json` và bản đối chiếu
`data/raw/dethi-doituyen-2026-11-05.json` — **không đổi** `opts`/`ans` (khoá
đáp án gốc cho trắc nghiệm giữ nguyên, dùng nguyên khi bật "Ôn có gợi ý").
Thêm hàm `canonicalAnswers(q)` trong `app.js`: trả về `q.ansFull` nếu có,
nếu không thì trả về đúng nội dung phương án khoá đáp án gốc như trước — áp
dụng tại cả 3 nơi gọi `gradeRecall` cho chế độ trả lời tự do (chấm câu
chính, chấm "Thử tình huống" giành quyền trả lời, và hiển thị "Đáp án chuẩn"
+ highlight thiếu/thừa/sai từ, vì cả 3 đều dùng chung kết quả của
`gradeRecall`) — sửa một chỗ, áp dụng nhất quán cho mọi nơi hiển thị/chấm,
đúng yêu cầu không chỉ sửa phần hiển thị mà chấm vẫn theo chuỗi tham chiếu cũ.

**Kiểm thử** bằng hàm thật trích từ `app.js` (không phải viết lại logic để
test) và bằng `jsdom` bấm qua giao diện thật trên service đang chạy, cho cả
3 câu: gõ đúng nội dung đã mở rộng → **Đúng**; gõ nguyên văn cụm tham chiếu cũ
("Cả hai phương án trên.", "Cả a, b, c, d.", "Cả a, b, c.") → **Sai** (0%,
không còn được tính đúng); gõ thiếu một vế → **Sai**, từ còn thiếu được tô
đỏ gạch ngang đúng vị trí; "Đáp án chuẩn" hiển thị sau khi nộp cũng đổi sang
nội dung đã mở rộng, không còn hiện cụm tham chiếu cũ. Xác nhận chế độ trắc
nghiệm ("Ôn có gợi ý") vẫn hiện nguyên văn "Cả a, b, c." làm phương án, bấm
đúng khoá đáp án gốc vẫn được tính đúng bình thường — không đổi. Chạy lại bộ
kiểm thử 80-câu-đúng cũ: điểm giảm còn 96% nếu vẫn gõ 3 cụm tham chiếu cũ
(đúng như kỳ vọng, xác nhận lỗi đã được chặn), quay lại 100% khi gõ đúng nội
dung đã mở rộng — không có câu nào khác bị ảnh hưởng ngoài 3 câu trên.

### 05/11/2026 (tiếp 6) — sửa icon cảnh báo/kết quả bị phóng quá khổ

Lỗi: icon cảnh báo ở pha "Đang chuẩn bị" (Gói câu hỏi riêng) và icon
Đúng/Sai ở màn hình chấm kết quả (cả Khởi động lẫn Gói riêng/chung, cả 2 tab)
bị hiển thị rất lớn, đẩy ô trả lời/nút thao tác xuống dưới.

**Nguyên nhân** (SVG icon dùng chung `ICON.warn/check/x` trong `app.js` —
mỗi icon chỉ có `viewBox`, không có `width`/`height`, phải dựa hoàn toàn vào
CSS theo đúng ngữ cảnh chứa nó để định kích thước):
1. `rcPhaseUI` (pha "chuẩn bị" Gói riêng) gọi `${ICON.warn.replace('warn','')}`
   — lỗi gõ nhầm, chuỗi `"warn"` không hề xuất hiện trong mã SVG nên
   `.replace()` không có tác dụng gì, để lọt nguyên icon **không có class**
   vào một `<div class="lead">` chưa từng được định kiểu cho bối cảnh này
   (CSS `.lead` sẵn có chỉ áp dụng trong `.recall-ans`/`.flash .fa`) → trình
   duyệt tự giãn SVG theo kích thước mặc định, rất lớn.
2. `.gpts b{display:block;...}` (khung điểm Đúng/Sai dùng chung cho
   `teamAutoGradeBox`, khung "luyện thêm giành quyền trả lời", và
   `rcMissedBox`) **chưa từng có quy tắc CSS định cỡ `svg` con** — vẫn hoạt
   động "tạm ổn" ở các icon khác vì mọi nơi khác đều có `X svg{width;height}`
   riêng (`.note svg`, `.feedback svg`, `.btn svg`, `.mark`…), chỉ riêng
   `.gpts`/`.gpct` bị bỏ sót từ trước, lộ rõ hơn khi thêm các khung mới (Gói
   riêng/chung, luyện giành quyền trả lời) dùng cùng cấu trúc này.

**Sửa tại đúng phạm vi** (không đổi quy tắc `svg{...}` toàn cục, không ảnh
hưởng logo hay icon khác đang đúng):
- Bỏ `.replace()` sai, bọc icon + chữ trong `<div class="lead">${ICON.warn}
  <span>…</span></div>`; thêm CSS `.prep-box` (khung pha chuẩn bị/giành
  quyền) và `.prep-box .lead svg{width:18px;height:18px}` — icon cạnh chữ,
  đúng dải 20–24px theo yêu cầu (chọn 18px cho vừa cỡ chữ 15px của dòng tiêu
  đề ngắn này).
- Đổi `.gpct b,.gpts b` từ `display:block` sang `display:flex;align-items:
  center;justify-content:center;gap:5px` (vẫn căn giữa y hệt trước, chỉ đổi
  cơ chế để xếp icon + chữ cùng hàng) và thêm `.gpct b svg,.gpts b svg{
  width:22px;height:22px}` — áp dụng thống nhất cho mọi nơi dùng `.gpts`
  (Khởi động, Gói riêng/chung, "luyện thêm giành quyền trả lời", "không
  giành được quyền"), vì tất cả cùng chia sẻ một đoạn mã hiển thị kết quả.
- Không đổi `.note svg`, `.feedback svg`, `.btn svg`, `.mark`, `.tabs
  button svg`, `.star-btn svg`, `.ring svg` — những nơi này đã có quy tắc
  đúng từ trước, rà soát lại toàn bộ danh sách nơi dùng `ICON.warn/check/x`
  trong `app.js` xác nhận không còn chỗ nào thiếu CSS định cỡ `svg`.

**Kiểm thử**: dùng `jsdom` tải trang thật từ service đang chạy rồi đọc
`getComputedStyle` của icon — xác nhận icon pha chuẩn bị còn đúng 18×18px,
icon Đúng/Sai trong khung kết quả còn đúng 22×22px (trước đó không có quy
tắc CSS nào khớp, kích thước không xác định/giãn to). Chạy lại toàn bộ kiểm
thử trước đó (80 câu đúng → 100%, bộ lọc vòng không lẫn câu, kịch bản đáp án
mở rộng ở `DT3-KD-3`/`DT2-GC-1`/`DT3-GC-3`) — không hồi quy. **Không kiểm tra
được bằng mắt thật trên trình duyệt/điện thoại thật** vì VPS không có trình
duyệt hay màn hình — `jsdom` không dựng layout/CSS đầy đủ như trình duyệt
thật, chỉ xác nhận đúng quy tắc CSS được áp dụng; cần người dùng tự mở trang
để xác nhận hình ảnh cuối cùng.
