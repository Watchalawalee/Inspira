'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReviewSection from '@/app/components/reviewsection';
import Link from 'next/link';
import { motion } from 'framer-motion';


export default function EventDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null | undefined>(undefined); // 🛡️ แก้ไข

  // ✅ อ่าน token เฉพาะ client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const id = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}`);
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลนิทรรศการได้");
        const data = await res.json();
        if (!data.title) throw new Error(data.message || "ไม่พบนิทรรศการ");
        setEvent(data);
      } catch (err: any) {
        console.error("❌ โหลดนิทรรศการล้มเหลว:", err);
        setError(err.message || "ไม่สามารถดึงข้อมูลนิทรรศการได้");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${slug}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("ข้อมูลรีวิวผิดพลาด");
        setAllReviews(data);
      } catch (err) {
        console.error("โหลดรีวิวล้มเหลว:", err);
      }
    };
    fetchReviews();
  }, [slug]);

  useEffect(() => {
    const checkFavorite = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/favorites/check/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setIsFavorite(data.favorited);
      } catch (err) {
        console.error("เช็ค favorite ไม่สำเร็จ:", err);
      }
    };
    checkFavorite();
  }, [slug]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/favorites/${slug}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ exhibition_id: slug }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("อัปเดต favorite ไม่สำเร็จ:", err);
    }
  };

  // ✅ ป้องกัน Hydration mismatch: รอโหลด userId ก่อน render
  if (userId === undefined) return null;
  if (loading) return <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!event) return <div className="text-center mt-20">ไม่พบนิทรรศการ</div>;

  return (
    <main className="px-4 py-8 max-w-3xl mx-auto relative">
      <Link href="/" className="text-blue-600 underline absolute top-4 left-4">⬅</Link>

      <button onClick={toggleFavorite} className="absolute top-4 right-4 text-2xl focus:outline-none">
        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3 }}>
          {isFavorite ? '❤️' : '🤍'}
        </motion.span>
      </button>

      <div className="mb-6 text-center">
        {event.cover_picture && (
          <img
            src={event.cover_picture.startsWith('http')
              ? event.cover_picture
              : `${process.env.NEXT_PUBLIC_API_BASE}${event.cover_picture}`}
            alt={event.title}
            className="mx-auto mb-4 rounded shadow max-h-[400px] object-contain"
          />
        )}
        <h1 className="text-3xl font-bold text-[#5b78a4] mb-2">{event.title}</h1>
        <div className="text-sm text-gray-600">
          <p>📍 {event.location}</p>
          <p>🗓 {event.start_date} - {event.end_date}</p>
          <p>🕒 {event.event_slot_time || '-'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">รายละเอียด</h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      {/* ✅ ReviewSection รับ userId ด้วย */}
      <ReviewSection
        allReviews={allReviews}
        exhibitionId={slug as string}
        userId={userId}
      />

      <div className="mt-6 flex justify-center gap-4">
        <Link
          href={`/direction/${slug}`}
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg shadow-2xl hover:bg-gray-300"
        >
          How to get there?
        </Link>

        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              alert("กรุณาเข้าสู่ระบบก่อนเขียนรีวิว");
              router.push("/login");
              return;
            }
            router.push(`/review/${slug}`);
          }}
          className="bg-[#5b78a4] text-white py-2 px-6 rounded-lg shadow-2xl hover:bg-blue-700"
        >
          Write a Review
        </button>
      </div>
    </main>
  );
}
