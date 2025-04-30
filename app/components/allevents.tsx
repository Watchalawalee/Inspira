// components/AllEvents.tsx

'use client';

import React from 'react';

const AllEvents = () => {
  const dummyEvents = [
    {
      title: 'Tech World Expo 2025',
      location: 'Impact Arena',
      cover_picture: '/images/tech.jpg',
    },
    {
      title: 'Book & Reading Fest',
      location: 'Central World',
      cover_picture: '/images/book.jpg',
    },
    {
      title: 'Food Carnival',
      location: 'The Mall Bangkapi',
      cover_picture: '/images/food.jpg',
    },
  ];

  return (
    <section className="py-12 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Events</h2>
        <button className="text-blue-500 hover:underline text-sm">View All</button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {dummyEvents.map((event, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={event.cover_picture}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-gray-500 text-sm">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllEvents;
