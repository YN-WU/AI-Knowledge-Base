const fs = require('fs');
const path = 'tvbs-ai-newsletter/search-index.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.forEach(item => {
  if (item.title && item.title.includes('Seedance 2.0')) {
    const marker = '<div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 20px; font-size: 0.9em; color: #555; line-height: 1.8;">';
    if (item.fullContent.includes(marker)) {
      console.log('Found article, truncating...');
      item.fullContent = item.fullContent.split(marker)[0].trim();
      // Ensure closing divs are correct.
      // Usually it's inside news-item/news-content
      if (!item.fullContent.endsWith('</div>')) {
          item.fullContent += '</div>';
      }
    }
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
