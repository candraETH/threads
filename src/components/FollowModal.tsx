"use client";

import Image from "next/image";
import { useState } from "react";

export default function FollowModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-sm animate-modal-pop">
      <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-2xl shadow-emerald-500/10">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

        {/* Content */}
        <div className="space-y-5 p-6 text-center sm:p-7">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/20">
            <Image
              src="/threads-logo.svg"
              alt="Threads"
              width={34}
              height={34}
              className="h-[34px] w-[34px]"
            />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Ikuti Saya di Threads
            </h3>
            <p className="mx-auto max-w-[260px] text-sm leading-relaxed text-zinc-400">
              Dapatkan update terbaru, tips menarik, dan konten eksklusif lainnya.
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="https://www.threads.com/@can_lotte"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="group relative inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/40 active:scale-[0.98]"
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.776-.963-1.394-1.813-1.79-.128 2.754-1.19 5.026-3.18 6.81-.95.847-2.082 1.275-3.365 1.275h-.01c-2.316 0-4.08-.825-5.187-2.427C5.29 17.195 4.72 14.89 4.69 12c.03-2.89.6-5.195 1.837-6.866C7.634 3.525 9.4 2.7 11.715 2.7h.01c1.862.015 3.375.618 4.533 1.816l-1.456 1.456c-.756.756-1.807 1.225-3.088 1.225h-.003c-1.459.01-2.658-.54-3.54-1.634-.826-1.022-1.282-2.437-1.315-4.13.033-1.68.489-3.095 1.315-4.117.882-1.094 2.081-1.644 3.54-1.634h.007c1.737.012 3.17.626 4.295 1.853 1.256 1.37 2.06 3.224 2.398 5.53l2.03-.563c-.402-2.786-1.44-5.038-3.23-6.74C17.337.94 15.046.022 12.186 0h-.007c-3.581.024-6.334 1.205-8.184 3.509C2.35 5.56 1.5 8.414 1.472 12v.017c.03 3.579.879 6.43 2.525 8.482C5.845 22.795 8.6 23.976 12.18 24h.007z" />
            </svg>
            Follow
          </a>
        </div>
      </div>
    </div>
  );
}
