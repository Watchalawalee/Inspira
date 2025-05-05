'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReviewSection from '@/app/components/reviewsection';
import Link from 'next/link';

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/exhibitions/${slug}`);
        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลนิทรรศการได้");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลนิทรรศการได้");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  useEffect(() => {
    const storedFavorite = localStorage.getItem(`favorite-${slug}`);
    if (storedFavorite) setIsFavorite(true);
  }, [slug]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      localStorage.setItem(`favorite-${slug}`, 'true');
    } else {
      localStorage.removeItem(`favorite-${slug}`);
    }
  };

  if (loading) return <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!event) return <div className="text-center mt-20">ไม่พบนิทรรศการ</div>;

  return (
    <main className="px-4 py-8 max-w-3xl mx-auto relative">
      {/* Heart Favorite Button */}
      <button onClick={toggleFavorite} className="absolute top-4 right-4">
        <span className={isFavorite ? 'text-red-500' : 'text-gray-300'}>❤️</span>
      </button>

      {/* Poster & Title */}
      <div className="mb-6 text-center">
      {event.cover_picture && (
          <img
            src={event.cover_picture.startsWith('http') ? event.cover_picture : `http://localhost:5000${event.cover_picture}`}
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

      {/* Description */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">รายละเอียด</h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      {/* Review Section */}
      <ReviewSection reviews={event.reviews || []} />

      {/* Write a Review Button */}
      <div className="mt-4 text-center">
        <Link href={`/review/${slug}`} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
          เขียนรีวิว
        </Link>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 underline">
          ⬅ กลับหน้าหลัก
        </Link>
      </div>
    </main>
  );
}