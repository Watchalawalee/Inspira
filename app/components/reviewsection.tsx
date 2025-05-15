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
  } | string | null;
}

interface ReviewSectionProps {
  allReviews: Review[];
  exhibitionId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ allReviews, exhibitionId }) => {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const id = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
      setUserId(id);
    }
  }, []);

  if (userId === undefined) return null;

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const averageRating = (
    allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
  ).toFixed(1);

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
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-2 text-[#2D3E50]'>Review : {averageRating} / 5</h2>
      {/* ✅ รีวิวของตนเอง */}
      {userReview && (
        <div className='w-full relative mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg'>
          <div className='w-full relative h-80 flex items-center justify-center p-2'>
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
              className="rounded-md max-w-sm mx-auto h-auto"
            />
          )}
        </div>
      )}

      {/* ✅ รีวิวล่าสุดของคนอื่น */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {latestOtherReview && (
        <div className="w-full relative mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <div className="w-full relative h-80 flex items-center justify-center p-2">
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

          {/* ✅ ปุ่ม View More ในการ์ด */}
          {showMore && (
            <Link
              href={`/event/${exhibitionId}/reviews`}
              className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md transition"
            >
              View More →
            </Link>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default ReviewSection;
