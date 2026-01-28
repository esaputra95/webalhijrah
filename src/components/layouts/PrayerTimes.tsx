"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface PrayerSchedule {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface PrayerData {
  lokasi: string;
  jadwal: PrayerSchedule;
}

export default function PrayerTimes() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const today = dayjs().format("YYYY/MM/DD");
        const response = await fetch(
          `https://api.myquran.com/v2/sholat/jadwal/0412/${today}`,
        );
        const result = await response.json();
        if (result.status) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();
  }, []);

  if (loading)
    return <div className="text-xs opacity-50">Memuat Jadwal Shalat...</div>;
  if (!data) return null;

  const prayers = [
    // { name: "Imsak", time: data.jadwal.imsak },
    { name: "Subuh", time: data.jadwal.subuh },
    { name: "Dzuhur", time: data.jadwal.dzuhur },
    { name: "Ashar", time: data.jadwal.ashar },
    { name: "Maghrib", time: data.jadwal.maghrib },
    { name: "Isya", time: data.jadwal.isya },
  ];

  const getHijriDate = () => {
    const date = new Date();
    try {
      // Try to get Hijri date using Intl
      const hijriMonths = [
        "Muharram",
        "Safar",
        "Rabiul Awal",
        "Rabiul Akhir",
        "Jumadil Awal",
        "Jumadil Akhir",
        "Rajab",
        "Sya'ban",
        "Ramadhan",
        "Syawal",
        "Dzulqa'dah",
        "Dzulhijjah",
      ];

      // Use English locale to get reliable numeric parts for Islamic calendar
      const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      const parts = formatter.formatToParts(date);
      const day = parts.find((p) => p.type === "day")?.value;
      const monthPart = parts.find((p) => p.type === "month")?.value;
      const year = parts.find((p) => p.type === "year")?.value;

      if (day && monthPart && year) {
        const monthIndex = parseInt(monthPart) - 1;
        return `${day} ${hijriMonths[monthIndex]} ${year}`;
      }

      return dayjs().format("DD/MM/YYYY");
    } catch (error) {
      console.error("Hijri formatting error:", error);
      return dayjs().format("DD/MM/YYYY");
    }
  };

  const hijriDate = getHijriDate();

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase text-brand-gold">
          {hijriDate}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className="flex text-gray-300 flex-col lg:flex-row sm:flex-row md:flex-row items-center md:gap-1.5 lg:gap-1.5"
          >
            <span className="text-[10px] text-xs md:text-xs font-medium opacity-80 uppercase">
              {prayer.name}
            </span>
            <span className="text-xs md:text-sm font-bold">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
