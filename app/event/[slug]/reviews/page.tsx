'use client';

import React from 'react';
import { notFound } from 'next/navigation';

type Review = {
  rating: number;
  review: string;
  photoUrl?: string;
};

type Props = {
  params: { exhibitionId: string };
};

export default async function AllReviewsPage({ params }: Props) {
  const { exhibitionId } = params;

  // ดึงข้อมูลรีวิวจาก API
  const res = await fetch(`https://your-api-url.com/reviews/${exhibitionId}`);
  
  if (!res.ok) {
    return notFound(); // ถ้าไม่พบข้อมูลให้แสดงหน้า 404
  }

  const reviews: Review[] = await res.json();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">รีวิวทั้งหมดสำหรับนิทรรศการ {exhibitionId}</h1>
      {reviews.map((review, index) => (
        <div key={index} className="border-t py-4">
          <div className="text-yellow-400">
            {'★'.repeat(review.rating)}{' '}
            {'☆'.repeat(5 - review.rating)}
          </div>
          <p className="text-gray-700 leading-relaxed mt-2">{review.review}</p>
          {review.photoUrl && (
            <img
              src={review.photoUrl}
              alt={`Review ${index + 1}`}
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}
