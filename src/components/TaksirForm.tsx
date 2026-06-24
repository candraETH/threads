"use client";

import { useEffect, useState } from "react";
import type { TaksirInput } from "@/types";

interface TaksirFormProps {
  onGenerate: (input: TaksirInput) => void;
  isLoading: boolean;
}

export default function TaksirForm({ onGenerate, isLoading }: TaksirFormProps) {
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const canSubmit = mounted && !isLoading && username.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    onGenerate({
      username: username.trim().startsWith("@") ? username.trim() : `@${username.trim()}`,
      platform: "threads",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Username Threads
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@usernamekamu"
          autoComplete="off"
          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          disabled={!mounted || isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        suppressHydrationWarning
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25"
      >
        {isLoading ? "Mengambil data..." : "Taksir Threads Sekarang"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Disclaimer: aplikasi ini hanya untuk hiburan, bukan estimasi real atau acuan harga jual akun.
      </p>
    </form>
  );
}
