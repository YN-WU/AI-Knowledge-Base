function switchTab(page){
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('active',t.dataset.page===page);});
  document.querySelectorAll('.page').forEach(function(p){p.classList.toggle('active',p.id==='page-'+page);});
  window.scrollTo({top:0,behavior:'smooth'});
  
  // 核心修正：切換到歸檔頁時自動載入內容
  if(page === 'archive') {
    if(typeof renderArchive === 'function' && issuesData.length > 0) {
      renderArchive('all');
    }
  }
}
document.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){switchTab(t.dataset.page);});});

// 模型類別切換
document.querySelectorAll('.model-type-tab').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.model-type-tab').forEach(function(x){x.classList.remove('active');});
    t.classList.add('active');
    document.querySelectorAll('.model-type-pane').forEach(function(p){p.classList.toggle('active',p.id==='pane-'+t.dataset.type);});
  });
});
document.querySelectorAll('.chip').forEach(function(c){
  c.addEventListener('click',function(){
    c.parentElement.querySelectorAll('.chip').forEach(function(x){x.classList.remove('active');});
    c.classList.add('active');
    
    // 如果是在存檔頁面
    if(c.parentElement.classList.contains('archive-filters')) {
      if(typeof renderArchive === 'function') renderArchive(c.dataset.filter);
    }
    // 如果是在 PROMPT 專欄
    if(c.parentElement.classList.contains('prompt-filters')) {
      if(typeof renderPrompts === 'function') renderPrompts(c.dataset.filter);
    }
    // 如果是在新聞趨勢
    if(c.parentElement.classList.contains('trend-filters')) {
      var filter = c.dataset.filter;
      var cards = document.querySelectorAll('#trendGrid .article-card');
      cards.forEach(function(card) {
        var tag = card.querySelector('.tag').textContent.trim();
        if(filter === '全部' || tag === filter) {
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

var slideIdx=0,slideTotal=0;
function renderDots(){var d=document.getElementById('sliderDots');if(!d)return;var h='';for(var i=0;i<slideTotal;i++){h+='<div class="slider-dot'+(i===slideIdx?' active':'')+'" onclick="slideGoTo('+i+')"></div>';}d.innerHTML=h;}
function slideGoTo(i){slideIdx=(i+slideTotal)%slideTotal;var t=document.getElementById('slidesTrack');if(t)t.style.transform='translateX(-'+(slideIdx*100)+'%)';renderDots();}
function slideMove(d){slideGoTo(slideIdx+d);}
function initHeroSlider(){
  slideIdx=0;
  slideTotal=document.querySelectorAll('#slidesTrack .slide').length;
  if(slideTotal>0){
    renderDots();
    if(window.__sliderTimer) clearInterval(window.__sliderTimer);
    window.__sliderTimer=setInterval(function(){slideMove(1);},5000);
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

function getTag(title) {
  if(title.includes('實測')) return '網路實測';
  if(title.includes('影片') || title.includes('影音') || title.includes('音樂') || title.includes('Veo') || title.includes('Sora') || title.includes('Lyria') || title.includes('Vidu') || title.includes('可靈')) return '影音創作';
  if(title.includes('生圖') || title.includes('繪圖') || title.includes('圖像') || title.includes('照片') || title.includes('Banana')) return '圖像生成';
  if(title.includes('代理') || title.includes('Agent') || title.includes('助理') || title.includes('Cowork') || title.includes('平台')) return 'AI 代理';
  if(title.includes('搜尋') || title.includes('Search') || title.includes('瀏覽器') || title.includes('Chrome') || title.includes('Atlas')) return '智慧搜尋';
  if(title.includes('法律') || title.includes('版權') || title.includes('專利') || title.includes('訴訟') || title.includes('判')) return '法律規範';
  if(title.includes('登場') || title.includes('發布') || title.includes('推出') || title.includes('更新') || title.includes('Pro') || title.includes('級') || title.includes('模型')) return '模型發布';
  if(title.includes('教戰') || title.includes('技巧') || title.includes('攻略') || title.includes('案例')) return '應用技巧';
  return '產業動態';
}

function showArticle(data) {
  let art;
  if(typeof data === 'string') {
    art = articleData[data];
  } else {
    art = data;
  }
  if(!art) return;
  
  let issueNo = "";
  if(art.url) {
    const m = art.url.match(/(\d+)\.html/);
    issueNo = m ? m[1] : '';
  } else if(art.no) {
    issueNo = art.no;
  }

  const issue = issuesData.find(it => it.no == issueNo || parseInt(it.no) == parseInt(issueNo));
  let displayDate = art.date || (issue ? issue.date : '');
  let displaySource = art.source || (issue ? `TVBS AI Newsletter 第 ${issue.no} 期` : '');
  let displayTag = art.tag || getTag(art.title);
  let displayImg = art.img || (issue ? issue.img : '');

  document.getElementById('amTag').textContent = displayTag;
  document.getElementById('amTitle').textContent = art.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();
  document.getElementById('amCover').style.backgroundImage = `url('${displayImg}')`;
  let bodyHtml = art.fullContent || art.content || '';
  if (art.imgCaption) {
    bodyHtml = `<p style="font-size:12px;color:var(--text-light);font-style:italic;margin-top:-4px;margin-bottom:16px">${art.imgCaption}</p>` + bodyHtml;
  }

  // 推導外連結：優先用 sourceUrl，其次從 art.url 推導舊版電子報網址
  let externalUrl = art.sourceUrl;
  let externalLabel = art.sourceLabel || '原文連結 →';
  if (!externalUrl && art.url && /\/issues\/[^/#]+\.html/.test(art.url)) {
    const path = art.url.startsWith('/') ? art.url : '/' + art.url;
    externalUrl = 'https://ainews.tvbs.ai' + path;
    externalLabel = '閱讀完整文章 →';
  }
  if (externalUrl) {
    bodyHtml += `<p style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);text-align:center"><a href="${externalUrl}" target="_blank" style="display:inline-block;padding:10px 20px;background:linear-gradient(135deg,var(--accent),var(--primary));color:#0a1228;border-radius:999px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.5px;box-shadow:0 0 16px rgba(94,245,255,0.3)">${externalLabel}</a></p>`;
  }
  document.getElementById('amBodyContent').innerHTML = bodyHtml;
  document.getElementById('amMeta').textContent = `${displaySource} ・ ${displayDate}`;
  document.getElementById('articleModal').classList.add('active');
}

function showArticleByTitle(title) {
  if(!title) return;
  const cleanTitle = title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();
  // 優先匹配完全一致的標題
  let item = searchIndex.find(it => it.title === title);
  // 次之匹配不含 Emoji 的純文字部分
  if(!item) item = searchIndex.find(it => it.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim() === cleanTitle);
  // 再者匹配包含關係
  if(!item) item = searchIndex.find(it => it.title.includes(cleanTitle) || cleanTitle.includes(it.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim()));

  if(item) {
    showArticle(item);
  } else {
    for(let k in articleData) {
      const art = articleData[k];
      if(art.title === title || art.title.includes(cleanTitle)) {
        showArticle(k);
        return;
      }
    }
  }
}

function closeArticle() {
  document.getElementById('articleModal').classList.remove('active');
}
function renderArchive(f){
  const g = document.getElementById('archiveGrid'); if(!g || !issuesData.length) return;
  const filtered = issuesData.filter(it => !f || f === 'all' || it.year === f);
  g.innerHTML = filtered.map(it => {
    const cv = it.img ? `background-image:linear-gradient(0deg,rgba(10,18,40,0.5),transparent),url('${it.img}')` : 'background:linear-gradient(135deg,#4f6dff,#2d4bdb)';
    const isSpecial = !/^\d+$/.test(it.no);
    const coverLabel = isSpecial ? '特刊' : `VOL. ${it.no}`;
    const issueLabel = isSpecial ? `${it.date}` : `第 ${it.no} 期 ・ ${it.date}`;
    return `
      <div class="archive-card" onclick="window.open('https://ainews.tvbs.ai/issues/${it.no}.html','_blank')">
        <div class="cover" style="${cv}">
          <div class="cover-label">${coverLabel}</div>
        </div>
        <div class="body">
          <div class="issue-num">${issueLabel}</div>
          <h4>${it.title}</h4>
          <div class="desc" style="font-size:12px;color:var(--text-light);margin-top:8px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${it.desc || ''}</div>
          <div class="foot" style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(255,255,255,0.4)">
            <span>${it.date}</span>
            <span style="color:var(--accent)">閱讀 →</span>
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
      fetch('data/news-feed.json').then(r => r.ok ? r.json() : []).catch(() => [])
    ]);
    issuesData = results[0] || [];
    searchIndex = results[1] || [];

    // 文章流（article-centric, 取代每期 JSON）
    const articles = (results[2] || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    window.__articles = articles;
    articles.forEach(a => {
      const sourceLabel = a.issueNo ? `TVBS AI Newsletter 第 ${a.issueNo} 期` : 'TVBS AI 知識庫';
      searchIndex.push({
        title: a.title,
        content: a.summary || '',
        fullContent: a.content || '',
        url: a.issueNo ? `/issues/${a.issueNo}.html#article-${a.id}` : `/article-${a.id}`,
        img: a.image,
        tag: a.tag,
        date: a.date,
        source: sourceLabel,
        sourceUrl: a.sourceUrl,
        sourceLabel: a.sourceLabel,
        imgCaption: a.imageCaption
      });
    });

    // AI 新聞快訊
    const feed = (results[3] || []).slice();  // 保留 JSON 的編輯順序（主題分類）
    window.__newsFeed = feed;
    const fallbackImg = articles[0] ? articles[0].image : '';
    feed.forEach(f => {
      searchIndex.push({
        title: f.title,
        content: f.summary || '',
        fullContent: `<p class="first-paragraph">${f.summary || ''}</p>`,
        url: f.sourceUrl || `/news-feed#${f.id}`,
        img: f.img || fallbackImg,
        tag: f.tag,
        date: f.date,
        source: 'AI 新聞快訊'
      });
    });

    if(issuesData.length > 0 || articles.length > 0) {
      // 用最新文章的 metadata 當 home 的 'issue' 代理
      const latestArt = articles[0];
      const issue = latestArt ? {
        no: latestArt.issueNo || '最新',
        date: latestArt.date || '',
        title: latestArt.title,
        desc: latestArt.summary,
        img: latestArt.image
      } : (issuesData.find(it => it.no === "018") || issuesData[0]);
      const label = document.getElementById('latestIssueLabel');
      if(label) label.textContent = `VOL. ${issue.no}`;
      const heroContainer = document.getElementById('latestHeroContainer');
      const articles019 = articles.filter(a => a.featured).slice(0, 5);
      if(heroContainer) {
        if(articles019.length >= 1) {
          // 第 019 期 (或之後的原生內容): Hero Slider，5 秒自動切換
          heroContainer.innerHTML = `
            <div class="hero-slider">
              <div class="slides-track" id="slidesTrack">
                ${articles019.map(a => `
                  <div class="slide" style="background-image:linear-gradient(135deg,rgba(10,18,40,0.4),rgba(10,18,40,0.1)),url('${a.image}')" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(a.title).replace(/'/g, "%27")}'))">
                    <div class="slide-content">
                      <span class="slide-tag">${a.tag || getTag(a.title)}</span>
                      <h2 class="slide-title">${a.title}</h2>
                      <p class="slide-desc">${a.summary || ''}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="slider-arrow prev" onclick="event.stopPropagation();slideMove(-1)">‹</button>
              <button class="slider-arrow next" onclick="event.stopPropagation();slideMove(1)">›</button>
              <div class="slider-dots" id="sliderDots"></div>
            </div>`;
          initHeroSlider();
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
      const issueArticles = searchIndex.filter(it => it.url && it.url.includes(`${issue.no}.html`));

      // TOC
      const tocWrap = document.getElementById('latestIssueTOC');
      if(tocWrap) {
        tocWrap.innerHTML = issueArticles
          .filter(it => !it.title.includes('本期重點摘要') && !it.title.includes('科技精選新聞'))
          .map(it => `
          <div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(it.title).replace(/'/g, "%27")}'))" class="toc-item">
            <span class="toc-dot"></span>
            <span class="toc-title">${it.title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim()}</span>
          </div>`).join('');
      }

      // 渲染 AI 新聞快訊：扁平列表（不顯示日期）
      const feedWrap = document.getElementById('newsFeedWrap');
      if(feedWrap && Array.isArray(window.__newsFeed)) {
        const totalCount = window.__newsFeed.length;
        const itemsHtml = window.__newsFeed.map(f => {
          const tipText = (f.summary || '').replace(/"/g, '&quot;');
          const tag = `<span class="feed-tag">${f.tag || ''}</span>`;
          const body = `<div class="feed-body"><div class="feed-title">${f.title}</div><div class="feed-summary">${f.summary || ''}</div></div>`;
          return f.sourceUrl
            ? `<a class="feed-item" href="${f.sourceUrl}" target="_blank" rel="noopener" title="${tipText}">${tag}${body}</a>`
            : `<div class="feed-item feed-item--noLink" title="${tipText}">${tag}${body}</div>`;
        }).join('');
        feedWrap.innerHTML = `<div class="news-feed-header"><span class="news-feed-header-label">AI 新聞快訊</span><span class="news-feed-header-line"></span><span style="font-size:11px;color:var(--text-light);white-space:nowrap">${totalCount} 則精選</span></div><div class="feed-day">${itemsHtml}</div>`;
      }
      // 5. AI 趨勢消息卡片牆 (Trend Grid) — 含第 010 期之後所有文章
      const trendWrap = document.getElementById('trendGrid');
      if(trendWrap) {
        // 收集所有要在趨勢頁顯示的期號：新文章的 issueNo + 舊期 010+
        const articleIssueNos = [...new Set(articles.map(a => a.issueNo).filter(Boolean))];
        const legacyNos = issuesData
          .map(it => it.no)
          .filter(no => /^\d+$/.test(no));
        const recentNos = [...new Set([...articleIssueNos, ...legacyNos])]
          .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

        const trendItems = recentNos.flatMap(no => {
          const iss = issuesData.find(it => it.no === no)
            || (latestArt && latestArt.issueNo === no ? { no, date: latestArt.date, img: latestArt.image } : { no, date: '', img: '' });
          return searchIndex
            .filter(it => it.url && it.url.includes(`${no}.html`))
            .filter(it => !it.title.match(/[🛠️💡🧩🌟]/) && !it.title.includes('重點摘要') && !it.title.includes('精選新聞'))
            .map(it => ({ ...it, issueDetail: iss }));
        });

        trendWrap.innerHTML = trendItems.map(it => {
          const iss = it.issueDetail;
          const isNative = it.url && it.url.includes('#article-');
          const artImg = it.img || iss.img || 'https://i.meee.com.tw/zg5kCCS.webp';
          // 新文章顯示日期，舊期顯示期號 + 日期
          let metaLeft, metaRight;
          if (isNative) {
            metaLeft = '最新文章';
            metaRight = '';
          } else {
            metaLeft = `第 ${iss.no} 期`;
            metaRight = iss.date || '';
          }
          return `
            <div class="article-card" onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(it.title).replace(/'/g, "%27")}'))">
              <div class="article-cover" style="background-image:url('${artImg}')"></div>
              <span class="tag">${it.tag || getTag(it.title)}</span>
              <h4>${it.title}</h4>
              <div class="summary">${(it.content||'').substring(0,80)}...</div>
              <div class="article-meta">
                <span>${metaLeft}</span>
                <span>${metaRight}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) { console.warn('Fetch failed', err); }
}


// ============ Data-driven renderers (B-phase refactor) ============
function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(m) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m];
  });
}

function toolCardHtml(t, internal) {
  var cls = 'tool-card-big' + (internal ? ' internal-highlight' : '');
  return '<a href="' + escHtml(t.url) + '" target="_blank" class="' + cls + '">'
    + '<div class="tool-icon logo-icon" style="background:' + escHtml(t.iconBg) + '">'
    +   '<img src="' + escHtml(t.logo) + '" alt="' + escHtml(t.name) + '">'
    + '</div>'
    + '<div class="tool-info">'
    +   '<div class="tool-name">' + escHtml(t.name) + '</div>'
    +   '<div class="tool-sub">' + escHtml(t.sub) + '</div>'
    + '</div></a>';
}

function renderTools() {
  var c = document.getElementById('toolsContainer');
  if (!c) return;
  return fetch('data/tools.json').then(function(r){return r.json();}).then(function(d) {
    var html = '';
    if (d.internal && d.internal.length) {
      html += '<div class="tool-section"><div class="section-title">公司內部 AI 工具</div><div class="tool-grid">'
        + d.internal.map(function(t){ return toolCardHtml(t, true); }).join('')
        + '</div></div>';
    }
    if (d.categories && d.categories.length) {
      html += '<div class="section-title" style="margin-top:16px">常用外部工具</div>';
      d.categories.forEach(function(cat) {
        html += '<div class="tool-section">'
          + '<div class="tool-section-title">' + escHtml(cat.title) + '</div>'
          + '<div class="tool-grid">'
          + cat.tools.map(function(t){ return toolCardHtml(t, false); }).join('')
          + '</div></div>';
      });
    }
    c.innerHTML = html;
  }).catch(function(e){ console.warn('renderTools failed', e); });
}

function renderToolIntro() {
  var c = document.getElementById('toolIntroContainer');
  if (!c) return;
  return fetch('data/tool-intro.json').then(function(r){return r.json();}).then(function(items) {
    c.innerHTML = items.map(function(it) {
      var inner = '<span class="pc-cat">' + escHtml(it.cat) + '</span>'
        + '<div class="pc-title">' + escHtml(it.title) + '</div>'
        + '<div class="pc-sub">' + escHtml(it.sub) + '</div>'
        + '<div class="pc-footer"><span class="pc-issue">收錄於第 ' + Number(it.issue) + ' 期</span><span>'
        + (it.openInModal ? '閱讀詳情 →' : '閱讀原文 →')
        + '</span></div>';
      if (it.openInModal) {
        var titleEnc = encodeURIComponent(it.title).replace(/'/g, "%27");
        return '<div class="prompt-compact-card" onclick="showArticleByTitle(decodeURIComponent(\'' + titleEnc + '\'))" style="cursor:pointer">' + inner + '</div>';
      }
      return '<a href="' + escHtml(it.url) + '" target="_blank" class="prompt-compact-card" style="text-decoration:none">' + inner + '</a>';
    }).join('');
  }).catch(function(e){ console.warn('renderToolIntro failed', e); });
}

function renderPromptSites() {
  var c = document.getElementById('promptSitesContainer');
  if (!c) return;
  return fetch('data/prompt-sites.json').then(function(r){return r.json();}).then(function(sections) {
    c.innerHTML = sections.map(function(sec, idx) {
      var topMargin = idx === 0 ? '16px' : '32px';
      return '<div class="tool-section-title" style="margin-top:' + topMargin + ';padding-left:12px;border-left:4px solid ' + sec.barColor + '">'
        + escHtml(sec.title) + '</div>'
        + '<div class="prompt-sites-grid" style="margin-top:14px">'
        + sec.sites.map(function(s) {
            return '<a href="' + escHtml(s.url) + '" target="_blank" class="prompt-site-card">'
              + '<div class="site-icon" style="background:' + escHtml(s.iconBg) + '">' + escHtml(s.icon) + '</div>'
              + '<div class="site-info"><div class="site-name">' + escHtml(s.name) + '</div><div class="site-desc">' + escHtml(s.desc) + '</div></div>'
              + '</a>';
          }).join('')
        + '</div>';
    }).join('');
  }).catch(function(e){ console.warn('renderPromptSites failed', e); });
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboardData();
  renderPrompts();
  renderTools();
  renderToolIntro();
  renderPromptSites();
  
  // 搜尋邏輯
  // 使用全局 searchIndex
  function loadSearchIndex() {
    return new Promise(function(r) {
      if(searchIndex && searchIndex.length > 0) { r(searchIndex); return; }
      fetch('tvbs-ai-newsletter/search-index.json').then(function(x) { return x.json(); }).then(function(d) {
        searchIndex = d; r(d);
      }).catch(function() { searchIndex = []; r([]); });
    });
  }
  function doSearch(q) {
    if(!searchIndex || !q) return [];
    var k = q.toLowerCase().trim();
    return searchIndex.filter(function(it) {
      return (it.title || '').toLowerCase().indexOf(k) >= 0 || (it.content || '').toLowerCase().indexOf(k) >= 0;
    }); // 已移除 .slice(0, 20)
  }
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function(m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m];
    });
  }
  function hl(t, q) {
    var s = esc(t); if(!q) return s;
    var qq = esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return s.replace(new RegExp(qq, 'gi'), function(m) {
      return '<mark style="background:rgba(94,245,255,0.3);color:var(--accent);padding:0 2px">' + m + '</mark>';
    });
  }
  function renderSR(res, q) {
    var b = document.getElementById('searchResults'); if(!b) return;
    if(!q) { b.classList.remove('open'); return; }
    if(res.length === 0) { b.innerHTML = '<div class="search-no-result">找不到相關內容</div>'; b.classList.add('open'); return; }
    b.innerHTML = res.map(function(r) {
      var m = (r.url || '').match(/(\d{3})\.html/);
      var no = m ? m[1] : '';
      var u = 'https://ainews.tvbs.ai' + (r.url.indexOf('/') === 0 ? r.url : '/' + r.url);
      return `<div onclick="showArticleByTitle(decodeURIComponent('${encodeURIComponent(r.title).replace(/'/g, "%27")}'))" style="text-decoration:none;cursor:pointer"><div class="search-result-item"><div class="search-result-title">${hl(r.title, q)}</div><div class="search-result-snippet">${hl((r.content || '').slice(0, 120), q)}…</div>${no ? `<div class="search-result-meta">第 ${no} 期</div>` : ''}</div></div>`;
    }).join('');
    b.classList.add('open');
  }
  var si = document.getElementById('searchInput');
  if(si) {
    var dt;
    si.addEventListener('input', function(e) {
      clearTimeout(dt); var q = e.target.value;
      dt = setTimeout(function() { loadSearchIndex().then(function() { renderSR(doSearch(q), q); }); }, 150);
    });
    si.addEventListener('focus', function(e) {
      loadSearchIndex().then(function() { if(e.target.value) renderSR(doSearch(e.target.value), e.target.value); });
    });
    document.addEventListener('click', function(e) { if(!e.target.closest('.search-box')) { var b = document.getElementById('searchResults'); if(b) b.classList.remove('open'); } });
  }
});
