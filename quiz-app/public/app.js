/* ================= Ôn thi HC-KT 2026 ================= */
'use strict';

const LS = 'hckt2026.v1';
const DAY = 864e5;
const BOX_DAYS = [0, 0, 1, 3, 7, 21]; // index = box (1..5)
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const pad2 = n => String(n).padStart(2, '0');
const noAcc = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();

const ICON = {
  check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5L2.6 9.4l6.5-.9z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg>',
};

/* ---------------- store ---------------- */
const store = {
  d: { stats: {}, starred: {}, streak: { last: '', days: 0 }, history: [], theme: 'auto', best: {} },
  load() {
    try { Object.assign(this.d, JSON.parse(localStorage.getItem(LS) || '{}')); } catch (e) { }
    if (!this.d.stats) this.d.stats = {};
    if (!this.d.starred) this.d.starred = {};
    if (!this.d.streak) this.d.streak = { last: '', days: 0 };
    if (!this.d.history) this.d.history = [];
    if (!this.d.best) this.d.best = {};
  },
  save() { try { localStorage.setItem(LS, JSON.stringify(this.d)); } catch (e) { } },
  st(id) { return this.d.stats[id] || (this.d.stats[id] = { box: 1, due: 0, seen: 0, right: 0, wrong: 0 }); },
  grade(id, ok) {
    const s = this.st(id); s.seen++;
    if (ok) { s.right++; s.box = Math.min(5, s.box + 1); s.due = Date.now() + BOX_DAYS[s.box] * DAY; }
    else { s.wrong++; s.box = 1; s.due = Date.now(); }
    s.lastOk = ok; s.at = Date.now();
    this.touchStreak(); this.save();
  },
  touchStreak() {
    const t = today(), st = this.d.streak;
    if (st.last === t) return;
    const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
    st.days = (st.last === y) ? st.days + 1 : 1;
    st.last = t;
  },
  isDue(id) { const s = this.d.stats[id]; return !s || s.due <= Date.now(); },
  mastery(id) { const s = this.d.stats[id]; return s ? (s.box - 1) / 4 : 0; },
  star(id) { if (this.d.starred[id]) delete this.d.starred[id]; else this.d.starred[id] = 1; this.save(); },
};

/* ---------------- app state ---------------- */
let DATA = null, QBY = {};
let DETHI4 = null; // { sets:[{setNo,stages}], flat:[items in original order], bySet:{1:[...],...} }
const app = { view: 'home', quiz: null };

/* ---------------- helpers ---------------- */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
function secColor(id) { const s = DATA.sections.find(x => x.id === id); return s ? s.color : 'var(--brand)'; }
function secShort(id) { const s = DATA.sections.find(x => x.id === id); return s ? s.short : id; }
function answerable(q) { return q.ans.length > 0; }
function toast(msg) {
  const t = el('div', 'toast', esc(msg)); $('#toasts').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 1900);
}
function fmtTime(ms) { const s = Math.max(0, Math.round(ms / 1000)); return pad2(s / 60 | 0) + ':' + pad2(s % 60); }
function setEq(a, b) { return a.length === b.length && a.every(x => b.includes(x)); }
/** Bọc 1 trình xử lý sự kiện để chỉ chạy đúng 1 lần — chặn nộp bài/chuyển bước
 * hai lần nếu cùng một nút (hoặc tham chiếu cũ của nó) nhận sự kiện click lần
 * nữa trước khi màn hình kịp vẽ lại (ví dụ bấm liên tiếp rất nhanh). */
function once(fn) { let used = false; return (...a) => { if (used) return; used = true; return fn(...a); }; }

/* ---------------- theme ---------------- */
function applyTheme() {
  const t = store.d.theme;
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme:dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('#themeBtn').textContent = t === 'auto' ? '🌗' : (t === 'dark' ? '🌙' : '☀️');
  $('meta[name=theme-color]').setAttribute('content', dark ? '#0b1120' : '#f4f6fb');
}

/* ================= VIEWS ================= */
const V = {};

/* ---------- HOME ---------- */
V.home = () => {
  const qs = DATA.questions;
  const done = qs.filter(q => store.d.stats[q.id]);
  const mastered = qs.filter(q => (store.d.stats[q.id]?.box || 1) >= 4).length;
  const due = qs.filter(q => answerable(q) && store.d.stats[q.id] && store.isDue(q.id)).length;
  const weak = qs.filter(q => { const s = store.d.stats[q.id]; return s && s.wrong > 0 && s.box <= 2; }).length;
  const pct = Math.round(qs.reduce((a, q) => a + store.mastery(q.id), 0) / qs.length * 100);
  const C = 2 * Math.PI * 48;

  const v = el('div');
  v.appendChild(el('div', 'card hero', `
    <div class="ring">
      <svg viewBox="0 0 110 110">
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
        <circle class="bgc" cx="55" cy="55" r="48" fill="none"/>
        <circle class="fgc" cx="55" cy="55" r="48" fill="none" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
      </svg>
      <div class="ring-txt"><b>${pct}%</b><i>Thông thạo</i></div>
    </div>
    <div class="hero-info">
      <h2>Chào đồng chí 👋</h2>
      <p>Bộ đề gồm <b>${qs.length} câu</b> thuộc <b>${DATA.sections.length} ngành</b>. Đã học <b>${done.length}</b> câu · thuộc lòng <b>${mastered}</b> câu.</p>
      <div class="hero-cta">
        <button class="btn primary big" data-go="due">${ICON.play} Ôn hôm nay${due ? ` (${due})` : ''}</button>
        <button class="btn big" data-nav="practice">Luyện tập</button>
        <button class="btn big" data-nav="team">Mô phỏng Đội tuyển</button>
      </div>
    </div>`));

  v.appendChild(el('div', 'kpis', `
    <div class="kpi"><b>${qs.length}</b><span>Tổng số câu</span></div>
    <div class="kpi due"><b>${due}</b><span>Cần ôn hôm nay</span></div>
    <div class="kpi bad"><b>${weak}</b><span>Câu còn yếu</span></div>
    <div class="kpi ok"><b>${store.d.streak.days}</b><span>Ngày liên tiếp 🔥</span></div>`));

  if (DETHI4) {
    const d4card = el('div', 'card pad');
    d4card.style.cssText = 'margin-top:16px;border:1.5px solid var(--brand);background:linear-gradient(135deg,var(--brand-soft),var(--card))';
    d4card.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span class="tag" style="background:var(--brand);color:#fff">Trọng tâm</span>
        <h3 style="margin:0">Ôn 4 đề trọng tâm</h3>
      </div>
      <p class="muted" style="font-size:13.5px;line-height:1.55;margin:4px 0 12px">
        ${DETHI4.flat.length} câu nguyên văn trong 4 "Bộ đề" mô phỏng thi Đội tuyển — ôn theo thứ tự gốc,
        đảo thứ tự, trộn cả 4 đề, hoặc chỉ ôn câu sai/chưa thuộc.</p>`;
    const go4 = el('button', 'btn primary block', `${ICON.play} Vào ôn 4 đề`);
    go4.onclick = () => nav('dethi4');
    d4card.appendChild(go4);
    v.appendChild(d4card);
  }

  v.appendChild(el('div', 'sec-title', `<h3>Học theo ngành</h3><span class="muted" style="font-size:12.5px">Chạm để luyện riêng ngành đó</span>`));
  const g = el('div', 'sec-grid');
  DATA.sections.forEach(s => {
    const list = QBY[s.id];
    const m = Math.round(list.reduce((a, q) => a + store.mastery(q.id), 0) / list.length * 100);
    const seen = list.filter(q => store.d.stats[q.id]).length;
    const b = el('button', 'sec-card', `
      <span class="rom" style="background:${s.color}">${s.id}</span>
      <h4>${esc(s.short)}</h4>
      <div class="meta"><span>${list.length} câu · đã học ${seen}</span><span>${m}%</span></div>
      <div class="bar"><i style="width:${m}%;background:${s.color}"></i></div>`);
    b.onclick = () => startQuiz({ mode: 'practice', secs: [s.id], count: 0, shuffle: true, title: s.short });
    g.appendChild(b);
  });
  v.appendChild(g);
  return v;
};

/* ---------- SETUP (practice / exam) ---------- */
const setupState = {
  practice: { secs: [], count: 20, shuffle: true, only: '' },
  exam: { secs: [], count: 30, minutes: 20 },
};

V.practice = () => setupView('practice');
V.exam = () => setupView('exam');

function setupView(mode) {
  const isExam = mode === 'exam';
  const S = setupState[mode];
  const v = el('div');
  v.appendChild(el('div', 'page-head', isExam
    ? `<h1>Luyện tốc độ</h1><p>Làm nhiều câu liên tục theo thời gian tự chọn, chấm điểm và xem lại ở cuối bài — bài tập bổ sung để ôn rộng, <b>không phải định dạng chính thức</b> của Hội thi. Muốn mô phỏng đúng cấu trúc thi Đội tuyển, dùng tab “Đội tuyển”.</p>`
    : `<h1>Luyện tập</h1><p>Trả lời và biết đúng/sai ngay. Câu trả lời sai sẽ tự động quay lại sớm hơn.</p>`));

  const card = el('div', 'card pad');

  // sections
  const f1 = el('div', 'field', `<label>Chọn ngành</label>`);
  const chips = el('div', 'chips');
  const mkChip = (id, label, n) => {
    const c = el('button', 'chip', `${esc(label)}<small>${n}</small>`);
    c.dataset.id = id;
    c.onclick = () => {
      if (id === '*') S.secs = [];
      else {
        const i = S.secs.indexOf(id);
        i < 0 ? S.secs.push(id) : S.secs.splice(i, 1);
      }
      syncChips();
    };
    return c;
  };
  chips.appendChild(mkChip('*', 'Tất cả', DATA.questions.length));
  DATA.sections.forEach(s => chips.appendChild(mkChip(s.id, `${s.id}. ${s.short}`, s.count)));
  f1.appendChild(chips); card.appendChild(f1);
  function syncChips() {
    $$('.chip', chips).forEach(c => {
      const id = c.dataset.id;
      c.classList.toggle('on', id === '*' ? S.secs.length === 0 : S.secs.includes(id));
    });
    syncCount();
  }

  // count
  const counts = isExam ? [15, 30, 50] : [10, 20, 30, 50, 0];
  const f2 = el('div', 'field', `<label>Số câu mỗi lượt</label>`);
  const cchips = el('div', 'chips');
  counts.forEach(n => {
    const c = el('button', 'chip', n === 0 ? 'Toàn bộ' : `${n} câu`);
    c.dataset.n = n;
    c.onclick = () => { S.count = n; syncCount(); };
    cchips.appendChild(c);
  });
  f2.appendChild(cchips); card.appendChild(f2);
  const avail = el('p', 'muted', ''); avail.style.cssText = 'font-size:12.5px;margin-top:8px'; f2.appendChild(avail);

  // options
  if (isExam) {
    const f3 = el('div', 'field', `<label>Thời gian</label>`);
    const tchips = el('div', 'chips');
    [10, 20, 30, 45].forEach(m => {
      const c = el('button', 'chip', `${m} phút`); c.dataset.m = m;
      c.onclick = () => { S.minutes = m; $$('.chip', tchips).forEach(x => x.classList.toggle('on', +x.dataset.m === S.minutes)); };
      tchips.appendChild(c);
    });
    f3.appendChild(tchips); card.appendChild(f3);
    setTimeout(() => $$('.chip', tchips).forEach(x => x.classList.toggle('on', +x.dataset.m === S.minutes)));
  } else {
    const f3 = el('div', 'field', `<label>Nguồn câu hỏi</label>`);
    const sw = el('div', 'switches');
    const opts = [
      ['', 'Tất cả câu trong phạm vi đã chọn', ''],
      ['due', 'Chỉ câu đến hạn ôn', 'Theo lịch lặp lại ngắt quãng'],
      ['wrong', 'Chỉ câu từng trả lời sai', 'Tập trung xử lý điểm yếu'],
      ['star', 'Chỉ câu đã đánh dấu ★', 'Những câu bạn tự đánh dấu'],
    ];
    opts.forEach(([k, lbl, sub]) => {
      const n = countFor(mode, k);
      const w = el('label', 'sw' + (k && n === 0 ? ' disabled' : ''), `
        <input type="radio" name="only" value="${k}"${S.only === k ? ' checked' : ''}><span class="box"></span>
        <span class="lbl">${esc(lbl)}${sub ? `<i>${esc(sub)}</i>` : ''}</span>
        <span class="tag" style="margin-left:auto">${n}</span>`);
      w.querySelector('input').onchange = () => { S.only = k; syncCount(); };
      sw.appendChild(w);
    });
    f3.appendChild(sw); card.appendChild(f3);

    const f4 = el('div', 'field', `<label>Tuỳ chọn</label>`);
    const w2 = el('label', 'sw', `<input type="checkbox"${S.shuffle ? ' checked' : ''}><span class="box"></span>
      <span class="lbl">Xáo trộn thứ tự đáp án<i>Chống học vẹt theo vị trí a/b/c</i></span>`);
    w2.querySelector('input').onchange = e => { S.shuffle = e.target.checked; };
    f4.appendChild(w2); card.appendChild(f4);
  }

  const go = el('button', 'btn primary big block', `${ICON.play} Bắt đầu`);
  go.onclick = () => {
    const pool = poolFor(mode);
    if (!pool.length) return toast('Không có câu hỏi phù hợp lựa chọn.');
    startQuiz({ mode, secs: S.secs.slice(), count: S.count, shuffle: isExam ? true : S.shuffle, only: S.only, minutes: S.minutes });
  };
  card.appendChild(go);
  v.appendChild(card);

  function countFor(m, only) {
    return basePool(setupState[m].secs).filter(q => filterOnly(q, only)).length;
  }
  function syncCount() {
    const pool = poolFor(mode);
    $$('.chip', cchips).forEach(c => c.classList.toggle('on', +c.dataset.n === S.count));
    avail.textContent = `Có ${pool.length} câu phù hợp. Mỗi lượt sẽ lấy ${S.count === 0 ? pool.length : Math.min(S.count, pool.length)} câu.`;
    go.disabled = pool.length === 0;
    if (!isExam) $$('.sw input[name=only]').forEach(i => { i.checked = i.value === S.only; });
  }
  function poolFor(m) { return basePool(S.secs).filter(q => filterOnly(q, isExam ? '' : S.only)); }
  syncChips();
  return v;
}

function basePool(secs) {
  return DATA.questions.filter(q => answerable(q) && (secs.length === 0 || secs.includes(q.sec)));
}
function filterOnly(q, only) {
  if (only === 'due') return store.d.stats[q.id] ? store.isDue(q.id) : true;
  if (only === 'wrong') return (store.d.stats[q.id]?.wrong || 0) > 0;
  if (only === 'star') return !!store.d.starred[q.id];
  return true;
}

/* ---------- QUIZ ENGINE ---------- */
function startQuiz(cfg) {
  let pool = basePool(cfg.secs || []).filter(q => filterOnly(q, cfg.only || ''));
  if (!pool.length) { toast('Không còn câu hỏi phù hợp.'); return nav('home'); }
  // prioritise weakest / most overdue first, then randomise inside
  pool = shuffle(pool).sort((a, b) => {
    const sa = store.d.stats[a.id], sb = store.d.stats[b.id];
    return ((sa?.box || 1) - (sb?.box || 1));
  });
  const n = cfg.count && cfg.count > 0 ? Math.min(cfg.count, pool.length) : pool.length;
  let items = pool.slice(0, n);
  if (cfg.mode === 'exam') items = shuffle(items);

  app.quiz = {
    mode: cfg.mode, title: cfg.title || '',
    items: items.map(q => ({
      q, order: cfg.shuffle ? shuffle(q.opts) : q.opts,
      pick: [], done: false, ok: null,
    })),
    i: 0, right: 0, wrong: 0,
    started: Date.now(),
    endAt: cfg.mode === 'exam' ? Date.now() + (cfg.minutes || 20) * 60000 : 0,
  };
  app.view = 'quiz';
  render();
}

V.quiz = () => {
  const Q = app.quiz;
  if (!Q) { app.view = 'home'; return V.home(); }
  if (Q.finished) return quizResult();
  const it = Q.items[Q.i], q = it.q;
  const isExam = Q.mode === 'exam';
  const v = el('div');

  // top bar
  const bar = el('div', 'quiz-bar');
  const back = el('button', 'btn ghost', `${ICON.back} Thoát`);
  back.onclick = () => { if (Q.i === 0 || confirm('Thoát và huỷ lượt làm bài này?')) { app.quiz = null; nav('home'); } };
  bar.appendChild(back);
  bar.appendChild(el('div', 'progress', `<i style="width:${(Q.i) / Q.items.length * 100}%"></i>`));
  bar.appendChild(el('span', 'counter', `${Q.i + 1}/${Q.items.length}`));
  if (isExam) { const t = el('span', 'timer', fmtTime(Q.endAt - Date.now())); t.id = 'timer'; bar.appendChild(t); }
  else bar.appendChild(el('span', 'score-live', `<span class="g">✓ ${Q.right}</span> · <span class="r">✕ ${Q.wrong}</span>`));
  v.appendChild(bar);

  // question card
  const card = el('div', 'card qcard');
  const top = el('div', 'qtop');
  top.innerHTML = `<span class="tag sec" style="background:${secColor(q.sec)}">${q.sec}. ${esc(q.secShort)}</span>
    <span class="tag">Câu ${q.num}</span>` + (q.multi ? `<span class="tag multi">Chọn nhiều đáp án</span>` : '');
  const sb = el('button', 'star-btn' + (store.d.starred[q.id] ? ' on' : ''), ICON.star);
  sb.title = 'Đánh dấu để ôn lại (phím S)';
  sb.onclick = () => { store.star(q.id); sb.classList.toggle('on'); toast(store.d.starred[q.id] ? 'Đã đánh dấu ★' : 'Đã bỏ đánh dấu'); };
  top.appendChild(sb);
  card.appendChild(top);
  card.appendChild(el('div', 'qtext', esc(q.q)));

  const wrap = el('div', 'opts');
  // Display letters always run in the document's own sequence (a, b, c, d, đ, e …)
  // even when the options are shuffled, so the layout matches a real exam paper.
  it.order.forEach((o, idx) => {
    const b = el('button', 'opt');
    b.dataset.k = o.k;
    b.dataset.disp = q.opts[idx].k;
    b.innerHTML = `<span class="key">${esc(q.opts[idx].k)}</span><span class="txt">${esc(o.t)}</span><span class="mark"></span>`;
    b.onclick = () => pickOpt(o.k);
    wrap.appendChild(b);
  });
  card.appendChild(wrap);

  const fbSlot = el('div'); fbSlot.id = 'fbSlot'; card.appendChild(fbSlot);

  const foot = el('div', 'qfoot');
  const main = el('button', 'btn primary', '');
  main.id = 'mainBtn';
  foot.appendChild(main);
  foot.appendChild(el('div', 'spacer'));
  if (!isExam) foot.appendChild(el('div', 'kbd-hint', `<kbd>1</kbd>–<kbd>${it.order.length}</kbd> chọn theo thứ tự hiển thị · <kbd>Enter</kbd> tiếp · <kbd>S</kbd> đánh dấu`));
  else {
    const skip = el('button', 'btn ghost', 'Bỏ qua →');
    skip.onclick = () => advance();
    foot.appendChild(skip);
  }
  card.appendChild(foot);
  v.appendChild(card);

  setTimeout(paint);
  return v;

  function paint() {
    const opts = $$('.opt', wrap);
    opts.forEach(b => {
      const k = b.dataset.k;
      b.className = 'opt';
      if (it.done) {
        b.classList.add('locked');
        if (isExam) { if (it.pick.includes(k)) b.classList.add('sel'); }
        else {
          const isC = q.ans.includes(k), isP = it.pick.includes(k);
          if (isC) { b.classList.add('correct'); b.querySelector('.mark').innerHTML = ICON.check; }
          else if (isP) { b.classList.add('wrong'); b.querySelector('.mark').innerHTML = ICON.x; }
          else b.classList.add('dim');
        }
      } else if (it.pick.includes(k)) b.classList.add('sel');
    });
    const mb = $('#mainBtn');
    const last = Q.i === Q.items.length - 1;
    if (isExam) {
      mb.innerHTML = last ? 'Nộp bài' + ICON.check : 'Tiếp theo' + ICON.arrow;
      mb.disabled = false;
      mb.onclick = () => { it.done = true; advance(); };
    } else if (!it.done) {
      mb.innerHTML = 'Kiểm tra' + ICON.check;
      mb.disabled = it.pick.length === 0;
      mb.onclick = check;
    } else {
      mb.innerHTML = (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow;
      mb.disabled = false;
      mb.onclick = advance;
      mb.focus();
    }
  }

  function pickOpt(k) {
    if (it.done) return;
    if (q.multi) { const i = it.pick.indexOf(k); i < 0 ? it.pick.push(k) : it.pick.splice(i, 1); }
    else it.pick = [k];
    paint();
    if (!q.multi && !isExam) setTimeout(check, 130);
  }

  function check() {
    if (it.done || !it.pick.length) return;
    it.done = true;
    it.ok = setEq(it.pick, q.ans);
    it.ok ? Q.right++ : Q.wrong++;
    store.grade(q.id, it.ok);
    paint();
    const corr = q.ans.map(k => {
      const pos = it.order.findIndex(o => o.k === k);
      const disp = q.opts[pos].k;
      return `<b>${disp.toUpperCase()}</b>. ${esc(q.opts.find(o => o.k === k).t)}` +
        (disp !== k ? ` <em style="opacity:.7;font-style:normal">(tài liệu gốc: ý ${k})</em>` : '');
    }).join('<br>');
    const days = BOX_DAYS[store.st(q.id).box];
    const fb = el('div', 'feedback ' + (it.ok ? 'good' : 'bad'),
      (it.ok ? ICON.check : ICON.x) + `<div>${it.ok ? 'Chính xác!' : 'Chưa đúng'}<span class="sub">${it.ok ? (days ? 'Câu này sẽ quay lại sau ' + days + ' ngày.' : 'Câu này sẽ quay lại ngay trong hôm nay.') : 'Đáp án đúng: ' + corr}</span></div>`);
    $('#fbSlot').innerHTML = ''; $('#fbSlot').appendChild(fb);
    $('.score-live').innerHTML = `<span class="g">✓ ${Q.right}</span> · <span class="r">✕ ${Q.wrong}</span>`;
  }

  function advance() {
    if (Q.i >= Q.items.length - 1) return finishQuiz();
    Q.i++; render();
  }
};

function finishQuiz() {
  const Q = app.quiz;
  if (Q.mode === 'exam') {
    Q.right = 0; Q.wrong = 0;
    Q.items.forEach(it => {
      it.ok = it.pick.length > 0 && setEq(it.pick, it.q.ans);
      it.ok ? Q.right++ : Q.wrong++;
      if (it.pick.length) store.grade(it.q.id, it.ok);
    });
  }
  Q.finished = true; Q.elapsed = Date.now() - Q.started;
  const pct = Math.round(Q.right / Q.items.length * 100);
  store.d.history.unshift({ d: Date.now(), mode: Q.mode, r: Q.right, t: Q.items.length });
  store.d.history = store.d.history.slice(0, 60);
  if (Q.mode === 'exam' && pct > (store.d.best.exam || 0)) store.d.best.exam = pct;
  store.save();
  render();
}

function quizResult() {
  const Q = app.quiz;
  const pct = Math.round(Q.right / Q.items.length * 100);
  const emo = pct >= 90 ? '🏆' : pct >= 75 ? '🎉' : pct >= 50 ? '💪' : '📚';
  const msg = pct >= 90 ? 'Xuất sắc!' : pct >= 75 ? 'Khá tốt!' : pct >= 50 ? 'Cần ôn thêm' : 'Hãy ôn lại kỹ nhé';
  const v = el('div');
  const c = el('div', 'card result', `
    <div class="emoji">${emo}</div>
    <div class="big" style="color:${pct >= 75 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)'}">${pct}%</div>
    <div class="lbl"><b>${msg}</b> — đúng ${Q.right}/${Q.items.length} câu</div>
    <div class="rstats">
      <div class="rstat"><b style="color:var(--ok)">${Q.right}</b><span>Câu đúng</span></div>
      <div class="rstat"><b style="color:var(--bad)">${Q.wrong}</b><span>Câu sai</span></div>
      <div class="rstat"><b>${fmtTime(Q.elapsed)}</b><span>Thời gian</span></div>
    </div>`);
  const cta = el('div', 'hero-cta'); cta.style.justifyContent = 'center'; cta.style.marginTop = '22px';
  const wrongs = Q.items.filter(it => !it.ok);
  if (wrongs.length) {
    const b = el('button', 'btn primary', `${ICON.refresh} Làm lại ${wrongs.length} câu sai`);
    b.onclick = () => {
      app.quiz = {
        mode: 'practice', items: wrongs.map(it => ({ q: it.q, order: shuffle(it.q.opts), pick: [], done: false, ok: null })),
        i: 0, right: 0, wrong: 0, started: Date.now(), endAt: 0
      };
      render();
    };
    cta.appendChild(b);
  }
  const again = el('button', 'btn', `${ICON.play} Lượt mới`);
  again.onclick = () => nav(Q.mode === 'exam' ? 'exam' : 'practice');
  cta.appendChild(again);
  const home = el('button', 'btn ghost', 'Về trang chủ');
  home.onclick = () => { app.quiz = null; nav('home'); };
  cta.appendChild(home);
  c.appendChild(cta);
  v.appendChild(c);

  v.appendChild(el('div', 'sec-title', `<h3>Xem lại bài làm</h3><span class="muted" style="font-size:12.5px">${Q.items.length} câu</span>`));
  const list = el('div', 'review-list');
  Q.items.forEach((it, i) => {
    const q = it.q;
    const r = el('div', 'rev ' + (it.ok ? 'hit' : 'miss'));
    // map an original option key back to the letter it was shown under
    const dk = k => { const p = (it.order || q.opts).findIndex(o => o.k === k); return (p >= 0 ? q.opts[p].k : k).toUpperCase(); };
    const yours = it.pick.length ? it.pick.map(k => `<div class="ans r"><span class="k">${dk(k)}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('') : `<div class="ans r"><span class="k">–</span><span>Chưa trả lời</span></div>`;
    const corr = q.ans.map(k => `<div class="ans g"><span class="k">${dk(k)}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
    r.innerHTML = `<div class="qtop" style="margin-bottom:0">
        <span class="tag sec" style="background:${secColor(q.sec)}">${q.sec}</span>
        <span class="tag">Câu ${i + 1}</span>
        <span class="tag" style="color:${it.ok ? 'var(--ok)' : 'var(--bad)'};font-weight:800">${it.ok ? '✓ Đúng' : '✕ Sai'}</span></div>
      <div class="q">${esc(q.q)}</div>
      ${it.ok ? '' : `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Bạn chọn</div>${yours}`}
      <div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Đáp án đúng</div>${corr}`;
    list.appendChild(r);
  });
  v.appendChild(list);
  return v;
}

/* ---------- ĐỘI TUYỂN (mô phỏng Hội thi tập trung, Điều 12–15 Quy chế) ---------- */
const teamSetup = { hint: false, steal: false };
const TEAM_RULES = {
  noidung: { title: 'Điều 12 Khoản 2 — Nội dung thi Đội tuyển', page: '5',
    text: 'Nhận thức, hiểu biết về kiến thức chuyên ngành; về phong trào thi đua Ngành Hậu cần và thực hiện CVĐ50; truyền thống của ngành Hậu cần – Kỹ thuật Tổng cục.' },
  so_khoidong: { title: 'Điều 13.2.b — Phần thi Khởi động (Vòng sơ khảo)', page: '5–6',
    text: '5 câu hỏi, hình thức đưa ra đáp án đúng trên máy tính (soạn thảo đáp án); tổng thời gian đọc câu hỏi và trả lời mỗi câu: 90 giây. Trả lời đúng: điểm tối đa; không đưa ra câu trả lời hoặc trả lời sai: không được điểm.' },
  so_tangtoc: { title: 'Điều 13.2.b — Phần thi Tăng tốc (Vòng sơ khảo)', page: '6',
    text: '5 câu hỏi trắc nghiệm trên máy tính; tổng thời gian đọc câu hỏi và trả lời mỗi câu: 60 giây. Đội trả lời đúng & nhanh nhất được điểm tối đa; các đội đúng và nhanh tiếp theo nhận mức điểm thấp hơn tương ứng; không trả lời hoặc trả lời sai: không được điểm.' },
  chung_rieng: { title: 'Điều 13.2.b — Gói câu hỏi riêng (Vòng chung khảo)', page: '6',
    text: 'Mỗi đội trả lời 1 gói 5 câu hỏi riêng của BGK. Thời gian chuẩn bị tối đa 20 giây/câu. Đội được quyền trả lời: đúng được điểm câu hỏi; không trả lời hoặc trả lời sai: không được điểm — các đội còn lại được bấm chuông giành quyền trả lời trong 10 giây tiếp theo; giành chuông trả lời đúng: được điểm và đội thi của lượt đó bị trừ ½ số điểm câu hỏi; giành chuông trả lời sai: bị trừ ½ số điểm câu hỏi.' },
  chung_chung: { title: 'Điều 13.2.b — Gói câu hỏi chung (Vòng chung khảo)', page: '6',
    text: '4 đội cùng trả lời lần lượt 5 câu trong gói câu hỏi chung bằng hình thức bấm chuông giành quyền trả lời, trong vòng 20 giây; đội bấm chuông nhanh nhất trả lời đúng: được điểm; trả lời sai: không được điểm và các đội còn lại bấm chuông giành quyền trong 10 giây tiếp theo — giành quyền trả lời đúng: được điểm, đội giành quyền trả lời trước đó bị trừ ½ số điểm câu hỏi; trả lời sai: bị trừ ½ số điểm câu hỏi.' },
  diem: { title: 'Điều 14 Khoản 2.a — Cách chấm, tính điểm', page: '7–8',
    text: 'Vòng sơ khảo: tổng điểm tối đa 10 câu hỏi 100 điểm (mỗi câu 10 điểm) → ký hiệu Điểm ĐT1, là cơ sở để tính thành tích chung của đơn vị và lựa chọn 04 đội vào thi vòng chung khảo. Vòng chung khảo: điểm hiện có của mỗi đội tuyển = Điểm ĐT1; tổng điểm tối đa vòng chung khảo 100 điểm (10 câu hỏi, mỗi câu 10 điểm) → ký hiệu Điểm ĐT2, là cơ sở để tính thành tích, khen thưởng phần thi tập trung của đội tuyển.' },
  diem_ct: { title: 'Điều 14 Khoản 2.a — Công thức tính điểm từng câu', page: '7–8',
    text: 'Vòng sơ khảo — Khởi động (05 câu): mỗi câu trả lời đúng được 10 điểm; không đưa ra câu trả lời hoặc trả lời sai: 0 điểm. Tăng tốc (05 câu): đội trả lời đúng và nhanh nhất được 10 điểm; đội trả lời đúng và nhanh tiếp theo được số điểm = 10 − (n−1) × 1,0 (n là số thứ tự trả lời của đội, xếp theo thời gian đưa ra đáp án, đội có thời gian trả lời ít hơn xếp trên); không đưa ra câu trả lời hoặc trả lời sai: 0 điểm. Vòng chung khảo — Gói câu hỏi riêng và Gói câu hỏi chung (mỗi câu 10 điểm): đội được quyền trả lời đúng: 10 điểm; không đưa ra câu trả lời hoặc trả lời sai: 0 điểm; đội giành quyền trả lời đúng câu đó: được 10 điểm và bị trừ 5,0 điểm đối với đội để mất quyền trả lời (gói riêng) / đội giành quyền trước đó (gói chung); đội giành quyền trả lời sai: bị trừ 5,0 điểm.' },
};
const TEAM_STAGE_LABEL = { khoidong: 'Khởi động', tangtoc: 'Tăng tốc', rieng: 'Gói câu hỏi riêng', chung: 'Gói câu hỏi chung' };

/* ---- Chấm tự luận tự động (word-level sequence alignment, Khởi động) ----
 * Chuẩn hoá: NFC + hạ chữ thường + bỏ dấu câu (\p{P}, thay bằng khoảng trắng
 * để không làm dính hai từ bị dấu câu ngăn cách) + gộp khoảng trắng thừa
 * (không bỏ dấu tiếng Việt, không sửa chính tả, không đoán ý) → tách từ.
 * Kết quả ĐÚNG/SAI = so khớp CHÍNH XÁC toàn bộ mảng từ đã chuẩn hoá với đáp án
 * chuẩn (cùng số từ, cùng thứ tự, cùng từng từ) — thiếu/thừa/sai từ hoặc đảo
 * thứ tự đều tính SAI, không có điểm một phần. Đồng thời vẫn tính thêm dãy con
 * chung dài nhất (LCS) giữa đáp án chuẩn và câu trả lời để hiển thị tỷ lệ
 * khớp (%) và highlight từng từ — đây CHỈ là phản hồi tham khảo giúp người
 * học sửa, không được dùng để thay thế kết quả đúng/sai nhị phân ở trên. */
function normWords(s) {
  const n = String(s || '').normalize('NFC').toLowerCase()
    .replace(/\p{P}/gu, ' ').replace(/\s+/g, ' ').trim();
  return n ? n.split(' ') : [];
}
function lcsAlign(ref, hyp) {
  const n = ref.length, m = hyp.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    dp[i][j] = ref[i - 1] === hyp[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  }
  const mRef = new Array(n).fill(false), mHyp = new Array(m).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (ref[i - 1] === hyp[j - 1]) { mRef[i - 1] = mHyp[j - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return { lcs: dp[n][m], mRef, mHyp };
}
function wordsEqual(a, b) { return a.length === b.length && a.every((w, i) => w === b[i]); }
/** canonicalVariants: mảng các đáp án chuẩn đã xác minh (hiện mỗi câu có đúng 1
 * biến thể từ ngân hàng câu hỏi gốc). Trả về null nếu không có đáp án chuẩn.
 * best.exact = kết quả đúng/sai chính thức (khớp chính xác toàn bộ với MỘT
 * trong các biến thể chuẩn). best.pct = tỷ lệ khớp LCS, chỉ để hiển thị tham
 * khảo. Ưu tiên biến thể khớp chính xác; nếu không có, chọn biến thể có tỷ lệ
 * khớp cao nhất để hiển thị phần khác biệt. */
function gradeRecall(typed, canonicalVariants) {
  const variants = (canonicalVariants || []).filter(s => s && String(s).trim());
  if (!variants.length) return null;
  const hyp = normWords(typed);
  let best = null;
  variants.forEach(ans => {
    const ref = normWords(ans);
    if (!ref.length) return;
    const { lcs, mRef, mHyp } = lcsAlign(ref, hyp);
    const pct = Math.round((lcs / ref.length) * 1000) / 10;
    const exact = wordsEqual(ref, hyp);
    const cand = { pct, exact, refWords: ref, hypWords: hyp, mRef, mHyp, canonical: ans };
    if (!best || (exact && !best.exact) || (exact === best.exact && pct > best.pct)) best = cand;
  });
  if (!best) return null;
  best.points = best.exact ? 10 : 0;
  return best;
}
function wordDiffHtml(words, matched, missClass) {
  if (!words.length) return `<span class="muted" style="font-style:normal">(không có câu trả lời)</span>`;
  return words.map((w, i) => `<span class="w ${matched[i] ? 'ok' : missClass}">${esc(w)}</span>`).join(' ');
}

function pickTeamQuestions(n, exclude, excludeMulti) {
  let pool = basePool([]).filter(q => !exclude.includes(q.id) && (!excludeMulti || !q.multi));
  pool = shuffle(pool).sort((a, b) => (store.d.stats[a.id]?.box || 1) - (store.d.stats[b.id]?.box || 1));
  return pool.slice(0, n);
}
/* Thời gian mỗi câu theo Điều 13.2.b Quy chế Hội thi (trang 5–6 bản quét):
 * Khởi động 90s/câu, Tăng tốc 60s/câu, Gói câu hỏi riêng/chung 20s/câu — tính
 * PER CÂU (không phải cho cả phần thi), nên mỗi câu mới hợp lệ có đồng hồ
 * riêng; đây không phải "reset để gian lận" mà đúng theo quy chế. */
function teamSeconds(kind) { return kind === 'khoidong' ? 90 : kind === 'tangtoc' ? 60 : 20; }
/* Gói riêng/Gói chung: 20s KHÔNG phải "thời hạn nhập xong câu trả lời" — quy
 * chế không nêu thời lượng trình bày câu trả lời, nên ứng dụng không tự đặt
 * giới hạn đó. Gói riêng: 20s là "thời gian chuẩn bị" trước khi trả lời. Gói
 * chung: 20s là cửa sổ "giành quyền trả lời" (bấm chuông) trước khi trả lời. */
const TIME_CITE = {
  khoidong: '90 giây/câu (đọc câu hỏi + trả lời) — Điều 13.2.b, trang 5–6',
  tangtoc: '60 giây/câu (đọc câu hỏi + trả lời) — Điều 13.2.b, trang 6',
  rieng: '20 giây chuẩn bị/câu (trước khi trả lời, không giới hạn thời gian trả lời) — Điều 13.2.b, trang 6',
  chung: '20 giây giành quyền trả lời/câu (bấm chuông, không giới hạn thời gian trả lời sau khi giành quyền) — Điều 13.2.b, trang 6',
};
/** Trạng thái sẵn sàng trả lời ban đầu của 1 câu Gói riêng/Gói chung:
 * - Không bật giờ: bỏ qua pha chuẩn bị/giành quyền, vào thẳng ô trả lời.
 * - Gói riêng (có giờ): bắt đầu ở pha "chuẩn bị" (ready=false).
 * - Gói chung (có giờ): bắt đầu ở pha "giành quyền" (ready=false), phải bấm
 *   chuông mới được trả lời. */
function rcInitReady(kind, timed) {
  if (kind !== 'rieng' && kind !== 'chung') return true;
  return !timed;
}
let teamTimerHandle = null;
function clearTeamTimer() { if (teamTimerHandle) { clearInterval(teamTimerHandle); teamTimerHandle = null; } }
/** elId: id phần tử hiển thị đồng hồ (mặc định 'teamTimer', dùng chung cho cả
 * tab "Đội tuyển" và tab "Ôn 4 đề trọng tâm" vì không bao giờ hiển thị đồng
 * thời). Luôn tính theo mốc thời gian tuyệt đối (Date.now()), không cộng dồn
 * theo số lần tick, nên không bị chậm/lệch khi tab bị trình duyệt tạm ngưng
 * lúc chuyển tab/thu nhỏ cửa sổ — khi quay lại, đồng hồ hiển thị đúng ngay. */
function startTeamTimer(seconds, onZero, elId) {
  clearTeamTimer();
  const id = elId || 'teamTimer';
  const end = Date.now() + seconds * 1000;
  const tick = () => {
    const t = document.getElementById(id);
    if (!t) { clearTeamTimer(); return; }
    const left = end - Date.now();
    t.textContent = fmtTime(Math.max(0, left));
    t.classList.toggle('warn', left < seconds * 1000 / 3);
    if (left <= 0) { clearTeamTimer(); onZero(); }
  };
  setTimeout(tick);
  teamTimerHandle = setInterval(tick, 250);
}

function startTeamRound(round) {
  const hint = !!teamSetup.hint, steal = !!teamSetup.steal;
  const stages = round === 'so' ? ['khoidong', 'tangtoc'] : ['rieng', 'chung'];
  const used = [];
  const stageData = stages.map(kind => {
    const qs = pickTeamQuestions(5, used, kind === 'khoidong');
    qs.forEach(q => used.push(q.id));
    return {
      kind, items: qs.map(q => ({
        q, order: shuffle(q.opts), pick: [], done: false, ok: null, points: 0, typed: '',
        revealed: false, graded: null, ready: rcInitReady(kind, true), missed: false, steal: null, citeArticle: null,
      })),
    };
  });
  app.team = {
    round, hint, steal, stages: stageData, si: 0, qi: 0, total: 0, finished: false,
    baseline: round === 'chung' ? (store.d.lastDT1 ?? 0) : 0,
  };
  app.view = 'team'; render();
}
function teamCurrentItem() { const T = app.team, st = T.stages[T.si]; return { st, it: st.items[T.qi] }; }
function teamAdvance() {
  clearTeamTimer();
  const T = app.team, st = T.stages[T.si];
  if (T.qi < st.items.length - 1) T.qi++;
  else if (T.si < T.stages.length - 1) { T.si++; T.qi = 0; }
  else return teamFinish();
  render();
}
function teamFinish() {
  clearTeamTimer();
  const T = app.team;
  T.total = T.stages.reduce((a, st) => a + st.items.reduce((b, it) => b + it.points, 0), 0);
  T.finished = true;
  store.d.history.unshift({ d: Date.now(), mode: T.round === 'so' ? 'dtso' : 'dtck', r: T.total, t: 100 });
  store.d.history = store.d.history.slice(0, 60);
  if (T.round === 'so') {
    store.d.lastDT1 = T.total;
    if (T.total > (store.d.best.dt1 || 0)) store.d.best.dt1 = T.total;
  } else {
    T.dt2 = Math.min(100, T.baseline + T.total);
    if (T.dt2 > (store.d.best.dt2 || 0)) store.d.best.dt2 = T.dt2;
  }
  store.save();
  render();
}

V.team = () => {
  const T = app.team;
  if (!T) return teamHome();
  if (T.finished) return teamResult();
  const { st, it } = teamCurrentItem();
  const useMC = st.kind === 'tangtoc' || (T.hint && (st.kind === 'rieng' || st.kind === 'chung'));
  return useMC ? teamMCView(st, it) : teamRecallView(st, it);
};

function teamHome() {
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Đội tuyển</h1><p>Mô phỏng "Thi Đội tuyển" trong Hội thi tập trung theo Điều 12–15 Quy chế: Vòng sơ khảo và Vòng chung khảo.</p>`));
  v.appendChild(el('div', 'note', `${ICON.warn}<span>Quy chế mô tả hình thức thi <b>theo đội, nhiều đội thi đồng thời</b> (xếp hạng theo tốc độ, bấm chuông giành quyền trả lời). Khi luyện một mình, ứng dụng chỉ mô phỏng được <b>nội dung câu hỏi, thời gian và kết quả đúng/sai của riêng bạn</b> — không thể tái hiện việc tranh chuông hay trừ điểm giữa nhiều đội. Điểm hiển thị là điểm luyện tập cá nhân để tham khảo, <b>không phải điểm thi chính thức</b>.</span>`));
  v.appendChild(el('div', 'note', `${ICON.warn}<span><b>Khởi động</b> (90s/câu, tính cả thời gian trả lời — Điều 13.2.b) được chấm tự động theo tiêu chí luyện thuộc của ứng dụng: khớp <b>chính xác toàn bộ</b> đáp án chuẩn sau khi chuẩn hoá (không phân biệt hoa/thường, dấu câu, khoảng trắng; giữ nguyên dấu tiếng Việt và thứ tự từ) — thiếu/thừa/sai từ hoặc đảo thứ tự đều tính Sai. Cơ cấu điểm nhị phân (10đ/0đ, không có điểm một phần) đúng theo Điều 14.2.a; cách <b>xác định</b> đúng/sai bằng so khớp chữ là lựa chọn của ứng dụng, không phải cách BGK thực tế chấm (BGK là giám khảo con người, nghe trả lời trực tiếp).</span>`));
  v.appendChild(el('div', 'note', `${ICON.warn}<span><b>Gói câu hỏi riêng/Gói câu hỏi chung</b> (Vòng chung khảo): Điều 13.2.b gọi đây là "trả lời trực tiếp", <b>không</b> mô tả là trắc nghiệm hay trên máy tính — khác Khởi động/Tăng tốc. Mặc định ứng dụng dùng ô nhập tự do để mô phỏng việc này, chấm tự động bằng cùng tiêu chí so khớp chữ ở trên (trừ câu nhiều đáp án đúng — tự chấm thủ công). Gói riêng: 20s là thời gian <b>chuẩn bị trước khi trả lời</b>, không phải hạn nộp. Gói chung: 20s là cửa sổ <b>giành quyền trả lời</b> (bấm chuông), không phải hạn nộp. Quy chế không nêu thời lượng trình bày câu trả lời nên ứng dụng không giới hạn thêm.</span>`));

  const opt = el('div', 'card pad'); opt.style.marginBottom = '16px';
  opt.appendChild(el('h3', '', 'Tuỳ chọn cho Gói câu hỏi riêng/chung'));
  const sw1 = el('label', 'sw', `<input type="checkbox"${teamSetup.hint ? ' checked' : ''}><span class="box"></span>
    <span class="lbl">Ôn có gợi ý (hiện phương án để chọn)<i>Mô phỏng hỗ trợ học — quy chế không mô tả hình thức trắc nghiệm cho 2 phần này; tắt để luyện đúng "trả lời trực tiếp"</i></span>`);
  sw1.querySelector('input').onchange = e => { teamSetup.hint = e.target.checked; };
  opt.appendChild(sw1);
  const sw2 = el('label', 'sw', `<input type="checkbox"${teamSetup.steal ? ' checked' : ''}><span class="box"></span>
    <span class="lbl">Luyện thêm tình huống "Giành quyền trả lời" (10s)<i>Bài tập riêng, tuỳ chọn, xuất hiện sau khi trả lời sai — không cộng vào điểm/thời gian câu chính (Điều 13.2.b)</i></span>`);
  sw2.querySelector('input').onchange = e => { teamSetup.steal = e.target.checked; };
  opt.appendChild(sw2);
  v.appendChild(opt);

  const grid = el('div', 'sec-grid');
  const mkCard = (title, desc, bestVal, bestLbl, cta, onGo) => {
    const c = el('div', 'card pad');
    c.appendChild(el('h3', '', title));
    c.appendChild(el('p', 'muted', desc)).style.cssText = 'margin:6px 0 12px;font-size:13.5px;line-height:1.55';
    c.appendChild(el('p', '', `${bestLbl}: <b>${bestVal ?? '–'}${bestVal != null ? '/100' : ''}</b>`)).style.cssText = 'font-size:13.5px';
    const b = el('button', 'btn primary block', `${ICON.play} ${cta}`); b.style.marginTop = '12px';
    b.onclick = onGo;
    c.appendChild(b);
    return c;
  };
  grid.appendChild(mkCard('Vòng sơ khảo', '10 câu: Khởi động (5 câu, 90 giây/câu, tự luận — chấm tự động Đúng/Sai, khớp chính xác) + Tăng tốc (5 câu, 60 giây/câu, trắc nghiệm). Điều 13.2.b, 14.2.a — trang 5–7.',
    store.d.best.dt1, 'Điểm ĐT1 cao nhất', 'Bắt đầu Vòng sơ khảo', () => startTeamRound('so')));
  grid.appendChild(mkCard('Vòng chung khảo', '10 câu: Gói câu hỏi riêng (5 câu, 20s chuẩn bị/câu) + Gói câu hỏi chung (5 câu, 20s giành quyền/câu) — trả lời trực tiếp, không giới hạn thêm. Điều 13.2.b, 14.2.b — trang 6–8.',
    store.d.best.dt2, 'Điểm ĐT2 cao nhất', 'Bắt đầu Vòng chung khảo', () => startTeamRound('chung')));
  v.appendChild(grid);

  const rc = el('div', 'card pad'); rc.style.marginTop = '16px';
  rc.appendChild(el('h3', '', 'Nội dung & cách chấm theo Quy chế'));
  Object.values(TEAM_RULES).forEach(r => {
    rc.appendChild(el('div', 'rule-row', `<b>${esc(r.title)}</b><p>${esc(r.text)}</p><span class="muted">Trang ${esc(r.page)} tài liệu gốc</span>`));
  });
  const gofull = el('button', 'btn ghost', 'Xem bản quét gốc trong tab “Quy chế”');
  gofull.onclick = () => nav('ref');
  rc.appendChild(gofull);
  v.appendChild(rc);
  return v;
}

function teamBar(T) {
  const totalQ = T.stages.reduce((a, s) => a + s.items.length, 0);
  const doneQ = T.stages.slice(0, T.si).reduce((a, s) => a + s.items.length, 0) + T.qi;
  const bar = el('div', 'quiz-bar');
  const back = el('button', 'btn ghost', `${ICON.back} Thoát`);
  back.onclick = () => { if (confirm('Thoát và huỷ lượt mô phỏng này?')) { clearTeamTimer(); app.team = null; nav('team'); } };
  bar.appendChild(back);
  bar.appendChild(el('div', 'progress', `<i style="width:${doneQ / totalQ * 100}%"></i>`));
  bar.appendChild(el('span', 'counter', `Câu ${doneQ + 1}/${totalQ}`));
  const t = el('span', 'timer', ''); t.id = 'teamTimer'; t.title = TIME_CITE[T.stages[T.si].kind] || ''; bar.appendChild(t);
  return bar;
}

function teamRecallView(st, it) {
  const T = app.team, q = it.q, kind = st.kind, seconds = teamSeconds(kind);
  const isKhoidong = kind === 'khoidong';
  const autoGradeable = isKhoidong || !q.multi;
  const cite = isKhoidong ? 'Điều 14.2.a' : 'Điều 14.2.b';
  const v = el('div');
  v.appendChild(teamBar(T));

  const card = el('div', 'card qcard');
  const tagExtra = autoGradeable ? `<span class="tag ok">Chấm tự động</span>` : `<span class="tag multi">Nhiều đáp án — tự chấm</span>`;
  card.appendChild(el('div', 'qtop', `<span class="tag sec" style="background:${secColor(q.sec)}">${q.sec}. ${esc(q.secShort)}</span><span class="tag">${esc(TEAM_STAGE_LABEL[kind])}</span>` + tagExtra));
  card.appendChild(el('div', 'qtext', esc(q.q)));
  if (!isKhoidong) card.appendChild(rcFormatNote());

  if (!it.ready) {
    rcPhaseUI(card, kind, seconds,
      () => { it.ready = true; render(); },
      () => { it.ready = true; it.missed = true; it.revealed = true; it.done = true; it.ok = false; it.points = 0; store.grade(q.id, false); render(); });
  } else if (!it.revealed) {
    const ta = el('textarea', 'recall-in');
    ta.placeholder = autoGradeable
      ? 'Gõ câu trả lời đầy đủ của bạn — hệ thống sẽ tự so khớp từng từ với đáp án chuẩn…'
      : 'Soạn câu trả lời của bạn (câu nhiều đáp án — tự đối chiếu, không chấm tự động)…';
    ta.value = it.typed;
    ta.oninput = () => { it.typed = ta.value; };
    card.appendChild(ta);
    const foot = el('div', 'qfoot');
    const submit = el('button', 'btn primary', `Nộp & xem đáp án ${ICON.arrow}`);
    submit.onclick = once(() => { autoGradeable ? gradeAndReveal(it, q, cite) : (it.revealed = true, render()); });
    foot.appendChild(submit);
    card.appendChild(foot);
  } else if (autoGradeable) {
    card.appendChild(it.missed ? rcMissedBox() : teamAutoGradeBox(it));
    if (!isKhoidong && T.steal && rcStealEligible(kind, it)) renderStealPractice(card, it, q);
    const foot = el('div', 'qfoot');
    const retry = el('button', 'btn', `${ICON.refresh} Thử lại câu này`);
    retry.onclick = () => { it.typed = ''; it.revealed = false; it.missed = false; render(); };
    foot.appendChild(retry);
    const last = T.si === T.stages.length - 1 && T.qi === st.items.length - 1;
    const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
    next.onclick = once(() => {
      it.done = true;
      store.grade(q.id, !!(it.graded && it.graded.exact));
      teamAdvance();
    });
    foot.appendChild(next);
    card.appendChild(foot);
  } else {
    const ans = q.ans.map(k => `<div class="val"><span class="k">${k.toUpperCase()}</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
    const yours = it.typed.trim()
      ? `<div class="lead" style="margin-top:14px;color:var(--ink2)">Câu trả lời của bạn</div><div class="your">${esc(it.typed)}</div>` : '';
    const box = el('div', 'recall-ans', `<div class="lead">Đáp án đúng (tài liệu gốc)</div>${ans}${yours}`);
    card.appendChild(box);
    if (!it.done) {
      const self = el('div', 'self-grade');
      self.appendChild(el('p', 'muted', 'Câu nhiều đáp án đúng — tự đối chiếu và đánh giá (không chấm tự động được); đây không phải điểm thi chính thức.'));
      const row = el('div', 'rate');
      const ok = el('button', 'btn primary', `${ICON.check} Tôi trả lời đúng (+10đ)`);
      ok.onclick = once(() => { it.done = true; it.ok = true; it.points = 10; store.grade(q.id, true); render(); });
      const bad = el('button', 'btn danger', `${ICON.x} Sai / không kịp (0đ)`);
      bad.onclick = once(() => { it.done = true; it.ok = false; it.points = 0; store.grade(q.id, false); render(); });
      row.appendChild(ok); row.appendChild(bad);
      self.appendChild(row);
      card.appendChild(self);
    } else {
      card.appendChild(el('p', '', `<b style="color:${it.ok ? 'var(--ok)' : 'var(--bad)'}">${it.ok ? '✓ Bạn tự đánh giá: Đúng (+10đ)' : '✕ Bạn tự đánh giá: Sai (0đ)'}</b>`));
      if (!isKhoidong && T.steal && rcStealEligible(kind, it)) renderStealPractice(card, it, q);
      const foot = el('div', 'qfoot');
      const last = T.si === T.stages.length - 1 && T.qi === st.items.length - 1;
      const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
      next.onclick = once(teamAdvance);
      foot.appendChild(next);
      card.appendChild(foot);
    }
  }
  v.appendChild(card);
  return v;
}

function gradeAndReveal(it, q, citeArticle) {
  if (it.revealed) return; // chặn chấm/khoá 2 lần nếu nộp tay và hết giờ trùng thời điểm
  clearTeamTimer();
  const canonical = q.opts.find(o => o.k === q.ans[0]);
  const g = gradeRecall(it.typed, canonical ? [canonical.t] : []);
  if (g && (!it.graded || (g.exact && !it.graded.exact) || (g.exact === it.graded.exact && g.pct > it.graded.pct))) {
    it.graded = g; it.points = g.points; it.ok = g.exact;
  }
  it.citeArticle = citeArticle || it.citeArticle;
  it.revealed = true;
  render();
}

function teamAutoGradeBox(it) {
  const box = el('div', 'grade-box');
  if (!it.graded) {
    box.innerHTML = `<div class="note">${ICON.warn}<span>Câu này chưa có đáp án chuẩn đã xác minh để chấm tự động.</span></div>`;
    return box;
  }
  const g = it.graded;
  const cite = it.citeArticle || 'Điều 14.2.a';
  box.innerHTML = `
    <div class="gscore">
      <div class="gpts" style="color:${g.exact ? 'var(--ok)' : 'var(--bad)'}"><b>${g.exact ? ICON.check + ' Đúng' : ICON.x + ' Sai'}</b><span>+${g.points}đ / 10đ (thang điểm nhị phân ${esc(cite)})</span></div>
      <div class="gpct"><b>${g.pct}%</b><span>Tỷ lệ khớp từ (chỉ tham khảo)</span></div>
    </div>
    <p class="muted" style="font-size:12px;margin-top:8px">Đây là <b>tiêu chí luyện thuộc lòng của riêng ứng dụng</b> — chỉ tính <b>Đúng</b> khi câu trả lời khớp <b>chính xác toàn bộ</b> với đáp án chuẩn sau khi chuẩn hoá (không phân biệt hoa/thường, dấu câu, khoảng trắng thừa; giữ nguyên dấu tiếng Việt và thứ tự từ) — thiếu/thừa/sai từ hoặc đảo thứ tự đều tính Sai. Tỷ lệ khớp % bên trên chỉ là phản hồi tham khảo để sửa bài, <b>không</b> dùng để tính điểm. Cơ cấu điểm nhị phân (không có điểm một phần) là đúng theo ${esc(cite)}; cách <b>xác định</b> "đúng/sai" này là lựa chọn mô phỏng của ứng dụng để luyện ghi nhớ câu chữ — BGK thực tế là giám khảo con người.</p>
    <div class="wordrow"><div class="wlabel">Đáp án chuẩn</div><div class="words">${wordDiffHtml(g.refWords, g.mRef, 'miss')}</div></div>
    <div class="wordrow"><div class="wlabel">Câu trả lời của bạn</div><div class="words">${wordDiffHtml(g.hypWords, g.mHyp, 'bad')}</div></div>
    <div class="glegend"><span class="w ok">khớp</span><span class="w miss">thiếu (có ở đáp án, bạn chưa có)</span><span class="w bad">sai / thừa (bạn viết nhưng không khớp)</span></div>`;
  return box;
}

/* ---------- Gói câu hỏi riêng / Gói câu hỏi chung — "trả lời trực tiếp" ----------
 * Điều 13.2.b KHÔNG mô tả 2 phần này là trắc nghiệm/trên máy tính (khác hẳn
 * Khởi động, Tăng tốc) — dùng cụm "đưa ra câu trả lời" / "bấm chuông giành
 * quyền trả lời". Mặc định ứng dụng dùng ô nhập tự do để mô phỏng "trả lời
 * trực tiếp"; có thể bật "Ôn có gợi ý" để hiện lại các phương án in trong bộ
 * đề dưới dạng trắc nghiệm — đây LÀ LỰA CHỌN MÔ PHỎNG hỗ trợ học, quy chế
 * không mô tả hình thức chọn đáp án cho 2 phần này nên không được gọi là
 * "đúng quy chế". */
function rcFormatNote() {
  return el('div', 'note', `${ICON.warn}<span>Điều 13.2.b gọi đây là <b>"trả lời trực tiếp"</b> (kèm bấm chuông giành quyền) — không mô tả hình thức chọn đáp án như Khởi động/Tăng tốc. Ô nhập bên dưới là cách <b>ứng dụng mô phỏng</b> để luyện nhớ câu trả lời; BGK thực tế nghe đội trả lời trực tiếp, không chấm bằng so khớp chữ.</span>`);
}
/** Vẽ pha "chuẩn bị" (Gói riêng) hoặc "giành quyền trả lời" (Gói chung) trước
 * khi được nhập câu trả lời. onReady(): chuyển sang ô trả lời. onMiss(): chỉ
 * dùng cho Gói chung khi hết 20s mà không bấm chuông — quy chế không nêu
 * bước giành lại quyền cho trường hợp không ai bấm chuông, nên coi là bỏ lỡ. */
function rcPhaseUI(card, kind, seconds, onReady, onMiss) {
  const box = el('div', 'prep-box');
  if (kind === 'rieng') {
    box.innerHTML = `<div class="lead">${ICON.warn.replace('warn','')}Đang trong thời gian chuẩn bị…</div><p class="muted" style="font-size:13px;margin:6px 0 12px">Tối đa ${seconds}s (Điều 13.2.b, trang 6). Quy chế không nêu thời lượng trình bày câu trả lời sau đó, nên ứng dụng không giới hạn thêm — hết giờ chuẩn bị sẽ tự mở ô trả lời, hoặc bấm nút dưới để trả lời sớm hơn.</p>`;
    const go = el('button', 'btn primary', `${ICON.arrow} Trả lời ngay`);
    go.onclick = once(() => { clearTeamTimer(); onReady(); });
    box.appendChild(go);
    card.appendChild(box);
    startTeamTimer(seconds, once(() => onReady()));
  } else {
    box.innerHTML = `<div class="lead">Giành quyền trả lời</div><p class="muted" style="font-size:13px;margin:6px 0 12px">Trong ${seconds}s (Điều 13.2.b, trang 6): bấm chuông để giành quyền trả lời, rồi trả lời không giới hạn thêm giờ. Hết ${seconds}s mà chưa bấm: coi như không giành được quyền ở câu này.</p>`;
    const buzz = el('button', 'btn primary big', `🔔 Bấm chuông`);
    buzz.onclick = once(() => { clearTeamTimer(); onReady(); });
    box.appendChild(buzz);
    card.appendChild(box);
    startTeamTimer(seconds, once(() => onMiss()));
  }
}
/** Luyện thêm (tuỳ chọn, tách biệt): mô phỏng đội khác giành quyền trả lời
 * trong 10s sau khi đội chính trả lời sai/không có câu trả lời (Điều 13.2.b).
 * KHÔNG cộng vào điểm/thời gian của câu chính, không tự động nối tiếp — chỉ
 * bắt đầu khi người dùng chủ động bấm, và được ghi nhận/hiển thị riêng. */
function renderStealPractice(card, it, q) {
  if (it.steal && it.steal.revealed) {
    const g = it.steal.graded;
    const box = el('div', 'grade-box'); box.style.marginTop = '14px';
    box.innerHTML = `<div class="lead" style="margin-bottom:8px">Kết quả tình huống luyện thêm "Giành quyền trả lời" (không tính vào điểm câu chính)</div>` +
      (g ? `<div class="gscore"><div class="gpts" style="color:${g.exact ? 'var(--ok)' : 'var(--bad)'}"><b>${g.exact ? ICON.check + ' Đúng' : ICON.x + ' Sai'}</b></div></div>
        <div class="wordrow"><div class="wlabel">Đáp án chuẩn</div><div class="words">${wordDiffHtml(g.refWords, g.mRef, 'miss')}</div></div>
        <div class="wordrow"><div class="wlabel">Câu trả lời của bạn</div><div class="words">${wordDiffHtml(g.hypWords, g.mHyp, 'bad')}</div></div>`
        : `<p class="muted">Câu nhiều đáp án — không tự chấm được, tự đối chiếu với đáp án đúng ở trên.</p>`);
    card.appendChild(box);
    return;
  }
  const wrap = el('div', 'steal-wrap'); wrap.style.marginTop = '14px';
  if (!it.steal) {
    wrap.appendChild(el('div', 'note', `${ICON.warn}<span><b>Luyện thêm (tuỳ chọn, tách riêng):</b> mô phỏng tình huống một đội khác bấm chuông giành quyền trả lời trong 10 giây sau khi đội của bạn trả lời sai/không có câu trả lời (Điều 13.2.b, trang 6). Bài tập bổ sung này <b>không</b> cộng vào điểm hay thời gian của câu vừa rồi.</span>`));
    const go = el('button', 'btn', `🔔 Thử tình huống này (10s)`);
    go.onclick = once(() => { it.steal = { typed: '', revealed: false, graded: null }; render(); });
    wrap.appendChild(go);
  } else {
    const ta = el('textarea', 'recall-in');
    ta.placeholder = 'Mô phỏng đội khác giành quyền — gõ câu trả lời…';
    ta.value = it.steal.typed;
    ta.oninput = () => { it.steal.typed = ta.value; };
    wrap.appendChild(ta);
    const submit = el('button', 'btn primary', 'Nộp tình huống này');
    submit.onclick = once(() => {
      clearTeamTimer();
      const canonical = q.opts.find(o => o.k === q.ans[0]);
      const g = !q.multi ? gradeRecall(it.steal.typed, canonical ? [canonical.t] : []) : null;
      it.steal.graded = g; it.steal.revealed = true;
      render();
    });
    wrap.appendChild(submit);
    startTeamTimer(10, once(() => { clearTeamTimer(); it.steal.revealed = true; render(); }));
  }
  card.appendChild(wrap);
}
function rcStealEligible(kind, it) {
  if (kind === 'rieng') return it.ok === false;
  return it.ready && !it.missed && it.ok === false; // chung: chỉ khi đã bấm chuông & trả lời sai
}
function rcMissedBox() {
  const box = el('div', 'grade-box');
  box.innerHTML = `<div class="gscore"><div class="gpts" style="color:var(--bad)"><b>${ICON.x} Không giành được quyền trả lời</b><span>+0đ</span></div></div>
    <p class="muted" style="font-size:12px;margin-top:8px">Hết thời gian giành quyền trả lời (bấm chuông) mà chưa bấm — không có câu trả lời cho câu này.</p>`;
  return box;
}

function teamMCView(st, it) {
  const T = app.team, q = it.q, seconds = teamSeconds(st.kind);
  const v = el('div');
  v.appendChild(teamBar(T));

  const isHint = st.kind !== 'tangtoc';
  const card = el('div', 'card qcard');
  const top = el('div', 'qtop');
  top.innerHTML = `<span class="tag sec" style="background:${secColor(q.sec)}">${q.sec}. ${esc(q.secShort)}</span><span class="tag">${esc(TEAM_STAGE_LABEL[st.kind])}</span>` + (isHint ? `<span class="tag" style="background:var(--warn)">Ôn có gợi ý</span>` : '') + (q.multi ? `<span class="tag multi">Chọn nhiều đáp án</span>` : '');
  card.appendChild(top);
  card.appendChild(el('div', 'qtext', esc(q.q)));
  if (isHint) card.appendChild(el('div', 'note', `${ICON.warn}<span><b>Ôn có gợi ý:</b> Điều 13.2.b không mô tả Gói câu hỏi riêng/chung là trắc nghiệm — đây là lựa chọn <b>mô phỏng hỗ trợ học</b> (hiện lại các phương án in trong bộ đề để nhận diện thay vì nhớ lại), không phải hình thức thi thật. Tắt "Ôn có gợi ý" ở màn hình thiết lập để luyện đúng hình thức trả lời trực tiếp.</span>`));

  const wrap = el('div', 'opts');
  it.order.forEach((o, idx) => {
    const b = el('button', 'opt');
    b.dataset.k = o.k;
    b.innerHTML = `<span class="key">${esc(q.opts[idx].k)}</span><span class="txt">${esc(o.t)}</span><span class="mark"></span>`;
    b.onclick = () => pick(o.k);
    wrap.appendChild(b);
  });
  card.appendChild(wrap);
  const fbSlot = el('div'); fbSlot.id = 'fbSlot'; card.appendChild(fbSlot);
  const footSlot = el('div'); footSlot.id = 'mcFoot'; card.appendChild(footSlot);
  v.appendChild(card);
  setTimeout(paint);
  if (!it.done) startTeamTimer(seconds, () => { if (!it.done) finish(); }); else clearTeamTimer();
  return v;

  function paint() {
    $$('.opt', wrap).forEach(b => {
      const k = b.dataset.k; b.className = 'opt';
      if (it.done) {
        b.classList.add('locked');
        const isC = q.ans.includes(k), isP = it.pick.includes(k);
        if (isC) { b.classList.add('correct'); b.querySelector('.mark').innerHTML = ICON.check; }
        else if (isP) { b.classList.add('wrong'); b.querySelector('.mark').innerHTML = ICON.x; }
        else b.classList.add('dim');
      } else if (it.pick.includes(k)) b.classList.add('sel');
    });
    const slot = $('#mcFoot'); slot.innerHTML = '';
    if (!it.done && q.multi) {
      const foot = el('div', 'qfoot');
      const chk = el('button', 'btn primary', `Kiểm tra ${ICON.check}`);
      chk.disabled = it.pick.length === 0;
      chk.onclick = () => finish();
      foot.appendChild(chk);
      slot.appendChild(foot);
    }
  }
  function pick(k) {
    if (it.done) return;
    if (q.multi) { const i = it.pick.indexOf(k); i < 0 ? it.pick.push(k) : it.pick.splice(i, 1); paint(); }
    else { it.pick = [k]; paint(); setTimeout(finish, 130); }
  }
  function finish() {
    if (it.done) return;
    clearTeamTimer();
    it.done = true;
    it.ok = it.pick.length > 0 && setEq(it.pick, q.ans);
    it.points = it.ok ? 10 : 0;
    store.grade(q.id, !!it.ok);
    paint();
    const corr = q.ans.map(k => `<b>${k.toUpperCase()}</b>. ${esc(q.opts.find(o => o.k === k).t)}`).join('<br>');
    const okMsg = isHint ? 'Chính xác (chế độ Ôn có gợi ý — luyện tập)' : 'Chính xác (+10đ nếu bạn là đội nhanh & đúng nhất)';
    const fb = el('div', 'feedback ' + (it.ok ? 'good' : 'bad'),
      (it.ok ? ICON.check : ICON.x) + `<div>${it.ok ? okMsg : 'Chưa đúng — 0đ'}<span class="sub">Đáp án đúng: ${corr}</span></div>`);
    $('#fbSlot').innerHTML = ''; $('#fbSlot').appendChild(fb);
    const foot = el('div', 'qfoot');
    const last = T.si === T.stages.length - 1 && T.qi === st.items.length - 1;
    const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
    next.onclick = once(teamAdvance);
    foot.appendChild(next);
    const slot = $('#mcFoot'); slot.innerHTML = ''; slot.appendChild(foot);
    next.focus();
  }
}

function teamResult() {
  const T = app.team;
  const label = T.round === 'so' ? 'Vòng sơ khảo' : 'Vòng chung khảo';
  const pct = T.total;
  const emo = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚';
  const v = el('div');
  const c = el('div', 'card result', `
    <div class="emoji">${emo}</div>
    <div class="big">${pct}<span style="font-size:22px;font-weight:700;opacity:.5">/100</span></div>
    <div class="lbl"><b>${esc(label)}</b> — ${T.round === 'so' ? 'Điểm ĐT1' : 'Điểm phần Chung khảo'}: ${pct}/100</div>
    ${T.round === 'chung' ? `<p class="muted" style="margin-top:8px;font-size:13px">Mốc xuất phát (Điểm ĐT1 gần nhất): ${T.baseline} + điểm Chung khảo ${pct} → <b>Điểm ĐT2 ước tính: ${T.dt2}/100</b> (ước tính cá nhân, không mô phỏng việc bị trừ điểm khi đội khác giành chuông).</p>` : ''}`);

  const rstats = el('div', 'rstats');
  T.stages.forEach(st => {
    const pts = st.items.reduce((a, it) => a + it.points, 0);
    rstats.appendChild(el('div', 'rstat', `<b>${pts}/50</b><span>${esc(TEAM_STAGE_LABEL[st.kind])}</span>`));
  });
  c.appendChild(rstats);

  const cta = el('div', 'hero-cta'); cta.style.cssText = 'justify-content:center;margin-top:20px';
  const again = el('button', 'btn primary', `${ICON.refresh} Làm lại ${label}`);
  again.onclick = () => startTeamRound(T.round);
  cta.appendChild(again);
  const other = el('button', 'btn', T.round === 'so' ? 'Sang Vòng chung khảo' : 'Về Vòng sơ khảo');
  other.onclick = () => startTeamRound(T.round === 'so' ? 'chung' : 'so');
  cta.appendChild(other);
  const home = el('button', 'btn ghost', 'Về trang chủ');
  home.onclick = () => { app.team = null; nav('home'); };
  cta.appendChild(home);
  c.appendChild(cta);
  v.appendChild(c);

  v.appendChild(el('div', 'sec-title', `<h3>Xem lại</h3>`));
  const list = el('div', 'review-list');
  T.stages.forEach(st => st.items.forEach(it => {
    const q = it.q;
    const wasMC = st.kind === 'tangtoc' || (T.hint && (st.kind === 'rieng' || st.kind === 'chung'));
    const r = el('div', 'rev ' + (it.ok ? 'hit' : 'miss'));
    const corr = q.ans.map(k => `<div class="ans g"><span class="k">${k.toUpperCase()}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
    const scoreTag = it.missed ? 'Không giành được quyền'
      : (st.kind === 'khoidong' && it.graded) ? `${it.graded.pct}% · +${it.points}đ`
      : (it.ok ? `✓ +${it.points}đ` : '✕ 0đ');
    const dk = k => { const p = (it.order || q.opts).findIndex(o => o.k === k); return (p >= 0 ? q.opts[p].k : k).toUpperCase(); };
    const yourPick = (wasMC && it.pick && it.pick.length) ? `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;margin-top:8px">Bạn chọn</div>${it.pick.map(k => `<div class="ans r"><span class="k">${dk(k)}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('')}` : '';
    const yourTyped = (!wasMC && it.typed.trim()) ? `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;margin-top:8px">Bạn trả lời</div><div class="your">${esc(it.typed)}</div>` : '';
    const stealInfo = (!wasMC && it.steal && it.steal.revealed)
      ? `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;margin-top:10px">Tình huống luyện thêm "Giành quyền trả lời" (không tính điểm câu này)</div><div class="muted">${it.steal.graded ? (it.steal.graded.exact ? '✓ Đúng' : '✕ Sai') + ' — ' : ''}bạn gõ: ${esc(it.steal.typed || '(trống)')}</div>` : '';
    r.innerHTML = `<div class="qtop" style="margin-bottom:0">
        <span class="tag">${esc(TEAM_STAGE_LABEL[st.kind])}</span>
        <span class="tag" style="color:${it.ok ? 'var(--ok)' : 'var(--bad)'};font-weight:800">${scoreTag}</span></div>
      <div class="q">${esc(q.q)}</div>
      ${yourPick}${yourTyped}
      <div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Đáp án đúng</div>${corr}${stealInfo}`;
    list.appendChild(r);
  }));
  v.appendChild(list);
  return v;
}

/* ---------- FLASHCARD ---------- */
const flash = { list: null, i: 0, shown: false, secs: [] };

V.flash = () => {
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Thẻ ghi nhớ</h1><p>Đọc câu hỏi, tự nhớ đáp án rồi lật thẻ. Tự đánh giá để hệ thống xếp lịch ôn lại.</p>`));

  if (!flash.list) {
    const card = el('div', 'card pad');
    const f = el('div', 'field', `<label>Chọn ngành</label>`);
    const chips = el('div', 'chips');
    const mk = (id, label, n) => {
      const c = el('button', 'chip', `${esc(label)}<small>${n}</small>`); c.dataset.id = id;
      c.onclick = () => {
        if (id === '*') flash.secs = []; else { const i = flash.secs.indexOf(id); i < 0 ? flash.secs.push(id) : flash.secs.splice(i, 1); }
        $$('.chip', chips).forEach(x => x.classList.toggle('on', x.dataset.id === '*' ? flash.secs.length === 0 : flash.secs.includes(x.dataset.id)));
      };
      return c;
    };
    chips.appendChild(mk('*', 'Tất cả', DATA.questions.length));
    DATA.sections.forEach(s => chips.appendChild(mk(s.id, `${s.id}. ${s.short}`, s.count)));
    f.appendChild(chips); card.appendChild(f);
    const go = el('button', 'btn primary big block', `${ICON.play} Bắt đầu lật thẻ`);
    go.onclick = () => {
      const pool = basePool(flash.secs);
      if (!pool.length) return toast('Không có câu hỏi.');
      flash.list = shuffle(pool).sort((a, b) => (store.d.stats[a.id]?.box || 1) - (store.d.stats[b.id]?.box || 1));
      flash.i = 0; flash.shown = false; render();
    };
    card.appendChild(go);
    v.appendChild(card);
    setTimeout(() => $$('.chip', chips).forEach(x => x.classList.toggle('on', x.dataset.id === '*' ? flash.secs.length === 0 : flash.secs.includes(x.dataset.id))));
    return v;
  }

  const q = flash.list[flash.i];
  const bar = el('div', 'quiz-bar');
  const back = el('button', 'btn ghost', `${ICON.back} Đổi ngành`);
  back.onclick = () => { flash.list = null; render(); };
  bar.appendChild(back);
  bar.appendChild(el('div', 'progress', `<i style="width:${flash.i / flash.list.length * 100}%"></i>`));
  bar.appendChild(el('span', 'counter', `${flash.i + 1}/${flash.list.length}`));
  v.appendChild(bar);

  const card = el('div', 'card flash');
  const st = store.d.stats[q.id];
  card.innerHTML = `<div class="qtop" style="justify-content:center;margin-bottom:16px">
      <span class="tag sec" style="background:${secColor(q.sec)}">${q.sec}. ${esc(q.secShort)}</span>
      <span class="tag">Câu ${q.num}</span>
      <span class="tag">Hộp ${st ? st.box : 1}/5</span></div>
    <div class="fq">${esc(q.q)}</div>` +
    (flash.shown
      ? `<div class="fa"><div class="lead">Đáp án đúng</div>${q.ans.map(k => `<div class="val"><span class="k">${k.toUpperCase()}</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('')}</div>`
      : `<div class="hint">Chạm vào thẻ hoặc nhấn <kbd>Space</kbd> để xem đáp án</div>`);
  if (!flash.shown) card.onclick = () => { flash.shown = true; render(); };
  v.appendChild(card);

  if (flash.shown) {
    const r = el('div', 'rate');
    [['Chưa thuộc', false, 'danger'], ['Đã nhớ', true, ''], ['Bỏ qua', null, 'ghost']].forEach(([lbl, ok, cls]) => {
      const b = el('button', 'btn ' + (ok === true ? 'primary' : cls), esc(lbl));
      b.onclick = () => { if (ok !== null) store.grade(q.id, ok); nextFlash(); };
      r.appendChild(b);
    });
    v.appendChild(r);
  }
  return v;
};
function nextFlash() {
  if (flash.i >= flash.list.length - 1) { toast('Đã hết bộ thẻ! Bắt đầu lại từ đầu.'); flash.i = 0; flash.list = shuffle(flash.list); }
  else flash.i++;
  flash.shown = false; render();
}

/* ---------- BROWSE ---------- */
const browse = { q: '', sec: '', showAns: true, star: false };

V.browse = () => {
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Tra cứu</h1><p>Toàn bộ ${DATA.questions.length} câu hỏi kèm đáp án. Tìm theo từ khoá, số văn bản hoặc lọc theo ngành.</p>`));

  const sb = el('div', 'searchbar');
  const inp = el('div', 'inp', `${ICON.search.replace('<svg', '<svg class="ic"')}<input type="search" placeholder="Tìm câu hỏi, số thông tư, nghị định…" value="${esc(browse.q)}">`);
  const input = inp.querySelector('input');
  input.oninput = () => { browse.q = input.value; paint(); };
  sb.appendChild(inp);
  const tgl = el('button', 'btn', browse.showAns ? '👁 Ẩn đáp án' : '👁 Hiện đáp án');
  tgl.onclick = () => { browse.showAns = !browse.showAns; tgl.textContent = browse.showAns ? '👁 Ẩn đáp án' : '👁 Hiện đáp án'; paint(); };
  sb.appendChild(tgl);
  v.appendChild(sb);

  const chips = el('div', 'chips'); chips.style.marginBottom = '14px';
  const mk = (id, lbl) => { const c = el('button', 'chip', lbl); c.dataset.id = id; c.onclick = () => { browse.sec = id === browse.sec ? '' : id; browse.star = false; syncC(); paint(); }; return c; };
  chips.appendChild(mk('', 'Tất cả'));
  DATA.sections.forEach(s => chips.appendChild(mk(s.id, `${s.id}. ${s.short}`)));
  const sc = el('button', 'chip', '★ Đã đánh dấu');
  sc.onclick = () => { browse.star = !browse.star; if (browse.star) browse.sec = ''; syncC(); paint(); };
  chips.appendChild(sc);
  function syncC() { $$('.chip', chips).forEach(c => { if (c === sc) c.classList.toggle('on', browse.star); else c.classList.toggle('on', c.dataset.id === browse.sec && !browse.star); }); }
  syncC();
  v.appendChild(chips);

  const cnt = el('p', 'muted'); cnt.style.cssText = 'font-size:12.5px;margin-bottom:10px'; v.appendChild(cnt);
  const list = el('div', 'blist'); v.appendChild(list);

  function paint() {
    const term = noAcc(browse.q.trim());
    const res = DATA.questions.filter(q =>
      (browse.star ? store.d.starred[q.id] : true) &&
      (!browse.sec || q.sec === browse.sec) &&
      (!term || q.search.includes(term)));
    cnt.textContent = `${res.length} câu hỏi`;
    list.innerHTML = '';
    if (!res.length) { list.appendChild(el('div', 'empty', `<div class="ic">🔍</div><p>Không tìm thấy câu hỏi nào phù hợp.</p>`)); return; }
    res.slice(0, 400).forEach(q => list.appendChild(bqCard(q)));
    if (res.length > 400) list.appendChild(el('p', 'muted center', `… và ${res.length - 400} câu nữa. Hãy thu hẹp từ khoá.`));
  }
  function bqCard(q) {
    const d = el('details', 'bq');
    if (browse.showAns) d.open = false;
    const sum = el('summary', '', `<span class="no" style="background:${secColor(q.sec)}">${q.sec}·${q.num}</span><span>${esc(q.q)}</span>`);
    const sbn = el('button', 'star-btn' + (store.d.starred[q.id] ? ' on' : ''), ICON.star);
    sbn.onclick = e => { e.preventDefault(); e.stopPropagation(); store.star(q.id); sbn.classList.toggle('on'); };
    sum.appendChild(sbn);
    d.appendChild(sum);
    const body = el('div', 'body');
    q.opts.forEach(o => {
      const isC = browse.showAns && q.ans.includes(o.k);
      body.appendChild(el('div', 'o' + (isC ? ' c' : ''), `<span class="k">${o.k}.</span><span>${esc(o.t)}${isC ? ' ✓' : ''}</span>`));
    });
    if (q.unmarked) body.appendChild(el('div', 'note', `${ICON.warn}<span>Tài liệu gốc không gạch chân/ghi rõ đáp án cho câu này, nên câu này được loại khỏi các lượt luyện tập.</span>`));
    body.appendChild(el('div', 'src', `<span>${esc(q.secTitle)}</span><span>·</span><span>${q.srcLabel ? esc(q.srcLabel) : 'Trang ' + q.page + ' tài liệu gốc'}</span>${q.multi ? '<span>·</span><span>Nhiều đáp án</span>' : ''}`));
    d.appendChild(body);
    return d;
  }
  paint();
  return v;
};

/* ---------- STATS ---------- */
V.stats = () => {
  const qs = DATA.questions;
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Tiến độ</h1><p>Hệ thống dùng phương pháp lặp lại ngắt quãng (Leitner 5 hộp): trả lời đúng thì câu hỏi lùi xa hơn, sai thì quay lại ngay.</p>`));

  const seen = qs.filter(q => store.d.stats[q.id]).length;
  const tot = Object.values(store.d.stats).reduce((a, s) => a + s.seen, 0);
  const right = Object.values(store.d.stats).reduce((a, s) => a + s.right, 0);
  const acc = tot ? Math.round(right / tot * 100) : 0;
  const due = qs.filter(q => answerable(q) && store.d.stats[q.id] && store.isDue(q.id)).length;

  v.appendChild(el('div', 'stat-grid', `
    <div class="kpi"><b>${seen}/${qs.length}</b><span>Câu đã học</span></div>
    <div class="kpi ok"><b>${acc}%</b><span>Tỉ lệ trả lời đúng</span></div>
    <div class="kpi"><b>${tot}</b><span>Lượt trả lời</span></div>
    <div class="kpi due"><b>${due}</b><span>Đến hạn ôn</span></div>
    <div class="kpi"><b>${store.d.streak.days} 🔥</b><span>Ngày liên tiếp</span></div>
    <div class="kpi"><b>${store.d.best.dt1 ?? '–'}${store.d.best.dt1 != null ? '/100' : ''}</b><span>Điểm ĐT1 cao nhất (Sơ khảo)</span></div>
    <div class="kpi"><b>${store.d.best.dt2 ?? '–'}${store.d.best.dt2 != null ? '/100' : ''}</b><span>Điểm ĐT2 cao nhất (Chung khảo)</span></div>
    <div class="kpi"><b>${store.d.best.exam || 0}%</b><span>Điểm luyện tốc độ cao nhất</span></div>`));

  // Leitner boxes
  const boxes = [0, 0, 0, 0, 0];
  qs.forEach(q => { boxes[(store.d.stats[q.id]?.box || 1) - 1]++; });
  const bc = el('div', 'card pad'); bc.style.marginTop = '16px';
  bc.appendChild(el('h3', '', 'Phân bố 5 hộp ghi nhớ'));
  bc.appendChild(el('p', 'muted', 'Hộp càng cao, câu hỏi càng lâu mới quay lại. Hộp 5 = đã thuộc.')).style.cssText = 'font-size:13px;margin-top:4px';
  const bx = el('div', 'boxes');
  const lbl = ['Mới / sai', 'Sau 1 ngày', 'Sau 3 ngày', 'Sau 7 ngày', 'Sau 21 ngày'];
  const col = ['var(--bad)', 'var(--warn)', 'var(--ink2)', 'var(--brand)', 'var(--ok)'];
  boxes.forEach((n, i) => bx.appendChild(el('div', 'boxc', `<b style="color:${col[i]}">${n}</b><span>Hộp ${i + 1}<br>${lbl[i]}</span>`)));
  bc.appendChild(bx);
  v.appendChild(bc);

  // per section
  const mc = el('div', 'card pad'); mc.style.marginTop = '16px';
  mc.appendChild(el('h3', '', 'Mức thông thạo theo ngành'));
  DATA.sections.forEach(s => {
    const list = QBY[s.id];
    const m = Math.round(list.reduce((a, q) => a + store.mastery(q.id), 0) / list.length * 100);
    mc.appendChild(el('div', 'mastery-row', `
      <span class="rom" style="background:${s.color};display:inline-grid;place-content:center;min-width:30px;height:23px;padding:0 7px;border-radius:7px;font-size:11px;font-weight:800;color:#fff">${s.id}</span>
      <div class="nm"><b>${esc(s.short)}</b><div class="bar"><i style="width:${m}%;background:${s.color}"></i></div></div>
      <span class="pct">${m}%</span>`));
  });
  v.appendChild(mc);

  // history
  if (store.d.history.length) {
    const hc = el('div', 'card pad'); hc.style.marginTop = '16px';
    hc.appendChild(el('h3', '', 'Lượt gần đây'));
    store.d.history.slice(0, 12).forEach(h => {
      const p = Math.round(h.r / h.t * 100);
      const hlbl = { exam: 'Luyện tốc độ', dtso: 'ĐT · Sơ khảo', dtck: 'ĐT · Chung khảo' }[h.mode] || 'Luyện tập';
      hc.appendChild(el('div', 'mastery-row', `
        <span class="tag">${hlbl}</span>
        <div class="nm"><b>${h.r}/${h.t} câu đúng</b><div class="bar"><i style="width:${p}%;background:${p >= 75 ? 'var(--ok)' : p >= 50 ? 'var(--warn)' : 'var(--bad)'}"></i></div></div>
        <span class="pct" style="width:auto;color:var(--ink3);font-weight:600;font-size:12px">${new Date(h.d).toLocaleDateString('vi-VN')}</span>
        <span class="pct">${p}%</span>`));
    });
    v.appendChild(hc);
  }

  const rc = el('div', 'card pad'); rc.style.marginTop = '16px';
  rc.appendChild(el('h3', '', 'Dữ liệu học tập'));
  rc.appendChild(el('p', 'muted', 'Tiến độ được lưu ngay trên trình duyệt của bạn (localStorage), không gửi đi đâu cả.')).style.cssText = 'font-size:13px;margin:4px 0 14px';
  const rb = el('button', 'btn danger', 'Xoá toàn bộ tiến độ');
  rb.onclick = () => { if (confirm('Xoá toàn bộ tiến độ học tập? Không thể hoàn tác.')) { localStorage.removeItem(LS); location.reload(); } };
  rc.appendChild(rb);
  v.appendChild(rc);
  return v;
};

/* ---------- REFERENCE ---------- */
V.ref = () => {
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Quy chế</h1><p>Bản quét gốc các tài liệu quy chế/thang điểm dùng làm căn cứ xây dựng ứng dụng. Trích dẫn số điều, số trang trong phần "Đội tuyển" đều dựa trên các trang này.</p>`));

  v.appendChild(el('div', 'note', `${ICON.warn}<span>Bản quét "Thể lệ Thi Đội tuyển" dưới đây chỉ có <b>5 trang, đánh số gốc 4–8</b> (trích từ Quy chế Hội thi HC-KT 2026). Các phần khác của quy chế (Mục I chấm đơn vị đầy đủ, Thi Chủ nhiệm HC-KT, điều kiện dự thi, xếp loại chung toàn đoàn…) <b>chưa có trong tài liệu được cung cấp</b> nên không được đưa vào ứng dụng — nếu có đủ văn bản, hãy bổ sung để cập nhật.</span>`));

  v.appendChild(el('div', 'sec-title', `<h3>Thể lệ Thi Đội tuyển (trích Điều 12–15)</h3><span class="muted" style="font-size:12.5px">5 trang — dùng cho tab “Đội tuyển”</span>`));
  const g1 = el('div', 'ref-grid');
  for (let i = 1; i <= 5; i++) {
    const p = el('div', 'ref-page');
    const img = el('img'); img.loading = 'lazy'; img.decoding = 'async';
    img.src = `ref/dt-${pad2(i)}.jpg`; img.alt = `Thể lệ Đội tuyển — trang ${i}`;
    p.appendChild(img);
    p.appendChild(el('div', 'cap', `Trang gốc ${i + 3} (trích ${i}/5)`));
    g1.appendChild(p);
  }
  v.appendChild(g1);

  v.appendChild(el('div', 'sec-title', `<h3>Phụ lục: Thang điểm chấm "Đơn vị chính quy ngành HC-KT"</h3><span class="muted" style="font-size:12.5px">23 trang — chấm đơn vị (Mục I), không áp dụng trực tiếp cho phần thi Đội tuyển</span>`));
  const g2 = el('div', 'ref-grid');
  for (let i = 1; i <= 23; i++) {
    const p = el('div', 'ref-page');
    const img = el('img'); img.loading = 'lazy'; img.decoding = 'async';
    img.src = `ref/tcd-${pad2(i)}.jpg`; img.alt = `Thang điểm chấm thi — trang ${i}`;
    p.appendChild(img);
    p.appendChild(el('div', 'cap', `Trang ${i} / 23`));
    g2.appendChild(p);
  }
  v.appendChild(g2);
  return v;
};

/* ---------- ÔN 4 ĐỀ TRỌNG TÂM (giữ nguyên 4 Bộ đề mô phỏng Đội tuyển, CamScanner 5-11-26) ----------
 * Khác với tab "Đội tuyển" (mô phỏng đúng thời gian/cách tính điểm Điều 12–15):
 * khu vực này KHÔNG có đồng hồ đếm ngược ép buộc, KHÔNG dùng để tính Điểm ĐT1/ĐT2 — chỉ để ôn
 * luyện thuộc lòng đúng 80 câu gốc của 4 bộ đề, giữ nguyên mọi câu kể cả câu trùng lặp. */
const D4_STAGE_LABEL = { khoidong: 'Khởi động', tangtoc: 'Tăng tốc', rieng: 'Gói câu hỏi riêng', chung: 'Gói câu hỏi chung' };
/* Vòng theo Quy chế (Điều 13.2.a): Vòng sơ khảo = Khởi động + Tăng tốc; Vòng chung khảo = Gói riêng + Gói chung.
 * Cùng cách chia này đã dùng trong tab "Đội tuyển" (xem startTeamRound: stages = round==='so' ? [...] : [...]). */
const D4_ROUND_STAGES = { so: ['khoidong', 'tangtoc'], chung: ['rieng', 'chung'], all: ['khoidong', 'tangtoc', 'rieng', 'chung'] };
const D4_ROUND_LABEL = { so: 'Vòng sơ khảo', chung: 'Vòng chung khảo', all: 'Toàn bộ' };
const d4Setup = { scope: '1', round: 'all', mode: 'goc', timed: false, hint: false, steal: false };

function d4Pool(scope, round) {
  if (!DETHI4) return [];
  const stages = D4_ROUND_STAGES[round] || D4_ROUND_STAGES.all;
  const base = scope === 'all' ? DETHI4.flat : (DETHI4.bySet[scope] || []);
  return base.filter(q => stages.includes(q.stage));
}
function d4IsWeak(id) {
  const s = store.d.stats[id];
  return !!s && (s.wrong > 0 || s.box <= 2);
}
function d4CountFor(scope, round, mode) {
  let pool = d4Pool(scope, round);
  if (mode === 'sai') pool = pool.filter(q => d4IsWeak(q.id));
  return pool.length;
}

V.dethi4 = () => {
  if (!DETHI4) {
    const v = el('div');
    v.appendChild(el('div', 'page-head', `<h1>Ôn 4 đề trọng tâm</h1>`));
    v.appendChild(el('div', 'note', `${ICON.warn}<span>Không tải được dữ liệu 4 bộ đề (data/dethi4.json). Vui lòng tải lại trang.</span>`));
    return v;
  }
  if (!app.d4) return d4Home();
  if (app.d4.finished) return d4Result();
  return d4QuizView();
};

function d4Home() {
  const v = el('div');
  v.appendChild(el('div', 'page-head', `<h1>Ôn 4 đề trọng tâm</h1><p>Ôn đúng nguyên văn <b>80 câu</b> trong <b>4 "Bộ đề"</b> mô phỏng thi Đội tuyển (CamScanner 5-11-26) — giữ nguyên thứ tự gốc, giữ cả câu trùng giữa các đề/ngân hàng cũ. Không trộn câu ngoài 4 đề vào đây.</p>`));
  v.appendChild(el('div', 'note', `${ICON.warn}<span>Khu vực luyện tập riêng, <b>không tính vào Điểm ĐT1/ĐT2</b>. Đồng hồ đếm ngược ở đây là <b>tuỳ chọn</b> (tắt để ôn chậm không giới hạn giờ). Muốn mô phỏng đúng cấu trúc/thời gian/cách tính điểm chính thức bắt buộc theo quy chế, dùng tab "Đội tuyển".</span>`));

  const card = el('div', 'card pad');

  const f0 = el('div', 'field', `<label>Chọn vòng</label>`);
  const rchips = el('div', 'chips');
  const rounds = [['so', 'Sơ khảo'], ['chung', 'Chung khảo'], ['all', 'Toàn bộ']];
  rounds.forEach(([id, lbl]) => {
    const c = el('button', 'chip', `${esc(lbl)}<small>${d4Pool(d4Setup.scope, id).length}</small>`);
    c.dataset.id = id;
    c.onclick = () => { d4Setup.round = id; syncD4(); };
    rchips.appendChild(c);
  });
  f0.appendChild(rchips);
  f0.appendChild(el('p', 'muted', 'Sơ khảo = Khởi động + Tăng tốc · Chung khảo = Gói câu hỏi riêng + Gói câu hỏi chung (đúng cách chia vòng của Quy chế, Điều 13.2.a). Có thể vào luyện Chung khảo trực tiếp, không cần làm Sơ khảo trước.')).style.cssText = 'font-size:12.5px;margin-top:8px';
  card.appendChild(f0);

  const f1 = el('div', 'field', `<label>Chọn đề</label>`);
  const chips = el('div', 'chips');
  const scopes = [['1', 'Đề 1'], ['2', 'Đề 2'], ['3', 'Đề 3'], ['4', 'Đề 4'], ['all', 'Cả 4 đề']];
  scopes.forEach(([id, lbl]) => {
    const c = el('button', 'chip', `${esc(lbl)}<small></small>`);
    c.dataset.id = id;
    c.onclick = () => { d4Setup.scope = id; syncD4(); };
    chips.appendChild(c);
  });
  f1.appendChild(chips); card.appendChild(f1);

  const f2 = el('div', 'field', `<label>Chế độ ôn</label>`);
  const sw = el('div', 'switches');
  const modes = [
    ['goc', 'Theo thứ tự gốc', 'Đúng thứ tự gốc trong phạm vi vòng/đề đã chọn'],
    ['dao', 'Đảo thứ tự câu', 'Xáo trộn thứ tự câu — chọn "Cả 4 đề" để trộn luân phiên cả 4 đề, vẫn giữ các lượt xuất hiện của câu trùng'],
    ['sai', 'Chỉ câu sai / chưa thuộc', 'Lọc theo tiến độ ghi nhớ (hộp Leitner) của riêng 80 câu này'],
  ];
  modes.forEach(([id, lbl, sub]) => {
    const w = el('label', 'sw', `
      <input type="radio" name="d4mode" value="${id}"${d4Setup.mode === id ? ' checked' : ''}><span class="box"></span>
      <span class="lbl">${esc(lbl)}<i>${esc(sub)}</i></span>
      <span class="tag" style="margin-left:auto"></span>`);
    w.querySelector('input').onchange = () => { d4Setup.mode = id; syncD4(); };
    sw.appendChild(w);
  });
  f2.appendChild(sw); card.appendChild(f2);

  const f3 = el('div', 'field', `<label>Thời gian</label>`);
  const w3 = el('label', 'sw', `<input type="checkbox"${d4Setup.timed ? ' checked' : ''}><span class="box"></span>
    <span class="lbl">Bật đồng hồ đếm ngược theo đúng Quy chế<i>Khởi động 90s/câu · Tăng tốc 60s/câu · Gói riêng 20s chuẩn bị/câu · Gói chung 20s giành quyền/câu (Điều 13.2.b) — tắt để ôn chậm, không giới hạn giờ</i></span>`);
  w3.querySelector('input').onchange = e => { d4Setup.timed = e.target.checked; };
  f3.appendChild(w3); card.appendChild(f3);

  const f4 = el('div', 'field', `<label>Gói câu hỏi riêng / chung</label>`);
  const w4 = el('label', 'sw', `<input type="checkbox"${d4Setup.hint ? ' checked' : ''}><span class="box"></span>
    <span class="lbl">Ôn có gợi ý (hiện phương án để chọn)<i>Mô phỏng hỗ trợ học — Điều 13.2.b gọi đây là "trả lời trực tiếp", không mô tả trắc nghiệm; mặc định tắt, dùng ô nhập tự do</i></span>`);
  w4.querySelector('input').onchange = e => { d4Setup.hint = e.target.checked; };
  f4.appendChild(w4);
  const w5 = el('label', 'sw', `<input type="checkbox"${d4Setup.steal ? ' checked' : ''}><span class="box"></span>
    <span class="lbl">Luyện thêm tình huống "Giành quyền trả lời" (10s)<i>Bài tập riêng, tuỳ chọn, sau khi trả lời sai — không cộng vào điểm/thời gian câu chính (Điều 13.2.b)</i></span>`);
  w5.querySelector('input').onchange = e => { d4Setup.steal = e.target.checked; };
  f4.appendChild(w5);
  card.appendChild(f4);

  const avail = el('p', 'muted', ''); avail.style.cssText = 'font-size:12.5px;margin-top:4px'; card.appendChild(avail);

  const go = el('button', 'btn primary big block', `${ICON.play} Bắt đầu`);
  go.onclick = () => d4Start(d4Setup.scope, d4Setup.round, d4Setup.mode, d4Setup.timed, d4Setup.hint, d4Setup.steal);
  card.appendChild(go);
  v.appendChild(card);

  function syncD4() {
    $$('.chip', rchips).forEach(c => {
      c.classList.toggle('on', c.dataset.id === d4Setup.round);
      c.querySelector('small').textContent = d4Pool(d4Setup.scope, c.dataset.id).length;
    });
    $$('.chip', chips).forEach(c => {
      c.classList.toggle('on', c.dataset.id === d4Setup.scope);
      c.querySelector('small').textContent = d4Pool(c.dataset.id, d4Setup.round).length;
    });
    $$('.sw', sw).forEach((w, i) => {
      const id = modes[i][0];
      w.querySelector('input').checked = id === d4Setup.mode;
      w.querySelector('.tag').textContent = d4CountFor(d4Setup.scope, d4Setup.round, id);
    });
    const n = d4CountFor(d4Setup.scope, d4Setup.round, d4Setup.mode);
    avail.textContent = `Có ${n} câu phù hợp lựa chọn hiện tại (${D4_ROUND_LABEL[d4Setup.round]}).`;
    go.disabled = n === 0;
  }
  syncD4();
  return v;
}

function d4Start(scope, round, mode, timed, hint, steal) {
  let pool = d4Pool(scope, round);
  if (mode === 'sai') pool = pool.filter(q => d4IsWeak(q.id));
  if (!pool.length) { toast('Không có câu nào phù hợp lựa chọn.'); return; }
  let items = pool.slice();
  if (mode === 'dao') items = shuffle(items);
  app.d4 = {
    scope, round, mode, timed: !!timed, hint: !!hint, steal: !!steal,
    items: items.map(q => ({
      q, order: (q.stage === 'tangtoc' || (hint && (q.stage === 'rieng' || q.stage === 'chung'))) ? shuffle(q.opts) : q.opts,
      pick: [], typed: '', done: false, ok: null, revealed: false, graded: null,
      ready: rcInitReady(q.stage, !!timed), missed: false, steal: null, citeArticle: null,
    })),
    i: 0, right: 0, wrong: 0, started: Date.now(),
  };
  app.view = 'dethi4'; render();
}

function d4Tag(q) {
  return `Đề ${q.setNo} · ${D4_STAGE_LABEL[q.stage]} · Câu ${q.num} gốc`;
}
function d4Advance() {
  clearTeamTimer();
  const T = app.d4;
  if (T.i < T.items.length - 1) { T.i++; render(); }
  else d4Finish();
}
function d4Finish() {
  clearTeamTimer();
  const T = app.d4;
  T.right = T.items.filter(it => it.ok === true).length;
  T.wrong = T.items.filter(it => it.ok === false).length;
  T.finished = true;
  T.elapsed = Date.now() - T.started;
  render();
}

function d4QuizView() {
  const T = app.d4, it = T.items[T.i], q = it.q;
  const v = el('div');

  const bar = el('div', 'quiz-bar');
  const back = el('button', 'btn ghost', `${ICON.back} Thoát`);
  back.onclick = () => { clearTeamTimer(); if (T.i === 0 || confirm('Thoát và huỷ lượt ôn này?')) { app.d4 = null; nav('dethi4'); } };
  bar.appendChild(back);
  bar.appendChild(el('div', 'progress', `<i style="width:${T.i / T.items.length * 100}%"></i>`));
  bar.appendChild(el('span', 'counter', `${T.i + 1}/${T.items.length}`));
  if (T.timed) { const t = el('span', 'timer', ''); t.id = 'teamTimer'; t.title = TIME_CITE[q.stage] || ''; bar.appendChild(t); }
  bar.appendChild(el('span', 'score-live', `<span class="g">✓ ${T.items.filter(x => x.ok === true).length}</span> · <span class="r">✕ ${T.items.filter(x => x.ok === false).length}</span>`));
  v.appendChild(bar);

  const isRC = q.stage === 'rieng' || q.stage === 'chung';
  const useMC = q.stage === 'tangtoc' || (isRC && T.hint);
  const autoGradeable = q.stage === 'khoidong' || !useMC && (!q.multi);
  const extraTag = isRC
    ? (T.hint ? `<span class="tag" style="background:var(--warn)">Ôn có gợi ý</span>` : (autoGradeable ? `<span class="tag ok">Chấm tự động</span>` : `<span class="tag multi">Nhiều đáp án — tự chấm</span>`))
    : (q.multi ? `<span class="tag multi">Chọn nhiều đáp án</span>` : '');
  const card = el('div', 'card qcard');
  card.appendChild(el('div', 'qtop', `<span class="tag">${esc(d4Tag(q))}</span>` + extraTag + (q.uncertain ? `<span class="tag" style="background:var(--warn)">Cần xác minh</span>` : '')));
  card.appendChild(el('div', 'qtext', esc(q.q)));
  if (q.uncertain) card.appendChild(el('div', 'note', `${ICON.warn}<span>${esc(q.note || 'Bản quét không rõ đáp án cho câu này, cần xác minh thủ công.')}</span>`));
  if (isRC && T.hint) card.appendChild(el('div', 'note', `${ICON.warn}<span><b>Ôn có gợi ý:</b> Điều 13.2.b không mô tả Gói câu hỏi riêng/chung là trắc nghiệm — đây là lựa chọn <b>mô phỏng hỗ trợ học</b>, không phải hình thức thi thật. Tắt ở màn hình thiết lập để luyện đúng "trả lời trực tiếp".</span>`));
  else if (isRC) card.appendChild(rcFormatNote());

  if (useMC) d4RenderMC(card, T, it, q); else d4RenderRecall(card, T, it, q);
  v.appendChild(card);
  return v;
}

function d4RenderRecall(card, T, it, q) {
  const isKhoidong = q.stage === 'khoidong';
  const kind = q.stage;
  const autoGradeable = isKhoidong || !q.multi;
  const cite = isKhoidong ? 'Điều 14.2.a' : 'Điều 14.2.b';
  const doGrade = once(() => {
    if (it.revealed) return;
    clearTeamTimer();
    const canonical = q.opts.find(o => o.k === q.ans[0]);
    const g = gradeRecall(it.typed, canonical ? [canonical.t] : []);
    if (g) { it.graded = g; it.ok = g.exact; it.citeArticle = cite; store.grade(q.id, g.exact); }
    it.revealed = true; render();
  });

  if (!isKhoidong && !it.ready) {
    rcPhaseUI(card, kind, teamSeconds(kind),
      () => { it.ready = true; render(); },
      () => { it.ready = true; it.missed = true; it.revealed = true; it.done = true; it.ok = false; store.grade(q.id, false); render(); });
    return;
  }
  if (!it.revealed) {
    const ta = el('textarea', 'recall-in');
    ta.placeholder = autoGradeable
      ? 'Gõ câu trả lời đầy đủ của bạn — hệ thống so khớp chính xác toàn bộ với đáp án chuẩn…'
      : 'Soạn câu trả lời của bạn (câu nhiều đáp án — tự đối chiếu, không chấm tự động)…';
    ta.value = it.typed;
    ta.oninput = () => { it.typed = ta.value; };
    card.appendChild(ta);
    const foot = el('div', 'qfoot');
    const submit = el('button', 'btn primary', `Kiểm tra ${ICON.check}`);
    submit.onclick = once(() => { autoGradeable ? doGrade() : (it.revealed = true, render()); });
    foot.appendChild(submit);
    card.appendChild(foot);
    if (isKhoidong && T.timed) startTeamTimer(teamSeconds(kind), doGrade); else clearTeamTimer();
  } else if (autoGradeable) {
    card.appendChild(it.missed ? rcMissedBox() : teamAutoGradeBox(it));
    if (!isKhoidong && T.steal && rcStealEligible(kind, it)) renderStealPractice(card, it, q);
    const foot = el('div', 'qfoot');
    const retry = el('button', 'btn', `${ICON.refresh} Thử lại câu này`);
    retry.onclick = () => { it.typed = ''; it.revealed = false; it.missed = false; render(); };
    foot.appendChild(retry);
    const last = T.i === T.items.length - 1;
    const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
    next.onclick = once(() => { it.done = true; d4Advance(); });
    foot.appendChild(next);
    card.appendChild(foot);
  } else {
    const ans = q.ans.map(k => `<div class="val"><span class="k">${k.toUpperCase()}</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
    const yours = it.typed.trim()
      ? `<div class="lead" style="margin-top:14px;color:var(--ink2)">Câu trả lời của bạn</div><div class="your">${esc(it.typed)}</div>` : '';
    card.appendChild(el('div', 'recall-ans', `<div class="lead">Đáp án đúng (tài liệu gốc)</div>${ans}${yours}`));
    if (!it.done) {
      const self = el('div', 'self-grade');
      self.appendChild(el('p', 'muted', 'Câu nhiều đáp án đúng — tự đối chiếu và đánh giá (không chấm tự động được).'));
      const row = el('div', 'rate');
      const ok = el('button', 'btn primary', `${ICON.check} Tôi trả lời đúng`);
      ok.onclick = once(() => { it.done = true; it.ok = true; store.grade(q.id, true); render(); });
      const bad = el('button', 'btn danger', `${ICON.x} Sai / không kịp`);
      bad.onclick = once(() => { it.done = true; it.ok = false; store.grade(q.id, false); render(); });
      row.appendChild(ok); row.appendChild(bad);
      self.appendChild(row);
      card.appendChild(self);
    } else {
      card.appendChild(el('p', '', `<b style="color:${it.ok ? 'var(--ok)' : 'var(--bad)'}">${it.ok ? '✓ Bạn tự đánh giá: Đúng' : '✕ Bạn tự đánh giá: Sai'}</b>`));
      if (T.steal && rcStealEligible(kind, it)) renderStealPractice(card, it, q);
      const foot = el('div', 'qfoot');
      const last = T.i === T.items.length - 1;
      const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
      next.onclick = once(d4Advance);
      foot.appendChild(next);
      card.appendChild(foot);
    }
  }
}

function d4RenderMC(card, T, it, q) {
  const wrap = el('div', 'opts');
  it.order.forEach((o, idx) => {
    const b = el('button', 'opt');
    b.dataset.k = o.k;
    b.innerHTML = `<span class="key">${esc(q.opts[idx].k)}</span><span class="txt">${esc(o.t)}</span><span class="mark"></span>`;
    b.onclick = () => pick(o.k);
    wrap.appendChild(b);
  });
  card.appendChild(wrap);
  const fbSlot = el('div'); fbSlot.id = 'fbSlot'; card.appendChild(fbSlot);
  const footSlot = el('div'); footSlot.id = 'mcFoot'; card.appendChild(footSlot);
  setTimeout(paint);
  if (T.timed) { if (!it.done) startTeamTimer(teamSeconds(q.stage), () => { if (!it.done) finish(); }); else clearTeamTimer(); }

  function paint() {
    $$('.opt', wrap).forEach(b => {
      const k = b.dataset.k; b.className = 'opt';
      if (it.done) {
        b.classList.add('locked');
        const isC = q.ans.includes(k), isP = it.pick.includes(k);
        if (isC) { b.classList.add('correct'); b.querySelector('.mark').innerHTML = ICON.check; }
        else if (isP) { b.classList.add('wrong'); b.querySelector('.mark').innerHTML = ICON.x; }
        else b.classList.add('dim');
      } else if (it.pick.includes(k)) b.classList.add('sel');
    });
    const slot = $('#mcFoot'); if (slot) slot.innerHTML = '';
    if (!it.done && q.multi) {
      const foot = el('div', 'qfoot');
      const chk = el('button', 'btn primary', `Kiểm tra ${ICON.check}`);
      chk.disabled = it.pick.length === 0;
      chk.onclick = () => finish();
      foot.appendChild(chk);
      slot && slot.appendChild(foot);
    }
  }
  function pick(k) {
    if (it.done) return;
    if (q.multi) { const i = it.pick.indexOf(k); i < 0 ? it.pick.push(k) : it.pick.splice(i, 1); paint(); }
    else { it.pick = [k]; paint(); setTimeout(finish, 130); }
  }
  function finish() {
    if (it.done) return;
    clearTeamTimer();
    it.done = true;
    it.ok = it.pick.length > 0 && setEq(it.pick, q.ans);
    store.grade(q.id, !!it.ok);
    paint();
    const corr = q.ans.map(k => `<b>${k.toUpperCase()}</b>. ${esc(q.opts.find(o => o.k === k).t)}`).join('<br>');
    const fb = el('div', 'feedback ' + (it.ok ? 'good' : 'bad'), (it.ok ? ICON.check : ICON.x) + `<div>${it.ok ? 'Chính xác!' : 'Chưa đúng'}<span class="sub">Đáp án đúng: ${corr}</span></div>`);
    const fbSlotEl = $('#fbSlot'); if (fbSlotEl) { fbSlotEl.innerHTML = ''; fbSlotEl.appendChild(fb); }
    const foot = el('div', 'qfoot');
    const last = T.i === T.items.length - 1;
    const next = el('button', 'btn primary', (last ? 'Xem kết quả' : 'Câu tiếp theo') + ICON.arrow);
    next.onclick = once(d4Advance);
    foot.appendChild(next);
    const slot = $('#mcFoot'); if (slot) { slot.innerHTML = ''; slot.appendChild(foot); }
    next.focus();
  }
}

function d4Result() {
  const T = app.d4;
  const total = T.items.length;
  const pct = total ? Math.round(T.right / total * 100) : 0;
  const emo = pct >= 90 ? '🏆' : pct >= 75 ? '🎉' : pct >= 50 ? '💪' : '📚';
  const v = el('div');
  const c = el('div', 'card result', `
    <div class="emoji">${emo}</div>
    <div class="big" style="color:${pct >= 75 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)'}">${pct}%</div>
    <div class="lbl"><b>Ôn 4 đề trọng tâm — ${esc(D4_ROUND_LABEL[T.round] || 'Toàn bộ')}</b> — đúng ${T.right}/${total} câu <span class="muted" style="font-weight:400">(điểm luyện tập, không phải Điểm ĐT1/ĐT2)</span></div>
    <div class="rstats">
      <div class="rstat"><b style="color:var(--ok)">${T.right}</b><span>Câu đúng</span></div>
      <div class="rstat"><b style="color:var(--bad)">${T.wrong}</b><span>Câu sai</span></div>
      <div class="rstat"><b>${fmtTime(T.elapsed)}</b><span>Thời gian</span></div>
    </div>`);
  const cta = el('div', 'hero-cta'); cta.style.justifyContent = 'center'; cta.style.marginTop = '22px';
  const again = el('button', 'btn primary', `${ICON.refresh} Ôn lượt khác`);
  again.onclick = () => { app.d4 = null; nav('dethi4'); };
  cta.appendChild(again);
  const home = el('button', 'btn ghost', 'Về trang chủ');
  home.onclick = () => { app.d4 = null; nav('home'); };
  cta.appendChild(home);
  c.appendChild(cta);
  v.appendChild(c);

  v.appendChild(el('div', 'sec-title', `<h3>Xem lại bài làm</h3><span class="muted" style="font-size:12.5px">${total} câu — mỗi câu ghi rõ thuộc đề nào, phần nào, số câu gốc</span>`));
  const list = el('div', 'review-list');
  T.items.forEach(it => {
    const q = it.q;
    const isRC = q.stage === 'rieng' || q.stage === 'chung';
    const wasMC = q.stage === 'tangtoc' || (isRC && T.hint);
    const r = el('div', 'rev ' + (it.ok ? 'hit' : 'miss'));
    let body = `<div class="qtop" style="margin-bottom:0">
        <span class="tag">${esc(d4Tag(q))}</span>
        <span class="tag" style="color:${it.ok ? 'var(--ok)' : 'var(--bad)'};font-weight:800">${it.missed ? '✕ Không giành được quyền' : (it.ok ? '✓ Đúng' : '✕ Sai')}</span></div>
      <div class="q">${esc(q.q)}</div>`;
    if (!wasMC) {
      if (it.graded) {
        body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Đáp án chuẩn</div><div class="words">${wordDiffHtml(it.graded.refWords, it.graded.mRef, 'miss')}</div>`;
        body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Câu trả lời của bạn</div><div class="words">${wordDiffHtml(it.graded.hypWords, it.graded.mHyp, 'bad')}</div>`;
      } else if (it.missed) {
        body += `<div class="muted" style="margin-top:8px">(Không bấm chuông kịp trong thời gian giành quyền trả lời)</div>`;
      } else if (q.multi) {
        const corr = q.ans.map(k => `<div class="ans g"><span class="k">${k.toUpperCase()}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
        body += `<div class="muted" style="margin-top:8px">(Câu nhiều đáp án — tự chấm) Câu trả lời của bạn: ${it.typed.trim() ? esc(it.typed) : '(chưa trả lời)'}</div>`;
        body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Đáp án đúng</div>${corr}`;
      } else {
        body += `<div class="muted" style="margin-top:8px">(Chưa trả lời)</div>`;
      }
      if (it.steal && it.steal.revealed) {
        body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:10px">Tình huống luyện thêm "Giành quyền trả lời" (không tính vào kết quả câu này)</div>`;
        body += it.steal.graded
          ? `<div class="muted">${it.steal.graded.exact ? '✓ Đúng' : '✕ Sai'} — bạn gõ: ${esc(it.steal.typed || '(trống)')}</div>`
          : `<div class="muted">Bạn gõ: ${esc(it.steal.typed || '(trống)')} (câu nhiều đáp án — tự đối chiếu)</div>`;
      }
    } else {
      const dk = k => { const p = (it.order || q.opts).findIndex(o => o.k === k); return (p >= 0 ? q.opts[p].k : k).toUpperCase(); };
      const yours = it.pick.length ? it.pick.map(k => `<div class="ans r"><span class="k">${dk(k)}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('') : `<div class="ans r"><span class="k">–</span><span>Chưa trả lời</span></div>`;
      const corr = q.ans.map(k => `<div class="ans g"><span class="k">${dk(k)}.</span><span>${esc(q.opts.find(o => o.k === k).t)}</span></div>`).join('');
      if (!it.ok) body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Bạn chọn</div>${yours}`;
      body += `<div style="font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:8px">Đáp án đúng</div>${corr}`;
    }
    r.innerHTML = body;
    list.appendChild(r);
  });
  v.appendChild(list);
  return v;
}

/* ---------------- router / render ---------------- */
function nav(v) {
  app.view = v;
  if (v !== 'quiz') app.quiz = null;
  if (v === 'team' && app.team?.finished) app.team = null;
  if (v !== 'team') { clearTeamTimer(); app.team = null; }
  if (v === 'dethi4' && app.d4?.finished) app.d4 = null;
  if (v !== 'dethi4') { clearTeamTimer(); app.d4 = null; }
  location.hash = v; render(); scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const host = $('#view');
  host.innerHTML = '';
  host.appendChild((V[app.view] || V.home)());
  const cur = app.view === 'quiz' ? (app.quiz?.mode === 'exam' ? 'exam' : 'practice') : app.view;
  $$('#tabs button, #botbar button').forEach(b => b.classList.toggle('on', b.dataset.nav === cur));
}

function buildBottomBar() {
  const bb = $('#botbar');
  const SHORT = { home: 'Trang chủ', practice: 'Luyện tập', team: 'Đội tuyển', dethi4: '4 Đề', exam: 'Tốc độ', flash: 'Thẻ nhớ', browse: 'Tra cứu', stats: 'Tiến độ', ref: 'Quy chế' };
  [...$('#tabs').children].forEach(b => {
    const c = b.cloneNode(true);
    c.querySelector('span').textContent = SHORT[c.dataset.nav] || c.dataset.nav;
    c.onclick = () => nav(c.dataset.nav);
    bb.appendChild(c);
  });
  bb.hidden = false;
}

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', e => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (app.view === 'flash' && flash.list) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flash.shown) { flash.shown = true; render(); } else nextFlash(); }
    if (e.key === 'ArrowRight') nextFlash();
    return;
  }
  if (app.view === 'team') {
    if (!app.team || app.team.finished) return;
    const { st, it } = teamCurrentItem();
    if (st.kind !== 'tangtoc' || it.done) return;
    if (/^[1-9]$/.test(e.key)) { const b = $$('.opt')[+e.key - 1]; if (b) { e.preventDefault(); b.click(); } }
    else if (/^[a-e]$/i.test(e.key)) { const b = $$('.opt').find(x => x.dataset.k === e.key.toLowerCase()); if (b) { e.preventDefault(); b.click(); } }
    return;
  }
  if (app.view !== 'quiz' || !app.quiz || app.quiz.finished) return;
  if (/^[1-9]$/.test(e.key)) {
    const b = $$('.opt')[+e.key - 1];
    if (b) { e.preventDefault(); b.click(); }
  } else if (/^[a-e]$/i.test(e.key)) {
    const b = $$('.opt').find(x => x.dataset.k === e.key.toLowerCase());
    if (b) { e.preventDefault(); b.click(); }
  } else if (e.key === 'Enter') {
    e.preventDefault(); const mb = $('#mainBtn'); if (mb && !mb.disabled) mb.click();
  } else if (e.key.toLowerCase() === 's') {
    const sb = $('.star-btn'); if (sb) sb.click();
  }
});

/* ---------------- exam timer ---------------- */
setInterval(() => {
  const Q = app.quiz;
  if (!Q || Q.mode !== 'exam' || Q.finished || !Q.endAt) return;
  const t = $('#timer'); if (!t) return;
  const left = Q.endAt - Date.now();
  t.textContent = fmtTime(left);
  t.classList.toggle('warn', left < 120000);
  if (left <= 0) { toast('Hết giờ! Bài thi được nộp tự động.'); finishQuiz(); }
}, 1000);

/* ---------------- boot ---------------- */
(async function boot() {
  store.load();
  applyTheme();
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change', applyTheme);
  $('#themeBtn').onclick = () => {
    store.d.theme = { auto: 'light', light: 'dark', dark: 'auto' }[store.d.theme] || 'auto';
    store.save(); applyTheme();
  };

  // Cảnh báo trước khi rời/tải lại trang giữa lượt mô phỏng Đội tuyển hoặc lượt
  // ôn 4 đề có bật đồng hồ — tải lại không lấy thêm giờ được (trạng thái chỉ ở
  // bộ nhớ, mất hết khi tải lại), cảnh báo này chỉ để tránh mất bài làm do vô ý.
  window.addEventListener('beforeunload', e => {
    const inTeam = app.team && !app.team.finished;
    const inD4 = app.d4 && app.d4.timed && !app.d4.finished;
    if (inTeam || inD4) { e.preventDefault(); e.returnValue = ''; }
  });

  try {
    const r = await fetch('data/questions.json?v=3');
    DATA = await r.json();
  } catch (e) {
    $('#boot').innerHTML = '<p style="color:#dc2626">Không tải được dữ liệu câu hỏi. Vui lòng tải lại trang.</p>';
    return;
  }
  DATA.sections.forEach(s => QBY[s.id] = DATA.questions.filter(q => q.sec === s.id));

  try {
    const r4 = await fetch('data/dethi4.json?v=1');
    const raw4 = await r4.json();
    const STAGE_ORDER = ['khoidong', 'tangtoc', 'rieng', 'chung'];
    const flat = [];
    const bySet = {};
    raw4.sets.forEach(s => {
      bySet[s.setNo] = [];
      STAGE_ORDER.forEach(st => (s.stages[st] || []).forEach(q => { flat.push(q); bySet[s.setNo].push(q); }));
    });
    DETHI4 = { source: raw4.source, title: raw4.title, sets: raw4.sets, flat, bySet };
  } catch (e) { DETHI4 = null; }

  $$('#tabs button, .brand').forEach(b => b.onclick = () => nav(b.dataset.nav));
  buildBottomBar();
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g && g.dataset.go === 'due') {
      const pool = DATA.questions.filter(q => answerable(q) && filterOnly(q, 'due'));
      if (!pool.length) return toast('Tuyệt vời — hôm nay không còn câu nào đến hạn ôn!');
      startQuiz({ mode: 'practice', secs: [], count: Math.min(20, pool.length), shuffle: true, only: 'due' });
      return;
    }
    const n = e.target.closest('[data-nav]');
    if (n && !n.closest('#tabs') && !n.closest('#botbar') && !n.classList.contains('brand')) nav(n.dataset.nav);
  });

  const h = location.hash.slice(1);
  app.view = V[h] && h !== 'quiz' && h !== 'team' ? h : 'home';
  window.addEventListener('hashchange', () => {
    const v = location.hash.slice(1) || 'home';
    if (v !== app.view && V[v] && v !== 'quiz' && v !== 'team') { app.view = v; app.quiz = null; clearTeamTimer(); app.team = null; app.d4 = null; render(); }
  });

  $('#boot').remove();
  $('.topbar').hidden = false;
  $('#view').hidden = false;
  render();
})();
