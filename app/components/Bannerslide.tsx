'use client';

import React, { useState, useEffect } from 'react';

const BannerSlide: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // 👈 ตรวจจับ hover

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('http://localhost:5000/exhibitions/ongoing');
        const data = await res.json();

        const valid = data.filter((item: any) => item.cover_picture?.startsWith('http'));

        const formatted = valid.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          imageUrl: item.cover_picture,
        }));

        setBanners(formatted);
      } catch (err) {
        console.error('❌ Failed to fetch banners:', err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }, 5000); // เปลี่ยนภาพทุก 5 วินาที

    return () => clearInterval(interval);
  }, [banners, isHovered]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* แสดงรูปทั้งหมด ซ้อนกัน ใช้ opacity ควบคุม */}
      {banners.map((banner, index) => (
        <img
          key={index}
          src={banner.imageUrl}
          alt={banner.title}
          onMouseEnter={() => setIsHovered(true)}   // 👈 เริ่มจับ hover
          onMouseLeave={() => setIsHovered(false)}  // 👈 หยุดจับ hover
          className="absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        />
      ))}

      {/* กล่อง overlay โลโก้ ปุ่ม คำโปรย */}
      <div
        className="absolute left-80 top-10 h-full w-full md:w-1/3 lg:w-1/4 bg-[rgba(83,114,164,0.5)] flex flex-col justify-start items-center px-6 py-10 text-white transform -translate-x-1/2 z-10"
      >
        <img
          src="/logo.svg"
          alt="Logo"
          style={{
            height: '90px',
            maxWidth: '200px',
            width: '100%',
            filter: 'invert(1)',
            objectFit: 'contain',
          }}
        />
        <button className="bg-[#FFBAA3] text-white px-6 py-3 rounded-full shadow hover:bg-red-300 transition mt-4 w-full sm:w-auto">
          Find your inspiration !
        </button>
        <p
          className="text-center mt-6 max-w-md px-4 sm:px-0"
          style={{ color: 'white', zIndex: 10, position: 'relative' }}
        >
          "Your gateway to discovering exhibitions and activities that inspire and elevate your experience. Find, plan, and explore with us!"
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-20"
        onClick={() =>
          setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
        }
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-20"
        onClick={() =>
          setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
        }
      >
        ›
      </button>
    </section>
  );
};

export default BannerSlide;
