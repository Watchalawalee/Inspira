'use client';

import { useState, useEffect } from 'react';

const categories = [
  'Art & Design', 'Beauty & Fashion', 'Home & Furniture', 'Business',
  'Education', 'Concert', 'Technology', 'Book', 'Food & Drink', 'Others',
];

const tabs = ['Ongoing', 'Upcoming', 'Past'];

interface Event {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  status: string;
  category: string;
}

interface AllEventsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function AllEventsSection({ selectedTab, setSelectedTab }: AllEventsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(selectedTab || 'Ongoing');
  const [events, setEvents] = useState<Event[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(selectedTab);
    setSelectedCategory(null); // Reset category when tab changes
  }, [selectedTab]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/all-events'); //ใส่API
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (!selectedCategory || event.category === selectedCategory) &&
      event.status.toLowerCase() === activeTab.toLowerCase()
  );

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All events</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full drop-shadow-lg text-sm font-semibold ${activeTab === tab ? 'bg-red-300 text-white' : 'bg-[#FFBAA3] text-white'}`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedTab(tab);
              setSelectedCategory(null);
              setDisplayCount(6);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`w-1/2 lg:w-1/5 px-5 py-3 rounded-full drop-shadow-lg text-sm ${cat === selectedCategory ? 'bg-[#5372A4] text-white' : 'bg-slate-400 text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEvents.slice(0, displayCount).map((event) => (
              <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow">
                <img src={event.imageUrl} alt={event.name} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="bg-[#5372A4] text-white text-center py-2">
                  <p className="font-semibold truncate">{event.name}</p>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
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
        </>
      )}
    </div>
  );
}
