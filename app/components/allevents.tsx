'use client';

import { useState, useEffect } from 'react';

const categories = [
  'Art & Design', 'Beauty & Fashion', 'Home & Furniture', 'Business',
  'Education', 'Concert', 'Technology', 'Book', 'Food & Drink', 'Others',
];

const tabs = ['Ongoing', 'Upcoming', 'Past'];

const events = [
  {
    id: 1,
    name: 'Elephant Tales',
    location: 'Bangkok Art Center',
    imageUrl: '/mock/ongoing-1.jpg',
    status: 'ongoing',
    category: 'Art & Design',
  },
  {
    id: 2,
    name: 'Green Harmony',
    location: 'Chiang Mai Museum',
    imageUrl: '/mock/ongoing-2.jpg',
    status: 'ongoing',
    category: 'Art & Design',
  },
  {
    id: 3,
    name: 'Flowers of Japan',
    location: 'Ratchadamnoen Gallery',
    imageUrl: '/mock/ongoing-3.jpg',
    status: 'ongoing',
    category: 'Art & Design',
  },
  {
    id: 4,
    name: 'Tech Future Expo',
    location: 'BITEC Bangna',
    imageUrl: '/mock/upcoming-1.jpg',
    status: 'upcoming',
    category: 'Technology',
  },
  {
    id: 5,
    name: 'Book Fair 2025',
    location: 'Queen Sirikit Center',
    imageUrl: '/mock/upcoming-2.jpg',
    status: 'upcoming',
    category: 'Book',
  },
  {
    id: 6,
    name: 'Food Fest 2025',
    location: 'Siam Square',
    imageUrl: '/mock/upcoming-3.jpg',
    status: 'upcoming',
    category: 'Food & Drink',
  },
  // เพิ่มนิทรรศการที่เหลือ...
];

export default function AllEventsSection({ selectedTab }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState(selectedTab || 'Ongoing');
  const [displayCount, setDisplayCount] = useState(6); // จำนวนที่แสดงเริ่มต้น (6 นิทรรศการ)

  useEffect(() => {
    if (selectedTab) {
      setActiveTab(selectedTab);
      setSelectedCategory(null); // Reset category when switching tabs
    }
  }, [selectedTab]);

  // กรองรายการที่จะแสดงตามสถานะและประเภท
  const filteredEvents = events.filter(event =>
    (!selectedCategory || event.category === selectedCategory) &&
    event.status === activeTab.toLowerCase()
  );

  // ฟังก์ชันโหลดเพิ่ม
  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 6); // เพิ่มจำนวนรายการที่แสดงขึ้น 6 รายการ
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All events</h2>

      {/* Tabs for Ongoing, Upcoming, Past */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full drop-shadow-lg text-sm font-semibold ${activeTab === tab ? ' bg-red-300 text-white' : 'bg-[#FFBAA3] text-white'}`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedCategory(null); // Reset category when switching tabs
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`w-1/2 lg:w-1/5 px-5 py-3 text-lg rounded-full drop-shadow-lg text-sm ${cat === selectedCategory ? ' bg-[#5372A4] text-white' : 'bg-slate-400 text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Display Events */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEvents.slice(0, displayCount).map(event => (
          <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow">
            <img src={event.imageUrl} alt={event.name} className="w-full h-40 object-cover rounded-t-xl" />
            <div className="bg-[#5372A4] text-white text-center py-2">
              <p className="font-semibold truncate">{event.name}</p>
              <p className="text-sm">{event.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button ปุ่ม "Load more": จะปรากฏขึ้นเมื่อมีนิทรรศการมากกว่าจำนวนที่แสดงอยู่ในขณะนั้น โดยจะทำการโหลดรายการเพิ่มเมื่อคลิก*/}
      {filteredEvents.length > displayCount && (
        <div className="text-center mt-6">
          <button
            className="px-6 py-2 bg-[#5372A4] text-white rounded-full hover:bg-[#3f5c88] transition"
            onClick={loadMore}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
