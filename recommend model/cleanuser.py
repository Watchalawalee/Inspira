import pandas as pd

# ข้อมูลตัวอย่าง
data = [
    {
        "_id": "67f39dba448e8e41e23f30aa",
        "username": "sucha",
        "password": "$2b$10$poJDFfsuHRrbnF5fuPmc3.bjWcayM7THq9CffZthy.oG//36l18w.",
        "email": "suchawadee979@gmail.com",
        "gender": "female",
        "birthdate": "2025-04-07T00:00:00.000Z",
        "interests": ["Art & Design", "Beauty & Fashion", "Concert"],
        "created_at": "2025-04-07T09:41:14.932Z",
        "updated_at": "2025-04-07T09:41:14.932Z",
        "isEmailVerified": True,
        "verifyToken": None,
        "verifyTokenExpire": None,
        "__v": 0,
        "role": None
    },
    {
        "_id": "67fd30247d1817af1f1b938d",
        "username": "inspira_admin",
        "password": "$2b$10$Q38argUeUEoPetIXijKSv.h8wpecMvpApfs2Awv2026UUv0Bmm1Gy",
        "email": "inspira.project2025@gmail.com",
        "gender": "female",
        "birthdate": "2025-04-14T00:00:00.000Z",
        "interests": ["Art & Design", "Beauty & Fashion", "Book"],
        "created_at": "2025-04-14T15:56:20.263Z",
        "updated_at": "2025-04-14T15:56:20.263Z",
        "isEmailVerified": True,
        "verifyToken": None,
        "verifyTokenExpire": None,
        "__v": 0,
        "role": "admin"
    },
    {
        "_id": "6811e838c267ed74e1eabea0",
        "username": "mintmint",
        "password": "$2b$10$mv0u1Dxopd5CW2rfbMT1FuaEGwdk7ub1Q9yVNo1lyLPfsbMAjwPnK",
        "email": "suchawadee.imsap@gmail.com",
        "gender": "female",
        "birthdate": "2025-04-29T00:00:00.000Z",
        "interests": ["Art & Design", "Beauty & Fashion", "Concert"],
        "created_at": "2025-04-30T09:07:04.150Z",
        "updated_at": "2025-04-30T09:07:04.150Z",
        "isEmailVerified": True,
        "verifyToken": None,
        "verifyTokenExpire": None,
        "__v": 0,
        "role": "user"
    }
]

# กำหนดหมวดหมู่ที่ต้องการแปลงเป็น 1 หรือ 0
categories = ['Art & Design', 'Beauty & Fashion', 'Home & Furniture', 'Business', 'Education', 'Concert', 'Technology', 'Book', 'Food & Drink', 'Others']

# แปลงข้อมูลให้เป็น DataFrame
df = pd.json_normalize(data)

# ฟังก์ชันแปลง interests เป็น 0 หรือ 1
def interest_columns(interests_list):
    return [1 if category in interests_list else 0 for category in categories]

# ใช้ฟังก์ชันนี้กับทุกแถวใน DataFrame
interest_columns_data = df['interests'].apply(interest_columns)

# สร้างคอลัมน์ใหม่ใน DataFrame สำหรับ interests ที่แปลงเป็น 1 หรือ 0
interest_df = pd.DataFrame(interest_columns_data.tolist(), columns=categories)

# รวม DataFrame เดิมกับคอลัมน์ interests ที่แปลงแล้ว
df = pd.concat([df[['username', '_id']], interest_df], axis=1)

# เลือกเฉพาะคอลัมน์ที่ต้องการ
final_df = df[['username', '_id'] + categories]

# บันทึก DataFrame เป็น CSV
final_df.to_csv('user_interests.csv', index=False)

print("ไฟล์ CSV ถูกบันทึกเป็น 'user_interests.csv'")
