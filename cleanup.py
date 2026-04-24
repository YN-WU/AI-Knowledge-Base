
import os

file_path = r'c:\Users\ed\Desktop\cowork\AI NEWS LETTER\ai-newsletter-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the second instance of <!DOCTYPE html>
found_first = False
start_index = 0
for i, line in enumerate(lines):
    if '<!DOCTYPE html>' in line:
        if found_first:
            start_index = i
            break
        found_first = True

if start_index > 0:
    new_lines = lines[start_index:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Removed {start_index} lines.")
else:
    print("Could not find second DOCTYPE.")
