'use client';

import React, { useEffect, useState } from 'react';

interface Recommendation {
  _id: string;
  cover_picture: string;
  title: string;
  location: string;
}

interface Props {
  isLoggedIn: boolean;
}

const RecommendationsSection: React.FC<Props> = ({ isLoggedIn }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchRecommendations = async () => {
        try {
          const userStr = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          if (!userStr || !token) return;

          const user = JSON.parse(userStr);
          const userId = user.id;

          const res = await fetch(`http://localhost:5000/recommendations/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          console.log('✅ DATA:', data);
          setRecommendations(data);
        } catch (error) {
          console.error('❌ Failed to fetch recommendations:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || loading || recommendations.length === 0) return null;

  return (
    <div className="relative mt-16">
      {/* พื้นหลัง gradient ด้านหลังกล่อง */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#e6edf6] to-white z-[-1]" />
  
      <div className="relative w-fit mx-auto shadow-xl border-4 border-white rounded-md overflow-hidden">
        {/* ป้าย Recommended ลอยด้านบน */}
        <h2 className="absolute -top-8 left-0 text-white text-4xl italic font-semibold drop-shadow-lg z-10 px-4">
          Recommended
        </h2>
  
        {/* แสดงรูปภาพนิทรรศการ */}
        {recommendations.length > 0 && (
          <img
            src={recommendations[0].cover_picture}
            alt={recommendations[0].title}
            className="w-[600px] h-auto object-cover"
          />
        )}
      </div>
    </div>
  );  
};

export default RecommendationsSection;
