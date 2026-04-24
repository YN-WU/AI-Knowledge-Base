// scripts.js (電子報專用 - 最終整合版 v4) - 2025-08-14

// ==================================================
// 主要設定區
// ==================================================
//
// ╔══════════════════════════════════════════════════════════╗
// ║  出新期 Checklist — 每次出刊前必須更新以下 3 個地方      ║
// ║  1. 本檔案：更新 latestIssueValue（下方）                ║
// ║             在 issuesData 頂部加入新期物件               ║
// ║  2. index.html：更新 <meta http-equiv="refresh"> URL    ║
// ║  3. search-index.json：新增該期所有文章條目              ║
// ╚══════════════════════════════════════════════════════════╝
//
// === 動態載入期數資料 ===
let issuesData = []; // 初始化為空
let latestIssueValue = '018'; // 預設安全值

async function loadIssuesData() {
    try {
        // 自動判斷路徑 (根目錄在頂層，issues 頁面在兩層子目錄下)
        // 結構： /ai-newsletter-dashboard.html -> ./tvbs-ai-newsletter/
        // 結構： /tvbs-ai-newsletter/issues/0xx.html -> ../
        const pathPrefix = window.location.pathname.includes('/issues/') ? '../' : './tvbs-ai-newsletter/';
        const response = await fetch(pathPrefix + 'issues-metadata.json');
        
        if(!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // 格式化為選單需要的 text 格式
        issuesData = data.map(it => ({
            value: it.no,
            text: `第${it.no}期 | ${it.date}`
        }));
        
        const latest = data.find(it => it.img !== "") || data[0];
        latestIssueValue = latest.no;
        
        return true;
    } catch (err) {
        console.error('無法載入期數元資料:', err);
        return false;
    }
}

// === GA4 事件追蹤：外部連結點擊 ===
function trackOutboundLink(event) {
    const link = event.target.closest('a');
    if (link && link.href) {
        const currentHostname = window.location.hostname;
        let linkHostname;
        try { linkHostname = new URL(link.href).hostname; } catch (e) { return; }
        if (linkHostname !== currentHostname && link.href.indexOf('javascript:') !== 0 && link.href.indexOf('mailto:') !== 0) {
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'outbound', 'event_label': link.href,
                    'link_url': link.href, 'link_text': link.innerText || link.textContent || 'N/A',
                    'link_domain': linkHostname
                });
            }
        }
    }
}

// === 下拉選單變更處理 ===
function changePeriod() {
    const select = document.getElementById('periodSelect');
    const selectedValue = select.value;
    if (selectedValue) {
        // 取得當前路徑決定跳轉目標
        const isSubPage = window.location.pathname.includes('/issues/');
        const targetUrl = isSubPage ? `${selectedValue}.html` : `./issues/${selectedValue}.html`;
        window.location.href = targetUrl;
    }
}

// === 動態產生下拉選單選項 ===
function populateDropdown() {
    const select = document.getElementById('periodSelect');
    if (!select) return;
    select.innerHTML = '';
    issuesData.forEach(issue => {
        const option = document.createElement('option');
        option.value = issue.value;
        option.textContent = issue.text;
        select.appendChild(option);
    });
}

// === 數字滾動動畫函數 ===
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rawTarget = entry.target.dataset.target;
                // 嘗試解析數字 (移除逗號等非數字字元)
                const target = parseFloat(String(rawTarget).replace(/,/g, ''));

                // 如果不是有效數字 (例如 "All" 或 "100萬")，直接顯示原始文字並結束
                if (isNaN(target)) {
                    entry.target.innerText = rawTarget;
                    observer.unobserve(entry.target);
                    return;
                }

                const speed = 200;
                const update = () => {
                    const current = +entry.target.innerText;
                    const increment = target / speed;
                    if (current < target) {
                        entry.target.innerText = `${Math.ceil(current + increment)}`;
                        setTimeout(update, 10);
                    } else {
                        // 動畫結束後，如果是純數字則顯示目標值
                        // 如果原本是類似 "100" 這種純數字字串，這樣依然正確
                        entry.target.innerText = target;
                    }
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => { observer.observe(stat); });
}

// === 快速跳轉導覽列：初始化函數 (完整版) ===
function initQuickJumpNav() {
    const navContainer = document.getElementById('quickJumpNav');
    const navList = document.getElementById('quickJumpList');
    const toggleButton = document.getElementById('quickJumpToggle');
    const contentBlocks = document.querySelectorAll('.news-item, .section');

    if (!navList || !contentBlocks.length) {
        if (navContainer) navContainer.style.display = 'none';
        if (toggleButton) toggleButton.style.display = 'none';
        return;
    }

    navList.innerHTML = '';
    let sections = [];

    contentBlocks.forEach((block, index) => {
        if (block.classList.contains('social-connect-section')) return;
        let titleText = '';
        const id = `section-jump-${index}`;
        const h2 = block.querySelector('h2.section-title');
        const h3 = block.querySelector('h3');
        const mainTitle = h2 ? h2.textContent.trim() : (h3 ? h3.textContent.trim() : '');
        // 使用 textContent 確保只抓取純文字，避免 HTML 標籤污染 (如 <span>, <br>)
        const subTitle = h2 && h3 ? h3.textContent.trim().replace(/\s+/g, ' ') : '';
        if (mainTitle && subTitle && mainTitle !== subTitle) {
            titleText = `${mainTitle}：${subTitle}`;
        } else {
            titleText = mainTitle;
        }
        if (titleText) {
            block.id = id;
            sections.push(block);
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = titleText;
            link.title = titleText;
            listItem.appendChild(link);
            navList.appendChild(listItem);
        }
    });

    if (!navList.hasClickListener) {
        navList.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const targetId = event.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // 使用 window.scrollTo 替代 scrollIntoView，添加頂部偏移量
                    window.scrollTo({
                        top: targetElement.offsetTop - 150, // 添加150px的頂部偏移
                        behavior: 'smooth'
                    });
                    if (navContainer && navContainer.classList.contains('is-mobile-active')) {
                        navContainer.classList.remove('is-mobile-active');
                    }
                }
            }
        });
        navList.hasClickListener = true;
    }

    if (window.scrollSpyHandler) {
        window.removeEventListener('scroll', window.scrollSpyHandler);
    }
    let scrollTimeout;
    window.scrollSpyHandler = function () {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            let currentSectionId = '';
            const scrollPosition = window.scrollY + (window.innerHeight * 0.4);
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            if (Math.ceil(window.scrollY + clientHeight) >= scrollHeight - 5) {
                if (sections.length > 0) {
                    currentSectionId = sections[sections.length - 1].id;
                }
            } else {
                for (let i = sections.length - 1; i >= 0; i--) {
                    const section = sections[i];
                    if (section.offsetTop <= scrollPosition) {
                        currentSectionId = section.id;
                        break;
                    }
                }
            }
            const allLinks = navList.querySelectorAll('a');
            allLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }, 100);
    };
    window.addEventListener('scroll', window.scrollSpyHandler);

    if (toggleButton) {
        if (!toggleButton.hasClickListener) {
            toggleButton.addEventListener('click', function () {
                navContainer.classList.toggle('is-mobile-active');
            });
            toggleButton.hasClickListener = true;
        }
    }
}

// === 全站搜尋功能 (使用 Fuse.js) ===
async function loadSearchIndex() {
    if (fuse) return;
    try {
        const response = await fetch('../search-index.json');
        const searchIndex = await response.json();
        const options = {
            keys: ['title', 'content'], includeScore: true,
            threshold: 0.4, minMatchCharLength: 2,
        };
        fuse = new Fuse(searchIndex, options);
    } catch (error) {
        console.error('無法載入搜尋索引:', error);
    }
}

function initSiteSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            resultsContainer.classList.remove('active');
            return;
        }
        if (fuse) {
            const results = fuse.search(query);
            resultsContainer.innerHTML = '';
            if (results.length > 0) {
                results.forEach(result => {
                    const item = result.item;
                    const resultElement = document.createElement('a');
                    resultElement.href = item.url;
                    resultElement.className = 'search-result-item';
                    resultElement.innerHTML = `<h5>${item.title}</h5><p>${item.content}</p>`;
                    // 添加點擊事件處理，實現更好的滾動定位
                    resultElement.addEventListener('click', function (e) {
                        e.preventDefault();
                        const url = new URL(this.href, window.location.origin);
                        if (url.hash) {
                            // 如果是當前頁面的錨點
                            if (url.pathname === window.location.pathname) {
                                const targetElement = document.querySelector(url.hash);
                                if (targetElement) {
                                    // 滾動到目標元素，並添加頂部偏移量
                                    window.scrollTo({
                                        top: targetElement.offsetTop - 150, // 添加150px的頂部偏移
                                        behavior: 'smooth'
                                    });
                                    return;
                                }
                            }
                        }
                        // 如果不是當前頁面或找不到目標元素，則正常導航
                        window.location.href = this.href;
                    });
                    resultsContainer.appendChild(resultElement);
                });
            } else {
                resultsContainer.innerHTML = '<div class="no-results">找不到相關內容</div>';
            }
            resultsContainer.classList.add('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            resultsContainer.classList.remove('active');
        }
    });

    // 處理從其他頁面跳轉過來的錨點
    if (window.location.hash) {
        // 使用 setTimeout 確保頁面完全載入後再執行
        setTimeout(function () {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // 滾動到目標元素，並添加頂部偏移量
                window.scrollTo({
                    top: targetElement.offsetTop - 150, // 添加150px的頂部偏移
                    behavior: 'smooth'
                });
            }
        }, 300); // 延遲一點時間確保頁面已完全載入
    }
}

// ==================================================
// 頁面載入後執行的主要腳本 (唯一的入口點！)
// ==================================================
document.addEventListener('DOMContentLoaded', async function () {
    await loadIssuesData();
    populateDropdown();

    const select = document.getElementById('periodSelect');
    const headerP = document.querySelector('.header p');
    if (!select || !headerP) return;

    // 根據當前頁面的檔名，設定下拉選單的預設值和頁首文字
    const currentPagePath = window.location.pathname;
    const match = currentPagePath.match(/\/issues\/([^/]+)\.html$/);
    const currentIssueValue = match ? match[1] : latestIssueValue;

    select.value = currentIssueValue;
    const currentSelectedOption = select.querySelector(`option[value="${select.value}"]`);
    if (currentSelectedOption) {
        headerP.textContent = currentSelectedOption.text;
    }

    // 初始化所有頁面共用的功能
    initQuickJumpNav();
    animateNumbers();
    initSiteSearch();
    loadSearchIndex(); // 預先載入搜尋資料

    // 綁定事件監聽器
    select.addEventListener('change', changePeriod);
    document.addEventListener('click', trackOutboundLink);
});