var VALID_PAGES = ['home', 'news', 'summaries', 'prompt', 'prompt-sites', 'tool-intro', 'tools', 'archive'];

function switchTab(page) {
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.page === page); });
  document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('active', p.id === 'page-' + page); });
  window.scrollTo({ top: 0, behavior: 'smooth' });

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

  // GA4 SPA pageview（hash 路由 GA 不會自動偵測）
  if (typeof gtag === 'function') {
    const titleMap = {
      home: '首頁',
      news: '重點趨勢',
      summaries: '30秒看趨勢',
      prompt: 'Prompt 技巧分享',
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
document.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { switchTab(t.dataset.page); }); });

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
const promptData = [
  { no: '017', sj: 3, cat: '基礎入門', title: '指令基礎架構：任務＋行為＋目標', sub: '新手入門必學的 Prompt 架構公式，用三元素組合出清楚的指令。', img: 'https://i.meee.com.tw/CzYn2hg.jpg' },
  { no: '016', sj: 3, cat: '情境應用', title: 'Google 官方 10 種生活情境 Prompt', sub: 'Google 推薦的 10 種實用指令場景：客製化執行計畫、工作整理。', img: 'https://i.meee.com.tw/76YZkoN.jpg' },
  { no: '015', sj: 3, cat: '優化技巧', title: 'Prompt Optimizer 5 步驟教學', sub: 'OpenAI 官方推出的提示詞優化器，輸入隨意指令自動改寫成標準版本。', img: 'https://i.meee.com.tw/DXaIoAR.png' },
  { no: '014', sj: 5, cat: '優化技巧', title: '如何運用 AI 優化提示詞', sub: '三步驟教你改善 Prompt：找出問題、修改和優化、完成修改與測試。', img: 'https://i.meee.com.tw/gytRE58.jpg' },
  { no: '013', sj: 4, cat: '生圖指令', title: 'OpenNana：300+ 生圖提示詞集', sub: '收錄 Nano Banana、GPT-4o、ChatGPT、即夢等生圖工具提示詞。', img: 'https://i.meee.com.tw/ai8D8qY.png' },
  { no: '012', sj: 3, cat: '基礎入門', title: '「角色＋任務＋產出」三段式架構', sub: '與 AI 溝通的輕鬆入門公式，先設定角色、再講任務、最後規定產出格式。', img: 'https://i.meee.com.tw/EnrANiw.png' },
  { no: '011', sj: 2, cat: '生圖指令', title: 'Gemini 2.5 Flash Image 生專業形象照', sub: '用 Gemini 最新生圖模型快速生成形象照、證件照。分享多組 Prompt 樣板。', img: 'https://i.meee.com.tw/GbeKH8K.jpg' },
  { no: '010', sj: 2, cat: '模型技巧', title: 'GPT-5 提示詞使用方法重點整理', sub: 'GPT-5 推出後，Prompt 的寫法有什麼不同？官方建議與實戰心得整理。', img: 'https://i.meee.com.tw/VdWb0Dw.png' },
  { no: '009', sj: 3, cat: '基礎入門', title: '什麼是 Prompt？用買飲料的例子告訴你', sub: '指令工坊開篇：從日常場景解釋 Prompt 核心概念，輕鬆抓到重點。', img: 'https://i.meee.com.tw/PwhTSEZ.png' }
];

function renderPrompts(filter = '全部') {
  const container = document.getElementById('promptContainer');
  if (!container) return;
  const filtered = promptData.filter(it => filter === '全部' || it.cat === filter);
  container.innerHTML = filtered.map(it => `
    <a href="https://ainews.tvbs.ai/issues/${it.no}.html#section-jump-${it.sj}" target="_blank" class="prompt-compact-card">
      <div class="pc-cover" style="background-image:url('${it.img}')"></div>
      <span class="pc-cat">${it.cat}</span>
      <div class="pc-title">${it.title}</div>
      <div class="pc-sub">${it.sub}</div>
      <div class="pc-footer"><span class="pc-issue">收錄於第 ${parseInt(it.no)} 期</span><span>閱讀原文 →</span></div>
    </a>
  `).join('');
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
      crumbCategory = '30秒看趨勢';
      crumbPage = 'summaries';
    } else if (art.source === 'AI 工具介紹') {
      crumbParent = 'AI 工具';
      crumbCategory = 'AI 工具介紹';
      crumbPage = 'tool-intro';
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
    if (art.source === '趨勢總覽') {
      headerDateEl.style.display = 'none';
    } else {
      headerDateEl.textContent = displayDate;
      headerDateEl.style.display = displayDate ? 'block' : 'none';
      headerDateEl.style.textAlign = 'left';
      headerDateEl.style.marginTop = '8px';
    }
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

  // 推導外連結：優先用 sourceUrl，其次從 art.url 推導舊版電子報網址
  let externalUrl = art.sourceUrl;
  let externalLabel = art.sourceLabel || '原文連結 →';
  let isLegacyLink = false;
  if (!externalUrl && art.url && /\/issues\/[^/#]+\.html/.test(art.url)) {
    const path = art.url.startsWith('/') ? art.url : '/' + art.url;
    externalUrl = 'https://ainews.tvbs.ai' + path;
    externalLabel = '閱讀電子報原始文章';
    isLegacyLink = true;
  }
  if (art.source === '趨勢總覽') {
    // 適用情境 tags 行（在內文下方、日期/來源之上）
    if (art.tags && art.tags.length > 0) {
      bodyHtml += `<div class="summary-tags-row" style="margin-top:20px;">
        <span class="summary-tags-label">適用情境：</span>
        ${sortUsecaseTags(art.tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}
      </div>`;
    }
    let sourceLinkHtml = externalUrl ? `<span style="color:var(--text-light); font-size:14px;">（<a href="${externalUrl}" target="_blank" style="color:var(--text-light); text-decoration:underline; transition:color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-light)'">資料來源</a>）</span>` : ``;
    bodyHtml += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:32px; padding-bottom:40px;">
      <span style="font-size:13px; color:var(--text-light); font-weight:700;">${displayDate}</span>
      ${sourceLinkHtml}
    </div>`;
  } else {
    // 原生文章的適用情境行（在「閱讀原文」按鈕之前）
    if (art.isNative && art.tags && art.tags.length > 0) {
      bodyHtml += `<div class="summary-tags-row" style="margin-top:24px;">
        <span class="summary-tags-label">適用情境：</span>
        ${sortUsecaseTags(art.tags).map(t => `<span class="usecase-tag">${t}</span>`).join('')}
      </div>`;
    }
    if (externalUrl) {
      if (isLegacyLink) {
        // 舊期電子報：簡單文字超連結（預設灰色，hover 變青色）
        bodyHtml += `<p style="margin-top:32px;text-align:center"><a href="${externalUrl}" target="_blank" class="legacy-source-link">${externalLabel}</a></p>`;
      } else {
        // 原生文章（含日期標記）：使用有框框的按鈕樣式（無上方裝飾線）
        bodyHtml += `<p style="margin-top:32px;text-align:center"><a href="${externalUrl}" target="_blank" class="issue-hero-btn" style="padding:9px 18px; font-size:14px; display:inline-block; text-decoration:none;">${externalLabel}</a></p>`;
      }
    }
  }
  // 延伸閱讀：原生文章（articles.json）+ 舊期電子報文章都顯示，取最新 3 篇排除自己
  if ((art.isNative || isLegacyLink) && Array.isArray(window.__articles)) {
    const others = window.__articles.filter(a => a.title !== art.title).slice(0, 3);
    if (others.length > 0) {
      const relatedHtml = others.map(a => `
        <div class="related-card" onclick="event.stopPropagation();showArticleByTitle(decodeURIComponent('${encodeURIComponent(a.title).replace(/'/g, "%27")}'))">
          <div class="related-cover" style="background-image:url('${a.image}')"></div>
          <div class="related-info">
            <span class="related-tag">${a.tag || ''}</span>
            <h5 class="related-title">${a.title}</h5>
            <span class="related-date">${a.date || ''}</span>
          </div>
        </div>
      `).join('');
      bodyHtml += `
        <div class="related-articles">
          <h4 class="related-heading">延伸閱讀</h4>
          <div class="related-grid">${relatedHtml}</div>
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
  if (art.source === '趨勢總覽') {
    document.querySelector('.am-body').style.paddingBottom = '0';
  } else {
    document.querySelector('.am-body').style.paddingBottom = '40px';
  }
  const modal = document.getElementById('articleModal');
  modal.classList.add('active');
  // 重置 modal 內各個可滾動容器到頂部（避免沿用上一篇的滾動位置）
  modal.scrollTop = 0;
  const modalBox = modal.querySelector('.article-modal');
  if (modalBox) modalBox.scrollTop = 0;
  const bodyScroll = modal.querySelector('.am-body');
  if (bodyScroll) bodyScroll.scrollTop = 0;

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

function closeArticle() {
  document.getElementById('articleModal').classList.remove('active');
}
function renderArchive(f) {
  const g = document.getElementById('archiveGrid'); if (!g || !issuesData.length) return;
  const filtered = issuesData.filter(it => !f || f === 'all' || it.year === f);
  g.innerHTML = filtered.map(it => {
    const cv = it.img ? `background-image:url('${it.img}')` : 'background:linear-gradient(135deg,#5b5bd6,#4848b8)';
    const isSpecial = !/^\d+$/.test(it.no);
    const issueLabel = isSpecial ? `${it.date}` : `第 ${it.no} 期 ・ ${it.date}`;
    return `
      <div class="archive-card" onclick="window.open('https://ainews.tvbs.ai/issues/${it.no}.html','_blank')">
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
      fetch('data/articles.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/weekly-summaries.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/tool-intro.json').then(r => r.ok ? r.json() : []).catch(() => [])
    ]);
    issuesData = results[0] || [];
    searchIndex = results[1] || [];

    // 文章流（article-centric, 取代每期 JSON）
    const articles = (results[2] || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    window.__articles = articles;
    articles.forEach(a => {
      searchIndex.push({
        title: a.title,
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
          content: s.summary || '',
          fullContent: `<p class="first-paragraph">${s.summary || ''}</p>`,
          url: s.sourceUrl || `/summaries#${s.id}`,
          img: s.img || fallbackImg,
          tag: s.tag || '趨勢摘要',
          tags: s.tags || [],
          date: s.date,
          source: '趨勢總覽',
          sourceUrl: s.sourceUrl,
          sourceLabel: '資料來源 →'
        });
      });

      // AI 工具介紹 (含有完整內容的加入索引)
      const toolIntros = results[4] || [];
      toolIntros.forEach(t => {
        if (t.content || t.openInModal) {
          searchIndex.push({
            title: t.title,
            content: t.sub || '',
            fullContent: t.content || '',
            url: t.sourceUrl || `/tools#${t.issue}`,
            img: t.image || fallbackImg,
            tag: t.cat || '新工具',
            date: t.date || (t.issue ? `第 ${t.issue} 期` : ''),
            source: t.issue ? `TVBS AI Newsletter 第 ${t.issue} 期` : 'AI 工具介紹',
            sourceUrl: t.sourceUrl,
            sourceLabel: t.sourceLabel,
            imgCaption: t.imageCaption
          });
        }
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

      // 期間 meta — 從首頁所有文章 + 30秒趨勢的日期推算「最舊 ～ 最新」
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

      // 趨勢總數 — 從 0 平滑滾到目標值（cubic ease-out, 800ms）
      const countEl = document.getElementById('readerTrendCount');
      if (countEl) {
        countEl.innerHTML = `<span class="reader-count-num">0</span><span class="reader-count-unit">則精選</span>`;
        const numEl = countEl.querySelector('.reader-count-num');
        const target = overviewSource.length;
        const duration = 800;
        const start = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const frame = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          numEl.textContent = Math.round(target * easeOut(progress));
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }

      // 關鍵字 — 類型（含次數）+ 情境（純 tag），統一為 inline 文字
      const renderInlineTags = (entries, showCount) => entries.map(([t, n]) =>
        `<span class="reader-kw-link"><span class="kw-name">${t}</span>${showCount ? `<span class="kw-num">${n}</span>` : ''}</span>`
      ).join('');

      // 類型：item.tag 單值頻率（顯示次數）— 列出全部，依頻率 desc 排序
      const contentEl = document.getElementById('readerKwContent');
      if (contentEl) {
        const freq = {};
        overviewSource.forEach(it => {
          const t = it.tag || (typeof getTag === 'function' ? getTag(it.title) : null);
          if (t) freq[t] = (freq[t] || 0) + 1;
        });
        contentEl.innerHTML = renderInlineTags(Object.entries(freq).sort((a, b) => b[1] - a[1]), true);
      }

      // 情境：item.tags 陣列展平，依 USECASE_TAG_ORDER 固定順序排列
      const usecaseEl = document.getElementById('readerKwUsecase');
      if (usecaseEl) {
        // 按 USECASE_TAG_ORDER 固定順序掃描，有出現的就放，取前 6 個
        const presentTags = new Set();
        overviewSource.forEach(it => {
          (it.tags || []).forEach(t => { if (t) presentTags.add(t); });
        });
        const ordered = USECASE_TAG_ORDER.filter(t => presentTags.has(t)).slice(0, 6);
        usecaseEl.innerHTML = ordered
          .map(t => `<span class="reader-kw-link">${t}</span>`)
          .join('');
      }

      const heroContainer = document.getElementById('latestHeroContainer');
      // Hero Slider 候選池：articles + tool-intro 兩邊 featured: true 合併，按日期 desc 取前 5
      const articleSlides = articles.filter(a => a.featured).map(a => ({
        image: a.image, tag: a.tag || getTag(a.title), title: a.title, summary: a.summary || '', date: a.date || '', type: 'article'
      }));
      const toolSlides = toolIntros.filter(t => t.featured).map(t => ({
        image: t.image, tag: 'AI 工具介紹', title: t.title, summary: t.summary || t.sub || '', date: t.date || '', type: 'tool'
      }));
      const featuredSlides = [...articleSlides, ...toolSlides]
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        .slice(0, 4);
      if (heroContainer) {
        if (featuredSlides.length >= 1) {
          const [main, ...others] = featuredSlides;
          const sideCards = others.slice(0, 3).map(a => `
            <div class="hero-small" style="background-image:linear-gradient(180deg,rgba(10,18,40,0.1),rgba(10,18,40,0.85)),url('${a.image}')" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(a.title).replace(/'/g, "%27")}'))">
              <div class="hero-small-content">
                <span class="slide-tag${a.type === 'tool' ? ' slide-tag--tool' : ''}">${a.tag}</span>
                <h3 class="hero-small-title">${a.title}</h3>
              </div>
            </div>
          `).join('');
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
            </div>`;
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
        summariesWrap.innerHTML = window.__weeklySummaries.map(it => renderSummaryItem(it, { showSummary: true })).join('');
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
    }
  } catch (err) { console.warn('Fetch failed', err); }
}

// 雙層 chip filter：自動掃描 data-content-tag / data-usecase-tags 產生 chips，
// 點擊套用 AND 篩選，「全部」清除該排
// 適用情境 tag 的顯示順序（指定排列，沒在這裡列的會排到最後）
// 統一渲染「30 秒看趨勢」列表項目 — 垂直 stacked layout
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

  // 緊湊版：橫向一行（日期 + tag + 標題 + 箭頭），tags 在標題下方
  if (opts.compact) {
    return `
      <div class="summary-list-item summary-list-item--compact" data-content-tag="${it.tag || ''}" data-usecase-tags="${(it.tags || []).join(',')}" ${onclick}>
        <span class="sli-date">${it.date || ''}</span>
        <span class="feed-tag">${contentTag}</span>
        <div class="sli-compact-body">
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

function sortUsecaseTags(tags) {
  return (tags || []).slice().sort((a, b) => {
    const ia = USECASE_TAG_ORDER.indexOf(a);
    const ib = USECASE_TAG_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
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

  const renderRow = (label, tags, type) => {
    const chipsHtml = ['<button class="chip active" data-filter="全部" data-type="' + type + '">全部</button>']
      .concat(Array.from(tags).map(t => `<button class="chip" data-filter="${t}" data-type="${type}">${t}</button>`))
      .join('');
    return `<div class="filter-row"><span class="filter-label">${label}</span><div class="chips">${chipsHtml}</div></div>`;
  };

  filterContainer.innerHTML = renderRow('內容屬性：', contentTags, 'content')
                            + renderRow('適用情境：', sortedUsecase, 'usecase');

  const state = { content: '全部', usecase: '全部' };
  const applyFilter = () => {
    items.forEach(item => {
      const ct = item.dataset.contentTag || '';
      const ut = (item.dataset.usecaseTags || '').split(',').filter(Boolean);
      const cMatch = state.content === '全部' || ct === state.content;
      const uMatch = state.usecase === '全部' || ut.includes(state.usecase);
      item.style.display = (cMatch && uMatch) ? '' : 'none';
    });
  };

  filterContainer.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.type;
      const filter = chip.dataset.filter;
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state[type] = filter;
      applyFilter();
    });
  });
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
  return fetch('data/tool-intro.json').then(function (r) { return r.json(); }).then(function (items) {
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
        + '<span class="tag">' + escHtml(it.cat) + '</span>'
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
  // URL hash → 立刻切到對應分頁（重新整理保留位置）+ 觸發初次 pageview
  const initialPage = getHashPage() || 'home';
  switchTab(initialPage);

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
    const p = getHashPage() || 'home';
    switchTab(p);
  });

  // 資料載入完後，若停在 archive 分頁需要再 render 一次（issuesData 才有值）
  initDashboardData().then(() => {
    const cur = document.querySelector('.tab.active');
    if (cur && cur.dataset.page === 'archive' && typeof renderArchive === 'function') {
      renderArchive('all');
    }
  });
  renderPrompts();
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
    if (src === '趨勢總覽') return '30 秒看趨勢';
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
  function renderSR(res, q) {
    var b = document.getElementById('searchResults'); if (!b) return;
    if (!q) { b.classList.remove('open'); return; }
    if (res.length === 0) { b.innerHTML = '<div class="search-no-result">找不到相關內容</div>'; b.classList.add('open'); return; }
    b.innerHTML = res.map(function (r) {
      var sourceLabel = getSearchSourceLabel(r);
      var dateLabel = r.date || '';
      return `<div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(r.title).replace(/'/g, "%27")}'))" style="text-decoration:none;cursor:pointer"><div class="search-result-item"><div class="search-result-title">${hl(r.title, q)}</div><div class="search-result-snippet">${hl((r.content || '').slice(0, 120), q)}…</div><div class="search-result-meta">${sourceLabel ? `<span class="search-result-source">${sourceLabel}</span>` : ''}${dateLabel ? `<span class="search-result-date">${dateLabel}</span>` : ''}</div></div></div>`;
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
