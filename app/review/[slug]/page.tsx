'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReviewFormPage() {
  const { slug } = useParams(); // อาจเป็น exhibitionId หรือ reviewId ก็ได้
  const router = useRouter();
  const [exhibitionId, setExhibitionId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchData = async () => {
    if (!slug) return;

    try {
      // กรณี slug เป็น exhibition_id
      const eventRes = await fetch(`http://localhost:5000/exhibitions/${slug}`);
      if (eventRes.ok) {
        setExhibitionId(slug as string);
        return;
      }
    } catch {}

    try {
      // กรณี slug เป็น reviewId
      const reviewRes = await fetch(`http://localhost:5000/reviews/id/${slug}`);
      if (reviewRes.ok) {
        const review = await reviewRes.json();
        setExhibitionId(review.exhibition_id._id || review.exhibition_id);
        setRating(review.rating);
        setReviewText(review.review);
        setExistingReviewId(review._id);
        if (review.image_url) {
          setPreviewImage(`http://localhost:5000${review.image_url}`);
        }
      } else {
        alert('ไม่พบข้อมูลนิทรรศการหรือรีวิว');
      }
    } catch (err) {
      console.error('Error fetching review:', err);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return alert('กรุณาเข้าสู่ระบบ');
    if (!rating) return alert('กรุณาให้คะแนน');

    const formData = new FormData();
    if (!exhibitionId) return alert('ไม่พบรหัสนิทรรศการ');
    formData.append('exhibition_id', exhibitionId);
    formData.append('rating', rating.toString());
    formData.append('review', reviewText);
    if (photo) formData.append('image', photo);

    const url = existingReviewId
      ? `http://localhost:5000/reviews/${existingReviewId}`
      : 'http://localhost:5000/reviews';
    const method = existingReviewId ? 'PUT' : 'POST';
    


    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert('✅ บันทึกรีวิวเรียบร้อยแล้ว');
        router.push(`/event/${exhibitionId}`);
      } else {
        const data = await res.json();
        alert('❌ ผิดพลาด: ' + (data.message || data.error));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('เกิดข้อผิดพลาดในการส่งรีวิว');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">เขียนรีวิวของคุณ</h2>

      <div className="flex gap-1 text-2xl cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="select-none"
          >
            {(hoveredRating || rating) >= star ? '★' : '☆'}
          </span>
        ))}
      </div>
      <div>
        <label htmlFor="reviewText" className="block font-medium mb-1">ข้อความรีวิว:</label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="พิมพ์รีวิวของคุณที่นี่..."
          required
        />
      </div>
      <div>
        <label htmlFor="photo" className="block font-medium mb-1">แนบรูปภาพ (ถ้ามี):</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded"
        />
        {previewImage && (
          <img src={previewImage} alt="รูปที่แนบ" className="mt-2 max-h-48 rounded" />
        )}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        ส่งรีวิว
      </button>
    </form>
  );
}
