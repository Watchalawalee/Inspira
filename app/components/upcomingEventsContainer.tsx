'use client';

import React, { useEffect, useState } from 'react';

interface Event {
  _id: string;
  title: string;
  location: string;
  cover_picture: string;
  status: string;
  categories: string[];
}

const isImageLoadable = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

const UpcomingEventsContainer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/exhibitions?status=upcoming&page=1&limit=12');
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtered = await Promise.all(
            data.map(async (event) => {
              const imgUrl = event.cover_picture.startsWith('http')
                ? event.cover_picture
                : `http://localhost:5000${event.cover_picture}`;
              const canLoad = await isImageLoadable(imgUrl);
              return canLoad ? event : null;
            })
          );
          const validEvents = filtered.filter(Boolean) as Event[];
          setEvents(validEvents);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (err) {
        console.error('Failed to fetch upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center">Loading upcoming events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-500">No upcoming exhibitions found</p>;

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow">
            <img
              src={
                event.cover_picture.startsWith('http')
                  ? event.cover_picture
                  : `http://localhost:5000${event.cover_picture}`
              }
              alt={event.title}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="bg-[#5372A4] text-center p-3 flex flex-col justify-center text-white">
              <h3 className="text-sm font-semibold truncate" style={{ color: 'white' }}>
                {event.title}
              </h3>
              <p className="text-xs" style={{ color: 'white' }}>
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsContainer;