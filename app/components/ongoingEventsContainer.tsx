'use client';

import React, { useEffect, useState } from 'react';

interface Event {
  _id: string;
  title: string;
  location: string;
  cover_picture: string;
}

const isImageLoadable = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

const OngoingEventsContainer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/exhibitions/ongoing');
        const data = await res.json();

        const filtered = await Promise.all(
          data.map(async (event: Event) => {
            const imgUrl = event.cover_picture?.startsWith('http')
              ? event.cover_picture
              : `http://localhost:5000${event.cover_picture}`;
            const canLoad = await isImageLoadable(imgUrl);
            return canLoad ? { ...event, cover_picture: imgUrl } : null;
          })
        );

        setEvents(filtered.filter(Boolean) as Event[]);
      } catch (err) {
        console.error('❌ Failed to fetch ongoing events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const onViewAll = () => {
    // Handle the "View all" button click (for example, navigate to another page)
    console.log('View all button clicked');
  };

  if (loading) return <p className="text-center text-gray-400">Loading ongoing events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-400">No ongoing exhibitions found</p>;

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
        {events.map((event) => (
          <div key={event._id} className="min-w-[200px]">
            {/* Image Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <img
                src={event.cover_picture}
                alt={event.title}
                className="w-full h-40 object-cover rounded-t-xl"
              />
            </div>

            {/* Text Section */}
            <div className="p-3 mt-4 text-center bg-[#5372A4] rounded-xl shadow-xl text-white">
              <h3 className="text-sm font-semibold truncate">{event.title}</h3>
              <p className="text-xs">{event.location || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OngoingEventsContainer;
