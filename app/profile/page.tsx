'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InspiraNavbar from '../components/button'; // Navbar ที่คุณใช้

const AccountPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      {/* Navbar */}
      <InspiraNavbar />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">MY FAVORITE EXHIBITIONS</h1>

        {/* Manual Carousel (scrollable list) */}
        <div className="carousel-container px-10 logo-dark overflow-x-auto">
          <ul className="carousel-items flex gap-6">
            {[...Array(6)].map((_, index) => (
              <li className="carousel-item" key={index}>
                <div className="client-image">
                  <img
                    src={`/images/fav-${index + 1}.jpg`}
                    alt={`Favorite ${index + 1}`}
                    className="logo-dark w-full h-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <h1 className="text-2xl font-bold my-6">MY REVIEW</h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="font-bold text-lg mb-2">พาใจกลับบ้าน HOMECOMING</h2>
          <p className="text-sm text-gray-700">📍 Location: MMAD at MunMun Srinakarin, 2nd fl.</p>
          <p className="text-sm text-gray-700">
            📅 Date & Time: 13 Jul 2024 11:00 - 13 Jul 2024 20:00
          </p>
          <p className="mt-2 text-sm">Review ⭐⭐⭐⭐⭐ (5/5)</p>
        </div>
      </div>

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
        }
      `}</style>
    </div>
  );
};

export default AccountPage;
