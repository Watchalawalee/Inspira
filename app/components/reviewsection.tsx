import React from 'react';

type ReviewSectionProps = {
  reviews: Array<{ rating: number; review: string; photoUrl?: string }>;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-lg mb-2">รีวิวจากผู้เข้าชม</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
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
    </div>
  );
};

export default ReviewSection;
