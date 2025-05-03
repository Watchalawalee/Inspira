'use client';

import React from 'react';

interface Event {
  id: number;
  imageUrl: string;
  name: string;
  location: string;
}

interface OngoingEventsProps {
  onViewAll: () => void;
  events: Event[];
}

const OngoingEvents: React.FC<OngoingEventsProps> = ({ onViewAll, events }) => {
  return (
    <section className="px-6 py-8 bg-white font-sans">
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
        {events.map((event) => (
          <div key={event.id} className="min-w-[200px]">
            <div className="bg-white rounded-t-full shadow-xl">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-48 object-cover rounded-t-full"
              />
            </div>
            <div className="p-3 mt-2 text-center bg-[#5372A4] rounded-xl shadow-xl text-white">
              <h3 className="text-sm font-semibold truncate">{event.name}</h3>
              <p className="text-xs">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OngoingEvents;
