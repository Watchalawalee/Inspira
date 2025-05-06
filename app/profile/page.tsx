'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InspiraNavbar from '../components/button';
import ReviewTicket from "../components/reviewtickets";
import Image from 'next/image';
import Link from 'next/link';

interface Exhibition {
  _id: string;
  title: string;
  location: string;
  start_date?: string;
  cover_picture?: string;
}

interface Favorite {
  _id: string;
  exhibition_id: Exhibition;
}

interface Review {
  _id: string;
  exhibition_id: Exhibition;
  image_url?: string;
  rating: number;
}

const API = process.env.NEXT_PUBLIC_API_URL!; // http://localhost:5000

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);

    // Fetch favorites + reviews
    (async () => {
      try {
        const [favRes, revRes] = await Promise.all([
          fetch(`${API}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/reviews/me/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [favData, revData] = await Promise.all([
          favRes.json(),
          revRes.json(),
        ]);
        setFavorites(favData);
        setReviews(revData);
      } catch (err) {
        console.error("❌ โหลดข้อมูลล้มเหลว:", err);
      }
    })();
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* BG */}
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
      />

      <div className="bg-white min-h-screen px-6 py-8 w-full relative z-10">
        <InspiraNavbar />

        <div className="max-w-6xl mx-auto py-10 px-6">
          {/* Favorites Carousel */}
          <h1 className="text-3xl font-bold mb-6 text-blue-800">MY FAVORITE EXHIBITIONS</h1>
          <div className="carousel-container px-10 logo-dark overflow-x-auto">
            <ul className="carousel-items flex gap-6">
              {favorites.length === 0 ? (
                <li className="text-gray-500">ยังไม่มีรายการโปรด</li>
              ) : (
                favorites.map((fav) => {
                  const imgPath = fav.exhibition_id.cover_picture || '';
                  const src = imgPath.startsWith('http') ? imgPath : `${API}${imgPath}`;
                  const id = fav.exhibition_id._id;

                  return (
                    <li className="carousel-item" key={fav._id}>
                      <Link href={`/event/${id}`}>
                        <div className="client-image cursor-pointer">
                          <img
                            src={src}
                            alt={fav.exhibition_id.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Review Section */}
          <h1 className="text-2xl font-bold my-6">MY REVIEW</h1>
          {reviews.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีรีวิว</p>
          ) : (
            reviews.map((rev) => {
              const imgPath = rev.exhibition_id.cover_picture || "";
              const src = imgPath.startsWith("http") ? imgPath : `${API}${imgPath}`;
              const id = rev.exhibition_id._id;

              return (
                <div key={rev._id} className="mb-8">
                  <Link href={`/event/${id}`}>
                    <div className="cursor-pointer">
                      <ReviewTicket
                        imageUrl={src}
                        title={rev.exhibition_id.title}
                        location={rev.exhibition_id.location}
                        datetime={rev.exhibition_id.start_date || "-"}
                        rating={`${rev.rating}/5`}
                      />
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>

        {/* CSS สำหรับ carousel */}
        <style jsx>{`
          .carousel-container {
            overflow-x: auto;
            scroll-behavior: smooth;
          }
          .carousel-item {
            min-width: 180px;
          }
          .client-image {
            width: 180px;
            height: 120px;
            object-fit: cover;
            border-radius: 0.5rem;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfilePage;
