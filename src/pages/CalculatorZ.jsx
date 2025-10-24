/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { ArrowLeftRight, Clock } from "lucide-react";

const TIME_ZONES = [
  { label: "WIB (Asia/Jakarta)", value: "Asia/Jakarta" },
  { label: "WITA (Asia/Makassar)", value: "Asia/Makassar" },
  { label: "WIT (Asia/Jayapura)", value: "Asia/Jayapura" },
  { label: "UTC", value: "UTC" },
  { label: "London (Europe/London)", value: "Europe/London" },
  { label: "New York (America/New_York)", value: "America/New_York" },
  { label: "Tokyo (Asia/Tokyo)", value: "Asia/Tokyo" },
  { label: "Rome (Europe/Rome)", value: "Europe/Rome" },
  { label: "Sydney (Australia/Sydney)", value: "Australia/Sydney" },
];

export default function CalculatorZ() {
  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("Europe/London");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);
  const [currentTimes, setCurrentTimes] = useState({});

  // Auto detect user's timezone on first load
  useEffect(() => {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIME_ZONES.find((z) => z.value === localZone)) {
      setFromZone(localZone);
    } else {
      setFromZone("Asia/Jakarta"); // fallback
    }
  }, []);

  // Realtime update current time for each zone
  useEffect(() => {
    const interval = setInterval(() => {
      const times = {};
      TIME_ZONES.forEach((z) => {
        times[z.value] = DateTime.now().setZone(z.value).toFormat("hh:mm:ss a");
      });
      setCurrentTimes(times);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = () => {
    if (!fromZone || !toZone || !time) return;

    const [hour, minute] = time.split(":").map(Number);
    const sourceTime = DateTime.now()
      .setZone(fromZone)
      .set({ hour, minute, second: 0, millisecond: 0 });

    const targetTime = sourceTime.setZone(toZone);
    const diffHours = (targetTime.offset - sourceTime.offset) / 60;

    setResult({
      fromLabel: TIME_ZONES.find((z) => z.value === fromZone)?.label,
      toLabel: TIME_ZONES.find((z) => z.value === toZone)?.label,
      fromTime: sourceTime.toFormat("hh:mm a, dd LLL yyyy"),
      toTime: targetTime.toFormat("hh:mm a, dd LLL yyyy"),
      diff:
        diffHours === 0
          ? "Same time"
          : diffHours > 0
          ? `+${diffHours.toFixed(1)}h ahead`
          : `${diffHours.toFixed(1)}h behind`,
    });
  };

  const handleSwap = () => {
    const temp = fromZone;
    setFromZone(toZone);
    setToZone(temp);
  };

  const handleSetLocalTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    setTime(`${hh}:${mm}`);
  };

  return (
    <div className="md:min-h-screen flex flex-col items-center justify-center p-0 md:p-6">
      <div className="max-w-md w-full mx-auto md:bg-neutral-900 md:border border-neutral-800 p-6 rounded-2xl shadow-lg text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-100">
          <Calculator className="inline-block mr-2" size={24} />
          Time Zone Calculator
        </h2>

        <div className="space-y-4 mt-4">
          {/* From Zone */}
          <div>
            <label className="text-sm text-neutral-400">From Time Zone</label>
            <Select value={fromZone} onValueChange={setFromZone}>
              <SelectTrigger className="border-neutral-700 bg-neutral-800 text-neutral-100 mt-1">
                <SelectValue placeholder="Select zone..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                {TIME_ZONES.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-500 mt-1">
              CAT: {currentTimes[fromZone] || "--:--:--"}
            </p>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleSwap}
              className="flex items-center gap-2 hover:bg-neutral-800"
            >
              <ArrowLeftRight size={16} /> Swap
            </Button>
          </div>

          {/* To Zone */}
          <div>
            <label className="text-sm text-neutral-400">To Time Zone</label>
            <Select value={toZone} onValueChange={setToZone}>
              <SelectTrigger className="border-neutral-700 bg-neutral-800 text-neutral-100 mt-1">
                <SelectValue placeholder="Select zone..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                {TIME_ZONES.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-500 mt-1">
              CAT: {currentTimes[toZone] || "--:--:--"}
            </p>
          </div>

          {/* Time Input */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm text-neutral-400">Enter Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-1"
              />
            </div>
            <Button
              onClick={handleSetLocalTime}
              variant="outline"
              className="border-neutral-700 text-neutral-200 mt-auto flex items-center gap-1"
            >
              <Clock size={14} /> Set to Local
            </Button>
          </div>

          <Button onClick={handleConvert} className="w-full mt-2">
            Convert
          </Button>
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center bg-neutral-800 p-4 rounded-xl border border-neutral-700"
            >
              <p className="text-sm text-neutral-400 mb-1">
                {result.fromLabel} → {result.toLabel}
              </p>
              <p className="text-lg font-semibold text-neutral-100">
                {result.toTime}
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                Based on {result.fromTime}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Difference: {result.diff}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
