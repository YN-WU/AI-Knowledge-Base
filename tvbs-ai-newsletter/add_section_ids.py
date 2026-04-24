import os
from bs4 import BeautifulSoup

issues_dir = r'c:\Users\ed\Desktop\cowork\AI NEWS LETTER\tvbs-ai-newsletter\issues'

for filename in os.listdir(issues_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(issues_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        
        modified = False
        h2_tags = soup.find_all('h2')
        
        for h2 in h2_tags:
            text = h2.get_text()
            if 'Prompt 專欄' in text or 'AIWIZE TIPS' in text:
                h2['id'] = 'prompt'
                modified = True
            elif 'AI 工具推薦' in text or 'AI工具推薦' in text:
                h2['id'] = 'tools'
                modified = True
            elif 'AI 精選新聞' in text or 'AI 科技精選新聞' in text or '科技新聞精選' in text:
                h2['id'] = 'news'
                modified = True
        
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print(f"Updated {filename}")

print("Done.")
