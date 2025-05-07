from datetime import datetime
from pymongo import MongoClient

# ✅ ฮาร์ดโค้ด URI ชั่วคราว (ไม่แนะนำให้ใช้ระยะยาว)
MONGO_URI = "mongodb+srv://inspiraproject2025:ypLEu0xL3plfo2AW@exhibition-cluster.ty3ugcy.mongodb.net/exhibition_db"
client = MongoClient(MONGO_URI)
db = client["exhibition_db"]
collection = db["exhibitions"]

now = datetime.now()

# อัปเดตเป็น ongoing
collection.update_many({
    "start_date_obj": {"$lte": now},
    "end_date_obj": {"$gte": now}
}, { "$set": { "status": "ongoing" }})

# อัปเดตเป็น upcoming
collection.update_many({
    "start_date_obj": {"$gt": now}
}, { "$set": { "status": "upcoming" }})

# อัปเดตเป็น past
collection.update_many({
    "end_date_obj": {"$lt": now}
}, { "$set": { "status": "past" }})

print("✅ อัปเดต status รายวันเสร็จสิ้น")
