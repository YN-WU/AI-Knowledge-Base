"""
驗證 search-index.json 檔案的格式是否正確
"""
import json
import sys
import os

def validate_search_index():
    """驗證搜尋索引 JSON 檔案"""
    json_file = 'search-index.json'
    
    if not os.path.exists(json_file):
        print(f"❌ 錯誤：找不到檔案 {json_file}")
        return False
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ JSON 格式正確！")
        print(f"📊 索引項目數量：{len(data)}")
        
        # 驗證每個項目的結構
        required_fields = ['title', 'content', 'url']
        for i, item in enumerate(data):
            missing_fields = [field for field in required_fields if field not in item]
            if missing_fields:
                print(f"⚠️  項目 {i+1} 缺少欄位：{', '.join(missing_fields)}")
        
        print("✅ 驗證完成！")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 格式錯誤：{e}")
        print(f"   行：{e.lineno}，列：{e.colno}")
        return False
    except Exception as e:
        print(f"❌ 其他錯誤：{e}")
        return False

if __name__ == "__main__":
    success = validate_search_index()
    sys.exit(0 if success else 1)