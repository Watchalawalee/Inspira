'use client';

import React, { useState, useRef } from 'react';
import InspiraNavbar from '../components/button';
import BannerSlide from '../components/Bannerslide';
import OngoingEventsContainer from '../components/OngoingEventsContainer';
import UpcomingEventsContainer from '../components/UpcomingEventsContainer';
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
      <BannerSlide />
      <OngoingEventsContainer onViewAll={() => handleViewAll('Ongoing')} /> 
      <UpcomingEventsContainer onViewAll={() => handleViewAll('Upcoming')} /> 
      <AllEvents ref={allEventsRef} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </main>
  );
};

export default HomePage;
