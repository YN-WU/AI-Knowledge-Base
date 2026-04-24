const fs = require('fs');

try {
    const templateContent = fs.readFileSync('017.html', 'utf8');
    let template = templateContent.replace('第017期 | 2026年1月', '第018期 | 2026年3月');

    const startIdx = template.indexOf('<div class="outline-box">');
    const endIdx = template.indexOf('<section class="social-connect-section">');

    if (startIdx !== -1 && endIdx !== -1) {
        template = template.substring(0, startIdx) + '<!-- CONTENT_HERE -->' + template.substring(endIdx);
    } else {
        console.error("Could not find outline-box or social-connect-section in 017.html");
        process.exit(1);
    }

    const contentParts = [
        fs.readFileSync('018-part1.html', 'utf8'),
        fs.readFileSync('018-part2.html', 'utf8'),
        fs.readFileSync('018-part3.html', 'utf8'),
        fs.readFileSync('018-part4.html', 'utf8')
    ];

    const finalHtml = template.replace('<!-- CONTENT_HERE -->', contentParts.join('\n'));
    fs.writeFileSync('018.html', finalHtml, 'utf8');
    console.log("Successfully rebuilt 018.html");
} catch (error) {
    console.error("Error building 018.html:", error);
}
