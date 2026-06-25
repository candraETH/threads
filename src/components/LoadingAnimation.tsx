"use client";

const LOADING_TEXTS = [
  "Mengambil data publik Threads...",
  "Membaca jumlah followers...",
  "Mengecek jumlah postingan Threads...",
  "Merangkum bio dan profil publik...",
  "AI sedang menaksir nilai akun...",
  "Menghitung potensi cuan...",
];

import { useEffect, useState } from "react";
import FollowModal from "@/components/FollowModal";

export default function LoadingAnimation() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6 py-12">
      <FollowModal />

      <p className="max-w-xs text-center text-sm font-medium text-zinc-400 sm:text-base">
        Agar tidak bosan menunggu, anda bisa menatap kanda ganteng!!
      </p>

      <div className="relative h-36 w-36 overflow-hidden rounded-full border border-emerald-400/30 bg-white shadow-2xl shadow-emerald-500/10 sm:h-44 sm:w-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loading-face.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-teal-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-lg text-zinc-200 font-medium animate-pulse">
          {LOADING_TEXTS[currentText]}
        </p>
        <p className="text-sm text-zinc-500">
          Tanpa login, cuma data publik.
        </p>
      </div>
    </div>
  );
}
