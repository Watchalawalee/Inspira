'use client';

import React, { useEffect, useState } from 'react';
import UpcomingEvents from './upcomingevents';
import UpcomingEventsSkeleton from './upcomingEventsSkeleton';

interface Event {
  id: number;
  imageUrl: string;
  name: string;
  location: string;
}

interface UpcomingEventsContainerProps {
  onViewAll: () => void;
}

const UpcomingEventsContainer: React.FC<UpcomingEventsContainerProps> = ({ onViewAll }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/upcoming-events'); // เรียก API mock
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return loading ? (
    <UpcomingEventsSkeleton />
  ) : (
    <UpcomingEvents events={events} onViewAll={onViewAll} />
  );
};

export default UpcomingEventsContainer;
