'use client';

import React, { useEffect, useState } from 'react';
import OngoingEvents from './OngoingEvents';
import OngoingEventsSkeleton from './OngoingEventsSkeleton';

interface Event {
  id: number;
  imageUrl: string;
  name: string;
  location: string;
}

const OngoingEventsContainer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/ongoing-events'); //เอาAPIมาใส่ตรงนี้
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewAll = () => {
    console.log('View All clicked');
  };

  return loading ? (
    <OngoingEventsSkeleton />
  ) : (
    <OngoingEvents onViewAll={handleViewAll} events={events} />
  );
};

export default OngoingEventsContainer;
