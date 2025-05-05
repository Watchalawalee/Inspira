import React from 'react';
import Link from 'next/link';

type ReviewSectionProps = {
  reviews: Array<{ rating: number; review: string; photoUrl?: string }>;
  exhibitionId: string;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, exhibitionId }) => {
  const displayedReviews = reviews.slice(0, 2);
  const hasMoreReviews = reviews.length > 2;

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-2">รีวิวจากผู้เข้าชม</h2>
      {displayedReviews.length > 0 ? (
        displayedReviews.map((review, index) => (
          <div key={index} className="border-t py-4">
            <div className="flex items-center space-x-2">
              <div className="text-yellow-400">
                {'★'.repeat(review.rating)}{' '}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-2">{review.review}</p>
            {review.photoUrl && (
              <img
                src={review.photoUrl}
                alt="Review Photo"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">ยังไม่มีรีวิวสำหรับนิทรรศการนี้</p>
      )}

      {/* ปุ่มดูเพิ่มเติม */}
      <div className="mt-4">
        {hasMoreReviews ? (
          <Link href={`/exhibitions/${exhibitionId}/reviews`}>
            <span className="text-[#171717] transition transform hover:scale-105 hover:underline">
              view more →
            </span>
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">view more →</span>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
