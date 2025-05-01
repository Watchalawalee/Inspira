'use client';

import React, { useState } from 'react';

interface UpcomingEventsProps {
  onViewAll: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const upcomingEvents = [
    {
      id: 1,
      imageUrl: '/mock/recommendation-1.jpg',
      name: 'Modern Art Journey',
      location: 'Museum of Contemporary Art',
    },
    {
      id: 2,
      imageUrl: '/mock/recommendation-2.jpg',
      name: 'Natural Wonders',
      location: 'Nature Gallery',
    },
    // Add more events if needed
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingEvents.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + upcomingEvents.length) % upcomingEvents.length
    );
  };

  return (
    <section className="px-6 py-10 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Upcoming Events</h2>
        <a
          onClick={onViewAll}
          className="cursor-pointer text-blue-500 font-medium hover:underline"
        >
          View all
        </a>
      </div>
      <div className="relative overflow-hidden rounded-xl shadow-md">
        <div
          className="w-full h-64 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {upcomingEvents.map((event) => (
            <div key={event.id} className="min-w-full">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {upcomingEvents.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;
