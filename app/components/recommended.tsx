'use client';

import React from 'react';

const recommendations = [
    {
      id: 1,
      imageUrl: '/mock/recommendation-1.jpg',
      name: 'Modern Art Journey',
      location: 'Museum of Contemporary Art',
    },
    {
      id: 2,
      imageUrl: '/mock/recommendation-2.jpg',
      name: 'Natur Wonders',
      location: 'Nature Gallery',
    },
  ];
      {/* Recommendation Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Recommendations</h2>
          <a href="#" className="text-blue-500 font-medium hover:underline">View all</a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommendations.map(rec => (
            <div key={rec.id} className="min-w-[200px] bg-white rounded-t-2xl shadow-md">
              <img
                src={rec.imageUrl}
                alt={rec.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold truncate">{rec.name}</h3>
                <p className="text-xs text-gray-500">{rec.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>