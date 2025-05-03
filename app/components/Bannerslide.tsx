'use client';

import React, { useState, useEffect } from 'react';

const mockBanners = [
  {
    id: 1,
    title: 'Find your inspiration',
    description: 'Your gateway to discovering exhibitions and artists that inspire and elevate your experience. Find, plan and explore with us.',
    imageUrl: '/mock/banner-1.jpg',
  },
  {
    id: 2,
    title: 'Explore Masterpieces',
    description: 'Dive into stunning artworks and exhibitions around the country.',
    imageUrl: '/mock/banner-2.jpg',
  },
];

const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mockBanners.length - 1 ? 0 : prev + 1));
  };

  // Automatically change banner every 3 seconds if not hovered
  useEffect(() => {
    if (!isHovered) {
      const id = setInterval(() => {
        setCurrentIndex((prev) => (prev === mockBanners.length - 1 ? 0 : prev + 1));
      }, 3000); // Change every 3 seconds

      setIntervalId(id);

      return () => clearInterval(id); // Cleanup interval on component unmount or when hovering
    }
  }, [isHovered]);

  const banner = mockBanners[currentIndex];

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}  // Set hover to true when mouse enters
      onMouseLeave={() => setIsHovered(false)} // Set hover to false when mouse leaves
    >
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="relative h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/path/to/your/image.jpg')` }}>
        <div className="absolute left-80 top-10 h-full w-full md:w-1/3 lg:w-1/4 bg-[rgba(83,114,164,0.5)] flex flex-col justify-start items-center px-6 py-10 text-white transform -translate-x-1/2">
          <img
            src="/logo.svg"
            alt="Logo"
            style={{
              height: '90px', // หรือเปลี่ยนตาม responsive ได้
              maxWidth: '200px',
              width: '100%',
              filter: 'invert(1)',
              objectFit: 'contain',
            }}
          />
          <button className="bg-[#FFBAA3] text-white px-6 py-3 rounded-full shadow hover:bg-red-300 transition mt-4 w-full sm:w-auto">
            Find your inspiration !
          </button>
          <p className="text-center mt-6 max-w-md px-4 sm:px-0" style={{ color: 'white', zIndex: 10, position: 'relative' }}>
            "Your gateway to discovering exhibitions and activities that inspire and elevate your experience. Find, plan, and explore with us!"
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
        onClick={handlePrev}
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
        onClick={handleNext}
      >
        ›
      </button>
    </section>
  );
};

export default BannerSlider;
