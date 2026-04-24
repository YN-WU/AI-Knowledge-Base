const fs = require('fs');
const content = fs.readFileSync('017.html', 'utf8');

// Prepare base template from 017
let template = content.replace('第017期 | 2026年1月', '第018期 | 2026年3月');

const startMarker = '<div class="outline-box">';
const endMarker = '<section class="social-connect-section">';

const startIndex = template.indexOf(startMarker);
const endIndex = template.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found in 017.html");
    process.exit(1);
}

const prefix = template.substring(0, startIndex);
const suffix = template.substring(endIndex);

const bodyContent = `        <div class="outline-box">
            <h2>本期重點摘要</h2>
            <ul>
                <li><a href="#section-jump-0">Claude Sonnet 4.6 登場！沒 API 也能操作電腦</a></li>
                <li><a href="#section-jump-1">Gemini 3.1 Pro 正式發布！推理能力翻倍</a></li>
                <li><a href="#section-jump-2">AI 輔助功能再進化！Deep Research & Deep Think</a></li>
                <li><a href="#section-jump-3">陸 AI 影片生成技術大突破 Seedance 2.0 與 Vidu Q3</a></li>
                <li><a href="#section-jump-4">Gemini 加入音樂生成模型 Lyria 3</a></li>
                <li><a href="./hackathon-special.html" style="color: #ff4e50; font-weight: bold;">🚀【黑客松特別企劃】AI 備戰指南 (Antigravity)</a></li>
                <li><a href="#section-jump-6">🗞️ 本期 AI 精選新聞短評 (23篇)</a></li>
            </ul>
        </div>

        <div class="news-item" id="section-jump-0">
            <span class="tag">Anthropic</span>
            <span class="tag">Claude Sonnet 4.6</span>
            <span class="tag">自動化</span>
            <h3>Claude Sonnet 4.6 登場！沒 API 也能操作電腦 支援百萬詞元處理</h3>
            <div class="news-content">
                <div class="news-image-top">
                    <img src="https://i.meee.com.tw/oC4Bugq.png" alt="Claude Sonnet 4.6 登場">
                    <p style="font-size: 12px; color: #888888; font-style: italic; margin: 10px 0 0 0; text-align: center;">
                        Claude Sonnet 4.6 登場。( 圖 / 翻攝自 Anthropic 官網 )
                    </p>
                </div>
                <div class="news-columns">
                    <div class="column">
                        <p class="first-paragraph">Anthropic 日前正式推出全新中階 AI 模型 Claude Sonnet 4.6。此次更新以維持前代平易定價為基礎，全面升級自動化流程與開發輔助能力，重點功能特色如下：</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">突破性電腦操控能力：</h4>
                        <p>Sonnet 4.6 能在不依賴特殊 API 的情況下，以接近人類操作滑鼠與鍵盤的方式，自主跨軟體（如 Chrome、VS Code、LibreOffice）完成導航試算表或跨分頁填寫表單等複雜任務，有效解決老舊系統自動化的痛點。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">高階程式開發與美學生成：</h4>
                        <p>在內部評測中，高達 70% 用戶偏好 Sonnet 4.6 勝過前代。它能精準理解既有程式脈絡、減少過度設計與幻覺；同時，生成的網頁前端代碼與數據報告更具備專業設計美感，大幅降低生產修改成本。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">100 萬詞元（Token）上下文視窗：</h4>
                        <p>首度支援單次容納大型程式庫、數百頁合約或數十份論文。模型展現了卓越的長程策略規劃能力，且處理繁雜企業文件（OfficeQA）的深度推理表現較前代提升 15%。</p>
                    </div>
                    <div class="column">
                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">四大彈性工作流功能：</h4>
                        <ul>
                            <li><strong>適應性與擴展思考：</strong>模型可依任務難度自動調整推理深度，開發者亦能手動控制思考深度以解決艱難難題。</li>
                            <li><strong>上下文壓縮：</strong>當對話逼近長度上限時，系統會自動摘要舊內容，確保長程任務不中斷。</li>
                            <li><strong>動態過濾機制：</strong>API 網路搜尋能自動撰寫程式碼來篩選結果，僅保留高相關性內容以節省詞元消耗。</li>
                            <li><strong>支援 MCP 串接：</strong>支援直接於 Excel 中調用S&P Global、Moody's 等外部專業金融數據，不需再切換視窗。</li>
                        </ul>

                        <p style="margin-top: 20px;">此外，Sonnet 4.6 對抗惡意指令注入（Prompt Injection）的資安防護水準已提升至與旗艦模型 Opus 4.6 齊平。該模型 API 定價維持每百萬輸入 3 美元、輸出 15 美元，目前已於所有 Claude 方案及主要雲端平臺全面上線。</p>
                    </div>
                </div>
                <div class="link-group" style="text-align: center; margin-top: 20px;">
                    <a href="https://www.anthropic.com/news/claude-sonnet-4-6" target="_blank" class="news-link">官方完整介紹 →</a>
                </div>
            </div>
        </div>

        <div class="news-item" id="section-jump-1">
            <span class="tag">Google</span>
            <span class="tag">Gemini 3.1 Pro</span>
            <span class="tag">邏輯推理</span>
            <h3>Gemini 3.1 Pro 正式發布！推理能力翻倍 四大突破應用一次看</h3>
            <div class="news-content">
                <div class="news-image-top">
                    <img src="https://i.meee.com.tw/7hzq4yP.webp" alt="Gemini 3.1 Pro 發布">
                    <p style="font-size: 12px; color: #888888; font-style: italic; margin: 10px 0 0 0; text-align: center;">
                        Gemini 3.1 Pro 發布。( 圖 / 翻攝自 Google Blog )
                    </p>
                </div>
                <div class="news-columns">
                    <div class="column">
                        <p class="first-paragraph">Google 正式推出最新 AI 模型 Gemini 3.1 Pro，專為解決需要多重轉折與思考的複雜任務而生。本次重大更新不僅大幅提升了邏輯推理能力，更將高階推理能力轉化為極具視覺張力與實用性的實戰功能，為開發者與各界用戶帶來四大突破性應用。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">Gemini 3.1 Pro 推理效能翻倍</h4>
                        <p>在測試邏輯推理力的 ARC-AGI-2 基準測試中， Gemini 3.1 Pro 取得 77.1% 驗證分數，是前代 Gemini 3 Pro（31.1%）的兩倍多。在跨學科領域的 Humanity’s Last Exam 測試上，3.1 Pro 以 44.4% 分數領先 Gemini 3 Pro（37.5%）及 GPT-5.2（34.5%）。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">1. 純程式碼動態圖像生成（Code-based animation）</h4>
                        <p>Gemini 3.1 Pro 能夠直接根據文字指令，生成網頁專用的 SVG 向量動畫。這些動畫完全由純程式碼構成，不僅檔案體積極小、不佔用頻寬，更具備在任何高畫質螢幕下放大皆不失真的優勢，為網頁設計與開發帶來極大便利。</p>
                    </div>
                    <div class="column">
                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">2. 複雜系統整合與視覺化（Complex system synthesis）</h4>
                        <p>該模型展現了橋接複雜技術數據與直覺介面的強大實力。例如，它能精準解析公開的遙測 API 數據流，自動構建出一個追蹤國際太空站（ISS）軌道的即時儀表板，成功將深奧的航太數據轉化為一般人也能看懂的科技感視覺介面。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">3. 沉浸式互動設計（Interactive design）</h4>
                        <p>在多模態（包括圖文影音）資訊處理上，模型可編寫出複雜的 3D 椋鳥群飛（Murmuration）模擬器。這項功能結合了手勢追蹤技術與生成式音效，使聲音能隨著鳥群的移動與使用者的操作產生動態變化，打造出結合視覺、聽覺與觸覺的沉浸式體驗。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">4. 氛圍理解與文學轉化（Creative coding）</h4>
                        <p>Gemini 3.1 Pro 具備細膩的「氛圍感推理」能力。以經典名著《咆哮山莊》為例，模型能深度理解小說中壓抑、荒野的抽象情感，並將其轉化為充滿藝術氣息且具備功能性的現代感網站設計，突破了過往模型僅能單一抓取字面關鍵字的限制。</p>

                        <p style="margin-top: 20px;">Google 表示，Gemini 3.1 Pro 預覽版目前已於多個平台陸續釋出。一般消費者可透過 Gemini App 與 NotebookLM（Pro 與 Ultra 訂閱用戶）體驗；開發者與企業則可經由 Gemini API (Google AI Studio)、Vertex AI、Android Studio 等工具進行存取。</p>
                    </div>
                </div>
                <div class="link-group" style="text-align: center; margin-top: 20px;">
                    <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/" target="_blank" class="news-link">官方完整介紹 →</a>
                </div>
            </div>
        </div>

        <div class="news-item" id="section-jump-2">
            <span class="tag">OpenAI</span>
            <span class="tag">Google</span>
            <span class="tag">AI 輔助</span>
            <h3>AI 輔助功能再進化！ChatGPT Deep Research 與 Google Deep Think 的差異比較</h3>
            <div class="news-content">
                <div class="news-image-top">
                    <img src="https://i.meee.com.tw/2QkK5x7.png" alt="Deep Research 與 Deep Think">
                    <p style="font-size: 12px; color: #888888; font-style: italic; margin: 10px 0 0 0; text-align: center;">
                        Deep Research 與 Deep Think。( 圖 / 翻攝自 OpenAI、Google 官網 )
                    </p>
                </div>
                <div class="news-columns">
                    <div class="column">
                        <p class="first-paragraph">近期，OpenAI 與 Google 相繼推出了深度研究與思考領域的最新功能：ChatGPT 的 Deep Research 與 Gemini 的 Deep Think。兩者皆旨在提升 AI 處理複雜任務的能力，但在功能側重、搜尋機制及應用場景上各自展現了獨特的優勢。以下從三方面比較兩者的差異：</p>
                        
                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">1. 功能核心設計</h4>
                        <p><strong>Deep Research</strong></p>
                        <p>由 OpenAI 推出，是一款專注於「長時研究任務」的 AI 工具。它能夠自動執行多步驟的研究流程，包括：搜尋資訊、篩選來源、擷取數據，最終產出一份結構完整的綜合報告。使用者可預先設定研究方向與報告格式，系統甚至在需要時主動提問以釐清需求。其核心優勢在於：</p>
                        <ul>
                            <li>自動化深度資料蒐集。</li>
                            <li>具備長遠規畫與推理能力。</li>
                            <li>預設生成詳盡、結構化的總結報告。</li>
                        </ul>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">2. 搜尋技術與資訊來源</h4>
                        <p><strong>Deep Research</strong></p>
                        <p>主要依賴網際網路與龐大的開源資料庫。在生成報告前，它會廣泛爬梳網頁，並提供詳細的參考文獻與來源連結，確保報告內容的可追溯性與客觀性。其強大的長上下文處理能力（基於 o3 推理模型），能容許處理大量文件檔案，適合進行文獻回顧與產業分析。</p>
                    </div>
                    <div class="column">
                        <p><strong>Deep Think</strong></p>
                        <p>由 Google 推出，更側重於「複雜問題的邏輯推理」與「專業領域求解」。這項功能特別適合如數學運算、程式碼編寫與除錯，以及需要多層次推演的科學問題。它能在極短時間內提供深度的分析與解答。其核心優勢在於：</p>
                        <ul>
                            <li>強化數理邏輯運算。</li>
                            <li>進階程式碼編寫與優化能力。</li>
                            <li>能快速針對單一複雜問題提供精確解答。</li>
                        </ul>

                        <p><strong>Deep Think</strong></p>
                        <p>深度整合了 Google 既有的生態系，最顯著的優勢是能直接取用 Google 學術搜尋（Google Scholar）、專利資料庫以及旗下其他專業服務的資料。這使得它在處理科學、醫療或技術專利等高門檻專業領域時，能提供更具權威性與專業深度的解答與數據。</p>

                        <h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">3. 適用場景建議</h4>
                        <p>若需求為進行市場調查、撰寫專題報告或彙整大量分散資訊，<strong>Deep Research</strong> 提供的一條龍式自主研究與報告生成功能，能大幅節省時間。反之，若面臨棘手的程式碼 Bug、複雜的數學方程式分析，或是需要查閱專業學術文獻與專利庫來解答技術難題，<strong>Deep Think</strong> 強大的邏輯推演與 Google 生態系支援，將是更好的選擇。</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="news-item" id="section-jump-3">
            <span class="tag">Sora</span>
            <span class=\"tag\">Vidu Q3</span>
            <span class=\"tag\">Seedance 2.0</span>
            <h3>陸 AI 影片生成技術大突破：Seedance 2.0 與 Vidu Q3 強勢挑戰 Sora</h3>
            <div class="news-content">
                <div class="news-image-top">
                    <img src=\"https://i.meee.com.tw/hO0bIf1.png\" alt=\"Seedance 2.0 與 Vidu Q3\">
                    <p style=\"font-size: 12px; color: #888888; font-style: italic; margin: 10px 0 0 0; text-align: center;\">
                        Seedance 2.0 與 Vidu Q3。( 圖 / 取自 Seedance、Vidu 官網 )
                    </p>
                </div>
                <div class=\"news-columns\">
                    <div class=\"column\">
                        <p class=\"first-paragraph\">近期，中國在 AI 影片生成領域展現了驚人的技術躍進，字節跳動與生數科技相繼發表了最新模型 Seedance 2.0 與 Vidu Q3。這兩款模型在影片長度、生成速度及物理一致性上，不僅超越前代，更被視為正面迎擊 OpenAI 旗下影片生成巨頭 Sora 的強大挑戰者。</p>

                        <h4 style=\"color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;\">Seedance 2.0：極速生成與商業應用的完美結合</h4>
                        <p>字節跳動推出的 Seedance 2.0 主打「極致的速度」與「多樣化的應用場景」。根據官方發布的資訊，該模型能以極快的速度將文字提示轉化為高畫質（HD）影片。相較於前代，Seedance 2.0 在物理規律的模擬上有顯著提升，例如物體的碰撞、反彈等動態效果更為自然，大幅減少了不合理的畫面「崩壞」現象。此外，它能更好地理解並生成包含文字或招牌的畫面，也提供了多種鏡頭控制選項（推、拉、搖、移），讓創作者能像導演般精準掌控影片節奏。</p>
                    </div>
                    <div class=\"column\">
                        <h4 style=\"color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;\">Vidu Q3：專注於長影片與畫面穩定性</h4>
                        <p>由北京生數科技（Shengshu Technology）開發的 Vidu Q3，則在「推動影片長度極限」與「極致的畫面穩定」上展現野心。Vidu Q3 強勢主打能夠生成長達 1 分鐘以上的高解析度連續鏡頭，並在整個影片過程中保持極高的一致性，無論是角色的服裝細節還是背景連貫性，皆不易產生變形或突兀的跳躍感。其底層架構強化了對複雜環境與光影變化的計算能力，特別適合用於短片創作、廣告腳本預覽，甚至是微電影的製作。</p>

                        <h4 style=\"color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;\">挑戰 Sora 霸主地位</h4>
                        <p>Sora 自發布以來，以其能生成長達 60 秒的高擬真影片震驚全球，被譽為影片生成領域的標竿。然而，Seedance 2.0 的高速產出與 Vidu Q3 在長鏡頭連貫性上的突破，顯示出中國廠商正以前所未有的速度拉近差距。Sora 的優勢在於對現實世界物理模擬的深刻理解（World Model），而 Seedance 2.0 的親民生態系整合以及 Vidu Q3 在長短影片並進的策略，則讓這場「AI 視覺奧斯卡」競爭進入了白熱化階段。</p>

                        <p style=\"margin-top: 20px;\">隨著這兩款新模型的問世，創作者將獲得更多元、更便捷的視覺表達工具，未來的 AI 影片市場將不再由單一巨頭壟斷。</p>
                    </div>
                </div>
            </div>
        </div>

        <div class=\"news-item\" id=\"section-jump-4\">
            <span class=\"tag\">Google</span>
            <span class=\"tag\">Gemini</span>
            <span class=\"tag\">Lyria 3</span>
            <h3>Gemini 應用再擴張：加入音樂生成模型 Lyria 3　一鍵創作出完整歌曲</h3>
            <div class=\"news-content\">
                <div class=\"news-image-top\">
                    <img src=\"https://i.meee.com.tw/A2nI4G0.jpeg\" alt=\"Gemini Music\">
                    <p style=\"font-size: 12px; color: #888888; font-style: italic; margin: 10px 0 0 0; text-align: center;\">
                        Gemini 加入音樂生成模型 Lyria 3。( 圖 / 翻攝自 Google 官網 )
                    </p>
                </div>
                <div class=\"news-columns\">
                    <div class=\"column\">
                        <p class=\"first-paragraph\">Google 近日宣布，音樂生成模型 Lyria 3 將正式整合至 Gemini 平台中。未來，使用者不再需要深厚的樂理基礎，只需透過簡單的文字指令，便能在 Gemini 中創作具備豐富編曲與結構的完整音樂曲目。此項更新預計將為音樂創作普及化帶來實質的影響。</p>

                        <h4 style=\"color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;\">文字轉音樂能力再進化</h4>
                        <p>Lyria 3 是 Google DeepMind 與 YouTube 合作開發的音樂模型。與過去將重點放在短樂段的模型不同，Lyria 3 強調「長格式（Long-form）」音樂的生成能力。目前支援生成的主流曲式結構（如前奏、主歌、副歌、橋段、尾奏），使用者只需輸入類似「一首帶有合成器波浪風格的 80 年代流行歌曲，並在副歌加入強烈的電吉他獨奏」等文字提示，模型便能產出結構完整、音質清澈的音軌檔。此外，它還能模擬不同的樂器組合與人聲演唱效果，提供創作者極高的自由度。</p>
                    </div>
                    <div class=\"column\">
                        <h4 style=\"color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;\">解決音樂創作人的兩大痛點</h4>
                        <p>這項升級將大幅解決部分大眾在音樂創作上的兩大痛點：「缺乏靈感」與「技術門檻」。對於內容創作者（如 YouTuber、Podcaster）而言，Lyria 3 能快速生成符合特定氛圍的去版權（Royalty-free）背景音樂，省去尋找配樂的時間；對於專業音樂人，該工具也能作為一個強大的靈感產生器，快速打草稿並測試不同的編曲變化與和弦走向。</p>
                        
                        <p style=\"margin-top: 20px;\">隨著 Lyria 3 的加入，Gemini 將從以純文字與圖像為主的助理，進一步成為「聽覺」內容的生產中樞，與市面上的 Suno 或 Udio 等音樂生成工具展開競爭。</p>
                    </div>
                </div>
                <div class=\"link-group\" style=\"text-align: center; margin-top: 20px;\">
                    <a href=\"https://blog.google/innovation-and-ai/models-and-research/google-deepmind-lyria-3-music-ai/\" target=\"_blank\" class=\"news-link\">官方完整介紹 →</a>
                </div>
            </div>
        </div>

        <div class="news-item" style="border: 2px solid #ff4e50; background: linear-gradient(135deg, #f9d423 0%, #ff4e50 100%); padding: 3px; border-radius: 12px; margin-bottom: 40px;">
            <div style="background: #fff; border-radius: 9px; padding: 25px;position: relative;overflow: hidden;">
                <!-- 裝飾背景 -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255, 78, 80, 0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(249, 212, 35, 0.2); border-radius: 50%;"></div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <span class="tag" style="background: #ff4e50; color: white; border: none; font-weight: bold; box-shadow: 0 2px 5px rgba(255,78,80,0.3);">🚀 Hackathon Pick</span>
                </div>
                
                <h3 style="font-size: 1.6em; color: #333; margin-bottom: 15px; border-bottom: none; padding-bottom: 0;">第三屆黑客松特別企劃：AI 備戰指南</h3>
                
                <div class="news-content">
                    <p class="first-paragraph" style="font-size: 1.1em; color: #555;">
                        黑客松倒數計時！如何在 48 小時內將「企劃構思、程式編寫、視覺設計」？本期為您獨家介紹 AI Agent 開發框架的神兵利器 — <strong style="color: #ff4e50;">Antigravity</strong>。這不是普通的聊天機器人，而是能幫你直接「寫 Code、建網頁、找資料」的最強外掛隊友！
                    </p>

                    <!-- 重點特色 (卡片排版) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 25px 0;">
                        <!-- Card 1 -->
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #f9d423;">
                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1em;">⚡ 突破期效準備</h4>
                            <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.5;">一鍵生成我做網頁框架與設計草圖，將網頁架構、程式撰寫交給它，雙手專注於創意發想。</p>
                        </div>
                        <!-- Card 2 -->
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4e50;">
                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1em;">🛠 教學即應用</h4>
                            <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.5;">透過 SKILL.md 寫入系統設定，讓 AI 立即學會你們的開發語言與架構要求。</p>
                        </div>
                        <!-- Card 3 -->
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #6b4e9d;">
                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1em;">🔗 外部擴充支援</h4>
                            <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.5;">內建 MCP 支援，直接串接工作團隊 API，解決舊有系統資料庫串接痛點。</p>
                        </div>
                    </div>

                    <div class="link-group" style="text-align: center; margin-top: 30px;">
                        <a href="./hackathon-special.html" class="news-link" style="display: inline-block; background: linear-gradient(135deg, #ff4e50 0%, #f9d423 100%); color: white; font-weight: bold; padding: 12px 30px; border-radius: 25px; box-shadow: 0 4px 15px rgba(255, 78, 80, 0.4); transition: transform 0.2s; border: none;">
                            👉 【點擊查看】 🤖Antigravity 解析與 48 小時戰術版 👈
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="news-item" id="section-jump-6">
            <div class="roundup-header">
                <span class="roundup-icon">🗞️</span>
                <h3>AI 精選新聞短評</h3>
            </div>
            <div class="roundup-grid">
                <a href="https://www.msn.com/zh-tw/news/other/yahoo也做ai搜尋了-全新回答引擎scout整合新聞-購物與財經內容/ar-AA1V7YcF" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/vfCLuBX.jpg');"></div>
                    <div class="roundup-content">
                        <p>1. Yahoo也做AI搜尋了! 全新回答引擎Scout整合新聞、購物與財經內容</p>
                    </div>
                </a>
                <a href="https://www.bnext.com.tw/article/85510/google-ai-pro" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/tlAtuEl.jpg');"></div>
                    <div class="roundup-content">
                        <p>2. 台灣也能訂閱Google AI Plus了！月付260元，跟AI Pro、AI Ultra方案差在哪？</p>
                    </div>
                </a>
                <a href="https://www.perplexity.ai/hub/blog/finish-your-annual-plan-faster-with-perplexity" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/Bxz2KXc.jpg');"></div>
                    <div class="roundup-content">
                        <p>3. Finish Your Annual Plan Faster With Perplexity</p>
                    </div>
                </a>
                <a href="https://www.ithome.com.tw/news/173660" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/TCN2Wj4.jpg');"></div>
                    <div class="roundup-content">
                        <p>4. Chrome導入Auto Browse，AI開始接手瀏覽器操作</p>
                    </div>
                </a>
                <a href="https://www.gvm.com.tw/article/127376" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/KeByTwX.jpg');"></div>
                    <div class="roundup-content">
                        <p>5. 當Claude發布Cowork，工程師、白領工作誰遭砍？</p>
                    </div>
                </a>
                <a href="https://www.blocktempo.com/what-is-moltbook-the-ai-community-platform/" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/imnhGvQ.jpg');"></div>
                    <div class="roundup-content">
                        <p>6. AI 社群平台 Moltbook 是什麼？OpenClaw 自創宗教</p>
                    </div>
                </a>
                <a href="https://www.incgmedia.com/spotlight/how-pixar-animators-and-ai-researchers-made-dear-upstairs-neighbors" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/W0eK65d.jpg');"></div>
                    <div class="roundup-content">
                        <p>7. 皮克斯動畫師與 Google DeepMind 團隊共創動畫短片</p>
                    </div>
                </a>
                <a href="https://www.techbang.com/posts/127759-xai-grok-imagine-10s-video-audio" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/BhMtVh5.jpg');"></div>
                    <div class="roundup-content">
                        <p>8. xAI 正式發表 Grok Imagine 1.0：10 秒 720p 影片隨手產</p>
                    </div>
                </a>
                <a href="https://news.cnyes.com/news/print/6337821" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/PwRL2PC.jpg');"></div>
                    <div class="roundup-content">
                        <p>9. 超級盃最貴火藥味 Anthropic廣告大酸對手 OpenAI採感性訴求</p>
                    </div>
                </a>
                <a href="https://techcrunch.com/2026/02/06/it-just-got-easier-for-claude-to-check-in-on-your-wordpress-site/" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/BpwuI43.jpg');"></div>
                    <div class="roundup-content">
                        <p>10. It just got easier for Claude to check in on your WordPress site</p>
                    </div>
                </a>
                <a href="https://autos.udn.com/autos/amp/story/7832/9341765" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/kJBpaE2.jpg');"></div>
                    <div class="roundup-content">
                        <p>11. CarPlay 重大升級！iOS 26.4 導入影音串流 支援 ChatGPT</p>
                    </div>
                </a>
                <a href="https://www.bnext.com.tw/article/90032/anthropic-claude-opus-4-6-ai-model-breakthrough-and-applications" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/On8jwco.jpg');"></div>
                    <div class="roundup-content">
                        <p>12. AI痛擊白領工作！Anthropic推出旗艦模型Opus 4.6</p>
                    </div>
                </a>
                <a href="https://ai.ettoday.net/amp/amp_news.php7?news_id=3116535" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/1ehHmCA.jpg');"></div>
                    <div class="roundup-content">
                        <p>13. 免費AI撐不下去了？OpenAI解釋ChatGPT為何開始導入廣告</p>
                    </div>
                </a>
                <a href="https://ai.ettoday.net/amp/amp_news.php7?news_id=3118914" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/7fvjQVv.jpg');"></div>
                    <div class="roundup-content">
                        <p>14. Airbnb三分之一客服改由AI處理 工程師八成已導入AI工具</p>
                    </div>
                </a>
                <a href="https://ai.ettoday.net/amp/amp_news.php7?news_id=3110343" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/fkuCcUH.jpg');"></div>
                    <div class="roundup-content">
                        <p>15. 阿里巴巴升級Qwen AI功能 一句話就能買東西</p>
                    </div>
                </a>
                <a href="https://www.blocktempo.com/google-gemini-3-deep-think-arc-agi-benchmark/" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/Ff0DWL8.jpg');"></div>
                    <div class="roundup-content">
                        <p>16. Google Gemini 3 Deep Think 大升級：要最強</p>
                    </div>
                </a>
                <a href="https://www.bigmedia.com.tw/article/1771046118469" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/SqnRwnF.jpg');"></div>
                    <div class="roundup-content">
                        <p>17. 科技遇上愛情：矽谷菁英用AI與數據尋找真愛的新嘗試</p>
                    </div>
                </a>
                <a href="https://www.bbc.com/zhongwen/articles/cwy964g856go/trad.amp" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/LUywz8u.jpg');"></div>
                    <div class="roundup-content">
                        <p>18. Seedance 2.0: 這款中國AI應用程式令好萊塢陷入恐慌</p>
                    </div>
                </a>
                <a href="https://www.newmobilelife.com/2026/02/20/google-gemini-3-1-pro-ai-reasoning/" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/epgKxSl.jpg');"></div>
                    <div class="roundup-content">
                        <p>19. Gemini 3.1 Pro 登場 大幅提升 AI 邏輯推理能力</p>
                    </div>
                </a>
                <a href="https://mrmad.com.tw/ios-264-beta2-new-features" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/CWdbDXW.jpg');"></div>
                    <div class="roundup-content">
                        <p>20. iOS 26.4 Beta 2更新釋出！新版11項重點功能細節全面看</p>
                    </div>
                </a>
                <a href="https://news.cnyes.com/news/id/6348175" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/9EEbCU8.jpg');"></div>
                    <div class="roundup-content">
                        <p>21. 有鏡頭！OpenAI被曝最快一年內推出AI音箱</p>
                    </div>
                </a>
                <a href="https://udn.com/news/story/6809/9341597" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/4h4lBCJ.jpg');"></div>
                    <div class="roundup-content">
                        <p>22. 槍手ChatGPT遭封鎖卻未通報 加拿大召見OpenAI高層</p>
                    </div>
                </a>
                <a href="https://blog.google/products/ads-commerce/digital-advertising-commerce-2026/" target="_blank" class="roundup-card">
                    <div class="roundup-image" style="background-image: url('https://i.meee.com.tw/PUTWTOZ.jpg');"></div>
                    <div class="roundup-content">
                        <p>23. What to expect in digital advertising and commerce in 2026</p>
                    </div>
                </a>
            </div>
        </div>
`;

fs.writeFileSync('018.html', prefix + bodyContent + suffix, 'utf8');
console.log('Successfully rebuilt 018.html');
