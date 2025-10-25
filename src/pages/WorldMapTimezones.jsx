/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Globe, Clock, Sun, Moon, MapPin } from "lucide-react";

const TIMEZONE_CITIES = [
  // Americas
  {
    name: "Los Angeles",
    zone: "America/Los_Angeles",
    lat: 34.05,
    lng: -118.24,
    flag: "🇺🇸",
  },
  {
    name: "Denver",
    zone: "America/Denver",
    lat: 39.74,
    lng: -104.99,
    flag: "🇺🇸",
  },
  {
    name: "Chicago",
    zone: "America/Chicago",
    lat: 41.88,
    lng: -87.63,
    flag: "🇺🇸",
  },
  {
    name: "New York",
    zone: "America/New_York",
    lat: 40.71,
    lng: -74.01,
    flag: "🇺🇸",
  },
  {
    name: "Mexico City",
    zone: "America/Mexico_City",
    lat: 19.43,
    lng: -99.13,
    flag: "🇲🇽",
  },
  {
    name: "Bogota",
    zone: "America/Bogota",
    lat: 4.71,
    lng: -74.07,
    flag: "🇨🇴",
  },
  { name: "Lima", zone: "America/Lima", lat: -12.05, lng: -77.04, flag: "🇵🇪" },
  {
    name: "São Paulo",
    zone: "America/Sao_Paulo",
    lat: -23.55,
    lng: -46.63,
    flag: "🇧🇷",
  },
  {
    name: "Buenos Aires",
    zone: "America/Buenos_Aires",
    lat: -34.6,
    lng: -58.38,
    flag: "🇦🇷",
  },

  // Europe
  { name: "London", zone: "Europe/London", lat: 51.51, lng: -0.13, flag: "🇬🇧" },
  { name: "Paris", zone: "Europe/Paris", lat: 48.86, lng: 2.35, flag: "🇫🇷" },
  { name: "Berlin", zone: "Europe/Berlin", lat: 52.52, lng: 13.4, flag: "🇩🇪" },
  { name: "Madrid", zone: "Europe/Madrid", lat: 40.42, lng: -3.7, flag: "🇪🇸" },
  { name: "Rome", zone: "Europe/Rome", lat: 41.9, lng: 12.5, flag: "🇮🇹" },
  { name: "Moscow", zone: "Europe/Moscow", lat: 55.76, lng: 37.62, flag: "🇷🇺" },
  {
    name: "Istanbul",
    zone: "Europe/Istanbul",
    lat: 41.01,
    lng: 28.98,
    flag: "🇹🇷",
  },

  // Africa
  { name: "Cairo", zone: "Africa/Cairo", lat: 30.04, lng: 31.24, flag: "🇪🇬" },
  { name: "Lagos", zone: "Africa/Lagos", lat: 6.52, lng: 3.38, flag: "🇳🇬" },
  {
    name: "Johannesburg",
    zone: "Africa/Johannesburg",
    lat: -26.2,
    lng: 28.05,
    flag: "🇿🇦",
  },
  {
    name: "Nairobi",
    zone: "Africa/Nairobi",
    lat: -1.29,
    lng: 36.82,
    flag: "🇰🇪",
  },

  // Asia
  { name: "Dubai", zone: "Asia/Dubai", lat: 25.2, lng: 55.27, flag: "🇦🇪" },
  { name: "Kolkata", zone: "Asia/Kolkata", lat: 22.57, lng: 88.36, flag: "🇮🇳" },
  { name: "Bangkok", zone: "Asia/Bangkok", lat: 13.76, lng: 100.5, flag: "🇹🇭" },
  {
    name: "Singapore",
    zone: "Asia/Singapore",
    lat: 1.35,
    lng: 103.82,
    flag: "🇸🇬",
  },
  {
    name: "Jakarta",
    zone: "Asia/Jakarta",
    lat: -6.21,
    lng: 106.85,
    flag: "🇮🇩",
  },
  {
    name: "Hong Kong",
    zone: "Asia/Hong_Kong",
    lat: 22.32,
    lng: 114.17,
    flag: "🇭🇰",
  },
  {
    name: "Shanghai",
    zone: "Asia/Shanghai",
    lat: 31.23,
    lng: 121.47,
    flag: "🇨🇳",
  },
  { name: "Tokyo", zone: "Asia/Tokyo", lat: 35.68, lng: 139.65, flag: "🇯🇵" },
  { name: "Seoul", zone: "Asia/Seoul", lat: 37.57, lng: 126.98, flag: "🇰🇷" },
  { name: "Taipei", zone: "Asia/Taipei", lat: 25.03, lng: 121.56, flag: "🇹🇼" },

  // Oceania
  {
    name: "Perth",
    zone: "Australia/Perth",
    lat: -31.95,
    lng: 115.86,
    flag: "🇦🇺",
  },
  {
    name: "Sydney",
    zone: "Australia/Sydney",
    lat: -33.87,
    lng: 151.21,
    flag: "🇦🇺",
  },
  {
    name: "Auckland",
    zone: "Pacific/Auckland",
    lat: -36.85,
    lng: 174.76,
    flag: "🇳🇿",
  },
];

export default function WorldMapTimezones() {
  const [now, setNow] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentZone, setCurrentZone] = useState("");
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Detect user's current timezone and set as default
  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentZone(userZone);

    // Find matching city or create custom entry
    const matchingCity = TIMEZONE_CITIES.find((city) => city.zone === userZone);
    if (matchingCity) {
      setSelectedCity(matchingCity);
    } else {
      // Create a custom city entry for user's location
      setSelectedCity({
        name: "Your Location",
        zone: userZone,
        lat: 0,
        lng: 0,
        flag: "📍",
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        // Check if container already has a map instance
        if (mapContainerRef.current._leaflet_id) {
          return;
        }

        // Dynamically import Leaflet
        const L = await import(
          "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js"
        );

        if (!mounted) return;

        // Create map
        const map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,
          maxZoom: 8,
          worldCopyJump: true,
          zoomControl: true,
        });

        // Add tile layer (CartoDB Dark Matter theme)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }
        ).addTo(map);

        mapRef.current = { map, L, markers: [] };

        // Add markers for all cities
        updateMarkers();
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when cities change
  const updateMarkers = () => {
    if (!mapRef.current) return;

    const { map, L, markers } = mapRef.current;

    // Remove old markers
    markers.forEach((marker) => marker.remove());
    mapRef.current.markers = [];

    // Add new markers
    TIMEZONE_CITIES.forEach((city) => {
      const timeOfDay = getTimeOfDay(city.zone);
      const color = timeOfDay === "night" ? "#6366f1" : "#fbbf24";

      const icon = L.divIcon({
        className: "custom-marker-wrapper",
        html: `<div class="marker-dot" style="
          width: 16px;
          height: 16px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

      // Store city data on marker
      marker.cityData = city;

      // Click event
      marker.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        setSelectedCity(this.cityData);
      });

      // Hover events
      marker.on("mouseover", function () {
        const markerElement = this.getElement();
        if (markerElement) {
          const dotElement = markerElement.querySelector(".marker-dot");
          if (dotElement) {
            dotElement.style.transform = "scale(1.4)";
            dotElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.6)";
          }
        }
        this.openTooltip();
      });

      marker.on("mouseout", function () {
        const markerElement = this.getElement();
        if (markerElement) {
          const dotElement = markerElement.querySelector(".marker-dot");
          if (dotElement) {
            dotElement.style.transform = "scale(1)";
            dotElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
          }
        }
        this.closeTooltip();
      });

      // Bind tooltip
      marker.bindTooltip(
        `<div style="text-align: center;"><span style="font-size: 18px;">${city.flag}</span><br/><strong>${city.name}</strong></div>`,
        {
          direction: "top",
          offset: [0, -15],
          className: "custom-tooltip",
          permanent: false,
          opacity: 1,
        }
      );

      mapRef.current.markers.push(marker);
    });
  };

  // Update markers every minute to reflect time changes
  useEffect(() => {
    const interval = setInterval(updateMarkers, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeForZone = (zone) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
    } catch {
      return "--:--";
    }
  };

  const getDateForZone = (zone) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);
    } catch {
      return "--";
    }
  };

  const getHourForZone = (zone) => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "numeric",
        hour12: false,
      });
      return parseInt(formatter.format(now), 10);
    } catch {
      return 12;
    }
  };

  const getTimeOfDay = (zone) => {
    const hour = getHourForZone(zone);
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 20) return "evening";
    return "night";
  };

  const getUTCOffset = (zone) => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        timeZoneName: "shortOffset",
      });
      const parts = formatter.formatToParts(now);
      const timeZonePart = parts.find((part) => part.type === "timeZoneName");
      if (timeZonePart) {
        return timeZonePart.value.replace("GMT", "UTC");
      }
      return "";
    } catch {
      return "";
    }
  };

  const getColorForTimeOfDay = (timeOfDay) => {
    const colors = {
      morning: {
        bg: "from-amber-500/20 to-amber-600/10",
        border: "border-amber-500/40",
        badge: "bg-amber-500/80",
        icon: Sun,
        textColor: "text-amber-100",
        glow: "shadow-amber-500/20",
      },
      afternoon: {
        bg: "from-sky-500/20 to-sky-600/10",
        border: "border-sky-500/40",
        badge: "bg-sky-500/80",
        icon: Sun,
        textColor: "text-sky-100",
        glow: "shadow-sky-500/20",
      },
      evening: {
        bg: "from-rose-500/20 to-rose-600/10",
        border: "border-rose-500/40",
        badge: "bg-rose-500/80",
        icon: Sun,
        textColor: "text-rose-100",
        glow: "shadow-rose-500/20",
      },
      night: {
        bg: "from-indigo-600/20 to-indigo-700/10",
        border: "border-indigo-500/40",
        badge: "bg-indigo-600/80",
        icon: Moon,
        textColor: "text-indigo-100",
        glow: "shadow-indigo-500/20",
      },
    };
    return colors[timeOfDay] || colors.afternoon;
  };

  const cityToDisplay = selectedCity;

  return (
    <>
      {/* Add Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
      />
      <style>{`
        .leaflet-container {
          background: #1e293b;
          font-family: inherit;
        }
        .custom-marker-wrapper {
          background: transparent !important;
          border: none !important;
          pointer-events: auto !important;
        }
        .marker-dot {
          pointer-events: auto !important;
        }
        .custom-tooltip {
          background: rgba(15, 23, 42, 0.98) !important;
          border: 2px solid rgba(148, 163, 184, 0.5) !important;
          color: white !important;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 10px;
          backdrop-filter: blur(12px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.5) !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(15, 23, 42, 0.98) !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95);
          color: white;
        }
      `}</style>

      <div className="w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="text-startflex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-100">
              <Globe className="inline-block mr-2" size={24} />
              World Time Zones
            </h2>
            <p className="text-neutral-300 text-xs md:text-sm">
              Choose a city on the map to see its time zone and UTC offset.
            </p>
          </div>

          {/* Main Content - Map on Left, Info on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-800/30 backdrop-blur-sm border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[500px] lg:h-[600px]"
                />
              </div>

              {/* Legend below map */}
              <div className="mt-4 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Sun size={18} />
                  Time of Day Legend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Morning (5AM-12PM)", timeOfDay: "morning" },
                    { label: "Afternoon (12PM-5PM)", timeOfDay: "afternoon" },
                    { label: "Evening (5PM-8PM)", timeOfDay: "evening" },
                    { label: "Night (8PM-5AM)", timeOfDay: "night" },
                  ].map(({ label, timeOfDay }) => {
                    const colors = getColorForTimeOfDay(timeOfDay);
                    const IconComponent = colors.icon;
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                          style={{
                            backgroundColor:
                              timeOfDay === "night" ? "#6366f1" : "#fbbf24",
                          }}
                        />
                        <span className="text-neutral-300 text-xs">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Info Card Section - Takes 1 column */}
            <div className="lg:col-span-1">
              {cityToDisplay ? (
                <div className=" shadow-2xl h-max sticky top-24 p-3 rounded-xl border border-input">
                  <div className="space-y-6">
                    {/* City Header */}
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{cityToDisplay.flag}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {cityToDisplay.name}
                        </h3>
                        <p className="text-neutral-300 text-sm flex items-center gap-1">
                          <MapPin size={12} />
                          {cityToDisplay.zone}
                        </p>
                      </div>
                    </div>

                    {/* Time Display */}
                    <div
                      className={`bg-gradient-to-br ${
                        getColorForTimeOfDay(getTimeOfDay(cityToDisplay.zone))
                          .bg
                      } backdrop-blur-md border ${
                        getColorForTimeOfDay(getTimeOfDay(cityToDisplay.zone))
                          .border
                      } rounded-xl p-4`}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <Clock size={16} className="text-neutral-300" />
                        <span className="text-neutral-300 text-xs md:text-sm font-medium">
                          Current Time
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-white tabular-nums">
                        {getTimeForZone(cityToDisplay.zone)}
                      </p>
                      <p className="text-neutral-300 text-xs md:text-sm">
                        {getDateForZone(cityToDisplay.zone)}
                      </p>
                    </div>

                    {/* UTC Offset */}
                    <div className="flex items-center justify-between gap-2 mb-2 bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Globe size={16} className="text-neutral-300" />
                          <span className="text-neutral-300 text-xs md:text-sm font-medium">
                            UTC Offset
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {getUTCOffset(cityToDisplay.zone)}
                        </p>
                      </div>

                      {/* Time of Day Badge */}
                      <div className="flex justify-center">
                        {(() => {
                          const timeOfDay = getTimeOfDay(cityToDisplay.zone);
                          const colors = getColorForTimeOfDay(timeOfDay);
                          const IconComponent = colors.icon;
                          return (
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.badge} ${colors.textColor} shadow-lg ${colors.glow}`}
                            >
                              <IconComponent size={20} />
                              <span className="font-bold text-base capitalize">
                                {timeOfDay}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {cityToDisplay.name === "Your Location" && (
                      <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                        <p className="text-blue-200 text-sm text-center">
                          📍 This is your current location based on your system
                          timezone
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-800/30 backdrop-blur-md border border-neutral-700 rounded-2xl p-6 text-center h-72 flex items-center justify-center">
                  <div className="space-y-4">
                    <Globe size={54} className="mx-auto text-neutral-600" />
                    <p className="text-neutral-400 text-sm">
                      Click on any city marker on the map to view its time zone
                      information
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
