'use client';

import React, { useState, useRef } from 'react';
import InspiraNavbar from '../components/button';
import BannerSlider from '../components/Bannerslide';
import OngoingEventsContainer from '../components/ongoingEventsContainer';
import UpcomingEventsContainer from '../components/upcomingEventsContainer';
import AllEvents from '../components/allevents';

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const allEventsRef = useRef<HTMLDivElement>(null);

  const handleViewAll = (tab: string) => {
    setSelectedTab(tab);
    // Scroll to the All Events section smoothly
    allEventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      {/* Navbar */}
      <InspiraNavbar />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Ongoing Events Container */}
      <OngoingEventsContainer onViewAll={() => handleViewAll('Ongoing')} />

      {/* Upcoming Events Container */}
      <UpcomingEventsContainer onViewAll={() => handleViewAll('Upcoming')} />

      {/* All Events Section */}
      <AllEvents
        ref={allEventsRef}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </main>
  );
};

export default HomePage;
