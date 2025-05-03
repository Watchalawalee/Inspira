'use client';

import React, { useState, useRef } from 'react';
import InspiraNavbar from '../components/button';
import BannerSlider from '../components/Bannerslide';
import OngoingEventsContainer from '../components/OngoingEventsContainer.tsx';
import UpcomingEvents from '../components/upcomingevents';
import AllEvents from '../components/allevents';

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const allEventsRef = useRef<HTMLDivElement>(null);

  const handleViewAll = (tab: string) => {
    setSelectedTab(tab);
    allEventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <InspiraNavbar />
      <BannerSlider />
      <OngoingEventsContainer onViewAll={() => handleViewAll('Ongoing')} />
      <UpcomingEvents onViewAll={() => handleViewAll('Upcoming')} />
      <div ref={allEventsRef}>
        <AllEvents selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
    </main>
  );
};

export default HomePage;
