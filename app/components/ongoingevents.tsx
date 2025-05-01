'use client';

import React from 'react';

interface OngoingEventsProps {
  onViewAll: () => void;
}

const ongoingEvents = [
  {
    id: 1,
    imageUrl: '/mock/ongoing-1.jpg',
    name: 'Elephant Tales',
    location: 'Bangkok Art Center',
  },
  {
    id: 2,
    imageUrl: '/mock/ongoing-2.jpg',
    name: 'Green Harmony',
    location: 'Chiang Mai Museum',
  },
  {
    id: 3,
    imageUrl: '/mock/ongoing-3.jpg',
    name: 'Flowers of Japan',
    location: 'Ratchadamnoen Gallery',
  },
];

const OngoingEvents: React.FC<OngoingEventsProps> = ({ onViewAll }) => {
  return (
    <section className="px-6 py-8 bg-white">
      {/* Ongoing Events Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ongoing Events</h2>
        <button
          onClick={onViewAll}
          className="text-blue-500 font-medium hover:underline"
        >
          View all
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {ongoingEvents.map(event => (
          <div key={event.id} className="min-w-[200px]">
            {/* รูปภาพ */}
            <div className="bg-white rounded-t-full shadow-xl">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-48 object-cover rounded-t-full"
              />
            </div>

            {/* ข้อความ */}
            <div className="p-3 mt-2 text-center bg-[#5372A4] rounded-xl shadow-xl text-white">
              <h3 className="text-sm font-semibold truncate text-white">{event.name}</h3>
              <p className="text-xs text-white">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OngoingEvents;
