'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Review {
  _id: string;
  rating: number;
  review: string;
  image_url?: string;
  user_id: {
    _id?: string;
    username?: string;
  } | string | null; // เพิ่ม null ได้
}

interface ReviewSectionProps {
  allReviews: Review[];
  exhibitionId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ allReviews, exhibitionId }) => {
  const [userId, setUserId] = useState<string | null | undefined>(undefined); // undefined = ยังไม่โหลด

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const id = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
      setUserId(id);
    }
  }, []);

  if (userId === undefined) return null; // 🛡️ ป้องกัน hydration mismatch

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const userReview = userId
    ? allReviews.find((r) => {
        const uid = typeof r.user_id === 'object' ? r.user_id?._id : r.user_id;
        return uid === userId;
      })
    : null;

  const others = userId
    ? allReviews.filter((r) => {
        const uid = typeof r.user_id === 'object' ? r.user_id?._id : r.user_id;
        return uid !== userId;
      }).reverse()
    : [...allReviews].reverse();

  const showMore = others.length > 1;
  const latestOtherReview = others[0];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">รีวิวจากผู้เข้าชม</h2>

      {/* ✅ รีวิวของตนเอง */}
      {userReview && (
        <div className="mb-4 bg-gray-100 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <strong>รีวิวของคุณ</strong>
            <div>
              <span className="text-yellow-500">{renderStars(userReview.rating)}</span>
              <Link
                href={`/review/${exhibitionId}`}
                className="text-sm text-blue-600 hover:underline ml-2"
              >
                แก้ไข
              </Link>
            </div>
          </div>
          <p className="text-sm mt-2">{userReview.review}</p>
          {userReview.image_url && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE}${userReview.image_url}`}
              alt="รูปรีวิว"
              className="mt-2 rounded max-h-48"
            />
          )}
        </div>
      )}

      {/* ✅ รีวิวล่าสุดของคนอื่น */}
      {latestOtherReview && (
        <div className="mb-4 bg-gray-100 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <strong>
              {typeof latestOtherReview.user_id === 'object' && latestOtherReview.user_id
                ? latestOtherReview.user_id.username || 'ผู้ใช้งาน'
                : 'ผู้ใช้งาน'}
            </strong>
            <span className="text-yellow-500">{renderStars(latestOtherReview.rating)}</span>
          </div>
          <p className="text-sm mt-2">{latestOtherReview.review}</p>
          {latestOtherReview.image_url && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE}${latestOtherReview.image_url}`}
              alt="รูปรีวิว"
              className="mt-2 rounded max-h-48"
            />
          )}
        </div>
      )}

      {/* ✅ ปุ่มดูเพิ่มเติม */}
      {showMore && (
        <div className="text-center">
          <Link
            href={`/event/${exhibitionId}/reviews`}
            className="text-blue-600 hover:underline"
          >
            ดูรีวิวเพิ่มเติม →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
