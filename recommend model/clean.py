import pandas as pd

# หมวดหมู่ที่สนใจ
categories = ['Art & Design', 'Beauty & Fashion', 'Home & Furniture', 'Business',
              'Education', 'Concert', 'Technology', 'Book', 'Food & Drink', 'Others']

# โหลดไฟล์ CSV
file_path = r'C:\Users\TUF\Documents\work\Project\recommend model\exhibition_db.exhibitions.csv'
df = pd.read_csv(file_path)

# รวมค่าจาก categories[0] และ categories[1] เป็น list ต่อแถว
df['all_categories'] = df[['categories[0]', 'categories[1]']].values.tolist()

# ฟังก์ชันแปลงเป็น one-hot vector
def category_columns(category_list):
    return [1 if category in category_list else 0 for category in categories]

# แปลงหมวดหมู่เป็น one-hot encoding
category_df = pd.DataFrame(df['all_categories'].apply(category_columns).tolist(), columns=categories)

# รวมเข้ากับ DataFrame เดิม
df = pd.concat([df, category_df], axis=1)

# กรองเฉพาะรายการที่ status ไม่ใช่ past
df = df[df['status'] != 'past']

# เลือกเฉพาะคอลัมน์ที่ต้องการ
final_df = df[['_id','title', 'start_date', 'end_date', 'location', 'status'] + categories]

# บันทึกเป็น events.csv
final_df.to_csv('events.csv', index=False, encoding='utf-8-sig')

print("✅ บันทึกไฟล์ 'events.csv' เรียบร้อยแล้ว (เฉพาะนิทรรศการที่ไม่ใช่ past)")
