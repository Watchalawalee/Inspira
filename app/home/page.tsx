'use client';

import React from 'react';
import InspiraNavbar from '../components/button'; 

const Home = () => {
  return (
    <div>
      {/* Navbar will always be at the top */}
      <InspiraNavbar />

      {/* Your other page content */}
      <div style={{ paddingTop: 80 }}> {/* Padding to avoid overlap with fixed navbar */}
        <h1>Welcome to the Home Page</h1>
        {/* Add your page content here */}
      </div>
    </div>
  );
};

export default Home;
