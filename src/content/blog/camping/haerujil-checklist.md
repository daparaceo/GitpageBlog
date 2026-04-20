---
title: "해루질 준비물 체크리스트"
description: "야간 갯벌 채집(해루질) 준비물 체크리스트. 조명부터 안전 장비까지 항목을 클릭하면 진행률이 실시간으로 반영됩니다."
publishedAt: 2026-04-18
category: "camping"
tags: ["해루질", "해루질준비물", "야간채집", "갯벌", "해루질체크리스트"]
---

<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">

<style>
  :root {
    --bg: #EBF2F6;
    --surface: #F5FAFE;
    --surface2: #D9E8F0;
    --text: #182830;
    --text-muted: #5A7580;
    --accent: #1A6B8A;
    --accent-light: #C6E4F0;
    --accent-warm: #C05C28;
    --accent-warm-light: #F5E8DF;
    --border: rgba(24,40,48,0.11);
    --border-strong: rgba(24,40,48,0.20);
    --shadow: 0 2px 20px rgba(24,40,48,0.07);
    --shadow-lg: 0 8px 40px rgba(24,40,48,0.13);
    --radius: 16px;
    --radius-sm: 8px;
  }
  .cl-wrap { font-family: 'Noto Sans KR', sans-serif; color: var(--text); }
  .cl-header { padding: 32px 0 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .header-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-light); color: var(--accent); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; padding: 5px 14px; border-radius: 999px; margin-bottom: 16px; border: 1px solid rgba(26,107,138,0.2); }
  .cl-header p { font-size: 13px; color: var(--text-muted); font-weight: 300; }
  .header-line { width: 40px; height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-warm)); border-radius: 1px; margin: 16px auto 0; }
  .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 14px; text-align: center; box-shadow: var(--shadow); }
  .stat-num { font-family: 'Noto Serif KR', serif; font-size: 26px; font-weight: 700; color: var(--text); display: block; line-height: 1; margin-bottom: 4px; }
  .stat-num.blue { color: var(--accent); }
  .stat-label { font-size: 11px; color: var(--text-muted); letter-spacing: 0.05em; }
  .progress-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 24px; box-shadow: var(--shadow); }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-header span { font-size: 13px; color: var(--text-muted); }
  .progress-header strong { font-family: 'Noto Serif KR', serif; font-size: 18px; color: var(--accent); font-weight: 600; }
  .progress-track { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #2E9BBF); border-radius: 4px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); width: 0%; }
  .cl-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; box-shadow: var(--shadow); overflow: hidden; }
  .section-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; user-select: none; transition: background 0.15s; }
  .section-header:hover { background: rgba(26,107,138,0.04); }
  .section-emoji { width: 36px; height: 36px; border-radius: 10px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; border: 1px solid var(--border); }
  .section-title { font-family: 'Noto Serif KR', serif; font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .section-count { font-size: 11px; color: var(--text-muted); background: var(--surface2); border: 1px solid var(--border); padding: 3px 9px; border-radius: 999px; flex-shrink: 0; }
  .section-count.complete { background: var(--accent-light); color: var(--accent); border-color: rgba(26,107,138,0.2); font-weight: 500; }
  .chevron { color: var(--text-muted); font-size: 10px; transition: transform 0.25s; flex-shrink: 0; }
  .chevron.open { transform: rotate(90deg); }
  .section-prog { height: 3px; background: var(--surface2); overflow: hidden; }
  .section-prog-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #2E9BBF); transition: width 0.4s ease; }
  .items-container { overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
  .cl-item { display: flex; align-items: center; gap: 12px; padding: 10px 18px; cursor: pointer; border-top: 1px solid var(--border); transition: background 0.12s; }
  .cl-item:hover { background: rgba(26,107,138,0.03); }
  .cb { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--border-strong); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; background: transparent; }
  .cb.checked { background: var(--accent); border-color: var(--accent); }
  .cb svg { opacity: 0; transform: scale(0.5); transition: all 0.18s; }
  .cb.checked svg { opacity: 1; transform: scale(1); }
  .item-text { font-size: 13px; color: var(--text); flex: 1; transition: color 0.2s; line-height: 1.5; }
  .item-text.done { color: var(--text-muted); text-decoration: line-through; text-decoration-color: rgba(90,117,128,0.5); }
  .tag { font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 500; letter-spacing: 0.04em; flex-shrink: 0; }
  .tag-must { background: var(--accent-warm-light); color: var(--accent-warm); border: 1px solid rgba(192,92,40,0.2); }
  .tag-rec { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }
  .cl-footer { display: flex; justify-content: center; margin-top: 24px; }
  .reset-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 26px; background: transparent; border: 1px solid var(--border-strong); border-radius: 999px; font-size: 13px; font-family: 'Noto Sans KR', sans-serif; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
  .reset-btn:hover { background: var(--surface); color: var(--accent); border-color: var(--accent); box-shadow: var(--shadow); }
  .complete-banner { display: none; background: linear-gradient(135deg, var(--accent-light), #E0F4FC); border: 1px solid rgba(26,107,138,0.25); border-radius: var(--radius); padding: 18px 22px; text-align: center; margin-bottom: 20px; }
  .complete-banner.show { display: block; }
  .complete-banner p { font-family: 'Noto Serif KR', serif; font-size: 15px; color: var(--accent); font-weight: 600; }
  .complete-banner span { font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px; }
  @media (max-width: 480px) {
    .summary { gap: 8px; }
    .stat-card { padding: 12px 8px; }
    .stat-num { font-size: 20px; }
    .section-header { padding: 12px 14px; }
    .cl-item { padding: 10px 14px; }
  }
</style>

<div class="cl-wrap">
  <div class="cl-header">
    <div class="header-badge">🌊 해루질 · 야간 갯벌 채집</div>
    <p>항목을 클릭해 체크하세요. 준비 상황이 실시간으로 반영됩니다.</p>
    <div class="header-line"></div>
  </div>

  <div class="summary">
    <div class="stat-card"><span class="stat-num blue" id="s-done">0</span><div class="stat-label">완료</div></div>
    <div class="stat-card"><span class="stat-num" id="s-left">0</span><div class="stat-label">남은 항목</div></div>
    <div class="stat-card"><span class="stat-num" id="s-pct">0%</span><div class="stat-label">진행률</div></div>
  </div>

  <div class="progress-wrap">
    <div class="progress-header">
      <span>전체 진행률</span>
      <strong id="pct-label">0%</strong>
    </div>
    <div class="progress-track"><div class="progress-fill" id="main-bar"></div></div>
  </div>

  <div class="complete-banner" id="complete-banner">
    <p>모든 준비가 완료되었습니다!</p>
    <span>안전하고 즐거운 해루질 되세요.</span>
  </div>

  <div id="cl-sections"></div>

  <div class="cl-footer">
    <button class="reset-btn" onclick="clResetAll()">↺ 전체 초기화</button>
  </div>
</div>

<script>
(function() {
  const sections = [
    { id:"light", icon:"🔦", title:"조명", items:[
      {label:"방수 헤드랜턴 (1인 1개)",must:true},{label:"수중 LED 집어등",must:true},
      {label:"예비 건전지 / 충전지",must:true},{label:"보조 배터리 (대용량)",must:false},
      {label:"야광 마커 / 형광 밴드",must:false},
    ]},
    { id:"tool", icon:"🦀", title:"채집 도구", items:[
      {label:"족대",must:true},{label:"집게 (긴자루형)",must:true},
      {label:"채집망 / 망태기",must:true},{label:"아이스박스 & 아이스팩",must:true},
      {label:"뜰채",must:false},{label:"작살",must:false},
      {label:"갈고리",must:false},{label:"소금",must:false},
    ]},
    { id:"clothes", icon:"👢", title:"의류 / 방수", items:[
      {label:"웨이더 (방수 장화 바지)",must:true},{label:"아쿠아슈즈 또는 방수 장화",must:true},
      {label:"방수 장갑",must:true},{label:"방한 재킷 (야간 기온 대비)",must:true},
      {label:"갈아입을 여벌 옷",must:true},{label:"수건",must:true},
      {label:"우비",must:false},
    ]},
    { id:"safety", icon:"🦺", title:"안전 장비", items:[
      {label:"구명조끼",must:true},{label:"핸드폰 방수팩",must:true},
      {label:"구급상자 (밴드·소독약)",must:true},{label:"비상연락처 공유 (현장 출발 전)",must:true},
      {label:"2인 이상 동행",must:true},{label:"안전 로프",must:false},
      {label:"호루라기",must:false},
    ]},
    { id:"info", icon:"📋", title:"사전 정보 확인", items:[
      {label:"물때표 & 간조 시간 확인 (간조 전후 2시간)",must:true},
      {label:"날씨 & 파고 확인",must:true},
      {label:"해루질 허용 구역 확인",must:true},
      {label:"채집 금지 어종·갑각류 확인",must:true},
      {label:"현장 주차 위치 확인",must:false},
    ]},
    { id:"cleanup", icon:"🧺", title:"마무리 / 정리", items:[
      {label:"세면도구",must:true},{label:"물티슈 & 화장지",must:true},
      {label:"쓰레기봉투",must:true},{label:"해감용 용기 & 소금물",must:false},
      {label:"조리 도구 (현장 취식 시)",must:false},
    ]},
  ];

  const state = {};
  const openState = {};
  sections.forEach(s => openState[s.id] = true);

  function totalItems() { return sections.reduce((a,s) => a + s.items.length, 0); }
  function doneCount() { return Object.values(state).filter(Boolean).length; }
  function secDone(sec) { return sec.items.filter(it => state[sec.id+'_'+it.label]).length; }

  function updateSummary() {
    const done = doneCount(), total = totalItems(), pct = Math.round(done/total*100);
    document.getElementById('s-done').textContent = done;
    document.getElementById('s-left').textContent = total - done;
    document.getElementById('s-pct').textContent = pct + '%';
    document.getElementById('pct-label').textContent = pct + '%';
    document.getElementById('main-bar').style.width = pct + '%';
    document.getElementById('complete-banner').classList.toggle('show', done === total && total > 0);
  }

  function render() {
    const wrap = document.getElementById('cl-sections');
    wrap.innerHTML = '';
    sections.forEach((sec) => {
      const done = secDone(sec), total = sec.items.length;
      const isOpen = openState[sec.id];
      const pct = total ? Math.round(done/total*100) : 0;
      const complete = done === total;
      const div = document.createElement('div');
      div.className = 'cl-section';
      div.innerHTML = `
        <div class="section-header" onclick="clToggleSec('${sec.id}')">
          <div class="section-emoji">${sec.icon}</div>
          <div class="section-title">${sec.title}</div>
          <span class="section-count ${complete?'complete':''}">${done}/${total}</span>
          <span class="chevron ${isOpen?'open':''}">▶</span>
        </div>
        <div class="section-prog"><div class="section-prog-fill" style="width:${pct}%"></div></div>
        <div class="items-container" style="max-height:${isOpen ? total*50+20+'px' : '0'}">
          ${sec.items.map(it => {
            const key = sec.id+'_'+it.label;
            const checked = !!state[key];
            return `<div class="cl-item" onclick="clToggle('${key}')">
              <div class="cb ${checked?'checked':''}">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 3.5L3.8 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="item-text ${checked?'done':''}">${it.label}</span>
              <span class="tag ${it.must?'tag-must':'tag-rec'}">${it.must?'필수':'권장'}</span>
            </div>`;
          }).join('')}
        </div>`;
      wrap.appendChild(div);
    });
    updateSummary();
  }

  window.clToggle = function(key) { state[key] = !state[key]; render(); };
  window.clToggleSec = function(id) { openState[id] = !openState[id]; render(); };
  window.clResetAll = function() { if (!confirm('모든 체크를 초기화할까요?')) return; Object.keys(state).forEach(k => delete state[k]); render(); };

  render();
})();
</script>
