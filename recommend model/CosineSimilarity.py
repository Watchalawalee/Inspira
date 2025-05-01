import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# โหลดข้อมูลกิจกรรม
events_path = r'C:\Users\TUF\Documents\work\Project\recommend model\events.csv'
events_df = pd.read_csv(events_path)
events_df = events_df.rename(columns={'_id': 'event_id'})  # ✅ แก้ชื่อ

# โหลดข้อมูลผู้ใช้
users_path = r'C:\Users\TUF\Documents\work\Project\recommend model\user_interests.csv'
users_df = pd.read_csv(users_path)
users_df = users_df.rename(columns={'_id': 'user_id'})     # ✅ แก้ชื่อ

# หมวดหมู่ที่ใช้วัดความคล้ายคลึง
categories = ['Art & Design', 'Beauty & Fashion', 'Home & Furniture',
              'Business', 'Education', 'Concert', 'Technology',
              'Book', 'Food & Drink', 'Others']

# เติมค่า missing ในคอลัมน์ status (หากมี)
events_df['status'] = events_df['status'].fillna('upcoming')

# เตรียมข้อมูลเวกเตอร์กิจกรรมและผู้ใช้
event_vectors = events_df[categories]
user_vectors = users_df[categories]

# คำนวณ cosine similarity
similarity_matrix = cosine_similarity(user_vectors, event_vectors)

# สร้าง DataFrame สำหรับความคล้ายคลึง
similarity_df = pd.DataFrame(similarity_matrix,
                             index=users_df['username'],
                             columns=events_df['title'])

# สร้าง mapping สำหรับการใช้งาน
user_id_map = users_df.set_index('username')['user_id'].to_dict()
event_id_map = events_df.set_index('title')['event_id'].to_dict()
event_status_map = events_df.set_index('title')['status'].to_dict()

# สร้างรายการคำแนะนำ
recommendations = []

for username in similarity_df.index:
    user_similarities = similarity_df.loc[username]
    for event_title, score in user_similarities.items():
        recommendations.append({
            'user_id': user_id_map.get(username, 'unknown'),
            'username': username,
            'event_id': event_id_map.get(event_title, 'unknown'),
            'event_title': event_title,
            'similarity_score': round(score, 4),
            'status': event_status_map.get(event_title, 'unknown')
        })

# สร้าง DataFrame จากคำแนะนำ
recommendations_df = pd.DataFrame(recommendations)

# จัดอันดับ status
status_order = {'ongoing': 0, 'upcoming': 1}
recommendations_df['status_rank'] = recommendations_df['status'].map(status_order).fillna(2).astype(int)

# เรียงลำดับผลลัพธ์
recommendations_df = recommendations_df.sort_values(by=['user_id', 'similarity_score', 'status_rank'],
                                                     ascending=[True, False, True]).drop(columns='status_rank')

# บันทึกเป็น CSV
output_path = r'C:\Users\TUF\Documents\work\Project\recommend model\user_event_recommendations.csv'
recommendations_df.to_csv(output_path, index=False, encoding='utf-8-sig')

print(f"คำแนะนำกิจกรรมถูกบันทึกไว้ที่ '{output_path}'")
