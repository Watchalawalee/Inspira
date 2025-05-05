'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DirectionPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [exhibitionLatLng, setExhibitionLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:5000/exhibitions/${slug}`);
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const busStopsResponse = await fetch(`http://localhost:5000/exhibitions/${slug}/nearby-bus`);
        const busStopsData = await busStopsResponse.json();
        setBusStops(busStopsData);

        if (eventData.latitude && eventData.longitude) {
          setExhibitionLatLng({ lat: eventData.latitude, lng: eventData.longitude });
        }
      } catch (error) {
        setError('Failed to load data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug]);

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const input = document.getElementById('startStopInput') as HTMLInputElement;
        input.value = `@${latitude},${longitude}`;
      },
      (err) => {
        alert('ไม่สามารถเข้าถึงพิกัดของคุณได้');
      }
    );
  };

  const displayRoutes = (data: any) => {
    const resultContainer = document.getElementById('routes-display')!;
    if (!Array.isArray(data) || data.length === 0) {
      resultContainer.innerHTML = `<p style="color:red;">${data?.message || 'ไม่พบเส้นทาง'}</p>`;
      return;
    }

    const grouped = data.reduce((acc: any, route: any) => {
      const key = `${route.get_on}___${route.get_off}`;
      if (!acc[key]) {
        acc[key] = {
          get_on: route.get_on,
          get_off: route.get_off,
          get_off_distance: route.get_off_distance,
          routes: []
        };
      }
      if (Array.isArray(route.routes)) {
        acc[key].routes.push(...route.routes);
      } else if (route.route) {
        acc[key].routes.push(route.route);
      } else {
        acc[key].routes.push(null);
      }
      return acc;
    }, {});

    const html = Object.values(grouped).map((group, i) => {
      const uniqueRoutes = Array.from(
        new Map(group.routes.map((r: any) => [`${r?.short_name}-${r?.long_name}`, r])).values()
      );

      return `
        <div style="margin-bottom: 12px; padding: 10px; background: #f1f5f9; border-radius: 8px;">
          <div><strong>📍 ขึ้นที่:</strong> ${group.get_on}</div>
          <div><strong>🎯 ลงที่:</strong> ${group.get_off} <small>(ห่างจากจุดหมาย: ${group.get_off_distance} เมตร)</small></div>
          <div><strong>🚌 สายที่สามารถนั่งได้:</strong></div>
          <ul class="ml-4 list-disc">
            ${uniqueRoutes.map((r: any) => {
              if (!r) return `<li>❌ ไม่พบข้อมูลเส้นทาง</li>`;
              const shortName = r.short_name || 'ไม่ทราบ';
              const longName = r.long_name || '';
              const onlyThai = longName.split(/;|,|\(/)[0]?.trim() || '';
              return `<li><strong>สาย ${shortName}</strong> - ${onlyThai}</li>`;
            }).join('')}
          </ul>
        </div>
      `;
    }).join('');

    resultContainer.innerHTML = html;
  };

  const suggestRoutes = () => {
    const input = document.getElementById('startStopInput') as HTMLInputElement;
    const resultContainer = document.getElementById('routes-display')!;

    if (!exhibitionLatLng) {
      alert('ยังไม่พบพิกัดนิทรรศการ');
      return;
    }

    const latLngParts = input.value.trim().slice(1).split(',');
    if (input.value.startsWith('@') && latLngParts.length === 2) {
      const [lat, lng] = latLngParts.map(parseFloat);
      fetch(`http://localhost:5000/bus-routes/suggest-route?lat=${lat}&lng=${lng}&exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`)
        .then((res) => res.json())
        .then(displayRoutes)
        .catch((err) => {
          console.error(err);
          resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาดในการค้นหาเส้นทาง</p>`;
        });
    } else {
      const matchedStop = busStops.find((stop: any) => stop.stop_name === input.value);
      if (!matchedStop) {
        resultContainer.innerHTML = `<p style="color:red;">ไม่พบป้ายที่คุณกรอกในระบบ</p>`;
        return;
      }

      fetch(`http://localhost:5000/bus-routes/suggest-route?exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userStops: [matchedStop.stop_id] })
      })
        .then((res) => res.json())
        .then(displayRoutes)
        .catch((err) => {
          console.error(err);
          resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาดในการค้นหาเส้นทาง</p>`;
        });
    }
  };

  const getTransportIcon = (name: string) => {
    const thaiNameOnly = name.split(/;|,/)[0].trim();
    if (/BTS|MRT|ARL|SRT|BRT/.test(thaiNameOnly)) return '🚆';
    if (/ท่าเรือ/.test(thaiNameOnly)) return '⛴️';
    return '🚌';
  };

  const renderBusStops = () => {
    return busStops.map((stop, index) => {
      const icon = getTransportIcon(stop.stop_name);
      const routeList = Array.isArray(stop.routes)
        ? Array.from(new Map(stop.routes.map((route: any) => [`${route.short_name}-${route.long_name}`, route])).values())
            .map((route: any) => `<li class="ml-4 list-disc"><strong>สาย ${route.short_name}</strong> - ${route.long_name.split(';')[0].trim()}</li>`)
            .join('')
        : '<li>ไม่มีข้อมูลเส้นทาง</li>';

      let price = 'ยังไม่มีข้อมูล';
      if (typeof stop.min_price === 'number' && typeof stop.max_price === 'number') {
        price = stop.min_price === stop.max_price ? `${stop.min_price} Baht` : `${stop.min_price} - ${stop.max_price} Baht`;
      }

      return (
        <div key={stop.stop_id} className="bus-stop">
          <h3><strong>🅿️ {index + 1}.</strong> {icon} {stop.stop_name}</h3>
          <div className="info">
            <span className="icon">📏</span>Distance: <strong>{stop.distance}</strong> meters
          </div>
          <div className="info">
            <span className="icon">{icon}</span> Routes:
          </div>
          <ul className="mt-1">{routeList}</ul>
          <div className="price">Fare: <strong>{price}</strong></div>
        </div>
      );
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => window.history.back()} className="mb-4 bg-blue-800 text-white p-2 rounded-md">
        ⬅️ กลับไปที่นิทรรศการ
      </button>
      <div className="flex gap-20 max-w-5xl mx-auto">
        <div className="flex-1">
          <div className="bus-container">
            <h2>🚍 Nearby Bus Stops</h2>
            {renderBusStops()}
          </div>
        </div>
        <div className="flex-1">
          <div id="route-inputs" className="text-center mb-3">
            <input list="stop-suggestions" id="startStopInput" placeholder="พิมพ์ชื่อป้าย หรือใช้พิกัดปัจจุบัน" className="m-1 p-2 rounded-md border" />
            <button onClick={useMyLocation} className="m-1 px-3 py-2 rounded-md bg-yellow-300">📍 ใช้พิกัดของฉัน</button>
          </div>
          <div className="text-center">
            <button onClick={suggestRoutes} className="bg-blue-800 text-white p-4 rounded-md">
              แสดงเส้นทาง
            </button>
          </div>
          <div id="routes-display" className="mt-4" />
        </div>
      </div>
    </div>
  );
}
