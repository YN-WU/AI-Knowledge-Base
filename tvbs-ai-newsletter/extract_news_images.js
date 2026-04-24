const fs = require('fs');
const path = require('path');

const issuesDir = 'c:\\Users\\ed\\Desktop\\cowork\\AI NEWS LETTER\\tvbs-ai-newsletter\\issues';
const indexPath = 'c:\\Users\\ed\\Desktop\\cowork\\AI NEWS LETTER\\tvbs-ai-newsletter\\search-index.json';

const searchIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// Map to store data: filename -> title -> { img, fullContent }
const contentMap = {};

const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(issuesDir, file);
    const fullSource = fs.readFileSync(filePath, 'utf8');
    
    contentMap[file] = {};

    // Split by Article comment to get each news item block
    const sections = fullSource.split(/<!--\s*Article/i);
    
    // Also include tools if they are structured similarly
    // Special sections like "AI 工具推薦" often have a header
    
    sections.forEach(section => {
        // Extract title
        const titleMatch = section.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
        if (!titleMatch) return;
        const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
        
        // Extract image
        const imgMatch = section.match(/<img[^>]+src="([^">]+)"/);
        const imgSrc = imgMatch ? imgMatch[1] : null;
        
        // Extract content: find from <div class="news-content"> or <div class="tool-content-flex"> to the end of the section
        const contentStartMatch = section.match(/<div class="(news-content|tool-content-flex)"[^>]*>/);
        let fullHtml = "";
        if (contentStartMatch) {
            const startIdx = contentStartMatch.index + contentStartMatch[0].length;
            // Find the end: we take everything until the last </div> before the end of this article block
            // Since this section was split by <!-- Article, it ends just before the next article
            const endIdx = section.lastIndexOf('</div>');
            if (endIdx > startIdx) {
                fullHtml = section.substring(startIdx, endIdx);
                // Also need to remove the closing </div> of news-content itself if we didn't slice it right
                // Actually, taking until the last </div> is safer because news-item ends with </div></div>
                
                // Clean up: remove the image div if it's at the start
                fullHtml = fullHtml.replace(/<div class="(news-image-top|tool-image-side)"[^>]*>[\s\S]*?<\/div>/, '');
            }
        }
        
        if (fullHtml) {
            contentMap[file][title] = {
                img: imgSrc,
                fullContent: fullHtml.trim()
            };
        }
    });
});

// Update search index
searchIndex.forEach(item => {
    const urlMatch = item.url.match(/issues\/([^#]+)/);
    if (urlMatch) {
        const filename = urlMatch[1];
        const title = item.title.trim();
        const cleanTitle = title.replace(/[🛠️💡🔄🧩🌟]/g, '').trim();
        
        if (contentMap[filename]) {
            let data = contentMap[filename][title];
            if (!data) {
                // Better fuzzy match: check if a significant part of the title matches
                const shortIndexTitle = cleanTitle.slice(0, 15);
                for (let t in contentMap[filename]) {
                    const shortHtmlTitle = t.slice(0, 15);
                    if (t.includes(shortIndexTitle) || cleanTitle.includes(shortHtmlTitle) || 
                        (cleanTitle.includes('Nano Banana') && t.includes('Nano Banana'))) {
                        data = contentMap[filename][t];
                        break;
                    }
                }
            }
            if (data) {
                item.img = data.img;
                item.fullContent = data.fullContent;
            }
        }
    }
});

fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log('Updated search-index.json with robust content extraction.');
