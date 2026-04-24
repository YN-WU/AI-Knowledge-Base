const fs = require('fs');
const path = require('path');

const issuesDir = 'c:\\Users\\ed\\Desktop\\cowork\\AI NEWS LETTER\\tvbs-ai-newsletter\\issues';

const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(issuesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Prompt column
    if (content.includes('Prompt 專欄') || content.includes('AIWIZE TIPS')) {
        if (!content.includes('id="prompt"')) {
            content = content.replace(/<h2 class="section-title">([^<]*(Prompt 專欄|AIWIZE TIPS)[^<]*)<\/h2>/, '<h2 class="section-title" id="prompt">$1</h2>');
            modified = true;
        }
    }

    // AI Tools
    if (content.includes('AI 工具推薦') || content.includes('AI工具推薦')) {
        if (!content.includes('id="tools"')) {
            content = content.replace(/<h2 class="section-title">([^<]*(AI 工具推薦|AI工具推薦)[^<]*)<\/h2>/, '<h2 class="section-title" id="tools">$1</h2>');
            modified = true;
        }
    }

    // News
    if (content.includes('精選新聞')) {
        if (!content.includes('id="news"')) {
            content = content.replace(/<h2 class="section-title">([^<]*(精選新聞)[^<]*)<\/h2>/, '<h2 class="section-title" id="news">$1</h2>');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

console.log('Done.');
