---
title: "캠핑 준비물 체크리스트"
description: "오토캠핑 3~4인 캠핑 준비물 체크리스트. 항목을 클릭하면 실시간으로 진행률이 반영됩니다."
publishedAt: 2026-04-03
category: "camping"
tags: ["캠핑", "캠핑준비물", "오토캠핑", "캠핑체크리스트"]
---

<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">

<style>
  :root {
    --bg: #F5F0E8;
    --surface: #FDFAF4;
    --surface2: #EDE8DC;
    --text: #2A2218;
    --text-muted: #7A6E5F;
    --accent: #3D6B4F;
    --accent-light: #D4E8DA;
    --accent-warm: #C4763A;
    --accent-warm-light: #F5E6D5;
    --border: rgba(42,34,24,0.12);
    --border-strong: rgba(42,34,24,0.22);
    --shadow: 0 2px 20px rgba(42,34,24,0.08);
    --shadow-lg: 0 8px 40px rgba(42,34,24,0.14);
    --radius: 16px;
    --radius-sm: 8px;
  }
  .cl-wrap { font-family: 'Noto Sans KR', sans-serif; color: var(--text); }
  .cl-header { padding: 32px 0 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .header-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-light); color: var(--accent); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; padding: 5px 14px; border-radius: 999px; margin-bottom: 16px; border: 1px solid rgba(61,107,79,0.2); }
  .cl-header p { font-size: 13px; color: var(--text-muted); font-weight: 300; }
  .header-line { width: 40px; height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-warm)); border-radius: 1px; margin: 16px auto 0; }
  .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 14px; text-align: center; box-shadow: var(--shadow); }
  .stat-num { font-family: 'Noto Serif KR', serif; font-size: 26px; font-weight: 700; color: var(--text); display: block; line-height: 1; margin-bottom: 4px; }
  .stat-num.green { color: var(--accent); }
  .stat-label { font-size: 11px; color: var(--text-muted); letter-spacing: 0.05em; }
  .progress-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 24px; box-shadow: var(--shadow); }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-header span { font-size: 13px; color: var(--text-muted); }
  .progress-header strong { font-family: 'Noto Serif KR', serif; font-size: 18px; color: var(--accent); font-weight: 600; }
  .progress-track { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #5A9A6F); border-radius: 4px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); width: 0%; }
  .cl-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; box-shadow: var(--shadow); overflow: hidden; }
  .section-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; user-select: none; transition: background 0.15s; }
  .section-header:hover { background: rgba(61,107,79,0.04); }
  .section-emoji { width: 36px; height: 36px; border-radius: 10px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; border: 1px solid var(--border); }
  .section-title { font-family: 'Noto Serif KR', serif; font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .section-count { font-size: 11px; color: var(--text-muted); background: var(--surface2); border: 1px solid var(--border); padding: 3px 9px; border-radius: 999px; flex-shrink: 0; }
  .section-count.complete { background: var(--accent-light); color: var(--accent); border-color: rgba(61,107,79,0.2); font-weight: 500; }
  .chevron { color: var(--text-muted); font-size: 10px; transition: transform 0.25s; flex-shrink: 0; }
  .chevron.open { transform: rotate(90deg); }
  .section-prog { height: 3px; background: var(--surface2); overflow: hidden; }
  .section-prog-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #5A9A6F); transition: width 0.4s ease; }
  .items-container { overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
  .cl-item { display: flex; align-items: center; gap: 12px; padding: 10px 18px; cursor: pointer; border-top: 1px solid var(--border); transition: background 0.12s; }
  .cl-item:hover { background: rgba(61,107,79,0.03); }
  .cb { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--border-strong); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; background: transparent; }
  .cb.checked { background: var(--accent); border-color: var(--accent); }
  .cb svg { opacity: 0; transform: scale(0.5); transition: all 0.18s; }
  .cb.checked svg { opacity: 1; transform: scale(1); }
  .item-text { font-size: 13px; color: var(--text); flex: 1; transition: color 0.2s; line-height: 1.5; }
  .item-text.done { color: var(--text-muted); text-decoration: line-through; text-decoration-color: rgba(122,110,95,0.5); }
  .tag { font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 500; letter-spacing: 0.04em; flex-shrink: 0; }
  .tag-must { background: var(--accent-warm-light); color: var(--accent-warm); border: 1px solid rgba(196,118,58,0.2); }
  .tag-rec { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }
  .cl-footer { display: flex; justify-content: center; margin-top: 24px; }
  .reset-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 26px; background: transparent; border: 1px solid var(--border-strong); border-radius: 999px; font-size: 13px; font-family: 'Noto Sans KR', sans-serif; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
  .reset-btn:hover { background: var(--surface); color: var(--accent); border-color: var(--accent); box-shadow: var(--shadow); }
  .complete-banner { display: none; background: linear-gradient(135deg, var(--accent-light), #EAF5EE); border: 1px solid rgba(61,107,79,0.25); border-radius: var(--radius); padding: 18px 22px; text-align: center; margin-bottom: 20px; }
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
    <div class="header-badge">⛺ 오토캠핑 · 3~4인 · 어린이 동반</div>
    <p>항목을 클릭해 체크하세요. 준비 상황이 실시간으로 반영됩니다.</p>
    <div class="header-line"></div>
  </div>

  <div class="summary">
    <div class="stat-card"><span class="stat-num green" id="s-done">0</span><div class="stat-label">완료</div></div>
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
    <p>🎉 모든 준비가 완료되었습니다!</p>
    <span>즐겁고 안전한 캠핑 되세요.</span>
  </div>

  <div id="cl-sections"></div>

  <div class="cl-footer">
    <button class="reset-btn" onclick="clResetAll()">↺ 전체 초기화</button>
  </div>
</div>

<script>
(function() {
  const sections = [
    { id:"shelter", icon:"⛺", title:"숙박 / 쉼터", items:[
      {label:"텐트",must:true},{label:"타프 / 쉘터",must:true},{label:"텐트 펙 & 폴대 (여분)",must:true},
      {label:"그라운드 시트 / 풋프린트",must:false},{label:"리빙쉘 (차량 연결용)",must:false},
    ]},
    { id:"sleep", icon:"🛏", title:"침구 / 수면", items:[
      {label:"침낭",must:true},{label:"에어 매트 / 캠핑 매트",must:true},{label:"베개 (캠핑용)",must:false},
      {label:"담요 / 이불 (어린이용 포함)",must:true},{label:"수면 양말",must:false},{label:"전기 장판",must:false},
      {label:"온풍기",must:false},{label:"에어컨",must:false},{label:"선풍기",must:false}
    ]},
    { id:"cooking", icon:"🍳", title:"취사 / 요리", items:[
      {label:"버너 & 가스 카트리지",must:true},{label:"코펠 (냄비·팬 세트)",must:true},
      {label:"아이스박스 & 아이스팩",must:true},{label:"식기류 (그릇·수저·컵)",must:true},
      {label:"칼 & 도마",must:true},{label:"집게 & 국자 & 주걱",must:true},
      {label:"테이블 & 의자",must:true},{label:"키친타월 & 행주",must:false},
      {label:"지퍼백 & 랩",must:false},{label:"종이호일 & 알루미늄 포일",must:false},
      {label:"식재료 & 양념류",must:true},{label:"음료 & 생수",must:true},{label:"세제 & 수세미",must:false},
    ]},
    { id:"kids", icon:"🧒", title:"어린이 동반", items:[
      {label:"어린이 침낭 또는 추가 이불",must:true},{label:"어린이 의자 & 테이블",must:false},
      {label:"모기 기피제 (어린이용)",must:true},{label:"선크림 (어린이용)",must:true},
      {label:"어린이 간식 & 음료",must:true},{label:"장난감 & 보드게임",must:false},
      {label:"야광 팔찌 / 야간 안전 용품",must:true},{label:"어린이 구명조끼 (물가 근처 시)",must:false},
      {label:"세면도구 (어린이 전용)",must:true},{label:"갈아입을 옷 여분 (2~3벌)",must:true},
    ]},
    { id:"fishing", icon:"🎣", title:"낚시 / 레저", items:[
      {label:"낚싯대 & 릴",must:true},{label:"낚싯줄 & 바늘 & 봉돌",must:true},
      {label:"미끼 (루어 또는 생미끼)",must:true},{label:"낚시 가방 & 태클박스",must:false},
      {label:"낚시 의자 & 받침대",must:false},{label:"뜰채 & 물고기 바구니",must:false},
      {label:"낚시 조끼",must:false},{label:"구명조끼",must:true},
    ]},
    { id:"light", icon:"💡", title:"조명 / 전력", items:[
      {label:"랜턴 (가스 또는 LED)",must:true},{label:"헤드랜턴 (1인 1개)",must:true},
      {label:"랜턴 가스 또는 배터리 여분",must:true},{label:"보조 배터리 (대용량)",must:false},
      {label:"멀티탭 & 연장선",must:false},
    ]},
    { id:"safety", icon:"🩹", title:"안전 / 위생", items:[
      {label:"구급상자 (밴드·소독약·해열제)",must:true},{label:"모기향 & 해충 퇴치제",must:true},
      {label:"핫팩 (야간 대비)",must:false},{label:"마스크 & 손소독제",must:false},
      {label:"화장지 & 물티슈",must:true},{label:"쓰레기봉투",must:true},
    ]},
    { id:"clothes", icon:"👕", title:"의류 / 기타", items:[
      {label:"방한복 (야간 기온 대비)",must:true},{label:"우비 / 우산",must:true},
      {label:"장화 또는 트레킹화",must:false},{label:"장갑 & 모자",must:false},
      {label:"수건 (1인 1장)",must:true},{label:"세면도구",must:true},
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
