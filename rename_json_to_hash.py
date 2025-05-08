import os
import hashlib
import json
from glob import glob

def hash_filename(title):
    return hashlib.md5(title.encode("utf-8")).hexdigest() + ".json"

def process_json_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # ตรวจสอบว่าเป็น list หรือ dict
        if isinstance(data, list) and len(data) > 0:
            title = data[0].get("title", "")
            for d in data:
                d["original_filename"] = os.path.basename(file_path)
        elif isinstance(data, dict):
            title = data.get("title", "")
            data["original_filename"] = os.path.basename(file_path)
        else:
            print(f"❌ ไม่มีข้อมูล title ในไฟล์: {file_path}")
            return

        if not title:
            print(f"❌ ไม่มี title สำหรับ hash: {file_path}")
            return

        # สร้างชื่อไฟล์ใหม่จาก hash
        new_name = hash_filename(title)
        new_path = os.path.join(os.path.dirname(file_path), new_name)

        # เขียนไฟล์ใหม่ (เขียนทับชื่อใหม่)
        with open(new_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # ลบไฟล์เดิมถ้าชื่อไม่เหมือน
        if os.path.abspath(new_path) != os.path.abspath(file_path):
            os.remove(file_path)

        print(f"✅ {os.path.basename(file_path)} → {new_name}")

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")

# 🔍 กำหนด path พื้นฐาน
base_folders = ["./scrapy_project/spiders"]
modes = ["upcoming"]

for base in base_folders:
    for mode in modes:
        target_path = os.path.join(base, "**", "raw_data", mode, "*.json")
        json_files = glob(target_path, recursive=True)

        print(f"\n📂 Processing {len(json_files)} files in {mode} mode")

        for file_path in json_files:
            process_json_file(file_path)
