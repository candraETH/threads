import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildPrompt } from "@/lib/prompts";
import { getStoredResult, saveStoredResult } from "@/lib/taksir-results-store";
import { calculateThreadsScores, estimateAvgViews, scrapeThreadsProfile } from "@/lib/threads-scraper";
import type { TaksirResult } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

const FALLBACK_STATUSES = {
  asbun: [
    "Asbunnya Kencang, Bahlil Pun Bandingkan Lagi ke MBG",
    "Banyak Gaya Sedikit Data, Bahlil Minta Cocokkan ke MBG",
    "Opininya Ramai, Nilai Jualnya Masih Nunggu Bahlil dan MBG",
    "Akun Ini Lincah Bicara, Bahlil dan MBG Masih Hitung Manfaatnya",
    "Asbun Produktif, Bahlil Suruh MBG Jadi Pembanding",
    "Kontennya Berani, Nilai Jualnya Masih Diaudit Bahlil ala MBG",
    "Bicara Lancar, Bahlil dan MBG Masih Cari Angka Final",
    "Vibes Rapat Panas, Bahlil Bandingkan Dulu dengan MBG",
    "Asbun Ada, Cuan Belum Rata, Bahlil Minta Benchmark MBG",
    "Akun Banyak Pernyataan, Bahlil dan MBG Tunggu Bukti Lapangan",
    "Timeline Berisik, Nilai Jual Masih Disandingkan Bahlil dengan MBG",
    "Pede Duluan, Bahlil dan MBG Masih Minta Revisi Angka",
    "Narasi Sudah Gas, Bahlil Tinggal Cocokkan dengan Standar MBG",
    "Omongan Naik Kelas, Nilai Jual Masih Dites Bahlil Lewat MBG",
    "Asbun Tajam, Tapi Bahlil dan MBG Belum Sepakat Harga",
  ],
  premium: [
    "MBG Level Premium, Bahlil Tinggal Rapatkan Harga",
    "Nilai Jual Sudah Matang, Bahlil dan MBG Bisa Jadi Pembanding",
    "Akun Ini Mulai Mahal, Bahlil Tinggal Bawa ke Meja MBG",
    "Cuan Sudah Tercium, Bahlil dan MBG Tinggal Validasi Angka",
    "Harga Mulai Serius, Bahlil Bisa Bandingkan dengan Skala MBG",
    "Aset Digital Makin Tebal, Bahlil dan MBG Mulai Relevan Dibahas",
    "Akun Siap Naik Kelas, Bahlil Tinggal Cocokkan dengan Benchmark MBG",
    "Valuasinya Menyala, Bahlil dan MBG Tinggal Jadi Bahan Rapat",
    "Potensi Cuan Kuat, Bahlil Mungkin Minta Slide MBG",
    "Akun Ini Sudah Berisi, Bahlil dan MBG Tidak Bisa Cuma Lewat",
    "Harga Makin Mantap, Bahlil Tinggal Tanya Porsi MBG-nya",
    "Cuan Mulai Rapi, Bahlil dan MBG Bisa Masuk Catatan",
    "Nilai Jual Menguat, Bahlil Tinggal Rapatkan ala MBG",
    "Akun Ini Bukan Receh, Bahlil dan MBG Mulai Punya Alasan Melirik",
    "Potensinya Premium, Bahlil Tinggal Ukur dengan Standar MBG",
  ],
  mid: [
    "Nilai Jual Mulai Ngegas, Bahlil dan MBG Mulai Melirik",
    "Akun Mulai Ada Harga, Bahlil Tinggal Bandingkan ke MBG",
    "Potensi Ada, Bahlil dan MBG Masih Minta Konsistensi",
    "Belum Sultan, Tapi Bahlil dan MBG Sudah Bisa Menoleh",
    "Cuan Mulai Tumbuh, Bahlil Minta MBG Jadi Ukuran",
    "Akun Ini Mulai Serius, Bahlil dan MBG Tinggal Pantau",
    "Nilai Jual Sedang Dirintis, Bahlil dan MBG Jadi Target Imajinasi",
    "Harga Mulai Naik, Bahlil Tinggal Cek Apakah Setara MBG Mini",
    "Branding Mulai Kebaca, Bahlil dan MBG Masih Tunggu Momentum",
    "Akun Punya Bibit, Bahlil Mungkin Catat di Pinggir Proposal MBG",
    "Cuan Ada Tipis-Tipis, Bahlil dan MBG Masih Hitung Ulang",
    "Akun Ini Mulai Layak Dibahas, Bahlil Bawa MBG Sebagai Pembanding",
    "Potensinya Masuk Akal, Bahlil dan MBG Tinggal Lihat Konsistensi",
    "Nilainya Mulai Bernapas, Bahlil dan MBG Belum Mau Tertawa",
    "Akun Ini Tidak Kosong, Bahlil dan MBG Mulai Cari Kalkulator",
  ],
  low: [
    "Nilai Jual Masih Jauh dari MBG, Bahlil Pun Minta Revisi",
    "Akun Masih Pemanasan, Bahlil dan MBG Belum Turun ke Lapangan",
    "Harga Masih Merangkak, Bahlil Suruh Belajar dari MBG",
    "Potensi Ada, Tapi Bahlil dan MBG Masih Minta Bukti",
    "Akun Ini Masih Tender Awal, Bahlil dan MBG Belum Ketok Palu",
    "Nilai Jual Masih Hemat, Bahlil Bandingkan Dulu dengan MBG",
    "Followers Masih Menabung, Bahlil dan MBG Belum Buka Rapat",
    "Akun Masih Butuh Gizi Konten, Bahlil Sebut MBG Jadi Inspirasi",
    "Harga Belum Gemuk, Bahlil dan MBG Masih Sabar Menunggu",
    "Akun Ini Masih Simulasi, Bahlil dan MBG Belum Masuk Anggaran",
    "Nilai Jual Masih Kecil, Bahlil Minta Jangan Dulu Lawan MBG",
    "Konten Masih Tipis, Bahlil dan MBG Minta Tambah Nutrisi",
    "Akun Baru Latihan, Bahlil dan MBG Masih Duduk di Belakang",
    "Cuan Belum Berisik, Bahlil dan MBG Belum Perlu Konferensi",
    "Nilai Masih Starter Pack, Bahlil dan MBG Minta Naik Level",
  ],
};

function stableIndex(result: TaksirResult, length: number) {
  const seed = `${result.username}:${result.estimated_price_max}:${result.score_cuan}:${result.score_asbun}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

function buildBahlilMbgStatus(result: TaksirResult) {
  const priceMax = result.estimated_price_max || 0;
  const scoreCuan = result.score_cuan || 0;
  const scoreAsbun = result.score_asbun || 0;
  const pool =
    scoreAsbun >= 75 ? FALLBACK_STATUSES.asbun :
    scoreCuan >= 80 || priceMax >= 5_000_000 ? FALLBACK_STATUSES.premium :
    scoreCuan >= 55 || priceMax >= 1_000_000 ? FALLBACK_STATUSES.mid :
    FALLBACK_STATUSES.low;

  return pool[stableIndex(result, pool.length)];
}

function ensureBahlilMbgStatus(result: TaksirResult) {
  const hasBahlil = /bahlil/i.test(result.funny_label || "");
  const hasMbg = /\bmbg\b|makan bergizi/i.test(result.funny_label || "");

  if (hasBahlil && hasMbg) return result;

  return {
    ...result,
    funny_label: buildBahlilMbgStatus(result),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;
    const platform = "threads";

    if (!username) {
      return NextResponse.json(
        { error: "Username Threads wajib diisi." },
        { status: 400 }
      );
    }

    const storedResult = await getStoredResult(username);
    if (storedResult) {
      const normalizedResult = ensureBahlilMbgStatus(storedResult);
      if (normalizedResult.funny_label !== storedResult.funny_label) {
        await saveStoredResult(normalizedResult);
      }

      return NextResponse.json(normalizedResult);
    }

    let profile;
    try {
      profile = await scrapeThreadsProfile(username);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengambil data publik Threads.";
      return NextResponse.json(
        { error: message },
        { status: 502 }
      );
    }

    const estimatedAvgViews = estimateAvgViews(profile);
    if (estimatedAvgViews) {
      profile.avgViews = estimatedAvgViews;
      profile.avgViewsEstimated = true;
    }

    const scores = calculateThreadsScores(profile);
    const prompt = buildPrompt({
      username: profile.username,
      platform,
      followers: profile.followers,
      threadCount: profile.threadCount,
      avgViews: profile.avgViews,
      avgViewsEstimated: profile.avgViewsEstimated,
      displayName: profile.displayName,
      bio: profile.bio,
      profileUrl: profile.profileUrl,
      scrapedAt: profile.scrapedAt,
      scores,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI tidak menghasilkan respons." },
        { status: 500 }
      );
    }

    let result: TaksirResult;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Gagal parse hasil AI. Coba lagi." },
        { status: 500 }
      );
    }

    result.username = profile.username;
    result.platform = platform;
    result.generated_at = new Date().toISOString();
    result.scraped_profile = profile;
    result.score_followers = scores.score_followers;
    result.score_engagement = scores.score_engagement;
    result.score_branding = scores.score_branding;
    result.score_trust = scores.score_trust;
    result.score_cuan = scores.score_cuan;
    result.score_asbun = scores.score_asbun;
    result.estimated_price_min = Math.round(result.estimated_price_min * 5);
    result.estimated_price_max = Math.round(result.estimated_price_max * 5);
    result = ensureBahlilMbgStatus(result);

    await saveStoredResult(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
