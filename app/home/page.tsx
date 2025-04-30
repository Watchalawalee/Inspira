'use client';
import React, { useState, useEffect } from 'react';
import InspiraNavbar from '../components/button'; 
import BannerSlider from '../components/Bannerslide';
import OngoingEvents from '../components/ongoingevents';
import UpcomingEvents from '../components/upcomingevents';
import AllEvents from '../components/allevents';

const HomePage = () => {
  return (
    <main>
      <InspiraNavbar />
      <BannerSlider />
      <OngoingEvents />
      <UpcomingEvents />
      <AllEvents />
    </main>
  );
};

export default HomePage;
