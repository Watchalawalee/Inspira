'use client';

import React from 'react';

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

const OngoingEvents: React.FC = () => {
  return (
    <section className="px-6 py-8 bg-gradient-to-b from-white to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ongoing Events</h2>
        <a href="#" className="text-blue-500 font-medium hover:underline">View all</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {ongoingEvents.map(event => (
          <div key={event.id} className="min-w-[200px] bg-white rounded-2xl shadow-md">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold truncate">{event.name}</h3>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OngoingEvents;
