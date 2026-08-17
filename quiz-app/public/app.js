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
        <button class="btn big" data-nav="exam">Thi thử</button>
      </div>
    </div>`));

  v.appendChild(el('div', 'kpis', `
    <div class="kpi"><b>${qs.length}</b><span>Tổng số câu</span></div>
    <div class="kpi due"><b>${due}</b><span>Cần ôn hôm nay</span></div>
    <div class="kpi bad"><b>${weak}</b><span>Câu còn yếu</span></div>
    <div class="kpi ok"><b>${store.d.streak.days}</b><span>Ngày liên tiếp 🔥</span></div>`));

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
    ? `<h1>Thi thử</h1><p>Làm bài liên tục theo thời gian, chấm điểm và xem lại ở cuối bài — giống không khí hội thi.</p>`
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
    body.appendChild(el('div', 'src', `<span>${esc(q.secTitle)}</span><span>·</span><span>Trang ${q.page} tài liệu gốc</span>${q.multi ? '<span>·</span><span>Nhiều đáp án</span>' : ''}`));
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
    <div class="kpi"><b>${store.d.best.exam || 0}%</b><span>Điểm thi thử cao nhất</span></div>`));

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
      hc.appendChild(el('div', 'mastery-row', `
        <span class="tag">${h.mode === 'exam' ? 'Thi thử' : 'Luyện tập'}</span>
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
  v.appendChild(el('div', 'page-head', `<h1>Thang điểm chấm thi</h1><p>Phụ lục “Thang điểm chấm thi Đơn vị chính quy ngành HC-KT cấp Tổng cục năm 2026” — bản quét đầy đủ 23 trang từ tài liệu gốc.</p>`));
  const g = el('div', 'ref-grid');
  for (let i = 1; i <= 23; i++) {
    const p = el('div', 'ref-page');
    const img = el('img'); img.loading = 'lazy'; img.decoding = 'async';
    img.src = `ref/tcd-${pad2(i)}.jpg`; img.alt = `Thang điểm chấm thi — trang ${i}`;
    p.appendChild(img);
    p.appendChild(el('div', 'cap', `Trang ${i} / 23`));
    g.appendChild(p);
  }
  v.appendChild(g);
  return v;
};

/* ---------------- router / render ---------------- */
function nav(v) { app.view = v; if (v !== 'quiz') app.quiz = null; location.hash = v; render(); scrollTo({ top: 0, behavior: 'smooth' }); }

function render() {
  const host = $('#view');
  host.innerHTML = '';
  host.appendChild((V[app.view] || V.home)());
  const cur = app.view === 'quiz' ? (app.quiz?.mode === 'exam' ? 'exam' : 'practice') : app.view;
  $$('#tabs button, #botbar button').forEach(b => b.classList.toggle('on', b.dataset.nav === cur));
}

function buildBottomBar() {
  const bb = $('#botbar');
  const SHORT = { home: 'Trang chủ', practice: 'Luyện tập', exam: 'Thi thử', flash: 'Thẻ nhớ', browse: 'Tra cứu', stats: 'Tiến độ', ref: 'Thang điểm' };
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

  try {
    const r = await fetch('data/questions.json');
    DATA = await r.json();
  } catch (e) {
    $('#boot').innerHTML = '<p style="color:#dc2626">Không tải được dữ liệu câu hỏi. Vui lòng tải lại trang.</p>';
    return;
  }
  DATA.sections.forEach(s => QBY[s.id] = DATA.questions.filter(q => q.sec === s.id));

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
  app.view = V[h] && h !== 'quiz' ? h : 'home';
  window.addEventListener('hashchange', () => {
    const v = location.hash.slice(1) || 'home';
    if (v !== app.view && V[v] && v !== 'quiz') { app.view = v; app.quiz = null; render(); }
  });

  $('#boot').remove();
  $('.topbar').hidden = false;
  $('#view').hidden = false;
  render();
})();
