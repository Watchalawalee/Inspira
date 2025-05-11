'use client';
import React from 'react';
import Link from 'next/link';

interface Review {
  _id: string;
  rating: number;
  review: string;
  image_url?: string;
  user_id: {
    _id?: string;
    username?: string;
  } | string;
}

interface ReviewSectionProps {
  allReviews: Review[];
  exhibitionId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ allReviews, exhibitionId }) => {
  if (typeof window === "undefined") return null; // ป้องกัน SSR error

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const userReview = allReviews.find(
    (r) => (typeof r.user_id === 'object' ? r.user_id._id : r.user_id) === userId
  );

  const others = allReviews
    .filter((r) => (typeof r.user_id === 'object' ? r.user_id._id : r.user_id) !== userId)
    .reverse(); // คนล่าสุดก่อน

  const showMore = others.length > 1;
  const latestOtherReview = others[0];

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">รีวิวจากผู้เข้าชม</h2>

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

      {latestOtherReview && (
        <div className="mb-4 bg-gray-100 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <strong>{typeof latestOtherReview.user_id === 'object'
              ? latestOtherReview.user_id.username
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

      {showMore && (
        <div className="text-center">
          <Link href={`/event/${exhibitionId}/reviews`} className="text-blue-600 hover:underline">
            ดูรีวิวเพิ่มเติม →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
