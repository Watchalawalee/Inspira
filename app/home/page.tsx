'use client';

import React, { useState, useRef } from 'react';
import InspiraNavbar from '../components/button';
import BannerSlider from '../components/Bannerslide';
import OngoingEventsContainer from '../components/ongoingEventsContainer.tsx';
import UpcomingEventsContainer from '../components/upcomingEventsContainer.tsx';
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
      <UpcomingEventsContainer onViewAll={() => handleViewAll('Upcoming')} /> 
      <AllEvents ref={allEventsRef} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </main>
  );
};

export default HomePage;
