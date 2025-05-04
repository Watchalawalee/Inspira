'use client';

import React, { useEffect, useState } from 'react';

interface Recommendation {
  id: number;
  imageUrl: string;
  name: string;
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
      // เรียก API ดึงรายการนิทรรศการที่ผู้ใช้สนใจ
      const fetchRecommendations = async () => {
        try {
          const res = await fetch('/api/user/recommendations');
          const data = await res.json();
          setRecommendations(data);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
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
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#e6edf6] to-white z-[-1]" />
      
      <div className="relative w-fit mx-auto shadow-xl border-4 border-white rounded-md overflow-hidden">
        <h2 className="absolute -top-8 left-0 text-white text-4xl italic font-semibold drop-shadow-lg z-10 px-4">
          Recommended
        </h2>
  
        {recommendations.length > 0 && (
          <img
            src={recommendations[0].imageUrl}
            alt={recommendations[0].name}
            className="w-[600px] h-auto object-cover"
          />
        )}
      </div>
    </div>
  );  
};

export default RecommendationsSection;
