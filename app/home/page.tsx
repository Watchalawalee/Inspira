'use client';

import React, { useState, useRef } from 'react';
import InspiraNavbar from '../components/button';
import BannerSlider from '../components/Bannerslide';
import OngoingEvents from '../components/ongoingevents';
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
      <OngoingEvents onViewAll={() => handleViewAll('Ongoing')} />
      <UpcomingEvents onViewAll={() => handleViewAll('Upcoming')} />
      <div ref={allEventsRef}>
        <AllEvents selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
    </main>
  );
};

export default HomePage;
