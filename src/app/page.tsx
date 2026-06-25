"use client";

import { useState } from "react";
import TaksirForm from "@/components/TaksirForm";
import BrosurCard from "@/components/BrosurCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import type { TaksirInput, TaksirResult } from "@/types";

async function trackUser(username: string) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
  } catch {}
}

export default function Home() {
  const [result, setResult] = useState<TaksirResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: TaksirInput) => {
    void trackUser(input.username);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Coba lagi.");
        return;
      }

      setResult(data);
    } catch {
      setError("Gagal terhubung ke server. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <span className="text-3xl">🏷️</span>
          <h1 className="text-2xl font-black text-white tracking-tight">TAKSIR THREADS</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {!result && !isLoading && (
          <div className="w-full max-w-md space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-white leading-tight">
                Cek Harga Akun
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Threads Kamu
                </span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tempel username Threads, data publiknya dicek otomatis
                <br />
                lalu AI taksir kira-kira nilainya berapa.
              </p>
            </div>

            {/* Form */}
            <TaksirForm onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-zinc-600 max-w-xs mx-auto leading-relaxed">
              Hasil taksir ini bersifat hiburan dan simulasi AI. Angka yang muncul bukan harga real, bukan valuasi resmi, dan tidak menjamin akun bisa dijual dengan nominal tersebut.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingAnimation />}

        {/* Result */}
        {result && !isLoading && (
          <BrosurCard result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
