'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera, Trash } from 'lucide-react';

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
      const eventRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}`);
      if (eventRes.ok) {
        setExhibitionId(slug as string);
        return;
      }
    } catch {}

    try {
      // กรณี slug เป็น reviewId
      const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/id/${slug}`);
      if (reviewRes.ok) {
        const review = await reviewRes.json();
        setExhibitionId(review.exhibition_id._id || review.exhibition_id);
        setRating(review.rating);
        setReviewText(review.review);
        setExistingReviewId(review._id);
        if (review.image_url) {
          setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE}${review.image_url}`);
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

  const handleRemoveImage = () => {
    setPreviewImage(null);
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
      ? `${process.env.NEXT_PUBLIC_API_BASE}/reviews/${existingReviewId}`
      : `${process.env.NEXT_PUBLIC_API_BASE}/reviews`;
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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative bg-gray-50">
          <Image
            src="/regis1.svg"
            alt="Background"
            width={1440}
            height={200}
            className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
          />
      <h1 className="text-3xl font-bold mb-6 z-10 text-[#2D3E50]">Review</h1>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-xl shadow space-y-4">
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
         <textarea
        id="reviewText"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
        className="w-full p-4 bg-gray-100 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="พิมพ์รีวิวของคุณที่นี่..."
        style={{ border: 'none', resize: 'none' }}
      />

      {/* Icon กล้องสำหรับแนบรูป */}
      <label htmlFor="photo" className="absolute bottom-4 right-4 cursor-pointer">
        <Camera size={32} className="text-gray-500 hover:text-gray-700 transition" />
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </label>

      {/* Preview รูป */}
      {previewImage && (
        <div className="relative mt-4 group">
          <img
            src={previewImage}
            alt="รูปที่แนบ"
            className="max-h-48 w-full rounded-lg shadow-md object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
          >
            <Trash size={18} />
          </button>
        </div>
        )}
      <button
            type="submit"
            className="w-full mt-2 bg-[#5372A4] hover:bg-[#3d5987] text-white py-2 rounded-full text-base font-semibold transition-colors"
          >
            Login
          </button>
    </form>
    </div>
  );
}
