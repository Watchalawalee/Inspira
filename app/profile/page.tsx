'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InspiraNavbar from '../components/button';
import ReviewTicket from "../components/reviewtickets";
import Image from 'next/image';


const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
 
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
      />  
    <div className="bg-white min-h-screen px-6 py-8">
      {/* Navbar */}
      <InspiraNavbar />

      <div className="max-w-6xl mx-auto py-10 px-6 ">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">MY FAVORITE EXHIBITIONS</h1>

        {/* Manual Carousel */}
        <div className="carousel-container px-10 logo-dark overflow-x-auto">
          <ul className="carousel-items flex gap-6">
            {[...Array(6)].map((_, index) => (
              <li className="carousel-item" key={index}>
                <div className="client-image">
                  <img
                    src={`/images/fav-${index + 1}.jpg`}
                    alt={`Favorite ${index + 1}`}
                    className="logo-dark w-full h-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <h1 className="text-2xl font-bold my-6">MY REVIEW</h1>

        <ReviewTicket
          imageUrl="/images/homecoming-poster.png"
          title="พาใจกลับบ้าน HOMECOMING"
          location="MMAD at MunMun Srinakarin, 2nd fl."
          datetime="12 Jul 2024 11:00 - 12 Jul 2024 20:00"
          rating="5/5"
        />
      </div>

      <style jsx>{`
        .carousel-container {
          overflow-x: auto;
          scroll-behavior: smooth;
        }
        .carousel-item {
          min-width: 180px;
        }
        .client-image {
          width: 180px;
          height: 120px;
          object-fit: cover;
        }
      `}</style>
    </div>
    </div>
  );
};

export default ProfilePage;
