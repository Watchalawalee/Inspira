'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function DirectionPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [exhibitionLatLng, setExhibitionLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [allStops, setAllStops] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, stopsRes, allStopsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/${slug}/nearby-bus`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/all-stops`)
        ]);
        const eventData = await eventRes.json();
        const busData = await stopsRes.json();
        const allStopsData = await allStopsRes.json();
        setEvent(eventData);
        setBusStops(busData);
        setAllStops(allStopsData);
        if (eventData.latitude && eventData.longitude) {
          setExhibitionLatLng({ lat: eventData.latitude, lng: eventData.longitude });
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined' && exhibitionLatLng && busStops.length > 0) {
      window.initMap = () => {
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: exhibitionLatLng,
          zoom: 15,
        });

        new google.maps.Marker({
          position: exhibitionLatLng,
          map,
          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          title: '📍 Exhibition Location',
        });

        busStops.forEach((stop) => {
          if (stop.latitude && stop.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: stop.latitude, lng: stop.longitude },
              map,
              icon: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
              title: stop.stop_name,
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<strong>${stop.stop_name}</strong><br>Distance: ${stop.distance} m`
            });

            marker.addListener("click", () => infoWindow.open(map, marker));
          }
        });
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyARUJc-U7xfVvWsV4LnguUoIZQcvoRM2ik&callback=initMap&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [exhibitionLatLng, busStops]);

  const getTransportIcon = (name: string) => {
    const thaiNameOnly = name.split(/;|,/)[0].trim();
    if (/BTS|MRT|ARL|SRT|BRT/.test(thaiNameOnly)) return '🚆';
    if (/ท่าเรือ/.test(thaiNameOnly)) return '⛴️';
    return '🚌';
  };

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const input = document.getElementById('startStopInput') as HTMLInputElement;
        input.value = `@${latitude},${longitude}`;
      },
      () => alert('ไม่สามารถเข้าถึงพิกัดของคุณได้')
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

    const html = Object.values(grouped).map((group: any) => {
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
              if (!r || !r.short_name) return `<li>❌ ไม่พบข้อมูลเส้นทาง</li>`;
              const shortName = r.short_name || 'ไม่ทราบ';
              const longName = (r?.long_name || '').split(/;|,|\(/)[0]?.trim() || '';
              return `<li><strong>สาย ${shortName}</strong> - ${longName}</li>`;
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

    const val = input.value.trim();
    if (val.startsWith('@')) {
      const parts = val.slice(1).split(',');
      const [lat, lng] = parts.map(parseFloat);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/suggest-route?lat=${lat}&lng=${lng}&exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`)
        .then(res => res.json())
        .then(displayRoutes)
        .catch(() => resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด</p>`);
    } else {
      const matched = allStops.find(stop => stop.stop_name === val);
      if (!matched) {
        resultContainer.innerHTML = `<p style="color:red;">ไม่พบป้ายที่คุณกรอกในระบบ</p>`;
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus-routes/suggest-route?exLat=${exhibitionLatLng.lat}&exLng=${exhibitionLatLng.lng}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userStops: [matched.stop_id] })
      })
        .then(res => res.json())
        .then(displayRoutes)
        .catch(() => resultContainer.innerHTML = `<p style="color:red;">เกิดข้อผิดพลาด</p>`);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4">
      <button onClick={() => window.history.back()} className="mb-4 bg-blue-800 text-white px-4 py-2 rounded-lg">
        ⬅️ กลับไปที่นิทรรศการ
      </button>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* LEFT: Bus Stop Info */}
        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">🚍 Nearby Bus Stops</h2>
            {busStops.map((stop, index) => {
              const icon = getTransportIcon(stop.stop_name);
              const routeList = Array.isArray(stop.routes)
                ? Array.from(new Map(stop.routes.map((r: any) => [`${r.short_name}-${r.long_name}`, r])).values())
                    .map((route: any) => `<li class="ml-4 list-disc"><strong>สาย ${route.short_name}</strong> - ${route.long_name?.split(';')[0]}</li>`)
                    .join('')
                : '<li>ไม่มีข้อมูลเส้นทาง</li>';
                const price = (stop.min_price == null || stop.max_price == null)
                ? 'ยังไม่มีข้อมูล'
                : (stop.min_price === stop.max_price
                    ? `${stop.min_price} Baht`
                    : `${stop.min_price} - ${stop.max_price} Baht`);              
              return (
                <div key={stop.stop_id} className="bus-stop border-b py-3">
                  <h3><strong>🅿️ {index + 1}.</strong> {icon} {stop.stop_name}</h3>
                  <div className="text-sm text-gray-700">📏 Distance: <strong>{stop.distance}</strong> meters</div>
                  <div className="text-sm text-gray-700">{icon} Routes:</div>
                  <ul className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: routeList }} />
                  <div className="text-blue-700 mt-2 font-medium">Fare: {price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Input + Map */}
        <div className="flex-1">
          <div className="text-center mb-3">
            <input list="stop-suggestions" id="startStopInput" placeholder="พิมพ์ชื่อป้าย หรือใช้พิกัดปัจจุบัน"
              className="m-1 p-2 rounded-md border w-3/4" />
            <datalist id="stop-suggestions">
              {allStops.map(stop => (
                <option key={stop.stop_id} value={stop.stop_name} />
              ))}
            </datalist>
            <button onClick={useMyLocation} className="m-1 px-3 py-2 rounded-md bg-yellow-300">📍 ใช้พิกัดของฉัน</button>
            <button onClick={suggestRoutes} className="m-1 px-3 py-2 rounded-md bg-blue-800 text-white">🧭 แนะนำเส้นทาง</button>
          </div>
          <div className="bg-white rounded-xl shadow p-4 mt-4">
            <h3 className="font-semibold mb-2">🚍 Suggested Routes</h3>
            <div id="routes-display">กรุณาเลือกป้ายเริ่มต้น</div>
          </div>
          <h2 className="text-center font-bold text-lg mt-8">🗺️ Map</h2>
          <div id="map" className="w-full h-[500px] rounded-2xl shadow-lg mt-2" />
        </div>
      </div>
    </div>
  );
}
