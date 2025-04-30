"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      {/* ปุ่มด้านขวา */}
      <div className="flex justify-end gap-3 mb-4">
        <a
          href="/change-password"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
        >
          เปลี่ยนรหัสผ่าน
        </a>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
        >
          ออกจากระบบ
        </button>
      </div>

      <a href="/" className="inline-block mb-6 text-blue-600 hover:underline text-sm">
        &larr; กลับหน้า Home
      </a>

      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">MY FAVORITE EXHIBITIONS</h1>

        {/* Carousel */}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-48 h-72 rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src={`/images/fav-${index + 1}.jpg`}
                alt={`Favorite ${index + 1}`}
                width={192}
                height={288}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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
    </div>
  );
};

export default AccountPage;