export const SYSTEM_PROMPT = `Kamu adalah AI penaksir nilai jual akun Threads dengan gaya lucu, santai, dan sedikit nyindir tapi tetap positif.

Gaya bahasa:
- Bahasa Indonesia casual
- Lucu, tidak menghina
- Tidak terlalu formal
- Cocok untuk dibagikan ke Threads
- Tetap positif dan membangun

Kamu harus merespons dalam format JSON yang valid sesuai dengan struktur yang diminta. Jangan tambahkan teks lain di luar JSON.`;

export function buildPrompt(input: {
  username: string;
  platform: "threads";
  followers?: number;
  threadCount?: number;
  avgViews?: number;
  avgViewsEstimated?: boolean;
  displayName?: string;
  bio?: string;
  profileUrl?: string;
  scrapedAt?: string;
  scores?: {
    score_followers: number;
    score_engagement: number;
    score_branding: number;
    score_trust: number;
    score_cuan: number;
  };
  niche?: string;
}): string {
  const parts = [
    `Username: ${input.username}`,
    `Platform: ${input.platform}`,
    `Sumber data: scraping halaman publik Threads tanpa login`,
  ];

  if (input.displayName) parts.push(`Nama tampilan: ${input.displayName}`);
  if (input.followers) parts.push(`Followers: ${input.followers.toLocaleString()}`);
  if (input.threadCount) parts.push(`Jumlah Threads: ${input.threadCount.toLocaleString()}`);
  if (input.avgViews) {
    parts.push(
      `${input.avgViewsEstimated ? "Estimasi average views otomatis" : "Average views"}: ${input.avgViews.toLocaleString()}`
    );
  }
  if (input.bio) parts.push(`Bio: ${input.bio}`);
  if (input.profileUrl) parts.push(`URL profil: ${input.profileUrl}`);
  if (input.scrapedAt) parts.push(`Waktu scraping: ${input.scrapedAt}`);
  if (input.scores) {
    parts.push(`Skor Followers hasil scraping: ${input.scores.score_followers}`);
    parts.push(`Skor Engagement proxy hasil scraping: ${input.scores.score_engagement}`);
    parts.push(`Skor Branding hasil scraping: ${input.scores.score_branding}`);
    parts.push(`Skor Trust hasil scraping: ${input.scores.score_trust}`);
    parts.push(`Skor Potensi Cuan hasil scraping: ${input.scores.score_cuan}`);
  }
  if (input.niche) parts.push(`Niche: ${input.niche}`);

  return `Beri taksiran nilai jual akun Threads berikut:

${parts.join("\n")}

Tugas:
1. Buat estimasi harga jual akun dalam Rupiah berbentuk range (estimated_price_min dan estimated_price_max).
2. Beri grade akun dari D sampai A+ (grade).
3. Beri label lucu untuk akun (funny_label) - pilih dari: 🐣 Akun Baru Netas, 🌱 Bibit Akun Cuan, 🧊 Akun Dingin Tapi Bisa Dipanasin, 💅 Akun Modal Gaya Butuh Massa, 🔥 Akun Siap Dipoles, 🏦 Aset Digital Mini, 🚀 Calon Akun Mahal, 👑 Akun Sultan Engagement, 🛒 Layak Masuk Keranjang, 🧾 Masih Harga Teman, 🫠 Akun Ada Niat Tapi Belum Ada Massa, 🤑 Akun Bisa Cuan Kalau Dirawat
4. Buat skor 0-100 untuk: Followers Value, Engagement, Branding, Trust, Potensi Cuan
5. Tulis 3 faktor penambah harga (price_boosters)
6. Tulis 3 faktor pengurang harga (price_penalties)
7. Tulis komentar AI lucu 2-3 kalimat (ai_comment)
8. Sertakan disclaimer (disclaimer)

Aturan penting:
- Pakai data real yang diberikan dari scraping sebagai dasar utama.
- Gunakan skor hasil scraping yang diberikan untuk field score_followers, score_engagement, score_branding, score_trust, dan score_cuan.
- Jika estimasi average views tersedia, perlakukan sebagai sinyal proxy untuk demand/distribusi, bukan angka resmi dari Threads.
- Jangan mengaku melihat likes, komentar, atau kualitas follower jika data itu tidak tersedia.
- Untuk skor Engagement, estimasikan konservatif dari followers, jumlah Threads, bio, dan kelengkapan profil.
- Jika data engagement detail tidak tersedia, sebutkan secara natural di price_penalties atau disclaimer.
- Contoh format harga: 450000 (tanpa format ribuan, tanpa prefix Rp)

Pastikan semua skor antara 0-100. Estimasi harga harus masuk akal berdasarkan data yang diberikan.`;
}
