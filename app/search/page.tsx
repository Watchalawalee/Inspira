'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import InspiraNavbar from '../components/button';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        const res = await fetch(`http://localhost:5000/exhibitions/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('❌ Error fetching search results:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main>
      <InspiraNavbar />
      <div className="mt-20 px-8">
        <h1 className="text-2xl font-bold text-[#5b78a4] mb-6">
          ผลการค้นหา: {query}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
        พบทั้งหมด {results.length} รายการ
      </p>

        {/* Mobile View */}
        <div className="block md:hidden">
          <Splide
            options={{
              perPage: 1,
              gap: '1rem',
              pagination: true,
            }}
          >
            {results.map((item, idx) => (
              <SplideSlide key={idx}>
                <Link href={`/event/${item._id}`}>
                  <div className="rounded overflow-hidden shadow cursor-pointer">
                    {item.cover_picture && (
                      <img src={item.cover_picture.startsWith('http') ? item.cover_picture : `http://localhost:5000${item.cover_picture}`} alt={item.title} className="w-full" />
                    )}
                    <div className="p-4">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="text-sm text-gray-600">{item.location || '-'}</p>
                    </div>
                  </div>
                </Link>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, idx) => (
            <Link href={`/event/${item._id}`} key={idx}>
              <div className="break-inside-avoid rounded overflow-hidden shadow bg-white cursor-pointer hover:shadow-lg transition">
                {item.cover_picture && (
                  <img src={item.cover_picture.startsWith('http') ? item.cover_picture : `http://localhost:5000${item.cover_picture}`} alt={item.title} className="w-full" />
                )}
                <div className="p-4">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.location || '-'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
