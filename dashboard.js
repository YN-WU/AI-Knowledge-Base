var VALID_PAGES = ['home', 'news', 'summaries', 'prompt-tips', 'prompt-sites', 'tool-intro', 'tools', 'archive', 'outlook-gen'];

function switchTab(page) {
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.page === page); });
  document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('active', p.id === 'page-' + page); });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 切分頁時把所有篩選 state 重置（避免回到原分頁時殘留之前的篩選紀錄）
  document.querySelectorAll('.filter-rows').forEach(function (c) {
    if (typeof c.resetFilter === 'function') c.resetFilter();
  });
  // Prompt 技巧分享：透過 initSingleFilter 暴露的 resetFilter API 同步 chip + 手機版 dropdown
  const promptFiltersEl = document.querySelector('.prompt-filters');
  if (promptFiltersEl && typeof promptFiltersEl.resetFilter === 'function') {
    promptFiltersEl.resetFilter();
  } else if (typeof renderPrompts === 'function') {
    renderPrompts('全部');
  }
  // 歷期 archive 維持原本 chip 切換
  document.querySelectorAll('.archive-filters .chip').forEach(function (c) {
    var defaultVal = c.dataset.filter === '全部' || c.dataset.filter === 'all';
    c.classList.toggle('active', defaultVal);
  });
  if (typeof renderArchive === 'function') renderArchive('all');

  // 同步 URL hash — 重新整理時可以回到原分頁
  var currentHash = location.hash.slice(1);
  if (page === 'home') {
    if (currentHash) history.replaceState(null, '', location.pathname + location.search);
  } else if (currentHash !== page) {
    history.replaceState(null, '', '#' + page);
  }

  // 核心修正：切換到歸檔頁時自動載入內容
  if (page === 'archive') {
    if (typeof renderArchive === 'function' && issuesData.length > 0) {
      renderArchive('all');
    }
  }

  // 切到 Outlook 產生器：首次進入時 init
  if (page === 'outlook-gen' && typeof initOutlookGenerator === 'function') {
    initOutlookGenerator();
  }

  // GA4 SPA pageview（hash 路由 GA 不會自動偵測）
  if (typeof gtag === 'function') {
    const titleMap = {
      home: '首頁',
      news: '重點趨勢',
      summaries: '10 秒看趨勢',
      'prompt-tips': 'Prompt 技巧分享',
      'prompt-sites': 'Prompt 資源庫',
      'tool-intro': 'AI 工具介紹',
      tools: 'AI 工具資源',
      archive: '歷期電子報'
    };
    gtag('event', 'page_view', {
      page_path: page === 'home' ? '/' : '/#' + page,
      page_title: 'AI Knowledge Base | ' + (titleMap[page] || page),
      page_location: window.location.href
    });
  }
}

function getHashPage() {
  var h = location.hash.slice(1);
  return VALID_PAGES.indexOf(h) >= 0 ? h : null;
}
document.querySelectorAll('.tab').forEach(function (t) {
  t.addEventListener('click', function () { switchTab(t.dataset.page); });
});

// 搜尋鈕：行動版點開／收起搜尋浮層
function closeMobileSearch() {
  var header = document.querySelector('.site-header');
  if (header) header.classList.remove('search-open');
  var toggle = document.getElementById('searchToggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}
(function () {
  var header = document.querySelector('.site-header');
  var searchBtn = document.getElementById('searchToggle');
  if (!header || !searchBtn) return;
  searchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var willOpen = !header.classList.contains('search-open');
    header.classList.toggle('search-open', willOpen);
    searchBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) {
      var input = document.getElementById('searchInput');
      if (input) input.focus();
    }
  });
})();

// 行動版選單：左右捲動按鈕 + 邊緣淡出狀態
(function () {
  var tabs = document.querySelector('.tabs');
  var wrap = document.querySelector('.tabs-wrap');
  if (!tabs || !wrap) return;
  function update() {
    var maxScroll = tabs.scrollWidth - tabs.clientWidth;
    wrap.classList.toggle('nav-scrolled', tabs.scrollLeft > 4);
    wrap.classList.toggle('nav-at-end', tabs.scrollLeft >= maxScroll - 4);
  }
  function scrollTabs(dir) {
    var amount = Math.max(tabs.clientWidth * 0.7, 160);
    tabs.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }
  var leftBtn = document.getElementById('tabsScrollLeft');
  var rightBtn = document.getElementById('tabsScrollRight');
  if (leftBtn) leftBtn.addEventListener('click', function () { scrollTabs(-1); });
  if (rightBtn) rightBtn.addEventListener('click', function () { scrollTabs(1); });
  tabs.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

// 行動版：總則數搬到標題旁省空間；桌機維持在 overview 區塊內
(function () {
  var count = document.getElementById('readerTrendCount');
  var titleRow = document.querySelector('.reader-title-row');
  var overview = document.querySelector('.reader-overview');
  var keywords = document.getElementById('readerKeywords');
  if (!count || !titleRow || !overview || !keywords) return;
  var mq = window.matchMedia('(max-width: 700px)');
  function place(e) {
    if (e.matches) {
      titleRow.appendChild(count);
    } else {
      overview.insertBefore(count, keywords);
    }
  }
  place(mq);
  mq.addEventListener('change', place);
})();

// 下拉選單：觸控/手機用 click 展開（桌機 hover 仍可用）
function closeNavDropdowns() {
  document.querySelectorAll('.nav-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
}
document.querySelectorAll('.nav-dropdown .dropdown-toggle').forEach(function (toggle) {
  function toggleDropdown(e) {
    e.stopPropagation();
    var parent = toggle.closest('.nav-dropdown');
    var wasOpen = parent.classList.contains('open');
    closeNavDropdowns();
    if (!wasOpen) parent.classList.add('open');
  }
  toggle.addEventListener('click', toggleDropdown);
  toggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(e); }
  });
});
// 點下拉項目 或 點選單外 → 收起下拉；點整個 header 外 → 連搜尋浮層一起收起
document.addEventListener('click', function (e) {
  if (!e.target.closest('.nav-dropdown') || e.target.closest('.dropdown-item')) {
    closeNavDropdowns();
  }
  if (!e.target.closest('.site-header')) {
    closeMobileSearch();
  }
});

// 模型類別切換
document.querySelectorAll('.model-type-tab').forEach(function (t) {
  t.addEventListener('click', function () {
    document.querySelectorAll('.model-type-tab').forEach(function (x) { x.classList.remove('active'); });
    t.classList.add('active');
    document.querySelectorAll('.model-type-pane').forEach(function (p) { p.classList.toggle('active', p.id === 'pane-' + t.dataset.type); });
  });
});
document.querySelectorAll('.chip').forEach(function (c) {
  c.addEventListener('click', function () {
    c.parentElement.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('active'); });
    c.classList.add('active');

    // 如果是在存檔頁面
    if (c.parentElement.classList.contains('archive-filters')) {
      if (typeof renderArchive === 'function') renderArchive(c.dataset.filter);
    }
    // 如果是在 PROMPT 專欄
    if (c.parentElement.classList.contains('prompt-filters')) {
      if (typeof renderPrompts === 'function') renderPrompts(c.dataset.filter);
    }
    // 如果是在新聞趨勢
    if (c.parentElement.classList.contains('trend-filters')) {
      var filter = c.dataset.filter;
      var cards = document.querySelectorAll('#trendGrid .article-card');
      cards.forEach(function (card) {
        var tag = card.querySelector('.tag').textContent.trim();
        if (filter === '全部' || tag === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
});

// 資料庫：Prompt 專欄數據 (含真實圖片連結)
// Prompt 技巧分享：資料從 data/prompt-tips.json 載入（initDashboardData 中），這裡只負責渲染
function renderPrompts(filter = '全部') {
  const container = document.getElementById('promptContainer');
  if (!container) return;
  const prompts = (window.__prompts || []).slice();
  const filtered = prompts.filter(it => filter === '全部' || it.tag === filter);
  container.innerHTML = filtered.map(it => {
    const titleEnc = encodeURIComponent(it.title).replace(/'/g, "%27");
    return `
    <a href="javascript:void(0)" onclick="showArticleByTitle(decodeURIComponent('${titleEnc}'))" class="prompt-compact-card">
      <div class="pc-cover" style="background-image:url('${it.image || ''}')"></div>
      <span class="pc-cat">${it.tag || ''}</span>
      <div class="pc-title">${it.title}</div>
      <div class="pc-sub">${(function(){ const src = (it.content || '').replace(/<div[^>]*>\s*<img[^>]*>[\s\S]*?<\/div>/gi, ''); return (typeof ogStripHtml === 'function' ? ogStripHtml(src) : '') || it.summary || ''; })()}</div>
      <div class="pc-footer"><span class="pc-issue">${it.date || ''}</span></div>
    </a>
  `;
  }).join('');
}

var slideIdx = 0, slideTotal = 0;
function renderDots() { var d = document.getElementById('sliderDots'); if (!d) return; var h = ''; for (var i = 0; i < slideTotal; i++) { h += '<div class="slider-dot' + (i === slideIdx ? ' active' : '') + '" onclick="slideGoTo(' + i + ')"></div>'; } d.innerHTML = h; }
function slideGoTo(i) { slideIdx = (i + slideTotal) % slideTotal; var t = document.getElementById('slidesTrack'); if (t) t.style.transform = 'translateX(-' + (slideIdx * 100) + '%)'; renderDots(); }
function slideMove(d) { slideGoTo(slideIdx + d); }
function initHeroSlider() {
  slideIdx = 0;
  slideTotal = document.querySelectorAll('#slidesTrack .slide').length;
  if (slideTotal > 0) {
    renderDots();
    if (window.__sliderTimer) clearInterval(window.__sliderTimer);
    window.__sliderTimer = setInterval(function () { slideMove(1); }, 5000);
  }
}

const articleData = {
  '017-clawdbot': {
    title: 'Clawdbot ( OpenClaw ) 爆紅！讓電腦直接變 AI 助手 免開 APP 就能做事',
    tag: 'AI Agent',
    date: '2025-06-21',
    source: 'TVBS AI Newsletter 第 017 期',
    img: 'https://i.meee.com.tw/MTqMQds.jpg',
    content: `
      <p class="first-paragraph">一款新的 AI 代理工具 Clawdbot（先前改名 Moltbot，現再度改名為 OpenClaw）在網路上爆紅，號稱真的能幫你在電腦上做事，只要簡單在手機輸入一段話，它就可以替你播放音樂、整理信箱、開發網站、監控股票價格、辦理登機手續等，不需親自操作電腦。</p>
      <h4>OpenClaw 是什麼？</h4>
      <p>OpenClaw 是一款開源的 AI 代理工具，由資深 iOS 開發者彼得・史坦伯格（Peter Steinberger）與 Github 社群共同管理，可直接安裝在使用者的電腦中，並串聯 Claude、Gemini、GPT 等大型語言模型，支援 Mac、Windows 和 Linux 系統。</p>
      <h4>與傳統 AI 工具有什麼差異？</h4>
      <p>傳統 AI 雖能回覆各種問題，卻無法直接操作檔案與軟體。OpenClaw 則突破了權限與記憶的限制，主要有三大特色：具備行動力、持久記憶、主動回報。</p>
    `
  },
  '017-chrome': {
    title: 'Chrome 瀏覽器 AI 功能大更新！整合 Gemini 3 支援圖像生成、自動瀏覽',
    tag: 'Google',
    date: '2025-06-21',
    source: 'TVBS AI Newsletter 第 017 期',
    img: 'https://i.meee.com.tw/FaWmLR2.png',
    content: `
      <p class="first-paragraph">Google 宣布為旗下瀏覽器 Chrome 推出一系列大更新，正式將最先進的 AI 模型 Gemini 3 整合至瀏覽器中，帶來全新的側邊面板體驗、整合圖像生成、自動瀏覽（Auto browse）等多項功能。</p>
      <h4>全新側邊面板 Gemini 即時支援</h4>
      <p>使用者無論身處任何分頁，都能隨時呼叫 Gemini 助理協助處理工作，例如進行跨分頁選項比較、彙整不同網站的產品評論，以及在繁忙的行事曆中安排活動時間等任務。</p>
      <h4>自動瀏覽功能</h4>
      <p>針對特定訂閱用戶推出的「自動瀏覽」功能，可代替使用者執行複雜的多步驟任務，例如協助研究飯店及航班費用、安排預約、填寫線上表單等。</p>
    `
  },
  '017-grok': {
    title: 'Grok 影音處理功能再升級！支援10秒 AI 影片生成還能整理摘要',
    tag: '影片生成',
    date: '2025-06-21',
    source: 'TVBS AI Newsletter 第 017 期',
    img: 'https://i.meee.com.tw/ushrAGE.png',
    content: `
      <p class="first-paragraph">馬斯克旗下 AI 公司 xAI 的 AI 產品 Grok 日前迎來重要更新，不僅正式加入 10 秒影片生成，也新增影片觀看及摘要功能，強化了創作與內容分析的應用場景。</p>
      <h4>10 秒影片生成</h4>
      <p>多模態創作工具 Grok Imagine 現在可產出 10 秒短影音內容。新版本在畫面穩定度與細節呈現上明顯進步，物件邊緣更清晰，音效也同步優化。</p>
      <h4>影片摘要能力</h4>
      <p>Grok 現在具備「觀看並摘要影片」能力。根據實測，Grok 能完整分析 30 分鐘訪談影片，並在極短時間內列出摘要與重點提取。</p>
    `
  },
  '016-claude': {
    title: '更親民的 AI 代理人！Claude Cowork 化身工作夥伴 幫你整理資料夾、寫文件',
    tag: 'AI Agent',
    date: '2025-05-31',
    source: 'TVBS AI Newsletter 第 016 期',
    img: 'https://i.meee.com.tw/AIw3oWe.jpg',
    content: `
      <p class="first-paragraph">Anthropic 日前推出全新的 AI Agent 功能「Claude Cowork」，讓不懂程式碼的人，也能透過自然語言指令讓 Claude 直接幫你執行日常任務。</p>
      <h4>Cowork 能做什麼？</h4>
      <p>只需描述目標，Claude 便會自行拆解步驟、規畫執行順序並持續完成任務。可授權 Claude 存取電腦中的特定資料夾，直接讀取、編輯或建立檔案，例如整理整理資料夾、重新命名檔案等。</p>
      <h4>平行處理多項任務</h4>
      <p>溝通方式不再像過去一來一往，而更像是留言給同事。您可以同時排定多項任務，讓 Claude 平行處理，大幅提升工作效率。</p>
    `
  },
  '016-uspto': {
    title: 'AI 能算發明人嗎？美國正式發布公告定義 AI 為協助工具',
    tag: '法律規範',
    date: '2025-05-31',
    source: 'TVBS AI Newsletter 第 016 期',
    img: 'https://i.meee.com.tw/InwkZRd.jpg',
    content: `
      <p class="first-paragraph">美國專利及商標局 (USPTO) 日前針對 AI 在應用過程中的定位發布最新公告，明確指出 AI 的角色等同於輔助發明的「工具」。</p>
      <h4>創意關鍵在於人類</h4>
      <p>公告強調 AI 不能被視為「發明人」，人類的創意構思才是關鍵。AI 系統僅是人類發明人所使用的工具，類似於實驗設備或電腦軟體。</p>
      <h4>共同發明原則</h4>
      <p>即使在 AI 協助下，判斷重點仍在於自然人是否對發明有實質貢獻。AI 可以提供想法，但構思主體仍必須是人類。</p>
    `
  },
  '016-google': {
    title: 'Google 官方教戰 40 個 AI 實用情境！影像創作、旅遊規劃全都包',
    tag: '應用技巧',
    date: '2025-05-31',
    source: 'TVBS AI Newsletter 第 016 期',
    img: 'https://i.meee.com.tw/DQ9MeXU.webp',
    content: `
      <p class="first-paragraph">Google 整理出 40 個最受歡迎的 AI 實用技巧情境，涵蓋深度學習、旅遊規劃、職場管理等多面向，幫助用戶更直覺有效地運用 Gemini。</p>
      <h4>核心應用分類</h4>
      <p>包含：「深度學習與知識探索」、「協助旅遊規劃」、「創意影像生成」以及「職場與生產力提升」。</p>
      <h4>亮點功能</h4>
      <p>例如：搜尋中的互動式模擬、開車時的語音助手、甚至能將截圖自動轉換為地圖清單，全方位滲透生活場景。</p>
    `
  }
};

var issuesData = [];
var searchIndex = [];

// 舊期電子報文章的 fallback 分類器（對齊最新 7 個內容屬性 tag）
// 優先序：先匹配語意最明確的（法律 / 產業 / 教學），再到模型 / 功能 / 工具
function getTag(title) {
  if (!title) return '產業動態';
  const t = title;

  // 1. 法律規範：政策、訴訟、合規
  if (/法律|版權|專利|訴訟|判決|侵權|合規|規範/.test(t)) return '法律規範';

  // 2. 產業動態：公司新聞、合作、市場、競爭、收購
  if (/合作|收購|投資|融資|併購|裁員|市場|競爭|股價|營收|攜手|聯手/.test(t)) return '產業動態';

  // 3. 應用技巧：教學、how-to、實戰、案例
  if (/教戰|教學|攻略|技巧|案例|實戰|心得|怎麼用|如何|這樣用|實測|實作/.test(t)) return '應用技巧';

  // 4. 模型發布：模型名 + 推出/登場 兩者並存
  // 涵蓋 LLM + 圖像 / 影片 / 音樂等 AI 模型
  const isModel = /(GPT-?\d|Claude(?:\s*\d|\s*Opus|\s*Sonnet|\s*Haiku)?|Gemini(?:\s*\d|\s*Pro|\s*Flash|\s*Ultra)?|DeepSeek|Llama|Grok\s*\d|Qwen|o[134](?:-pro|-mini)?|Mistral|Nano\s*Banana|Sora|Veo|Kling|可靈|Imagen|Midjourney|DALL[\s·-]?E|Stable\s*Diffusion|FLUX|Lyria|Suno|Seedance|Vidu|Hunyuan|混元|Wan|GLM|Yi-?\d)/i.test(t);
  const isLaunch = /登場|問世|問市|首發|新模型|釋出|發表|亮相|突破|問鼎|現身/.test(t);
  if (isModel && isLaunch) return '模型發布';

  // 5. 新功能：既有產品新功能 / 新版本
  if (/更新|升級|改版|新功能|新增|擴增|大進化|再進化|加入/.test(t)) return '新功能';

  // 6. 新工具：全新工具 / 服務上線（catch-all 動詞）
  if (/推出|發布|上線|新工具|新服務|問世/.test(t)) return '新工具';

  return '產業動態';
}

function showArticle(data) {
  let art;
  if (typeof data === 'string') {
    art = articleData[data];
  } else {
    art = data;
  }
  if (!art) return;

  let issueNo = "";
  if (art.url) {
    const m = art.url.match(/(\d+)\.html/);
    issueNo = m ? m[1] : '';
  } else if (art.no) {
    issueNo = art.no;
  }

  const issue = issuesData.find(it => it.no == issueNo || parseInt(it.no) == parseInt(issueNo));
  let displayDate = art.date || (issue ? issue.date : '');
  let displaySource = art.source || (issue ? `TVBS AI Newsletter 第 ${issue.no} 期` : '');
  let displayTag = art.tag || getTag(art.title);
  let displayImg = art.img || (issue ? issue.img : '');

  // 麵包屑：判定文章分類，外連電子報舊文不顯示
  const breadcrumbEl = document.getElementById('amBreadcrumb');
  if (breadcrumbEl) {
    let crumbParent = null;
    let crumbCategory = null;
    let crumbPage = null;
    if (art.isNative) {
      crumbParent = 'AI 趨勢消息';
      crumbCategory = '重點趨勢';
      crumbPage = 'news';
    } else if (art.source === '趨勢總覽') {
      crumbParent = 'AI 趨勢消息';
      crumbCategory = '10 秒看趨勢';
      crumbPage = 'summaries';
    } else if (art.source === 'AI 工具介紹') {
      crumbParent = 'AI 工具';
      crumbCategory = 'AI 工具介紹';
      crumbPage = 'tool-intro';
    } else if (art.source === 'Prompt 技巧分享') {
      crumbParent = 'Prompt 專區';
      crumbCategory = 'Prompt 技巧分享';
      crumbPage = 'prompt-tips';
    }
    if (crumbCategory) {
      breadcrumbEl.innerHTML = `${crumbParent}<span class="crumb-sep">&gt;</span><span class="crumb-link" onclick="closeArticle();switchTab('${crumbPage}')">${crumbCategory}</span>`;
      breadcrumbEl.style.display = 'block';
    } else {
      breadcrumbEl.style.display = 'none';
    }
  }

  document.getElementById('amTag').textContent = displayTag;
  document.getElementById('amTitle').textContent = art.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();

  const headerDateEl = document.getElementById('amHeaderDate');
  if (headerDateEl) {
    headerDateEl.textContent = displayDate;
    headerDateEl.style.display = displayDate ? 'block' : 'none';
    headerDateEl.style.textAlign = 'left';
    headerDateEl.style.marginTop = '8px';
  }

  const coverEl = document.getElementById('amCover');
  const titleEl = document.getElementById('amTitle');
  const headerEl = document.querySelector('.am-header');
  const bodyEl = document.querySelector('.am-body');

  if (art.source === '趨勢總覽') {
    coverEl.style.display = 'none';
    titleEl.style.fontSize = '22px';
    titleEl.style.lineHeight = '1.4';
    if (headerEl) {
      headerEl.style.borderBottom = 'none';
      headerEl.style.paddingBottom = '0';
      headerEl.style.marginBottom = '0';
    }
    if (bodyEl) {
      bodyEl.style.paddingTop = '20px';
    }
  } else if (art.source === 'Prompt 技巧分享') {
    // 封面圖已包在 content 內（含圖說），不再使用上方裁切型 .am-cover
    coverEl.style.display = 'none';
    titleEl.style.fontSize = '';
    titleEl.style.lineHeight = '';
    if (headerEl) {
      headerEl.style.borderBottom = '';
      headerEl.style.paddingBottom = '';
      headerEl.style.marginBottom = '';
    }
    if (bodyEl) {
      bodyEl.style.paddingTop = '';
    }
  } else {
    coverEl.style.display = 'block';
    coverEl.style.backgroundImage = `url('${displayImg}')`;
    titleEl.style.fontSize = '';
    titleEl.style.lineHeight = '';
    if (headerEl) {
      headerEl.style.borderBottom = '';
      headerEl.style.paddingBottom = '';
      headerEl.style.marginBottom = '';
    }
    if (bodyEl) {
      bodyEl.style.paddingTop = '';
    }
  }
  let bodyHtml = art.fullContent || art.content || '';
  if (art.imgCaption) {
    bodyHtml = `<p style="font-size:12px;color:var(--text-light);margin-top:-24px;margin-bottom:24px;text-align:center">${art.imgCaption}</p>` + bodyHtml;
  }
  // 抽出 fullContent 結尾的 link-group（內嵌來源按鈕），稍後放在「適用情境」之後渲染，避免按鈕在情境列上方
  // 文章可能有多個 link-group（例如同期合報的雙產品比較），只抽「最後一個且位於結尾」的那個
  let trailingLinkGroup = '';
  {
    const lgOpenRe = /<div[^>]*class=["'][^"']*\blink-group\b[^"']*["'][^>]*>/gi;
    let lastOpen = null, m;
    while ((m = lgOpenRe.exec(bodyHtml)) !== null) {
      lastOpen = { idx: m.index, len: m[0].length };
    }
    if (lastOpen) {
      let depth = 1, p = lastOpen.idx + lastOpen.len;
      while (depth > 0 && p < bodyHtml.length) {
        const o = bodyHtml.indexOf('<div', p);
        const c = bodyHtml.indexOf('</div>', p);
        if (c < 0) break;
        if (o >= 0 && o < c) { depth++; p = o + 4; }
        else { depth--; p = c + 6; }
      }
      // 只在 link-group 真的位於文章結尾時才抽（後面只剩 wrapper 收尾標籤跟空白），中段的 link-group 維持原位
      if (depth === 0 && /^(\s|<\/(?:div|section|article)>)*$/.test(bodyHtml.slice(p))) {
        trailingLinkGroup = bodyHtml.slice(lastOpen.idx, p);
        // 從中間摳掉這段 link-group，保留外層 wrapper 的開合對稱
        bodyHtml = bodyHtml.slice(0, lastOpen.idx).replace(/\s+$/, '') + bodyHtml.slice(p);
      }
    }
  }

  // 推導外連結：sourceUrl 為主，舊期電子報文章一律加上「閱讀電子報原始文章」備援連結
  let externalUrl = art.sourceUrl;
  let externalLabel = art.sourceLabel || '原文連結 →';
  let isLegacyLink = false;
  let legacyFallbackUrl = null;
  if (art.url && /\/issues\/[^/#]+\.html/.test(art.url)) {
    const path = art.url.startsWith('/') ? art.url : '/' + art.url;
    legacyFallbackUrl = 'https://ainews.tvbs.ai' + path;
    isLegacyLink = true;
  }
  // 若 fullContent 已內嵌 news-link 按鈕，sourceUrl 與其重複；以內嵌版為主
  const hasInlineSourceLink = /class=["'][^"']*news-link/.test(art.fullContent || '');
  if (hasInlineSourceLink) externalUrl = null;
  if (art.source === '趨勢總覽') {
    // 適用情境 + 資料來源 並列同一行（日期已在 title 下方顯示，不再重複）
    const sourceLinkHtml = externalUrl ? `<span style="margin-left:auto; color:var(--text-light); font-size:12px;">（<a href="${externalUrl}" target="_blank" style="color:var(--text-light); text-decoration:underline; transition:color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-light)'">資料來源</a>）</span>` : ``;
    const tagsInline = (art.tags && art.tags.length > 0)
      ? `<span class="summary-tags-label">適用情境：</span>${sortUsecaseTags(art.tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}`
      : '';
    if (tagsInline || sourceLinkHtml) {
      bodyHtml += `<div class="summary-tags-row" style="margin-top:20px;">${tagsInline}${sourceLinkHtml}</div>`;
    }
  } else {
    // 適用情境行（原生 + 舊期重點趨勢都顯示，在「閱讀原文」按鈕之前）
    if ((art.isNative || isLegacyLink) && art.tags && art.tags.length > 0) {
      bodyHtml += `<div class="summary-tags-row" style="margin-top:24px;">
        <span class="summary-tags-label">適用情境：</span>
        ${sortUsecaseTags(art.tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}
      </div>`;
    }
    // 從 fullContent 抽出來的內嵌 link-group（接在適用情境之後）
    if (trailingLinkGroup) {
      bodyHtml += trailingLinkGroup;
    }
    // 原生文章：有框框的按鈕（sourceUrl 來自 articles.json，無內嵌 news-link）
    if (externalUrl) {
      bodyHtml += `<p style="margin-top:32px;text-align:center"><a href="${externalUrl}" target="_blank" class="issue-hero-btn" style="padding:9px 18px; font-size:14px; display:inline-block; text-decoration:none;">${externalLabel}</a></p>`;
    }
    // 舊期電子報文章：永遠保留「閱讀電子報原始文章」備援連結（即使已有 sourceUrl 或內嵌 news-link）
    if (legacyFallbackUrl) {
      bodyHtml += `<p style="margin-top:32px;text-align:center"><a href="${legacyFallbackUrl}" target="_blank" class="legacy-source-link">閱讀電子報原始文章</a></p>`;
    }
  }
  // 延伸閱讀：依文章類型決定推薦池
  //   重點趨勢（原生/legacy）→ 全部三類
  //   Prompt 技巧 → 只推 Prompt
  //   AI 工具介紹 → Prompt + 工具
  //   10 秒看趨勢 → 只推 10 秒看趨勢（無封面圖，以文字卡呈現）
  // 本次瀏覽看過的文章不再重複出現（刷新頁面重置）
  window.__viewedTitles = window.__viewedTitles || new Set();
  window.__viewedTitles.add(art.title);
  const isPromptArt = art.source === 'Prompt 技巧分享' || art.kind === 'prompt';
  const isToolIntroArt = art.kind === 'tool-intro';
  const isSummaryArt = art.source === '趨勢總覽' || art.kind === 'summary';
  if (art.isNative || isLegacyLink || isPromptArt || isToolIntroArt || isSummaryArt) {
    const articlesArr = Array.isArray(window.__articles) ? window.__articles : [];
    const promptsArr = Array.isArray(window.__prompts) ? window.__prompts.map(p => ({
      title: p.title, image: p.image, tag: p.tag || 'Prompt', date: p.date
    })) : [];
    const toolsArr = Array.isArray(window.__toolIntros) ? window.__toolIntros
      .filter(t => t.content || t.openInModal)
      .map(t => ({
        title: t.title, image: t.image, tag: t.tag || 'AI 工具介紹', date: t.date
      })) : [];
    const summariesArr = Array.isArray(window.__weeklySummaries) ? window.__weeklySummaries.map(s => ({
      title: s.title, tag: s.tag || '趨勢摘要', date: s.date
    })) : [];
    // Prompt / 工具介紹 同類優先：自己類用滿才從其他類遞補；重點趨勢、10 秒看趨勢維持原本邏輯
    const filterUnviewed = arr => arr.filter(a => !window.__viewedTitles.has(a.title));
    const byDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '');
    let candidates;
    if (isPromptArt) {
      const own = filterUnviewed(promptsArr).sort(byDateDesc);
      const fallback = filterUnviewed([...toolsArr, ...articlesArr]).sort(byDateDesc);
      candidates = [...own, ...fallback];
    } else if (isToolIntroArt) {
      const own = filterUnviewed(toolsArr).sort(byDateDesc);
      const fallback = filterUnviewed([...promptsArr, ...articlesArr]).sort(byDateDesc);
      candidates = [...own, ...fallback];
    } else if (isSummaryArt) {
      candidates = filterUnviewed(summariesArr).sort(byDateDesc);
    } else {
      // 重點趨勢（原生 + legacy）：全 3 類混合，純粹用日期排
      candidates = filterUnviewed([...articlesArr, ...promptsArr, ...toolsArr]).sort(byDateDesc);
    }
    const others = candidates.slice(0, 3);
    if (others.length > 0) {
      const relatedHtml = others.map(a => {
        const titleEnc = encodeURIComponent(a.title).replace(/'/g, "%27");
        const onclick = `event.stopPropagation();showArticleByTitle(decodeURIComponent('${titleEnc}'))`;
        if (isSummaryArt) {
          // 10 秒看趨勢：橫排單欄列表，依序顯示日期 → 分類 → 標題
          return `
            <div class="related-card related-card--row" onclick="${onclick}">
              <span class="related-date">${a.date || ''}</span>
              <span class="related-tag">${a.tag || ''}</span>
              <h5 class="related-title">${a.title}</h5>
            </div>`;
        }
        return `
          <div class="related-card" onclick="${onclick}">
            <div class="related-cover" style="background-image:url('${a.image}')"></div>
            <div class="related-info">
              <span class="related-tag">${a.tag || ''}</span>
              <h5 class="related-title">${a.title}</h5>
              <span class="related-date">${a.date || ''}</span>
            </div>
          </div>`;
      }).join('');
      const gridClass = isSummaryArt ? 'related-grid related-grid--list' : 'related-grid';
      bodyHtml += `
        <div class="related-articles">
          <h4 class="related-heading">延伸閱讀</h4>
          <div class="${gridClass}">${relatedHtml}</div>
        </div>`;
    }
  }
  document.getElementById('amBodyContent').innerHTML = bodyHtml;
  // 標記文章底部最後一組 link-group 為「橫排」樣式，文章中段的維持垂直
  const linkGroups = document.querySelectorAll('#amBodyContent .link-group');
  if (linkGroups.length > 0) {
    linkGroups[linkGroups.length - 1].classList.add('link-group-bottom');
  }
  const metaEl = document.getElementById('amMeta');
  if (metaEl) {
    metaEl.style.display = 'none';
  }
  const footerEl = document.querySelector('.am-footer');
  if (footerEl) footerEl.style.display = 'none';
  document.querySelector('.am-body').style.paddingBottom = '40px';
  const modal = document.getElementById('articleModal');
  modal.classList.add('active');
  // 重置 modal 內各個可滾動容器到頂部（避免沿用上一篇的滾動位置）
  modal.scrollTop = 0;
  const modalBox = modal.querySelector('.article-modal');
  if (modalBox) modalBox.scrollTop = 0;
  const bodyScroll = modal.querySelector('.am-body');
  if (bodyScroll) bodyScroll.scrollTop = 0;

  // 同步網址 hash，讓開啟的文章可被分享／書籤（依資料源選對應 prefix）
  // 只有具 id 的原生資料才設；舊期/無 id 文章維持原網址。用 replaceState 不觸發 hashchange、避免迴圈
  if (art.id) {
    let prefix = 'article-';
    if (art.kind === 'summary') prefix = 'summary-';
    else if (art.kind === 'tool-intro') prefix = 'tool-';
    else if (art.kind === 'prompt') prefix = 'prompt-';
    const newHash = '#' + prefix + art.id;
    if (location.hash !== newHash) {
      history.replaceState(null, '', location.pathname + location.search + newHash);
    }
  }

  // GA4: 追蹤文章瀏覽
  if (typeof gtag === 'function') {
    gtag('event', 'article_view', {
      article_title: art.title,
      article_tag: art.tag || '',
      article_source: art.source || ''
    });
  }
}

function showArticleByTitle(title) {
  if (!title) return;
  const cleanTitle = title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();
  // 優先匹配完全一致的標題
  let item = searchIndex.find(it => it.title === title);
  // 次之匹配不含 Emoji 的純文字部分
  if (!item) item = searchIndex.find(it => it.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim() === cleanTitle);
  // 再者匹配包含關係
  if (!item) item = searchIndex.find(it => it.title.includes(cleanTitle) || cleanTitle.includes(it.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim()));

  if (item) {
    showArticle(item);
  } else {
    for (let k in articleData) {
      const art = articleData[k];
      if (art.title === title || art.title.includes(cleanTitle)) {
        showArticle(k);
        return;
      }
    }
  }
}

// 依 id 開啟文章 modal（給 email deep-link 用）
function showArticleById(id) {
  if (!id) return false;
  const item = searchIndex.find(it => it.id === id);
  if (item) { showArticle(item); return true; }
  return false;
}

// 從 hash 取出 deep-link id（4 個 prefix 對應 4 種資料來源）
// #article-* → articles.json / #summary-* → weekly-summaries.json
// #tool-*    → tool-intro.json / #prompt-*  → prompt-tips.json
// id 在四個資料源全站共用同一命名空間，prefix 只用於語意分類 + 舊 email 相容
function getArticleHash() {
  const h = location.hash.slice(1);
  const prefixes = ['article-', 'summary-', 'tool-', 'prompt-'];
  for (const p of prefixes) {
    if (h.indexOf(p) === 0) return h.slice(p.length);
  }
  return null;
}

function closeArticle() {
  document.getElementById('articleModal').classList.remove('active');
  // 若 hash 是 article-xxx，關閉時清掉（避免重新整理又跳出）
  if (getArticleHash()) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}
function renderArchive(f) {
  const g = document.getElementById('archiveGrid'); if (!g || !issuesData.length) return;
  const filtered = issuesData.filter(it => !f || f === 'all' || it.year === f);
  g.innerHTML = filtered.map(it => {
    const cv = it.img ? `background-image:url('${it.img}')` : 'background:linear-gradient(135deg,#5b5bd6,#4848b8)';
    const isSpecial = !/^\d+$/.test(it.no);
    const issueLabel = isSpecial ? `${it.date}` : `第 ${it.no} 期 ・ ${it.date}`;
    return `
      <div class="archive-card" onclick="window.open('tvbs-ai-newsletter/issues/${it.no}.html','_blank')">
        <div class="cover" style="${cv}"></div>
        <div class="body">
          <div class="issue-num">${issueLabel}</div>
          <h4>${it.title}</h4>
          <div class="desc" style="font-size:12px;color:var(--text-light);margin-top:8px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${it.desc || ''}</div>
          <div class="foot" style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-light)">
            <span>${it.date}</span>
            <span style="color:var(--primary);font-weight:600">閱讀 →</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

var issuesData = [];
async function initDashboardData() {

  try {
    const results = await Promise.all([
      fetch('tvbs-ai-newsletter/issues-metadata.json').then(r => r.json()),
      fetch('tvbs-ai-newsletter/search-index.json').then(r => r.json()),
      fetch('data/articles.json').then(r => r.ok ? r.json() : { items: [] }).then(d => d.items || []).catch(() => []),
      fetch('data/weekly-summaries.json').then(r => r.ok ? r.json() : { items: [] }).then(d => d.items || []).catch(() => []),
      fetch('data/tool-intro.json').then(r => r.ok ? r.json() : { items: [] }).then(d => d.items || []).catch(() => []),
      fetch('data/prompt-tips.json').then(r => r.ok ? r.json() : { items: [] }).then(d => d.items || []).catch(() => [])
    ]);
    issuesData = results[0] || [];
    searchIndex = results[1] || [];

    // 文章流（article-centric, 取代每期 JSON）
    const articles = (results[2] || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    window.__articles = articles;
    articles.forEach(a => {
      searchIndex.push({
        title: a.title,
        id: a.id,
        content: a.summary || '',
        fullContent: a.content || '',
        url: `/article-${a.id}`,
        isNative: true,
        img: a.image,
        tag: a.tag,
        tags: a.tags || [],
        date: a.date,
        source: 'TVBS AI 知識庫',
        sourceUrl: a.sourceUrl,
        sourceLabel: a.sourceLabel,
        imgCaption: a.imageCaption
      });
    });

    const fallbackImg = articles[0] ? articles[0].image : '';

    if (issuesData.length > 0 || articles.length > 0) {
      // Weekly Summaries
      const summaries = (results[3] || []).slice();
      summaries.sort((a, b) => new Date(b.date) - new Date(a.date));
      window.__weeklySummaries = summaries;
      summaries.forEach(s => {
        searchIndex.push({
          title: s.title,
          id: s.id,
          content: s.summary || '',
          fullContent: `<p class="first-paragraph">${s.summary || ''}</p>`,
          url: s.sourceUrl || `/summaries#${s.id}`,
          img: s.img || fallbackImg,
          tag: s.tag || '趨勢摘要',
          tags: s.tags || [],
          date: s.date,
          source: '趨勢總覽',
          sourceUrl: s.sourceUrl,
          sourceLabel: '資料來源 →',
          kind: 'summary'
        });
      });

      // AI 工具介紹 (含有完整內容的加入索引)
      const toolIntros = results[4] || [];
      window.__toolIntros = toolIntros;
      toolIntros.forEach(t => {
        if (t.content || t.openInModal) {
          searchIndex.push({
            title: t.title,
            id: t.id,
            content: t.sub || '',
            fullContent: t.content || '',
            url: t.sourceUrl || `/tools#${t.issue}`,
            img: t.image || fallbackImg,
            tag: t.tag || '新工具',
            date: t.date || (t.issue ? `第 ${t.issue} 期` : ''),
            source: t.issue ? `TVBS AI Newsletter 第 ${t.issue} 期` : 'AI 工具介紹',
            sourceUrl: t.sourceUrl,
            sourceLabel: t.sourceLabel,
            imgCaption: t.imageCaption,
            kind: 'tool-intro'
          });
        }
      });

      // Prompt 技巧分享：跟 articles 一樣走 modal
      const prompts = (results[5] || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      window.__prompts = prompts;
      prompts.forEach(p => {
        searchIndex.push({
          title: p.title,
          id: p.id,
          content: p.summary || '',
          fullContent: p.content || '',
          url: `/article-${p.id}`,
          img: p.image,
          tag: p.tag || 'Prompt',
          tags: p.tags || [],
          date: p.date,
          source: 'Prompt 技巧分享',
          sourceUrl: p.sourceUrl,
          sourceLabel: p.sourceLabel,
          imgCaption: p.imageCaption,
          kind: 'prompt'
        });
      });
      // 用最新文章的 metadata 當 home 的 'issue' 代理
      const latestArt = articles[0];
      const issue = latestArt ? {
        no: '最新',
        date: latestArt.date || '',
        title: latestArt.title,
        desc: latestArt.summary,
        img: latestArt.image
      } : (issuesData.find(it => it.no === "018") || issuesData[0]);

      // Document Reader Overview: 月份 meta + 趨勢數量 + 關鍵字 chips
      const articlesArr = articles || [];
      const summariesArr = window.__weeklySummaries || [];
      const overviewSource = [...articlesArr, ...summariesArr];

      // 期間 meta — 從首頁所有文章 + 10秒趨勢的日期推算「最舊 ～ 最新」
      const readerMetaEl = document.getElementById('readerIssueMeta');
      if (readerMetaEl) {
        const allDates = overviewSource.map(it => it.date).filter(Boolean)
          .sort((a, b) => b.localeCompare(a));
        const parseDate = (d) => {
          const m = d && d.match(/(\d{4})[\-.\/](\d{1,2})[\-.\/](\d{1,2})/);
          return m ? {
            y: m[1],
            m: String(parseInt(m[2], 10)).padStart(2, '0'),
            d: String(parseInt(m[3], 10)).padStart(2, '0')
          } : null;
        };
        const oldest = parseDate(allDates[allDates.length - 1]);
        const newest = parseDate(allDates[0]);
        if (oldest && newest) {
          const oldStr = `${oldest.y}.${oldest.m}.${oldest.d}`;
          const newStr = `${newest.y}.${newest.m}.${newest.d}`;
          if (oldStr === newStr) {
            readerMetaEl.textContent = newStr;
          } else {
            const sameYear = oldest.y === newest.y;
            const newDisplay = sameYear ? `${newest.m}.${newest.d}` : newStr;
            readerMetaEl.textContent = `${oldStr} ～ ${newDisplay}`;
          }
        }
      }

      const heroContainer = document.getElementById('latestHeroContainer');
      // 首頁大圖候選池：articles + tool-intro 兩邊 featured: true 合併，按日期 desc 全部呈現
      // 版型：雜誌式 1+2+4 —— 1 張主圖 + 右上 2 張疊卡 + 下方一排其餘小卡
      const articleSlides = articles.filter(a => a.featured).map(a => ({
        image: a.image, tag: a.tag || getTag(a.title), title: a.title, summary: a.summary || '', date: a.date || '', type: 'article'
      }));
      const toolSlides = toolIntros.filter(t => t.featured).map(t => ({
        image: t.image, tag: 'AI 工具介紹', title: t.title, summary: t.summary || t.sub || '', date: t.date || '', type: 'tool'
      }));
      const featuredSlides = [...articleSlides, ...toolSlides]
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      if (heroContainer) {
        if (featuredSlides.length >= 1) {
          const [main, ...rest] = featuredSlides;
          const smallCard = a => `
            <div class="hero-small" style="background-image:linear-gradient(180deg,rgba(10,18,40,0.1),rgba(10,18,40,0.85)),url('${a.image}')" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(a.title).replace(/'/g, "%27")}'))">
              <div class="hero-small-content">
                <span class="slide-tag${a.type === 'tool' ? ' slide-tag--tool' : ''}">${a.tag}</span>
                <h3 class="hero-small-title">${a.title}</h3>
              </div>
            </div>`;
          const sideCards = rest.slice(0, 2).map(smallCard).join('');
          const bottomCards = rest.slice(2).map(smallCard).join('');
          heroContainer.innerHTML = `
            <div class="hero-grid">
              <div class="hero-main" style="background-image:linear-gradient(180deg,rgba(10,18,40,0.05) 0%,rgba(10,18,40,0.3) 50%,rgba(10,18,40,0.9) 100%),url('${main.image}')" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(main.title).replace(/'/g, "%27")}'))">
                <div class="hero-main-content">
                  <span class="slide-tag${main.type === 'tool' ? ' slide-tag--tool' : ''}">${main.tag}</span>
                  <h2 class="hero-main-title">${main.title}</h2>
                </div>
              </div>
              <div class="hero-side">
                ${sideCards}
              </div>
            </div>
            ${bottomCards ? `<div class="hero-bottom">${bottomCards}</div>` : ''}`;
        } else {
          // 舊版：單張封面卡（沒原生內容時 fallback）
          heroContainer.innerHTML = `<div onclick="switchTab('news')" style="text-decoration:none; cursor:pointer">
            <div class="issue-hero">
              <div class="issue-hero-cover" style="background-image:linear-gradient(135deg,rgba(94,245,255,0.12),rgba(77,159,255,0.05)),url('${issue.img}')"></div>
              <div class="issue-hero-body">
                <div class="issue-hero-meta">第 ${issue.no} 期 · ${issue.date}</div>
                <h2 class="issue-hero-title">${issue.title}</h2>
                <p class="issue-hero-desc">${issue.desc || ''}</p>
                <span class="issue-hero-btn">閱讀完整內容 →</span>
              </div>
            </div></div>`;
        }
      }
      // 最新文章 TOC：上區塊 articles 最多 3 篇、下區塊 tool-intro 最多 1 篇，中間分隔線
      let articleTocItems, toolIntroTocItems;
      if (latestArt) {
        articleTocItems = articles
          .slice()
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
          .slice(0, 3);
        toolIntroTocItems = toolIntros
          .filter(t => t.content || t.openInModal)
          .slice()
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
          .slice(0, 1);
      } else {
        articleTocItems = searchIndex
          .filter(it => it.url && it.url.includes(`${issue.no}.html`))
          .slice(0, 3);
        toolIntroTocItems = [];
      }

      const renderTocItem = (item, isToolIntro) => {
        const cleanTitle = item.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();
        const displayTitle = isToolIntro
          ? `<span class="toc-prefix-tool">[AI工具介紹]</span> ${cleanTitle}`
          : cleanTitle;
        return `
          <div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(item.title).replace(/'/g, "%27")}'))" class="toc-item">
            <span class="toc-dot"></span>
            <span class="toc-title">${displayTitle}</span>
          </div>`;
      };

      const renderMoreLink = (page) => `
        <div style="margin-top: 6px; display: flex; justify-content: flex-end;">
          <a href="javascript:void(0)" onclick="switchTab('${page}')"
            style="font-size: 12px; color: var(--accent); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;"
            onmouseover="this.style.filter='brightness(1.2)'; this.style.transform='translateX(4px)'"
            onmouseout="this.style.filter='none'; this.style.transform='none'">看更多 →</a>
        </div>`;

      const tocWrap = document.getElementById('latestIssueTOC');
      if (tocWrap) {
        const articlesHtml = articleTocItems
          .filter(it => !it.title.includes('本期重點摘要') && !it.title.includes('科技精選新聞'))
          .map(it => renderTocItem(it, false))
          .join('');
        const toolHtml = toolIntroTocItems.map(it => renderTocItem(it, true)).join('');
        const bottomMore = (articlesHtml || toolHtml) ? renderMoreLink('news') : '';
        tocWrap.innerHTML = articlesHtml + toolHtml + bottomMore;
      }

      // 渲染重點摘要 (Homepage) — 垂直 stacked 卡片
      const summariesWrap = document.getElementById('weeklySummariesWrap');
      if (summariesWrap && Array.isArray(window.__weeklySummaries) && window.__weeklySummaries.length > 0) {
        const limit = HOME_WEEKLY_SUMMARIES_LIMIT;
        const list = limit ? window.__weeklySummaries.slice(0, limit) : window.__weeklySummaries;
        summariesWrap.innerHTML = list.map(it => renderSummaryItem(it, { showSummary: true })).join('');
      }
      // 渲染重點摘要 (Sidebar)
      const trendSidebarWrap = document.getElementById('latestTrendsSidebarTOC');
      if (trendSidebarWrap && Array.isArray(window.__weeklySummaries)) {
        trendSidebarWrap.innerHTML = window.__weeklySummaries.slice(0, 6).map(s => `
          <div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(s.title).replace(/'/g, "%27")}'))" class="toc-item">
            <span class="toc-dot"></span>
            <span class="toc-title">${s.title}</span>
          </div>
        `).join('');
      }

      // 5. AI 趨勢消息卡片牆 (Trend Grid) — 原生文章在前，舊期 010+ 在後
      const trendWrap = document.getElementById('trendGrid');
      if (trendWrap) {
        const nativeTrendItems = searchIndex
          .filter(it => it.isNative)
          .filter(it => !it.title.match(/[🛠️💡🧩🌟]/) && !it.title.includes('重點摘要') && !it.title.includes('精選新聞'))
          .filter(it => !it.excludeFromTrend)
          .map(it => ({ ...it, issueDetail: null }));

        const legacyNos = issuesData
          .map(it => it.no)
          .filter(no => /^\d+$/.test(no))
          .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

        const legacyTrendItems = legacyNos.flatMap(no => {
          const iss = issuesData.find(it => it.no === no) || { no, date: '', img: '' };
          return searchIndex
            .filter(it => it.url && it.url.includes(`${no}.html`))
            .filter(it => !it.title.match(/[🛠️💡🧩🌟]/) && !it.title.includes('重點摘要') && !it.title.includes('精選新聞'))
            .filter(it => !it.excludeFromTrend)
            .reverse()
            .map(it => ({ ...it, issueDetail: iss }));
        });

        const trendItems = [...nativeTrendItems, ...legacyTrendItems];

        trendWrap.innerHTML = trendItems.map(it => {
          const iss = it.issueDetail;
          const isNative = it.isNative;
          const artImg = it.img || (iss && iss.img) || 'https://i.meee.com.tw/zg5kCCS.webp';
          // 新文章顯示日期，舊期顯示期號 + 日期
          let metaLeft, metaRight;
          if (isNative) {
            metaLeft = it.date || '';
            metaRight = '';
          } else {
            metaLeft = `第 ${iss.no} 期`;
            metaRight = iss.date || '';
          }
          const useCaseTags = (it.tags || []).join(',');
          const resolvedTag = it.tag || getTag(it.title);
          const usecaseHtml = (it.tags && it.tags.length) ? `
              <div class="summary-tags-row">
                <span class="summary-tags-label">適用情境：</span>
                ${sortUsecaseTags(it.tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}
              </div>` : '';
          return `
            <div class="article-card" data-content-tag="${resolvedTag}" data-usecase-tags="${useCaseTags}" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(it.title).replace(/'/g, "%27")}'))">
              <div class="article-cover" style="background-image:url('${artImg}')"></div>
              <span class="tag">${resolvedTag}</span>
              <h4>${it.title}</h4>
              <div class="summary">${it.content || ''}</div>
              ${usecaseHtml}
              <div class="article-meta">
                <span>${metaLeft}</span>
                <span>${metaRight}</span>
              </div>
            </div>
          `;
        }).join('');
      }
      // 6. 重點摘要列表 (Trend Summaries List) — 緊湊橫向列表
      const trendSummariesWrap = document.getElementById('trendSummariesList');
      if (trendSummariesWrap && Array.isArray(window.__weeklySummaries)) {
        trendSummariesWrap.innerHTML = window.__weeklySummaries.map(it => renderSummaryItem(it, { compact: true })).join('');
      }

      // 初始化兩個分頁的雙層 filter
      initDualFilter('trendFilters', '#trendGrid', '.article-card');
      initDualFilter('summariesFilters', '#trendSummariesList', '.summary-list-item');
      // Prompt 技巧分享：單層 filter（手機版同樣 dropdown）
      initSingleFilter('.prompt-filters', { label: '分類：', defaultValue: '全部', onChange: function (v) { renderPrompts(v); } });
    }
  } catch (err) { console.warn('Fetch failed', err); }
}

// 雙層 chip filter：自動掃描 data-content-tag / data-usecase-tags 產生 chips，
// 點擊套用 AND 篩選，「全部」清除該排
// 適用情境 tag 的顯示順序（指定排列，沒在這裡列的會排到最後）
// 統一渲染「10 秒看趨勢」列表項目 — 垂直 stacked layout
function renderSummaryItem(it, opts) {
  opts = opts || {};
  const contentTag = it.tag || (typeof getTag === 'function' ? getTag(it.title) : '');
  const tags = (it.tags && it.tags.length) ? it.tags : [];
  const tagsHtml = tags.length ? `
    <div class="summary-tags-row">
      <span class="summary-tags-label">適用情境：</span>
      ${sortUsecaseTags(tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}
    </div>` : '';
  const titleEnc = encodeURIComponent(it.title).replace(/'/g, "%27");
  const onclick = `onclick="showArticleByTitle(decodeURIComponent('${titleEnc}'))"`;

  // 緊湊版：tag + 日期在標題上方，標題獨佔整行寬度
  if (opts.compact) {
    return `
      <div class="summary-list-item summary-list-item--compact" data-content-tag="${it.tag || ''}" data-usecase-tags="${(it.tags || []).join(',')}" ${onclick}>
        <div class="sli-compact-body">
          <div class="sli-meta">
            <span class="feed-tag">${contentTag}</span>
            <span class="sli-date">${it.date || ''}</span>
          </div>
          <h4 class="sli-title">${it.title}</h4>
          ${tagsHtml}
        </div>
        <span class="chevron-icon">›</span>
      </div>
    `;
  }

  // Stacked 卡片版（首頁用）
  const summaryHtml = opts.showSummary && it.summary
    ? `<p class="sli-summary">${it.summary}</p>` : '';
  return `
    <div class="summary-list-item" data-content-tag="${it.tag || ''}" data-usecase-tags="${(it.tags || []).join(',')}" ${onclick}>
      <div class="sli-body">
        <div class="sli-meta">
          <span class="feed-tag">${contentTag}</span>
          <span class="sli-date">${it.date || ''}</span>
        </div>
        <h4 class="sli-title">${it.title}</h4>
        ${summaryHtml}
        ${tagsHtml}
      </div>
      <span class="chevron-icon">›</span>
    </div>
  `;
}

const USECASE_TAG_ORDER = [
  '圖像生成', '影片製作', '聲音處理', '寫作協助', '即時翻譯',
  '自動化', '工作流整合', '整理資料', '簡報設計', '資料研究',
  '程式設計', '訪談記錄', '觀念學習'
];

const CONTENT_TAG_ORDER = [
  '模型發布', '新工具', '新功能', '應用技巧', '產業動態', '法律規範'
];

// 首頁「10 秒看趨勢」顯示篇數上限。null = 不限制（全部顯示），數字 = 顯示最新 N 篇。
// 未來想限制時，改成數字即可（例如 HOME_WEEKLY_SUMMARIES_LIMIT = 8）。
const HOME_WEEKLY_SUMMARIES_LIMIT = null;

function sortUsecaseTags(tags) {
  return (tags || []).slice().sort((a, b) => {
    const ia = USECASE_TAG_ORDER.indexOf(a);
    const ib = USECASE_TAG_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

// 鎖/解鎖背景 body 滾動（panel 開啟時用）— iOS-safe：用 position:fixed 鎖位置，關閉時還原 scrollY
function lockBodyScroll() {
  if (document.body.dataset.scrollLocked != null) return;
  const scrollY = window.scrollY;
  document.body.dataset.scrollLocked = String(scrollY);
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
}
function unlockBodyScroll() {
  if (document.body.dataset.scrollLocked == null) return;
  const scrollY = parseInt(document.body.dataset.scrollLocked, 10) || 0;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  delete document.body.dataset.scrollLocked;
  window.scrollTo(0, scrollY);
}

function initDualFilter(filterContainerId, gridSelector, itemSelector) {
  const filterContainer = document.getElementById(filterContainerId);
  const grid = document.querySelector(gridSelector);
  if (!filterContainer || !grid) return;
  const items = Array.from(grid.querySelectorAll(itemSelector));
  if (items.length === 0) return;

  const contentTags = new Set();
  const usecaseTags = new Set();
  items.forEach(item => {
    const c = item.dataset.contentTag;
    if (c) contentTags.add(c);
    (item.dataset.usecaseTags || '').split(',').filter(Boolean).forEach(t => usecaseTags.add(t));
  });

  // 適用情境依預定義順序排列
  const sortedUsecase = Array.from(usecaseTags).sort((a, b) => {
    const ia = USECASE_TAG_ORDER.indexOf(a);
    const ib = USECASE_TAG_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  // 內容屬性依預定義順序排列
  const sortedContent = Array.from(contentTags).sort((a, b) => {
    const ia = CONTENT_TAG_ORDER.indexOf(a);
    const ib = CONTENT_TAG_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  // 桌機：原本 chip 版（保留原本 UX）
  const renderChipRow = (label, tags, type) => {
    const chipsHtml = ['<button class="chip active" data-filter="全部" data-type="' + type + '">全部</button>']
      .concat(Array.from(tags).map(t => `<button class="chip" data-filter="${t}" data-type="${type}">${t}</button>`))
      .join('');
    return `<div class="filter-row"><span class="filter-label">${label}</span><div class="chips">${chipsHtml}</div></div>`;
  };
  // 手機 panel：跟桌機同樣 chip 概念，但每顆 chip 觸控區更大、active 顯著
  const renderMobileChipRow = (label, tags, type) => {
    const chipsHtml = ['<button class="filter-option-chip active" type="button" data-filter="全部" data-type="' + type + '">全部</button>']
      .concat(Array.from(tags).map(t => `<button class="filter-option-chip" type="button" data-filter="${t}" data-type="${type}">${t}</button>`))
      .join('');
    return `<div class="filter-row filter-row--stack"><span class="filter-label">${label}</span><div class="filter-option-chips">${chipsHtml}</div></div>`;
  };

  filterContainer.innerHTML = `
    <div class="filter-chips-wrap">
      ${renderChipRow('內容屬性：', sortedContent, 'content')}
      ${renderChipRow('適用情境：', sortedUsecase, 'usecase')}
    </div>
    <div class="filter-mobile-wrap">
      <button class="filter-toggle" type="button">
        <span class="filter-toggle-label">分類篩選</span>
        <span class="filter-toggle-arrow">▾</span>
      </button>
      <div class="filter-panel">
        ${renderMobileChipRow('內容屬性', sortedContent, 'content')}
        ${renderMobileChipRow('適用情境', sortedUsecase, 'usecase')}
      </div>
    </div>
  `;

  const toggleBtn = filterContainer.querySelector('.filter-toggle');
  const panel = filterContainer.querySelector('.filter-panel');
  // 按鈕進 h2 wrapper；panel 直接接到 body，徹底脫離 .page（有 transform 動畫）的 containing block / stacking context
  const pageEl = filterContainer.closest('.page');
  const pageHeader = pageEl && pageEl.querySelector('.page-header');
  const pageH2 = pageHeader && pageHeader.querySelector('h2');
  if (pageH2 && toggleBtn) {
    const filterWrap = document.createElement('span');
    filterWrap.className = 'filter-toggle-wrap';
    filterWrap.appendChild(toggleBtn);
    pageH2.appendChild(filterWrap);
  }
  if (panel) {
    panel.classList.add('filter-panel--floating');
    document.body.appendChild(panel);
  }
  // page-header 底線下方放一行篩選提示（含右側清除 ✕），有選分類才顯示
  let hintEl = null;
  let hintTextEl = null;
  let hintClearEl = null;
  if (pageHeader && pageHeader.parentNode) {
    hintEl = document.createElement('div');
    hintEl.className = 'filter-active-hint';
    hintEl.hidden = true;
    hintEl.innerHTML = '<span class="filter-active-hint-text"></span><button class="filter-active-hint-clear" type="button" aria-label="清除篩選">✕</button>';
    pageHeader.parentNode.insertBefore(hintEl, pageHeader.nextSibling);
    hintTextEl = hintEl.querySelector('.filter-active-hint-text');
    hintClearEl = hintEl.querySelector('.filter-active-hint-clear');
  }
  // 開 panel 時用 button rect 算 fixed 座標 + 動態 max-height（剩餘 viewport 高度），脫離 h2/wrapper/page 任何 stacking context 干擾
  const positionPanel = () => {
    if (!toggleBtn || !panel) return;
    const rect = toggleBtn.getBoundingClientRect();
    const top = rect.bottom + 6;
    panel.style.top = top + 'px';
    panel.style.right = (window.innerWidth - rect.right) + 'px';
    panel.style.maxHeight = (window.innerHeight - top - 16) + 'px';
  };
  const openPanel = () => {
    positionPanel();
    panel.classList.add('open');
    toggleBtn.classList.add('open');
    lockBodyScroll();
  };
  const closePanel = () => {
    panel.classList.remove('open');
    toggleBtn.classList.remove('open');
    unlockBodyScroll();
  };
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });
  }
  // 視窗 resize 時才重新定位（保留橫直切換／鍵盤彈出之類的場景）；滾動時不動，panel 凍結在當下位置
  window.addEventListener('resize', () => { if (panel.classList.contains('open')) positionPanel(); });
  // capture-phase 在 click 抵達 target 之前判斷：panel 開著時，點 panel/toggle 外面就 close 並吞掉這次點擊，避免穿透到下方文章卡片
  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  }, true);

  const state = { content: '全部', usecase: '全部' };
  // 同步桌機 chip active state 跟手機 select value（雙向）
  const syncUI = () => {
    ['content', 'usecase'].forEach(type => {
      filterContainer.querySelectorAll(`.chip[data-type="${type}"]`).forEach(c => {
        c.classList.toggle('active', c.dataset.filter === state[type]);
      });
      // 手機 panel 的 option chip active 也要同步
      if (panel) {
        panel.querySelectorAll(`.filter-option-chip[data-type="${type}"]`).forEach(c => {
          c.classList.toggle('active', c.dataset.filter === state[type]);
        });
      }
    });
    const activeCount = (state.content !== '全部' ? 1 : 0) + (state.usecase !== '全部' ? 1 : 0);
    if (toggleBtn) toggleBtn.classList.toggle('active', activeCount > 0);
    // 更新 page-header 下方的篩選提示
    const parts = [];
    if (state.content !== '全部') parts.push(state.content);
    if (state.usecase !== '全部') parts.push(state.usecase);
    if (hintTextEl) hintTextEl.textContent = parts.length > 0 ? '目前篩選分類：' + parts.join('、') : '';
    if (hintEl) hintEl.hidden = parts.length === 0;
  };
  const applyFilter = () => {
    items.forEach(item => {
      const ct = item.dataset.contentTag || '';
      const ut = (item.dataset.usecaseTags || '').split(',').filter(Boolean);
      const cMatch = state.content === '全部' || ct === state.content;
      const uMatch = state.usecase === '全部' || ut.includes(state.usecase);
      item.style.display = (cMatch && uMatch) ? '' : 'none';
    });
    syncUI();
  };

  // hint 右側 ✕：一鍵清掉兩種篩選
  if (hintClearEl) {
    hintClearEl.addEventListener('click', (e) => {
      e.stopPropagation();
      state.content = '全部';
      state.usecase = '全部';
      applyFilter();
    });
  }

  filterContainer.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state[chip.dataset.type] = chip.dataset.filter;
      applyFilter();
    });
  });
  // 手機 panel 的 chip click：跟桌機 chip 同樣邏輯
  if (panel) {
    panel.querySelectorAll('.filter-option-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        state[chip.dataset.type] = chip.dataset.filter;
        applyFilter();
      });
    });
  }

  // 對外公開的重置 API（給 switchTab 用）：切分頁時把篩選 state 清回「全部」
  filterContainer.resetFilter = () => {
    state.content = '全部';
    state.usecase = '全部';
    applyFilter();
    closePanel();
  };

}

// 單層 filter：給 Prompt 技巧分享這類只有一組分類的分頁用
// 桌機保留現存 .chips chip 點擊行為（已有 click handler），這裡額外建立手機版 dropdown 並讓兩邊狀態同步
function initSingleFilter(chipsSelector, options) {
  const chipsEl = document.querySelector(chipsSelector);
  if (!chipsEl) return;
  const chips = Array.from(chipsEl.querySelectorAll('.chip'));
  if (chips.length === 0) return;
  const filters = chips.map(c => c.dataset.filter);
  const defaultValue = options.defaultValue;
  const pageEl = chipsEl.closest('.page');
  const pageHeader = pageEl && pageEl.querySelector('.page-header');
  const pageH2 = pageHeader && pageHeader.querySelector('h2');
  if (!pageH2) return;
  // page-header 底線下方放一行篩選提示（含右側清除 ✕），有選分類才顯示
  let hintEl = null;
  let hintTextEl = null;
  let hintClearEl = null;
  if (pageHeader && pageHeader.parentNode) {
    hintEl = document.createElement('div');
    hintEl.className = 'filter-active-hint';
    hintEl.hidden = true;
    hintEl.innerHTML = '<span class="filter-active-hint-text"></span><button class="filter-active-hint-clear" type="button" aria-label="清除篩選">✕</button>';
    pageHeader.parentNode.insertBefore(hintEl, pageHeader.nextSibling);
    hintTextEl = hintEl.querySelector('.filter-active-hint-text');
    hintClearEl = hintEl.querySelector('.filter-active-hint-clear');
  }

  const wrap = document.createElement('span');
  wrap.className = 'filter-toggle-wrap';
  wrap.innerHTML = `
    <button class="filter-toggle" type="button">
      <span class="filter-toggle-label">分類篩選</span>
      <span class="filter-toggle-arrow">▾</span>
    </button>
    <div class="filter-panel filter-panel--list">
      ${filters.map(f => `<button class="filter-option" type="button" data-filter="${f}">${f}</button>`).join('')}
    </div>
  `;
  pageH2.appendChild(wrap);

  const toggleBtn = wrap.querySelector('.filter-toggle');
  const panel = wrap.querySelector('.filter-panel');
  const optionBtns = Array.from(wrap.querySelectorAll('.filter-option'));
  // panel 搬到 body 脫離 .page transform/stacking 干擾
  if (panel) {
    panel.classList.add('filter-panel--floating');
    document.body.appendChild(panel);
  }

  const positionPanel = () => {
    if (!toggleBtn || !panel) return;
    const rect = toggleBtn.getBoundingClientRect();
    const top = rect.bottom + 6;
    panel.style.top = top + 'px';
    panel.style.right = (window.innerWidth - rect.right) + 'px';
    panel.style.maxHeight = (window.innerHeight - top - 16) + 'px';
  };
  const openPanel = () => { positionPanel(); panel.classList.add('open'); toggleBtn.classList.add('open'); lockBodyScroll(); };
  const closePanel = () => { panel.classList.remove('open'); toggleBtn.classList.remove('open'); unlockBodyScroll(); };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  window.addEventListener('resize', () => { if (panel.classList.contains('open')) positionPanel(); });
  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  }, true);

  // 同步 UI：chip active + filter-option active + 按鈕變色 + page-header 下方提示
  const syncUI = (value) => {
    chips.forEach(c => c.classList.toggle('active', c.dataset.filter === value));
    optionBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === value));
    toggleBtn.classList.toggle('active', value !== defaultValue);
    if (hintTextEl) hintTextEl.textContent = value !== defaultValue ? '目前篩選分類：' + value : '';
    if (hintEl) hintEl.hidden = value === defaultValue;
  };
  // 套用篩選：同步 UI + 觸發 render
  const applyFilter = (value) => {
    syncUI(value);
    if (typeof options.onChange === 'function') options.onChange(value);
  };

  // hint 右側 ✕：一鍵清回預設分類
  if (hintClearEl) {
    hintClearEl.addEventListener('click', (e) => {
      e.stopPropagation();
      applyFilter(defaultValue);
    });
  }

  // 選項按鈕：點擊直接套用 + 收合 panel
  optionBtns.forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      applyFilter(b.dataset.filter);
      closePanel();
    });
  });
  // 桌機 chip click 已有現存 handler 呼叫 render，這裡只額外把 mobile UI 狀態同步
  chips.forEach(c => {
    c.addEventListener('click', () => syncUI(c.dataset.filter));
  });

  // 對外公開的重置 API（給 switchTab 用）
  chipsEl.resetFilter = () => {
    applyFilter(defaultValue);
    closePanel();
  };
}

// ============ Data-driven renderers (B-phase refactor) ============
function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

function toolCardHtml(t, internal) {
  var cls = 'tool-card-big' + (internal ? ' internal-highlight' : '');
  return '<a href="' + escHtml(t.url) + '" target="_blank" class="' + cls + '">'
    + '<div class="tool-icon logo-icon" style="background:' + escHtml(t.iconBg) + '">'
    + '<img src="' + escHtml(t.logo) + '" alt="' + escHtml(t.name) + '">'
    + '</div>'
    + '<div class="tool-info">'
    + '<div class="tool-name">' + escHtml(t.name) + '</div>'
    + '<div class="tool-sub">' + escHtml(t.sub) + '</div>'
    + '</div></a>';
}

function renderTools() {
  var c = document.getElementById('toolsContainer');
  if (!c) return;
  return fetch('data/tools.json').then(function (r) { return r.json(); }).then(function (d) {
    var html = '';
    if (d.internal && d.internal.length) {
      html += '<div class="tool-section"><div class="section-title">公司內部 AI 工具</div><div class="tool-grid">'
        + d.internal.map(function (t) { return toolCardHtml(t, true); }).join('')
        + '</div></div>';
    }
    if (d.categories && d.categories.length) {
      html += '<div class="section-title" style="margin-top:16px">常用外部工具</div>';
      d.categories.forEach(function (cat) {
        html += '<div class="tool-section">'
          + '<div class="tool-section-title">' + escHtml(cat.title) + '</div>'
          + '<div class="tool-grid">'
          + cat.tools.map(function (t) { return toolCardHtml(t, false); }).join('')
          + '</div></div>';
      });
    }
    c.innerHTML = html;
  }).catch(function (e) { console.warn('renderTools failed', e); });
}

function renderToolIntro() {
  var c = document.getElementById('toolIntroContainer');
  if (!c) return;
  return fetch('data/tool-intro.json').then(function (r) { return r.json(); }).then(function (d) {
    var items = (d && d.items) || [];
    // 有 date 的依日期由新到舊排在前面；其餘維持原 JSON 順序（舊期）
    items = items.slice().sort(function (a, b) {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });
    var fallbackImg = 'https://i.meee.com.tw/zg5kCCS.webp';
    c.innerHTML = items.map(function (it) {
      var img = it.image || fallbackImg;
      var metaLeft = it.date
        ? escHtml(it.date)
        : (it.issue ? '第 ' + Number(it.issue) + ' 期' : '');
      var metaRight = it.openInModal ? '閱讀詳情 →' : '閱讀原文 →';
      var inner = '<div class="article-cover" style="background-image:url(\'' + escHtml(img) + '\')"></div>'
        + '<span class="tag">' + escHtml(it.tag) + '</span>'
        + '<h4>' + escHtml(it.title) + '</h4>'
        + '<div class="summary">' + escHtml(it.sub) + '</div>'
        + '<div class="article-meta"><span>' + metaLeft + '</span><span>' + metaRight + '</span></div>';
      if (it.openInModal) {
        var titleEnc = encodeURIComponent(it.title).replace(/'/g, "%27");
        return '<div class="article-card" onclick="showArticleByTitle(decodeURIComponent(\'' + titleEnc + '\'))">' + inner + '</div>';
      }
      return '<a href="' + escHtml(it.url) + '" target="_blank" class="article-card" style="text-decoration:none;color:inherit;display:block">' + inner + '</a>';
    }).join('');
  }).catch(function (e) { console.warn('renderToolIntro failed', e); });
}

function renderPromptSites() {
  var c = document.getElementById('promptSitesContainer');
  if (!c) return;
  // 統一紫色色系，循環 4 種透明度做細微變化
  var PURPLE_TINTS = [
    'rgba(91, 91, 214, 0.06)',
    'rgba(91, 91, 214, 0.10)',
    'rgba(91, 91, 214, 0.14)',
    'rgba(91, 91, 214, 0.18)'
  ];
  return fetch('data/prompt-sites.json').then(function (r) { return r.json(); }).then(function (sections) {
    var siteCounter = 0;
    c.innerHTML = sections.map(function (sec, idx) {
      var topMargin = idx === 0 ? '16px' : '40px';
      return '<h3 class="prompt-sites-heading" style="margin:' + topMargin + ' 0 14px">'
        + escHtml(sec.title) + '</h3>'
        + '<div class="prompt-sites-grid" style="margin-top:14px">'
        + sec.sites.map(function (s) {
          var bg = PURPLE_TINTS[siteCounter % PURPLE_TINTS.length];
          siteCounter++;
          return '<a href="' + escHtml(s.url) + '" target="_blank" class="prompt-site-card">'
            + '<div class="site-icon" style="background:' + bg + ';color:var(--primary)">' + escHtml(s.icon) + '</div>'
            + '<div class="site-info"><div class="site-name">' + escHtml(s.name) + '</div><div class="site-desc">' + escHtml(s.desc) + '</div></div>'
            + '</a>';
        }).join('')
        + '</div>';
    }).join('');
  }).catch(function (e) { console.warn('renderPromptSites failed', e); });
}

document.addEventListener('DOMContentLoaded', () => {
  // 先讀 article hash（email deep-link），有的話保持 home 預設、不動 hash，等資料載入後開 modal
  const initialArticleId = getArticleHash();
  if (!initialArticleId) {
    // URL hash → 立刻切到對應分頁（重新整理保留位置）+ 觸發初次 pageview
    const initialPage = getHashPage() || 'home';
    switchTab(initialPage);
  }

  // GA4: 追蹤外部連結點擊（任何 <a> 連到外部網域都記）
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || typeof gtag !== 'function') return;
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    let url;
    try { url = new URL(href, location.href); } catch (err) { return; }
    if (url.hostname === location.hostname || !url.hostname) return; // 內部連結略過
    gtag('event', 'outbound_click', {
      link_url: url.href,
      link_domain: url.hostname,
      link_text: (a.textContent || '').trim().slice(0, 100)
    });
  });

  // 監聽 back/forward 觸發的 hash 變化
  window.addEventListener('hashchange', () => {
    const artId = getArticleHash();
    if (artId) {
      showArticleById(artId);
      return;
    }
    const p = getHashPage() || 'home';
    switchTab(p);
  });

  // 資料載入完後，若停在 archive 分頁需要再 render 一次（issuesData 才有值）
  initDashboardData().then(() => {
    const cur = document.querySelector('.tab.active');
    if (cur && cur.dataset.page === 'archive' && typeof renderArchive === 'function') {
      renderArchive('all');
    }
    // Outlook 產生器：data race 處理
    if (getHashPage() === 'outlook-gen' && typeof initOutlookGenerator === 'function') {
      initOutlookGenerator();
    }
    // email deep-link：資料就緒後開對應文章 modal
    if (initialArticleId && typeof showArticleById === 'function') {
      showArticleById(initialArticleId);
    }
    // Prompt 技巧分享資料從 data/prompt-tips.json 載入，需等 initDashboardData 完成
    renderPrompts();
  });
  renderTools();
  renderToolIntro();
  renderPromptSites();

  // 搜尋邏輯
  // 使用全局 searchIndex
  function loadSearchIndex() {
    return new Promise(function (r) {
      if (searchIndex && searchIndex.length > 0) { r(searchIndex); return; }
      fetch('tvbs-ai-newsletter/search-index.json').then(function (x) { return x.json(); }).then(function (d) {
        searchIndex = d; r(d);
      }).catch(function () { searchIndex = []; r([]); });
    });
  }
  function getIssueNum(it) {
    var m = (it.url || '').match(/(\d{3})\.html/);
    return m ? parseInt(m[1], 10) : 0;
  }
  function doSearch(q) {
    if (!searchIndex || !q) return [];
    var k = q.toLowerCase().trim();
    return searchIndex.filter(function (it) {
      return (it.title || '').toLowerCase().indexOf(k) >= 0 || (it.content || '').toLowerCase().indexOf(k) >= 0;
    }).sort(function (a, b) {
      var da = a.date || '';
      var db = b.date || '';
      // 兩者都有日期：日期 desc
      if (da && db) return db.localeCompare(da);
      // 只有 a 有日期：a 在前（新內容優先於舊期）
      if (da && !db) return -1;
      if (!da && db) return 1;
      // 兩者都沒日期（舊期 entries）：用期號 desc
      return getIssueNum(b) - getIssueNum(a);
    });
  }
  function getSearchSourceLabel(r) {
    // 1) 舊期電子報：URL 含 nnn.html
    var m = (r.url || '').match(/(\d{3})\.html/);
    if (m) return '第 ' + m[1] + ' 期';
    // 2) 用 source 欄位轉成易讀標籤
    var src = r.source || '';
    if (src === 'TVBS AI 知識庫') return '重點趨勢';
    if (src === '趨勢總覽') return '10 秒看趨勢';
    if (src === 'AI 新聞快訊') return '新聞快訊';
    if (src === 'AI 工具介紹' || /AI Newsletter 第/.test(src)) return 'AI 工具介紹';
    return src || '';
  }
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m];
    });
  }
  function hl(t, q) {
    var s = esc(t); if (!q) return s;
    var qq = esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return s.replace(new RegExp(qq, 'gi'), function (m) {
      return '<mark style="background:rgba(91,91,214,0.15);color:var(--primary);padding:0 2px;border-radius:3px">' + m + '</mark>';
    });
  }
  // 摘要：以關鍵字命中位置為中心擷取一段，而非永遠顯示內容開頭
  function makeSnippet(content, q, len) {
    content = content || '';
    var k = q ? String(q).toLowerCase().trim() : '';
    var idx = k ? content.toLowerCase().indexOf(k) : -1;
    var start = idx > 40 ? idx - 40 : 0;
    return {
      text: content.slice(start, start + len),
      lead: start > 0 ? '…' : '',
      tail: (start + len) < content.length ? '…' : ''
    };
  }
  function renderSR(res, q) {
    var b = document.getElementById('searchResults'); if (!b) return;
    if (!q) { b.classList.remove('open'); return; }
    if (res.length === 0) { b.innerHTML = '<div class="search-no-result">找不到相關內容</div>'; b.classList.add('open'); return; }
    b.innerHTML = res.map(function (r) {
      var sourceLabel = getSearchSourceLabel(r);
      var dateLabel = r.date || '';
      var sn = makeSnippet(r.content, q, 120);
      return `<div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(r.title).replace(/'/g, "%27")}'))" style="text-decoration:none;cursor:pointer"><div class="search-result-item"><div class="search-result-title">${hl(r.title, q)}</div><div class="search-result-snippet">${sn.lead}${hl(sn.text, q)}${sn.tail}</div><div class="search-result-meta">${sourceLabel ? `<span class="search-result-source">${sourceLabel}</span>` : ''}${dateLabel ? `<span class="search-result-date">${dateLabel}</span>` : ''}</div></div></div>`;
    }).join('');
    b.classList.add('open');
  }
  var si = document.getElementById('searchInput');
  if (si) {
    var dt;
    var gaT;
    si.addEventListener('input', function (e) {
      clearTimeout(dt); clearTimeout(gaT); var q = e.target.value;
      // 渲染結果：快速（150ms）
      dt = setTimeout(function () { loadSearchIndex().then(function () { renderSR(doSearch(q), q); }); }, 150);
      // GA 追蹤：較慢（1500ms），避免每按一鍵都送
      if (q && q.trim().length >= 2) {
        gaT = setTimeout(function () {
          if (typeof gtag === 'function') {
            loadSearchIndex().then(function () {
              gtag('event', 'search', {
                search_term: q.trim(),
                result_count: doSearch(q).length
              });
            });
          }
        }, 1500);
      }
    });
    si.addEventListener('focus', function (e) {
      loadSearchIndex().then(function () { if (e.target.value) renderSR(doSearch(e.target.value), e.target.value); });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search-box')) { var b = document.getElementById('searchResults'); if (b) b.classList.remove('open'); } });
  }
});

/* =========================================================
   Outlook 版本產生器（隱藏頁 #outlook-gen）
   ========================================================= */
const OG_TAG_COLORS = {
  '模型發布': { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  '新工具':   { bg: '#fff7ed', color: '#f59e0b', border: '#fde68a' },
  '新功能':   { bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
  '應用技巧': { bg: '#fdf4ff', color: '#c026d3', border: '#f5d0fe' },
  '產業動態': { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },
  '法律規範': { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  // 來源 label（混入本期重點時使用）
  'AI 工具介紹':     { bg: '#f5f3ff', color: '#5b5bd6', border: '#e0e0f5' },
  'Prompt 技巧分享': { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' }
};
const OG_SITE_URL = 'https://ainews.tvbs.ai/';
const OG_NEWS_URL = OG_SITE_URL + '#news';
const OG_SUM_URL = OG_SITE_URL + '#summaries';
const OG_FEEDBACK_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSfINdiIy8lfQ0bxfAha2d-rrgHggsz0XJcklILwoHqa3lFY8A/viewform?usp=pp_url&entry.1230987627=';

function ogEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function ogPillStyle(tag) {
  const c = OG_TAG_COLORS[tag] || OG_TAG_COLORS['產業動態'];
  return `background-color:${c.bg}; color:${c.color}; border:1px solid ${c.border};`;
}

function ogTruncate(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[\s,，。、；：「」（）()]+$/, '') + '…';
}

// 從 content（HTML）取得純文字預覽，跟網站文章卡片同步
function ogStripHtml(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function ogGetArticlePreview(article, maxChars) {
  // 優先使用 content（網站卡片實際顯示），fallback 到 summary
  const plain = ogStripHtml(article.content || '') || article.summary || '';
  return ogTruncate(plain, maxChars);
}

const OG_DASHBOARD = 'https://ainews.tvbs.ai/';

// 將不同資料源 normalize 成統一的「文章區塊」資料
function ogNormalizeItem(item, kind) {
  if (kind === 'article') {
    return {
      image: item.image,
      tag: item.tag || '產業動態',
      tags: item.tags || [],
      title: item.title,
      content: item.content || '',
      summary: item.summary || '',
      // deep-link：articles.json 用 #article-{id}
      url: item.id ? `${OG_DASHBOARD}#article-${item.id}` : OG_NEWS_URL
    };
  }
  if (kind === 'prompt') {
    return {
      // window.__prompts 是 prompt-tips.json 的 raw 資料、欄位叫 image；
      // 早期經由 searchIndex 進來的版本則用 img——兩個都吃，避免破圖
      image: item.image || item.img,
      tag: 'Prompt 技巧分享',  // 統一來源 label
      tags: [],
      title: item.title,
      content: '',
      summary: item.sub || item.summary || '',
      // Prompt deep-link 用 #prompt-{id}（getArticleHash 認得）
      url: item.id ? `${OG_DASHBOARD}#prompt-${item.id}` : (item.no ? `tvbs-ai-newsletter/issues/${item.no}.html#section-jump-${item.sj || 0}` : OG_DASHBOARD + '#prompt-tips')
    };
  }
  if (kind === 'toolIntro') {
    return {
      image: item.image,
      tag: 'AI 工具介紹',  // 統一來源 label
      tags: [],
      title: item.title,
      content: item.content || '',
      summary: item.sub || '',
      // deep-link：tool-intro.json 用 #tool-{id}
      url: item.id ? `${OG_DASHBOARD}#tool-${item.id}` : OG_DASHBOARD + '#tool-intro'
    };
  }
  return item;
}

function ogRenderArticle(item, isLast) {
  const tag = item.tag || '產業動態';
  const url = item.url || OG_NEWS_URL;
  const useTags = (typeof sortUsecaseTags === 'function' ? sortUsecaseTags(item.tags || []) : (item.tags || []));
  const useTagsRow = useTags.length ? `
                <tr><td style="padding:0 0 18px 0;"><p style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:13px; color:#5b5bd6; line-height:1.6;"><span style="font-weight:700;">適用情境：</span>${useTags.map(ogEsc).join('&nbsp;｜&nbsp;')}</p></td></tr>` : '';
  const summaryPad = useTags.length ? '6' : '14';
  const truncatedSummary = ogGetArticlePreview(item, 80);
  const tagRow = item.hideTag ? '' : `
                <tr><td style="padding:18px 0 8px 0;"><span style="display:inline-block; padding:4px 12px; ${ogPillStyle(tag)} border-radius:999px; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:0.5px;">${ogEsc(tag)}</span></td></tr>`;
  const titleTopPad = item.hideTag ? '18' : '0';
  return `
          <tr>
            <td style="padding:0 32px;">
              <a href="${url}" style="text-decoration:none; color:inherit;" target="_blank">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr><td><img alt="${ogEsc(item.title)}" src="${ogEsc(item.image)}" width="536" style="display:block; max-width:100%; width:100%; height:auto; border-radius:12px;" /></td></tr>${tagRow}
                <tr><td style="padding:${titleTopPad}px 0 10px 0;"><h2 style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:19px; font-weight:700; line-height:1.45; color:#0a2540;">${ogEsc(item.title)}</h2></td></tr>
                <tr><td style="padding:0 0 ${summaryPad}px 0;"><p style="margin:0; color:#6b7280; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:15px; line-height:1.75;">${ogEsc(truncatedSummary)}</p></td></tr>${useTagsRow}
                <tr><td align="center" style="padding:0 0 ${isLast ? '32' : '28'}px 0; text-align:center;"><span style="display:inline-block; padding:8px 18px; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:13px; font-weight:600; color:#5b5bd6; background-color:#ffffff; border:1px solid #d8d8e8; border-radius:999px;">閱讀全文 →</span></td></tr>
              </table>
              </a>
            </td>
          </tr>
          ${isLast ? '' : `<tr><td align="center" style="padding:0 32px 28px 32px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td width="80" style="border-top:1px solid #e5e7eb; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>`}`;
}

function ogRenderSummary(s, isLast) {
  const tag = s.tag || '產業動態';
  const useTags = (typeof sortUsecaseTags === 'function' ? sortUsecaseTags(s.tags || []) : (s.tags || []));
  const useHtml = useTags.length
    ? `<p style="margin:6px 0 0 0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; color:#5b5bd6; line-height:1.6;"><span style="font-weight:700;">適用情境：</span>${useTags.map(ogEsc).join('&nbsp;｜&nbsp;')}</p>`
    : '';
  // deep-link：weekly-summaries.json 用 #summary-{id}
  const sumUrl = s.id ? `${OG_DASHBOARD}#summary-${s.id}` : OG_SUM_URL;
  return `
          <tr>
            <td style="padding:0 32px;">
              <a href="${sumUrl}" style="text-decoration:none; color:inherit;" target="_blank">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"${isLast ? '' : ' style="border-bottom:1px solid #e5e7eb;"'}>
                  <tr>
                    <td style="padding:14px 0;" valign="middle">
                      <p style="margin:0 0 6px 0;"><span style="display:inline-block; padding:3px 10px; ${ogPillStyle(tag)} border-radius:999px; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:0.5px;">${ogEsc(tag)}</span>&nbsp;&nbsp;<span style="font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; color:#9ca3af; font-weight:700;">${ogEsc(s.date || '')}</span></p>
                      <p style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:16px; color:#0a2540; font-weight:600; line-height:1.55;">${ogEsc(s.title)}</p>
                      ${useHtml}
                    </td>
                    <td valign="middle" align="right" width="24" style="font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:26px; color:#c1c5cd; padding-left:12px; line-height:1;">›</td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>`;
}

function ogBuildEmailHTML(opts) {
  // 本期重點：重點趨勢 + Prompt + AI 工具介紹 全部混排，各自帶 tag，無 sub-heading
  const benItems = [
    ...(opts.articles || []).map(x => ogNormalizeItem(x, 'article')),
    ...(opts.prompts || []).map(x => ogNormalizeItem(x, 'prompt')),
    ...(opts.tools || []).map(x => ogNormalizeItem(x, 'toolIntro'))
  ];
  const articlesHtml = benItems
    .map((item, i) => ogRenderArticle(item, i === benItems.length - 1))
    .join('');
  const summariesHtml = (opts.summaries || []).map((s, i) => ogRenderSummary(s, i === opts.summaries.length - 1)).join('');

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- iOS Mail.app 防字體自動放大/縮放 -->
  <meta name="x-apple-disable-message-reformatting" />
  <!-- Android Outlook / iOS Outlook 黑暗模式不自動反色：強制走 light mode 配色 -->
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>TVBS AI Knowledge Base · ${ogEsc(opts.monthLabel)}</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
      <o:PixelsPerInch>96</o:PixelsPerInch>
      <o:AllowPNG/>
    </o:OfficeDocumentSettings>
  </xml>
  <style type="text/css">
    /* Outlook Windows 桌機（Word engine）：確保中文字體、line-height 不被引擎調整 */
    table, td, div, p, a, span, h1, h2 { font-family:'Microsoft JhengHei','微軟正黑體',Arial,sans-serif !important; mso-line-height-rule:exactly !important; }
    table { border-collapse:collapse !important; }
    p, div { margin:0 !important; mso-margin-top-alt:0 !important; mso-margin-bottom-alt:0 !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
    a { text-decoration:none; }
    /* 黑暗模式（Outlook / Gmail iOS）裡某些客戶端仍會反色，加 [data-ogsc] 鉤子防呆 */
    [data-ogsc] body, [data-ogsc] table, [data-ogsc] td { background-color:#fafbfc !important; color:#0a2540 !important; }
  </style>
</head>
<!-- 提示客戶端：本信只支援 light 模式（部分 Gmail/Outlook 會看這個屬性） -->
<!-- body 的 background-color/color 已 inline，避免被 dark mode 全域反色 -->
<body style="margin:0; padding:0; background-color:#fafbfc;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafbfc" style="background-color:#fafbfc;">
    <tr><td align="center" style="padding:24px 12px;">
      <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">

        <tr><td style="padding:40px 32px 28px 32px;">
          <p style="margin:0 0 14px 0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; font-weight:700; color:#5b5bd6; letter-spacing:1.5px;">──&nbsp;&nbsp;${ogEsc(opts.monthLabel)}</p>
          <h1 style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:34px; font-weight:900; color:#0a2540; line-height:1.2; letter-spacing:-0.5px;">精選 AI 趨勢</h1>
        </td></tr>

        <tr><td style="padding:0 32px 32px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafafe" style="background-color:#fafafe; border:1px solid #ececf9; border-radius:8px;">
            <tr><td style="padding:12px 16px;"><p style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; color:#6b7280; line-height:1.65;">💡 建議使用網頁版 Outlook 閱讀本期電子報。若排版異常請<a href="${OG_SITE_URL}" style="color:#5b5bd6; font-weight:600; text-decoration:underline;" target="_blank">前往網站版</a>。</p></td></tr>
          </table>
        </td></tr>

${articlesHtml}

        <tr><td style="padding:8px 32px 32px 32px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e5e7eb; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>

        <tr><td style="padding:0 32px 0 32px;">
          <h2 style="margin:0 0 8px 0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:26px; font-weight:900; color:#0a2540; letter-spacing:-0.3px; line-height:1.3;">10 秒看趨勢</h2>
          <p style="margin:0 0 20px 0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:14px; color:#6b7280; line-height:1.6;">用一個段落快速告訴你，最近 AI 界發生什麼事。</p>
        </td></tr>
${summariesHtml}

        <tr><td align="center" style="padding:24px 32px 8px 32px;"><a href="${OG_SUM_URL}" style="display:inline-block; padding:10px 24px; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:14px; font-weight:600; color:#5b5bd6; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:999px; text-decoration:none;" target="_blank">看更多趨勢 →</a></td></tr>

        <tr><td style="padding:32px 32px 0 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafbfc" style="background-color:#fafbfc; border-radius:8px;">
            <tr><td align="center" style="padding:28px 24px 4px 24px;">
              <p style="margin:0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:15px; color:#0a2540; font-weight:700;">您對本期內容滿意嗎？</p>
              <p style="margin:6px 0 0 0; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:13px; color:#6b7280;">您的回饋是我們進步的動力！</p>
            </td></tr>
            <tr><td align="center" style="padding:16px 24px 28px 24px;">
              <table border="0" cellpadding="0" cellspacing="0"><tr>
                <td><a href="${OG_FEEDBACK_BASE}%F0%9F%91%8D" style="display:inline-block; padding:10px 22px; font-family:Arial,sans-serif; font-size:16px; color:#0a2540; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:999px; text-decoration:none;" target="_blank">👍</a></td>
                <td width="14">&nbsp;</td>
                <td><a href="${OG_FEEDBACK_BASE}%F0%9F%98%90%E6%99%AE%E9%80%9A" style="display:inline-block; padding:10px 22px; font-family:Arial,sans-serif; font-size:16px; color:#0a2540; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:999px; text-decoration:none;" target="_blank">😐</a></td>
                <td width="14">&nbsp;</td>
                <td><a href="${OG_FEEDBACK_BASE}%F0%9F%91%8E%E4%B8%8D%E6%BB%BF%E6%84%8F" style="display:inline-block; padding:10px 22px; font-family:Arial,sans-serif; font-size:16px; color:#0a2540; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:999px; text-decoration:none;" target="_blank">👎</a></td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td align="center" style="padding:32px 32px 8px 32px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#5b5bd6" style="background-color:#5b5bd6; border-radius:999px;"><a href="https://ainews.tvbs.ai/" style="display:inline-block; padding:14px 32px; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:999px;" target="_blank">前往網站了解更多 AI 資訊 →</a></td></tr></table></td></tr>

        <tr><td style="height:32px; font-size:1px; line-height:1px;">&nbsp;</td></tr>

        <tr><td align="center" bgcolor="#f8f9fb" style="background-color:#f8f9fb; padding:24px 32px; border-radius:0 0 12px 12px; border-top:1px solid #e5e7eb;">
          <p style="margin:0; color:#9ca3af; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; line-height:1.7;">本電子報為公司內部刊物，僅供公司內部學習參考，相關資訊版權歸原作者所有。</p>
          <p style="margin:8px 0 0 0; color:#9ca3af; font-family:'Microsoft JhengHei',Arial,sans-serif; font-size:12px; line-height:1.7;">© 2026 TVBS AI 未來科技部&nbsp;｜&nbsp;聯利媒體股份有限公司</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

let ogCurrentHTML = '';
let ogInited = false;

function ogGenerate() {
  const status = document.getElementById('ogStatus');
  status.className = 'og-status';
  status.textContent = '產出中...';

  const articles = (window.__articles || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const summaries = (window.__weeklySummaries || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const prompts = (window.__prompts || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const toolIntros = (window.__toolIntros || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (!articles.length && !summaries.length && !prompts.length && !toolIntros.length) {
    status.className = 'og-status error';
    status.textContent = '✗ 資料還沒載入完，請先到首頁等資料載入再回來';
    return;
  }

  const monthLabel = ogReadMonthLabel();

  // 從 #ogSelector 的勾選狀態讀取最終要產出的項目（A 方案：可勾選清單）
  // 沒有勾選清單（例如直接呼叫 ogGenerate）時 fallback 用日期過濾整池
  const cutoffDateEl = document.getElementById('ogCutoffDate');
  const cutoffDate = cutoffDateEl ? cutoffDateEl.value.trim() : '';
  const sel = document.getElementById('ogSelector');
  const hasSelector = sel && !sel.classList.contains('og-hidden');

  let selA, selP, selT, selS;
  if (hasSelector) {
    selA = ogGetSelected('articles');
    selP = ogGetSelected('prompts');
    selT = ogGetSelected('tools');
    selS = ogGetSelected('summaries');
  } else if (cutoffDate) {
    selA = articles.filter(a => (a.date || '') >= cutoffDate);
    selP = prompts.filter(p => (p.date || '') >= cutoffDate);
    selT = toolIntros.filter(t => (t.date || '') >= cutoffDate);
    selS = summaries.filter(s => (s.date || '') >= cutoffDate);
  } else {
    selA = []; selP = []; selT = []; selS = [];
  }

  ogCurrentHTML = ogBuildEmailHTML({
    monthLabel,
    articles: selA,
    prompts: selP,
    tools: selT,
    summaries: selS
  });

  document.getElementById('ogPreviewFrame').srcdoc = ogCurrentHTML;
  document.getElementById('ogHtmlOutput').value = ogCurrentHTML;

  status.className = 'og-status success';
  status.classList.remove('og-hidden');
  status.textContent = '✓ 產出完成';
  ogClearDirty();
}

async function ogCopyHTML() {
  if (!ogCurrentHTML) { ogGenerate(); return; }
  if (ogDirty && !confirm('⚠ 預覽的 HTML 不是最新狀態（你改過設定但還沒重新產出），確定要複製舊版嗎？')) return;
  const status = document.getElementById('ogStatus');
  try {
    await navigator.clipboard.writeText(ogCurrentHTML);
    status.className = 'og-status success';
    status.textContent = '✓ HTML 已複製到剪貼簿，可貼進 Outlook';
  } catch (err) {
    const ta = document.getElementById('ogHtmlOutput');
    ta.select();
    document.execCommand('copy');
    status.className = 'og-status success';
    status.textContent = '✓ HTML 已複製';
  }
  ogFlashCopyButtons('✓ 已複製');
}

function ogDownloadHTML() {
  if (!ogCurrentHTML) { ogGenerate(); return; }
  if (ogDirty && !confirm('⚠ 預覽的 HTML 不是最新狀態（你改過設定但還沒重新產出），確定要下載舊版嗎？')) return;
  const blob = new Blob([ogCurrentHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const month = ogReadMonthLabel().replace(/\s+/g, '_').replace(/[年月號]/g, '');
  a.download = `${month}_outlook.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const status = document.getElementById('ogStatus');
  status.className = 'og-status success';
  status.textContent = '✓ 已下載 ' + a.download;
}

let ogMonthAutoFilled = false;
let ogCountsAutoFilled = false;

function ogReadMonthLabel() {
  // 期號為 <input>，自動推算寫進 .value、使用者可手動覆寫
  const el = document.getElementById('ogPeriodLabel');
  const v = el && (el.value || '').trim();
  return (v && v !== '—') ? v : '2026 年 X 月號';
}

// 期號已改成由 ogSyncCountsFromDate 在使用者選篩選日期後自動推算並寫進顯示元素
// 不再需要 page-load 時的 ogAutoFillMonth，保留空函式避免別處呼叫出錯
function ogAutoFillMonth() {}

// 舊「篇數模式」的 page-load 預填已被「可勾選清單」取代；保留空函式避免別處呼叫出錯
function ogAutoFillCounts() {}

// === A 方案：可勾選清單 ===
// ogPool / ogVisible 為 module-level state，由 ogBuildSelector 初始化
const ogPool = { articles: [], summaries: [], prompts: [], tools: [] };
const ogVisible = { articles: 0, summaries: 0, prompts: 0, tools: 0 };

// === 防呆：產出後若編輯區再變動，標記 dirty 提醒重新產出 ===
let ogDirty = false;
function ogMarkDirty() {
  if (!ogCurrentHTML) return; // 還沒產出過就不需要警示
  if (ogDirty) return;
  ogDirty = true;
  ogUpdateDirtyUI();
}
function ogClearDirty() {
  if (!ogDirty) return;
  ogDirty = false;
  ogUpdateDirtyUI();
}
function ogUpdateDirtyUI() {
  document.querySelectorAll('.og-generate-btn').forEach(btn => {
    btn.classList.toggle('og-btn--dirty', ogDirty);
    btn.textContent = ogDirty ? '↻ 重新產出' : '產出';
  });
  const status = document.getElementById('ogStatus');
  if (status && ogDirty) {
    status.className = 'og-status dirty';
    status.classList.remove('og-hidden');
    status.textContent = '⚠ 內容已變動，預覽為舊版，請重新按「產出」更新';
  }
  const bar = document.getElementById('ogDirtyBar');
  if (bar) bar.classList.toggle('og-hidden', !ogDirty);
}

// 複製成功反饋：把「複製 HTML」按鈕的字直接換成「✓ 已複製」+ 綠底
// 1.2 秒後復原。左欄與右上兩顆 .og-copy-btn 一起改，避免位置/定位問題
function ogFlashCopyButtons(msg, ms) {
  const btns = document.querySelectorAll('.og-copy-btn');
  if (!btns.length) return;
  clearTimeout(ogFlashCopyButtons._timer);
  btns.forEach(b => {
    if (!b.dataset.origText) b.dataset.origText = b.textContent;
    // 第一次 flash 時把當下「複製 HTML」原寬度鎖成 min-width，
    // 之後文字變「✓ 已複製」較短不會讓按鈕縮窄
    if (!b.style.minWidth) b.style.minWidth = b.offsetWidth + 'px';
    b.textContent = msg;
    b.classList.add('og-btn--success');
  });
  ogFlashCopyButtons._timer = setTimeout(() => {
    btns.forEach(b => {
      b.textContent = b.dataset.origText || '複製 HTML';
      b.classList.remove('og-btn--success');
    });
  }, ms || 1200);
}

function ogPoolFor(cat) {
  let arr;
  if (cat === 'articles') arr = (window.__articles || []).slice();
  else if (cat === 'summaries') arr = (window.__weeklySummaries || []).slice();
  else if (cat === 'prompts') arr = (window.__prompts || []).slice();
  else if (cat === 'tools') arr = ((window.__toolIntros || []).filter(t => t.content || t.openInModal)).slice();
  else return [];
  return arr.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function ogRenderCatItem(cat, item, idx, checked) {
  const li = document.createElement('li');
  li.className = 'og-cat-item';
  li.innerHTML =
    '<label>' +
      '<input type="checkbox" data-cat="' + cat + '" data-idx="' + idx + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="og-cat-date">' + (item.date || '—') + '</span>' +
      '<span class="og-cat-title-text">' + ogEsc(item.title || '(無標題)') + '</span>' +
    '</label>';
  return li;
}

// 各分類「預設顯示上限」：10 秒看趨勢量大、超過 5 篇預設只顯示 5；其他分類無上限
const OG_DEFAULT_CAP = { summaries: 5 };

function ogBuildSelector(cutoff) {
  const sel = document.getElementById('ogSelector');
  if (!sel) return;
  sel.classList.remove('og-hidden');
  ['articles', 'summaries', 'prompts', 'tools'].forEach(cat => {
    const pool = ogPoolFor(cat);
    ogPool[cat] = pool;
    const filteredCount = cutoff ? pool.filter(it => (it.date || '') >= cutoff).length : pool.length;
    const cap = OG_DEFAULT_CAP[cat];
    const initialVisible = cap ? Math.min(filteredCount, cap) : filteredCount;
    ogVisible[cat] = initialVisible;
    const catEl = sel.querySelector('.og-cat[data-cat="' + cat + '"]');
    const listEl = catEl.querySelector('.og-cat-list');
    listEl.innerHTML = '';
    pool.slice(0, initialVisible).forEach((item, i) => {
      listEl.appendChild(ogRenderCatItem(cat, item, i, true));
    });
    const moreBtn = catEl.querySelector('.og-cat-more');
    if (moreBtn) moreBtn.style.display = (initialVisible < pool.length) ? '' : 'none';
  });
  ogUpdateCounts();
}

function ogShowMore(cat, n) {
  n = n || 5;
  const pool = ogPool[cat] || [];
  const start = ogVisible[cat];
  const end = Math.min(start + n, pool.length);
  if (end <= start) return;
  const sel = document.getElementById('ogSelector');
  const listEl = sel.querySelector('.og-cat[data-cat="' + cat + '"] .og-cat-list');
  for (let i = start; i < end; i++) {
    listEl.appendChild(ogRenderCatItem(cat, pool[i], i, false));
  }
  ogVisible[cat] = end;
  const moreBtn = sel.querySelector('.og-cat[data-cat="' + cat + '"] .og-cat-more');
  if (moreBtn && end >= pool.length) moreBtn.style.display = 'none';
  ogUpdateCounts();
  // 注意：「顯示更早」只是把更舊的項目秀出來（預設未勾），選中集合沒變、預覽不算過時，故不標 dirty。
  // 若使用者接著真的勾起新出現的項目，會走 checkbox change handler 才標 dirty。
}

function ogUpdateCounts() {
  const sel = document.getElementById('ogSelector');
  if (!sel) return;
  let total = 0;
  ['articles', 'summaries', 'prompts', 'tools'].forEach(cat => {
    const catEl = sel.querySelector('.og-cat[data-cat="' + cat + '"]');
    if (!catEl) return;
    total += catEl.querySelectorAll('input[type="checkbox"]:checked').length;
  });
  const totalEl = document.getElementById('ogTotalSelected');
  if (totalEl) totalEl.textContent = total;
}

function ogAllOrNone(cat, value) {
  const sel = document.getElementById('ogSelector');
  if (!sel) return;
  sel.querySelectorAll('.og-cat[data-cat="' + cat + '"] input[type="checkbox"]').forEach(cb => {
    cb.checked = value;
  });
  ogUpdateCounts();
  ogMarkDirty();
}

function ogGetSelected(cat) {
  const sel = document.getElementById('ogSelector');
  const pool = ogPool[cat] || [];
  if (!sel) return [];
  const checked = sel.querySelectorAll('.og-cat[data-cat="' + cat + '"] input[type="checkbox"]:checked');
  return Array.from(checked).map(cb => pool[parseInt(cb.dataset.idx, 10)]).filter(Boolean);
}

function ogSyncCountsFromDate() {
  // 篩選日期改變時：(1) 用 cutoff 重建勾選清單（>= cutoff 預設勾、其餘藏在「顯示更早」後面）
  //                (2) 從同一份候選裡推算期號
  const cutoffEl = document.getElementById('ogCutoffDate');
  if (!cutoffEl) return;
  const cutoff = cutoffEl.value.trim();
  if (!cutoff) return;

  ogBuildSelector(cutoff);

  // 期號：從 >= cutoff 的所有資料裡找最新一筆日期，推算年/月
  const all = ['articles', 'summaries', 'prompts', 'tools']
    .flatMap(cat => ogPool[cat].filter(it => (it.date || '') >= cutoff));
  const latestDate = all.map(it => it.date).filter(Boolean).sort((a, b) => b.localeCompare(a))[0];
  const periodEl = document.getElementById('ogPeriodLabel');
  if (periodEl) {
    if (latestDate) {
      const dm = latestDate.match(/(\d{4})[\-.\/](\d{1,2})/);
      if (dm) periodEl.value = `${dm[1]} 年 ${parseInt(dm[2], 10)} 月號`;
    } else {
      periodEl.value = '—';
    }
  }
  document.querySelectorAll('.og-field--inline').forEach(el => el.classList.remove('og-hidden'));
  // 篩選日期改變 = 重建清單 = 編輯區變動，若已產出過就標 dirty
  ogMarkDirty();
}

function initOutlookGenerator() {
  // 1) 監聽器只掛一次
  if (!ogInited) {
    ogInited = true;
    // 左欄與右上 mini 兩組按鈕共用 handler（依 class 抓而非單一 id）
    document.querySelectorAll('.og-generate-btn').forEach(b => b.addEventListener('click', ogGenerate));
    document.querySelectorAll('.og-copy-btn').forEach(b => b.addEventListener('click', ogCopyHTML));
    document.getElementById('ogDownloadBtn').addEventListener('click', ogDownloadHTML);
    const cutoffEl = document.getElementById('ogCutoffDate');
    const genBtns = document.querySelectorAll('.og-generate-btn');
    const toggleGenBtn = () => {
      // 期號改成自動從篩選結果推算，所以這裡只看篩選日期是否填了
      const dis = !(cutoffEl && cutoffEl.value.trim());
      genBtns.forEach(b => b.disabled = dis);
    };
    if (cutoffEl) {
      cutoffEl.addEventListener('change', () => { ogSyncCountsFromDate(); toggleGenBtn(); });
      cutoffEl.addEventListener('input', toggleGenBtn);
    }
    document.querySelectorAll('.og-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.og-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('ogPreviewFrame').classList.toggle('hidden', tab !== 'preview');
        document.getElementById('ogHtmlOutput').classList.toggle('active', tab === 'code');
      });
    });

    // #ogSelector 事件代理：checkbox 變更更新計數+標 dirty、mini 全選/全不選、顯示更早
    const selEl = document.getElementById('ogSelector');
    if (selEl) {
      selEl.addEventListener('change', e => {
        if (e.target && e.target.matches('input[type="checkbox"]')) {
          ogUpdateCounts();
          ogMarkDirty();
        }
      });
      selEl.addEventListener('click', e => {
        const t = e.target;
        if (!t) return;
        if (t.matches('.og-cat-more')) {
          const catEl = t.closest('.og-cat');
          if (catEl) ogShowMore(catEl.dataset.cat, 5);
        } else if (t.matches('.og-cat-mini')) {
          const catEl = t.closest('.og-cat');
          if (catEl) ogAllOrNone(catEl.dataset.cat, t.dataset.action === 'all');
        }
      });
    }
    // 期號 input 編輯 = 標 dirty
    const periodEl = document.getElementById('ogPeriodLabel');
    if (periodEl) periodEl.addEventListener('input', ogMarkDirty);
  }

  // 2) 資料就緒才自動偵測月份 + 帶入篇數 default（不自動產出，等使用者按按鈕）
  const hasData = (window.__articles && window.__articles.length) ||
    (window.__weeklySummaries && window.__weeklySummaries.length);
  if (hasData) {
    ogAutoFillMonth();
    ogAutoFillCounts();
  }
}
