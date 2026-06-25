"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { TaksirResult } from "@/types";

interface BrosurCardProps {
  result: TaksirResult;
  onReset: () => void;
}

const CARD_WIDTH = 880;
const DESKTOP_DISPLAY_WIDTH = 720;

type IconName =
  | "tag"
  | "user"
  | "users"
  | "message"
  | "chart"
  | "cart"
  | "trendUp"
  | "trendDown"
  | "spark"
  | "rocket"
  | "globe"
  | "info"
  | "heart"
  | "star"
  | "shield"
  | "mic";

function ThreadsLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/threads-logo.svg"
      alt="Threads"
      className={className}
    />
  );
}

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  const paths: Record<IconName, React.ReactNode> = {
    tag: (
      <>
        <path d="M20.5 13.5 13.5 20.5a2.1 2.1 0 0 1-3 0l-7-7A2.1 2.1 0 0 1 3 12V5a2 2 0 0 1 2-2h7c.6 0 1.1.2 1.5.6l7 7a2.1 2.1 0 0 1 0 2.9Z" />
        <path d="M7.5 7.5h.01" />
      </>
    ),
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M3 17h4l4-7 4 4 6-8" />
        <path d="M14 6h7v7" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
        <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
      </>
    ),
    trendUp: (
      <>
        <path d="m3 17 6-6 4 4 7-7" />
        <path d="M14 8h6v6" />
      </>
    ),
    trendDown: (
      <>
        <path d="m3 7 6 6 4-4 7 7" />
        <path d="M14 16h6v-6" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5Z" />
        <path d="M19 3v4" />
        <path d="M21 5h-4" />
      </>
    ),
    rocket: (
      <>
        <path d="M4.5 16.5c-1 1-1.5 3-1.5 3s2-.5 3-1.5" />
        <path d="M9 15 6 12l5-5c3-3 6-4 9-3-.8 3-1.8 6-4.8 9Z" />
        <path d="M9 15h4l-1 4Z" />
        <path d="M9 15v-4l-4 1Z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20" />
        <path d="M12 2a15 15 0 0 0 0 20" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    star: <path d="m12 2 3 6 6.6 1-4.8 4.6 1.1 6.5L12 17l-5.9 3.1 1.1-6.5L2.4 9 9 8Z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    mic: (
      <>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <path d="M12 19v3" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function ProfileAvatar({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-full object-cover"
      />
    );
  }

  return <Icon name="user" className="h-12 w-12" />;
}

function ScoreBar({
  label,
  score,
  icon,
  tone,
}: {
  label: string;
  score: number;
  icon: IconName;
  tone: "emerald" | "rose" | "amber" | "sky" | "violet" | "orange";
}) {
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)));
  const active =
    tone === "emerald"
      ? "bg-emerald-400 shadow-emerald-400/40"
      : tone === "rose"
        ? "bg-rose-400 shadow-rose-400/40"
        : tone === "orange"
          ? "bg-orange-400 shadow-orange-400/40"
        : tone === "sky"
          ? "bg-sky-400 shadow-sky-400/40"
          : tone === "violet"
            ? "bg-violet-400 shadow-violet-400/40"
            : "bg-yellow-400 shadow-yellow-400/40";
  const iconColor =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "rose"
        ? "text-rose-400"
        : tone === "orange"
          ? "text-orange-400"
        : tone === "sky"
          ? "text-sky-400"
          : tone === "violet"
            ? "text-violet-400"
            : "text-yellow-400";

  return (
    <div className="grid grid-cols-[34px_140px_1fr_40px] items-center gap-3 border-t border-white/10 py-3 text-lg">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 ${iconColor}`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <span className="text-zinc-200">{label}</span>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full ${i < filled ? `${active} shadow-lg` : "bg-zinc-800"}`}
          />
        ))}
      </div>
      <span className="text-right font-mono text-zinc-200">{score}</span>
    </div>
  );
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

function formatMetric(n?: number): string {
  if (!n) return "-";
  return new Intl.NumberFormat("id-ID", {
    notation: n >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-emerald-400";
  if (grade.startsWith("B")) return "text-yellow-400";
  if (grade.startsWith("C")) return "text-yellow-300";
  return "text-rose-400";
}

function MetricTile({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-5 rounded-2xl border p-6 ${highlight ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/15 bg-zinc-950/50"}`}>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <div className="min-w-0">
        <p className="text-sm uppercase tracking-wider text-zinc-300">{label}</p>
        <p className="mt-1 text-4xl font-black leading-none text-white">{value}</p>
      </div>
    </div>
  );
}

function FactorPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "up" | "down";
}) {
  const isUp = tone === "up";
  return (
    <div className={`rounded-2xl border p-6 ${isUp ? "border-emerald-500/35 bg-emerald-500/10" : "border-orange-500/35 bg-orange-500/10"}`}>
      <div className="mb-5 flex items-center gap-4 border-b border-white/10 pb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${isUp ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-red-500/40 bg-red-500/10 text-red-400"}`}>
          <Icon name={isUp ? "trendUp" : "trendDown"} className="h-6 w-6" />
        </div>
        <p className={`text-2xl font-bold uppercase tracking-wide ${isUp ? "text-emerald-400" : "text-red-400"}`}>{title}</p>
      </div>
      <div className="space-y-4">
        {items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex gap-3 text-[21px] leading-snug text-zinc-100">
            <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded text-lg font-bold ${isUp ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"}`}>
              {isUp ? "+" : "!"}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrosurCard({ result, onReset }: BrosurCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const profile = result.scraped_profile;
  const [scale, setScale] = useState(1);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    const updateCardFrame = () => {
      const viewportWidth = viewportRef.current?.getBoundingClientRect().width || 0;
      const windowWidth = typeof window === "undefined" ? CARD_WIDTH : Math.max(320, window.innerWidth - 32);
      const displayWidth = Math.min(DESKTOP_DISPLAY_WIDTH, windowWidth);
      const availableWidth = viewportWidth > 0 ? Math.min(viewportWidth, displayWidth) : displayWidth;
      const nextScale = Math.min(DESKTOP_DISPLAY_WIDTH / CARD_WIDTH, availableWidth / CARD_WIDTH);
      setScale(nextScale);
      setCardHeight(cardRef.current?.offsetHeight || 0);
    };

    updateCardFrame();
    const resizeObserver = new ResizeObserver(updateCardFrame);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (cardRef.current) resizeObserver.observe(cardRef.current);
    window.addEventListener("resize", updateCardFrame);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCardFrame);
    };
  }, [result]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#020617",
      });
      const link = document.createElement("a");
      link.download = `taksir-akun-${result.username.replace("@", "")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="w-full max-w-[740px] space-y-4">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center shadow-lg shadow-emerald-500/10">
        <p className="text-sm leading-relaxed text-zinc-300">
          Hasil taksir ini cuma untuk hiburan, bukan harga resmi dan bukan patokan jual beli sungguhan.
        </p>
        <a
          href="https://www.threads.com/@can_lotte"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/35 bg-black/30 px-4 py-2 font-bold text-emerald-300 transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-200"
        >
          <ThreadsLogo className="h-5 w-5" />
          <span>Follow @can_lotte</span>
        </a>
      </div>

      <div
        ref={viewportRef}
        className="mx-auto flex w-full justify-center overflow-hidden"
        style={{ height: cardHeight ? cardHeight * scale : undefined }}
      >
        <div
          className="shrink-0"
          style={{
            width: CARD_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <div
            ref={cardRef}
            data-card-export
            className="w-full overflow-hidden rounded-3xl border border-emerald-400/70 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,#06110f_0%,#07090d_42%,#020304_100%)] text-white shadow-2xl shadow-emerald-500/20"
          >
            <div className="border-b border-emerald-500/30 bg-emerald-500/10 px-8 py-7">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-black text-white shadow-lg shadow-emerald-500/20">
                  <ThreadsLogo className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-wide text-emerald-400">Taksir Akun</h2>
              </div>
            </div>

            <div className="space-y-6 p-8">
              <div className="flex items-center gap-7">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-400 bg-emerald-500/10 text-emerald-400">
                  <ProfileAvatar src={profile?.imageUrl} />
                </div>
                <div className="min-w-0">
                  <p className="break-words text-4xl font-black leading-tight text-white">{result.username}</p>
                  <p className="mt-2 text-2xl text-zinc-300">
                    {profile?.displayName || "Threads"} - data publik
                  </p>
                </div>
              </div>

              {profile && (
                <div className={`grid gap-5 ${profile.avgViews ? "grid-cols-3" : "grid-cols-2"}`}>
                  <MetricTile icon="users" label="Followers" value={formatMetric(profile.followers)} />
                  <MetricTile icon="message" label="jumlah post" value={formatMetric(profile.threadCount)} />
                  {profile.avgViews && (
                    <MetricTile
                      icon="chart"
                      label="Avg Views"
                      value={formatMetric(profile.avgViews)}
                      highlight
                    />
                  )}
                </div>
              )}

              <div className="relative overflow-hidden rounded-2xl border border-emerald-300/80 bg-emerald-500/10 p-7 shadow-lg shadow-emerald-400/20">
                <div className="absolute -left-2 bottom-0 h-12 w-12 rounded-full bg-emerald-300/40 blur-xl" />
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-emerald-300/70 bg-black/20 text-emerald-300">
                    <Icon name="chart" className="h-10 w-10" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl uppercase tracking-widest text-emerald-100">Estimasi Nilai Jual</p>
                    <p className="mt-2 text-5xl font-black leading-tight text-emerald-300 drop-shadow-[0_0_14px_rgba(52,211,153,0.65)]">
                      Rp {formatPrice(result.estimated_price_min)} - {formatPrice(result.estimated_price_max)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center rounded-2xl border border-white/15 bg-slate-950/60 p-5">
                <div className="border-r border-white/15 text-center">
                  <p className="text-lg uppercase tracking-wide text-zinc-300">Grade</p>
                  <p className={`mt-1 text-6xl font-black ${getGradeColor(result.grade)}`}>{result.grade}</p>
                </div>
                <div className="flex items-center gap-6 pl-12">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                    <Icon name="cart" className="h-8 w-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg uppercase tracking-wide text-zinc-300">Status</p>
                    <p className="mt-2 break-words text-2xl font-bold text-white">{result.funny_label}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-slate-950/60 p-6">
                <div className="mb-2 flex items-center gap-4 text-emerald-400">
                  <Icon name="trendUp" className="h-7 w-7" />
                  <p className="text-xl font-bold uppercase tracking-wide">Skor Nilai Jual</p>
                </div>
                <ScoreBar label="Followers" score={result.score_followers} icon="users" tone="emerald" />
                <ScoreBar label="Engagement" score={result.score_engagement} icon="heart" tone="rose" />
                <ScoreBar label="Branding" score={result.score_branding} icon="star" tone="amber" />
                <ScoreBar label="Trust" score={result.score_trust} icon="shield" tone="sky" />
                <ScoreBar label="Potensi" score={result.score_cuan} icon="rocket" tone="violet" />
                <ScoreBar label="Asbun" score={result.score_asbun} icon="mic" tone="orange" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FactorPanel title="Faktor Naik" items={result.price_boosters} tone="up" />
                <FactorPanel title="Faktor Turun" items={result.price_penalties} tone="down" />
              </div>

              <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-6">
                <div className="mb-5 flex items-center gap-4 text-violet-400">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10">
                    <Icon name="spark" className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-bold uppercase tracking-wide">Analisis Akun</p>
                </div>
                <p className="text-2xl italic leading-relaxed text-zinc-100">&ldquo;{result.ai_comment}&rdquo;</p>
              </div>

              <div className="flex justify-end border-t border-white/10 pt-5 text-lg text-zinc-400">
                <div className="flex items-center gap-3">
                  <Icon name="info" className="h-5 w-5" />
                  <span>Estimasi hiburan, bukan harga resmi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-teal-500"
        >
          Download PNG
        </button>
        <button
          onClick={onReset}
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 font-medium text-zinc-300 transition-all hover:bg-zinc-700"
        >
          Lagi
        </button>
      </div>
    </div>
  );
}
