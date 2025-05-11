'use client';

import React from "react";

type Props = {
  imageUrl: string;
  title: string;
  location: string;
  datetime: string;
  rating: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;  

const ReviewTicket: React.FC<Props> = ({
  imageUrl,
  title,
  location,
  datetime,
  rating
}) => {
  // ถ้า imageUrl ไม่ขึ้นต้นด้วย http ให้ต่อ API host ข้างหน้า
  const src = imageUrl.startsWith('http')
    ? imageUrl
    : `${API}${imageUrl}`;

  return (
    <div
      className="relative w-full max-w-4xl h-[300px] bg-no-repeat bg-cover bg-center text-[#3c5a99]"
      style={{
        backgroundImage: 'url("/reviewticket.svg")',
      }}
    >
      {/* Exhibition image */}
      <div className="absolute left-8 top-6 w-1/3 h-[90%] rounded-xl overflow-hidden shadow-lg">
        <img
          src={src}
          alt="Poster"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content on the right */}
      <div className="absolute right-6 top-6 w-[50%] flex flex-col justify-between h-[90%] p-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-sm mb-1">
            📍 <span className="font-semibold">Location:</span> {location}
          </p>
          <p className="text-sm mb-4">
            📅 <span className="font-semibold">Date & Time:</span> {datetime}
          </p>
        </div>
        <div>
          <p className="font-bold text-lg mb-2">Review</p>
          <p className="text-xl">
            ★★★★★ <span className="text-sm">({rating})</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewTicket;
