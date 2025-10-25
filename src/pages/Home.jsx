/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Trash2, Sun, Moon, Sunrise, Sunset, Globe } from "lucide-react";

const TIME_ZONES = [
  { value: "Asia/Jakarta", label: "Jakarta", flag: "🇮🇩" },
  { value: "Asia/Singapore", label: "Singapore", flag: "🇸🇬" },
  { value: "Asia/Tokyo", label: "Tokyo", flag: "🇯🇵" },
  { value: "Asia/Seoul", label: "Seoul", flag: "🇰🇷" },
  { value: "Asia/Bangkok", label: "Bangkok", flag: "🇹🇭" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", flag: "🇭🇰" },
  { value: "Asia/Dubai", label: "Dubai", flag: "🇦🇪" },
  { value: "Asia/Kolkata", label: "Kolkata", flag: "🇮🇳" },
  { value: "Asia/Shanghai", label: "Shanghai", flag: "🇨🇳" },
  { value: "Asia/Taipei", label: "Taipei", flag: "🇹🇼" },
  { value: "Europe/London", label: "London", flag: "🇬🇧" },
  { value: "Europe/Paris", label: "Paris", flag: "🇫🇷" },
  { value: "Europe/Berlin", label: "Berlin", flag: "🇩🇪" },
  { value: "Europe/Madrid", label: "Madrid", flag: "🇪🇸" },
  { value: "Europe/Rome", label: "Rome", flag: "🇮🇹" },
  { value: "Europe/Moscow", label: "Moscow", flag: "🇷🇺" },
  { value: "Europe/Istanbul", label: "Istanbul", flag: "🇹🇷" },
  { value: "Europe/Amsterdam", label: "Amsterdam", flag: "🇳🇱" },
  { value: "Europe/Zurich", label: "Zurich", flag: "🇨🇭" },
  { value: "Europe/Stockholm", label: "Stockholm", flag: "🇸🇪" },
  { value: "America/New_York", label: "New York", flag: "🇺🇸" },
  { value: "America/Los_Angeles", label: "Los Angeles", flag: "🇺🇸" },
  { value: "America/Chicago", label: "Chicago", flag: "🇺🇸" },
  { value: "America/Denver", label: "Denver", flag: "🇺🇸" },
  { value: "America/Toronto", label: "Toronto", flag: "🇨🇦" },
  { value: "America/Vancouver", label: "Vancouver", flag: "🇨🇦" },
  { value: "America/Mexico_City", label: "Mexico City", flag: "🇲🇽" },
  { value: "America/Sao_Paulo", label: "São Paulo", flag: "🇧🇷" },
  { value: "America/Buenos_Aires", label: "Buenos Aires", flag: "🇦🇷" },
  { value: "America/Lima", label: "Lima", flag: "🇵🇪" },
  { value: "America/Bogota", label: "Bogota", flag: "🇨🇴" },
  { value: "Australia/Sydney", label: "Sydney", flag: "🇦🇺" },
  { value: "Australia/Melbourne", label: "Melbourne", flag: "🇦🇺" },
  { value: "Australia/Perth", label: "Perth", flag: "🇦🇺" },
  { value: "Australia/Brisbane", label: "Brisbane", flag: "🇦🇺" },
  { value: "Africa/Cairo", label: "Cairo", flag: "🇪🇬" },
  { value: "Africa/Johannesburg", label: "Johannesburg", flag: "🇿🇦" },
  { value: "Africa/Lagos", label: "Lagos", flag: "🇳🇬" },
  { value: "Africa/Nairobi", label: "Nairobi", flag: "🇰🇪" },
  { value: "Pacific/Auckland", label: "Auckland", flag: "🇳🇿" },
  { value: "Pacific/Fiji", label: "Fiji", flag: "🇫🇯" },
  { value: "Pacific/Honolulu", label: "Honolulu", flag: "🇺🇸" },
  { value: "Pacific/Guam", label: "Guam", flag: "🇬🇺" },
  { value: "Antarctica/Palmer", label: "Palmer", flag: "🇦🇶" },
  { value: "Asia/Kathmandu", label: "Kathmandu", flag: "🇳🇵" },
  { value: "Asia/Colombo", label: "Colombo", flag: "🇱🇰" },
  { value: "Asia/Gaza", label: "Gaza", flag: "🇵🇸" },
  { value: "Europe/Helsinki", label: "Helsinki", flag: "🇫🇮" },
  { value: "Europe/Athens", label: "Athens", flag: "🇬🇷" },
  { value: "Europe/Dublin", label: "Dublin", flag: "🇮🇪" },
  { value: "Europe/Lisbon", label: "Lisbon", flag: "🇵🇹" },
  { value: "America/Halifax", label: "Halifax", flag: "🇨🇦" },
  { value: "America/Anchorage", label: "Anchorage", flag: "🇺🇸" },
];

const STORAGE_KEY = "saved_timezones";

export default function Home() {
  const [timeFormat, setTimeFormat] = useState("12h");
  const [showUTC, setShowUTC] = useState(false);
  const [currentZone, setCurrentZone] = useState("");
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [hoveredZone, setHoveredZone] = useState(null);
  const [now, setNow] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Detect user's current timezone
  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentZone(userZone);
  }, []);

  // Load zones from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setZones(Array.isArray(parsed) ? parsed : []);
      } else {
        // Default zones if nothing stored
        const defaultZones = ["Europe/London", "America/New_York"];
        setZones(defaultZones);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultZones));
      }
    } catch (e) {
      console.error("Error loading zones:", e);
      setZones(["Europe/London", "America/New_York"]);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (zone) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: timeFormat === "12h",
      }).format(now);
    } catch {
      return "--:--";
    }
  };

  const getUTCOffset = (zone) => {
    try {
      const date = new Date();

      // Format with shortOffset to get something like "GMT+7"
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        timeZoneName: "shortOffset",
      });

      const parts = formatter.formatToParts(date);
      const timeZonePart = parts.find((part) => part.type === "timeZoneName");

      if (timeZonePart) {
        // Replace GMT with UTC
        return timeZonePart.value.replace("GMT", "UTC");
      }

      return "";
    } catch (e) {
      console.error("Error getting UTC offset:", e);
      return "";
    }
  };

  const getHourDecimal = (zone) => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      const timeStr = formatter.format(now);
      const [h, m] = timeStr.split(":").map(Number);
      return h + m / 60;
    } catch {
      return 12;
    }
  };

  const getDiffHours = (baseZone, targetZone) => {
    if (!baseZone || !targetZone) return 0;
    if (baseZone === targetZone) return 0;

    try {
      const getOffsetMinutes = (zone) => {
        const f = new Intl.DateTimeFormat("en-US", {
          timeZone: zone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        const parts = f.formatToParts(now);
        const obj = {};
        parts.forEach((p) => {
          if (p.type !== "literal") obj[p.type] = p.value;
        });
        const y = parseInt(obj.year, 10);
        const m = parseInt(obj.month, 10);
        const d = parseInt(obj.day, 10);
        const hh = parseInt(obj.hour, 10);
        const mm = parseInt(obj.minute, 10);
        const ss = parseInt(obj.second, 10);
        const localTs = Date.UTC(y, m - 1, d, hh, mm, ss);
        const nowUtc = now.getTime();
        const offsetMinutes = (localTs - nowUtc) / 60000;
        return -offsetMinutes;
      };
      const baseOff = getOffsetMinutes(baseZone);
      const targetOff = getOffsetMinutes(targetZone);
      const diffHours = (targetOff - baseOff) / 60;
      return Math.round(diffHours * 10) / 10;
    } catch {
      return 0;
    }
  };

  const getDiffText = (baseZone, targetZone) => {
    const h = getDiffHours(baseZone, targetZone);
    if (Math.abs(h) < 0.05) return "Same time";
    const sign = h > 0 ? "+" : "-";
    const abs = Math.abs(h);
    const shown = Number.isInteger(abs)
      ? `${abs}`
      : `${abs}`.replace(/\.0$/, "");
    const tzInfo = TIME_ZONES.find((tz) => tz.value === baseZone);
    const baseName = tzInfo ? tzInfo.label : baseZone.split("/")[1] || baseZone;
    return `${sign}${shown}h from ${baseName}`;
  };

  const getTimeOfDay = (zone) => {
    const now = new Date();

    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "2-digit",
        hour12: false,
      });

      const hourString = formatter.format(now);
      const hour = parseInt(hourString, 10);

      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 17) return "afternoon";
      if (hour >= 17 && hour < 20) return "evening";
      return "night";
    } catch (e) {
      console.error("Error getting time for zone:", zone, e);
      return "afternoon";
    }
  };

  const getTimeColors = (timeOfDay) => {
    const colors = {
      morning: {
        bg: "bg-gradient-to-r from-neutral-900 to-amber-200/50 70%",
        border: "border-amber-400/80",
        hover: "hover:border-amber-500",
        badge: "bg-amber-800/70",
        icon: Sunrise,
        sunColor: "#f59e0b",
        glowColor: "rgba(245,158,11,0.5)",
      },
      afternoon: {
        bg: "bg-gradient-to-r from-neutral-900 to-sky-200/50 70%",
        border: "border-sky-500/80",
        hover: "hover:border-sky-600",
        badge: "bg-sky-800/70",
        icon: Sun,
        sunColor: "#0ea5e9",
        glowColor: "rgba(14,165,233,0.5)",
      },
      evening: {
        bg: "bg-gradient-to-r from-neutral-900 to-rose-200/50 70%",
        border: "border-rose-500/80",
        hover: "hover:border-rose-600",
        badge: "bg-rose-800/70",
        icon: Sunset,
        sunColor: "#f43f5e",
        glowColor: "rgba(244,63,94,0.5)",
      },
      night: {
        bg: "bg-gradient-to-r from-neutral-900 to-indigo-400/30 70%",
        border: "border-indigo-400/70",
        hover: "hover:border-indigo-300",
        badge: "bg-indigo-400/50",
        icon: Moon,
        sunColor: "#a5b4fc",
        glowColor: "rgba(165,180,252,0.5)",
      },
    };
    return colors[timeOfDay] || colors.afternoon;
  };

  const handleAddZone = () => {
    if (!selectedZone) return;
    if (!zones.includes(selectedZone)) {
      const newZones = [...zones, selectedZone];
      setZones(newZones);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newZones));
      } catch (e) {
        console.error("Error saving zones:", e);
      }
    }
    setSelectedZone("");
    setIsDialogOpen(false);
  };

  const handleRemoveZone = (z) => {
    const newZones = zones.filter((x) => x !== z);
    setZones(newZones);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newZones));
    } catch (e) {
      console.error("Error saving zones:", e);
    }
    if (hoveredZone === z) setHoveredZone(null);
  };

  const renderCard = (zone, isCurrentTime = false, displayUTC = false) => {
    const timeStr = formatTime(zone);
    const utcStr = displayUTC ? getUTCOffset(zone) : null;
    const isRef = hoveredZone === zone;
    const timeOfDay = getTimeOfDay(zone);
    const colors = getTimeColors(timeOfDay);
    const hourDecimal = getHourDecimal(zone);
    const IconComponent = isCurrentTime ? Globe : colors.icon;

    // Get timezone info for display
    const tzInfo = TIME_ZONES.find((tz) => tz.value === zone);
    const displayName = tzInfo
      ? `${tzInfo.flag} ${tzInfo.label}`
      : zone.replace("_", " ");

    // Calculate sun position on curve
    const sunriseHour = 6;
    const sunsetHour = 18;

    const getSunY = (hour) => {
      if (hour >= sunriseHour && hour <= sunsetHour) {
        const dayProgress = (hour - sunriseHour) / (sunsetHour - sunriseHour);
        const angle = dayProgress * Math.PI;
        return 50 - Math.sin(angle) * 35;
      } else {
        let nightHour = hour < sunriseHour ? hour + 24 : hour;
        const nightProgress =
          (nightHour - sunsetHour) / (24 - sunsetHour + sunriseHour);
        const angle = nightProgress * Math.PI;
        return 50 + Math.sin(angle) * 25;
      }
    };

    const sunX = (hourDecimal / 24) * 100;
    const sunY = getSunY(hourDecimal);

    return (
      <div
        key={zone}
        onMouseEnter={() => setHoveredZone(zone)}
        onMouseLeave={() => setHoveredZone(null)}
        className={`relative flex flex-row items-center justify-between gap-3 p-3 rounded-xl border border-input ${
          colors.bg
        } cursor-pointer ${
          !isCurrentTime ? colors.hover : colors.hover
        } transition`}
      >
        {/* Info Section */}
        <div className="flex-1 relative z-10 space-y-3 text-nowrap">
          <div className="font-semibold text-lg text-neutral-100">
            {displayName}
          </div>
          <div className="ml-2">
            <div className="text-2xl font-bold text-neutral-100 tabular-nums">
              {timeStr}
            </div>
            {utcStr && <h3 className="text-sm text-neutral-300">{utcStr}</h3>}
          </div>
          <div
            className={`w-max flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md ${colors.badge}`}
          >
            <IconComponent size={16} className="text-neutral-200" />
            {isCurrentTime
              ? "Your Time"
              : timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
          </div>
        </div>

        {/* Time Visualization */}
        <div className="flex-0 relative w-full h-20">
          <svg
            className="w-full h-full opacity-40"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.5"
              strokeDasharray="2,2"
            />

            <path
              d={`M ${(6 / 24) * 100},50 ${[...Array(73).keys()]
                .map((i) => {
                  const hour = 6 + (i / 72) * 12;
                  const x = (hour / 24) * 100;
                  const progress = (hour - 6) / 12;
                  const angle = progress * Math.PI;
                  const y = 50 - Math.sin(angle) * 35;
                  return `L ${x},${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke={colors.sunColor}
              strokeWidth="1.5"
              opacity="0.6"
            />

            <path
              d={`M ${(18 / 24) * 100},50 ${[...Array(73).keys()]
                .map((i) => {
                  const hour = 18 + (i / 72) * 12;
                  const x = (hour / 24) * 100;
                  const progress = (hour - 18) / 12;
                  const angle = progress * Math.PI;
                  const y = 50 + Math.sin(angle) * 25;
                  return `L ${x},${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke={colors.sunColor}
              strokeWidth="1.5"
              opacity="0.3"
            />

            <path
              d={`M 0,${50 + Math.sin((6 / 12) * Math.PI) * 25} ${[
                ...Array(37).keys(),
              ]
                .map((i) => {
                  const hour = (i / 36) * 6;
                  const x = (hour / 24) * 100;
                  const progress = (6 - hour) / 12;
                  const angle = (1 - progress) * Math.PI;
                  const y = 50 + Math.sin(angle) * 25;
                  return `L ${x},${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke={colors.sunColor}
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>

          <div
            className="absolute w-3 h-3 rounded-full transition-all duration-1000 z-10"
            style={{
              left: `${sunX}%`,
              top: `${sunY}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: colors.sunColor,
              boxShadow: `0 0 12px ${colors.glowColor}, 0 0 24px ${colors.glowColor}`,
            }}
          />

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-neutral-400/30 transition-all duration-1000"
            style={{
              left: `${sunX}%`,
            }}
          />
        </div>

        <AnimatePresence>
          {!isCurrentTime && hoveredZone === zone && (
            <motion.button
              key="delete-btn"
              onClick={() => handleRemoveZone(zone)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-2 right-2 flex items-center gap-1 bg-neutral-800/70 hover:bg-red-600 text-neutral-100 hover:text-white px-2 py-1 rounded shadow-md z-20 transform duration-200 ease-in-out active:scale-[0.97]"
            >
              <Trash2 size={12} />
              <span className="text-xs">Remove</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredZone && hoveredZone !== zone && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 right-2 flex items-center justify-center pointer-events-none z-20"
            >
              <div className="bg-neutral-800/90 px-3 py-1 rounded text-sm text-neutral-100 backdrop-blur-sm shadow-md">
                {getDiffText(hoveredZone, zone)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRef && (
            <motion.div
              key="ref"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-neutral-700 text-xs text-neutral-100 z-20"
            >
              Reference
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full mx-auto space-y-6 md:bg-neutral-900 md:border border-neutral-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center">
            <Globe className="inline-block mr-2" size={24} />
            Time Zones
          </h2>

          {/* ✅ Desktop Buttons */}
          <div className="hidden sm:flex gap-2 mb-4">
            <Button
              onClick={() =>
                setTimeFormat(timeFormat === "12h" ? "24h" : "12h")
              }
            >
              Toggle {timeFormat === "12h" ? "24h" : "12h"}
            </Button>

            <Button onClick={() => setShowUTC(!showUTC)}>
              {showUTC ? "Hide UTC" : "Show UTC"}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-neutral-200">
                  + Add Time Zone
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md bg-neutral-900/95 border border-neutral-800 text-neutral-100 backdrop-blur-md rounded-2xl shadow-xl">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-2xl font-semibold tracking-wide text-white">
                    Select a Time Zone
                  </DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    Choose a zone to add to your list
                  </DialogDescription>
                </DialogHeader>

                {/* Decorative Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-4" />

                {/* Animated Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <Select
                    value={selectedZone || ""}
                    onValueChange={setSelectedZone}
                  >
                    <SelectTrigger className="w-full border-neutral-700 bg-neutral-800/60 text-neutral-100 hover:bg-neutral-800 transition-colors rounded-xl">
                      <SelectValue placeholder="🌍 Choose zone..." />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700 rounded-xl">
                      {TIME_ZONES.map((tzv) => (
                        <SelectItem key={tzv.value} value={tzv.value}>
                          {tzv.flag} {tzv.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleAddZone}
                    disabled={!selectedZone}
                    variant="default"
                    className="w-full"
                  >
                    Add Zone
                  </Button>
                </motion.div>
              </DialogContent>
            </Dialog>
          </div>

          {/* ✅ Mobile Dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Open menu"
                  size="icon-sm"
                  className="p-2"
                >
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setTimeFormat(timeFormat === "12h" ? "24h" : "12h")
                  }
                >
                  Toggle {timeFormat === "12h" ? "24h" : "12h"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShowUTC(!showUTC)}>
                  {showUTC ? "Hide UTC" : "Show UTC"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  + Add Time Zone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Current Time Card */}
          {currentZone && renderCard(currentZone, true, showUTC)}

          {/* Other timezone cards */}
          {zones.map((zone) => renderCard(zone, false, showUTC))}
        </div>
      </div>
    </div>
  );
}
