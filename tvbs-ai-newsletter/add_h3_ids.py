import os
import re
from bs4 import BeautifulSoup

# Directory containing HTML files
html_dir = 'issues'

# Process each HTML file
for filename in os.listdir(html_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(html_dir, filename)
        
        # Read the HTML file
        with open(filepath, 'r', encoding='utf-8') as file:
            html_content = file.read()
        
        # Parse HTML
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find all h3 elements
        h3_elements = soup.find_all('h3')
        
        # Add IDs to h3 elements
        for i, h3 in enumerate(h3_elements):
            h3['id'] = f'title-{i+1}'
        
        # Save the modified HTML
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(str(soup))
        
        print(f"Added IDs to h3 elements in {filename}")

print("Done adding IDs to h3 elements in all HTML files")