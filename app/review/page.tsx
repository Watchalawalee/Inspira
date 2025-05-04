'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReviewForm() {
  const { slug } = useParams();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('rating', rating.toString());
    formData.append('review', reviewText);
    if (photo) formData.append('photo', photo);

    // ส่งข้อมูลรีวิวไปยัง API
    await fetch(`/api/reviews/${slug}`, {
      method: 'POST',
      body: formData,
    });

    // หลังจากส่งรีวิวเสร็จ Redirect กลับไปที่หน้า Event
    router.push(`/event/${slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">เขียนรีวิวของคุณ</h2>

      {/* Rating */}
      <div>
        <label className="block font-medium mb-1">ให้คะแนน:</label>
        <div className="flex space-x-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Review */}
      <div>
        <label htmlFor="reviewText" className="block font-medium mb-1">ข้อความรีวิว:</label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="พิมพ์รีวิวของคุณที่นี่..."
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label htmlFor="photo" className="block font-medium mb-1">แนบรูปภาพ (ถ้ามี):</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        ส่งรีวิว
      </button>
    </form>
  );
}
