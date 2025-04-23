'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadOngoingImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/exhibitions/ongoing");
        const data = await response.json();
        const coverUrls = data
          .map((item: any) => item.cover_picture)
          .filter((url: string) => url && url.startsWith("http"));
        setImages(coverUrls);
      } catch (err) {
        console.error("🔥 ดึงข้อมูลผิดพลาด:", err);
      }
    };

    loadOngoingImages();
  }, []);

  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(slideshowInterval);
  }, [images]);

  return (
    <div>
      <div className="slideshow" style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', top: 0, left: 0 }}>
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="slide"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}
      </div>

      <div className="content" style={{ position: 'relative', zIndex: 10, height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center', paddingBottom: '60px', color: 'white' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Inspira</h1>
          <h2 style={{ fontSize: '22px', fontStyle: 'italic', marginTop: '5px' }}>Discover exhibitions and events happening around you.</h2>
        </div>
        <button
          className="btn enter-btn"
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', margin: '10px', backgroundColor: '#fca5a5', color: 'white' }}
          onClick={() => router.push('/home')}
        >
          CLICK TO ENTER
        </button>
        <div>
          <button
            className="btn secondary-btn"
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', margin: '10px', backgroundColor: '#cbd5e1', color: '#1e293b' }}
            onClick={() => router.push('/login')}
            >
            LOG IN
          </button>
          <button
            className="btn secondary-btn"
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', margin: '10px', backgroundColor: '#cbd5e1', color: '#1e293b' }}
            onClick={() => router.push('/register')}
          >
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
