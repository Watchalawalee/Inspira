'use client';

import React, { useEffect, useState } from 'react';
import OngoingEvents from './ongoingevents';
import OngoingEventsSkeleton from './ongoingEventsSkeleton';

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

const OngoingEventsContainer: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/ongoing-events');
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

  return loading ? (
    <OngoingEventsSkeleton />
  ) : (
    <OngoingEvents onViewAll={onViewAll} events={events} />
  );
};

export default OngoingEventsContainer;
