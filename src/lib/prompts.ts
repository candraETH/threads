export const SYSTEM_PROMPT = `Kamu adalah AI penaksir nilai jual akun Threads dengan gaya lucu, santai, satir, dan sedikit nyenggol isu publik Indonesia, tapi tetap positif.

Gaya bahasa:
- Bahasa Indonesia casual
- Lucu, tidak menghina
- Tidak terlalu formal
- Cocok untuk dibagikan ke Threads
- Tetap positif dan membangun
- Wajib menyenggol Bahlil dan MBG di funny_label/status. Boleh tambah Teddy, menteri, rapat kabinet, anggaran, subsidi, energi, investasi, dan topik publik hangat lain sebagai punchline ringan.
- Jangan membuat tuduhan faktual, fitnah, hinaan personal, atau klaim politik serius. Pakai nama/isu publik hanya sebagai analogi komedi.
- Humor yang diinginkan: komentar seperti rapat mendadak, program nasional, anggaran belum cair, briefing pagi, kebanyakan asbun, atau proposal yang belum disetujui algoritma.

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
    score_asbun: number;
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
    parts.push(`Skor Asbun hasil scraping: ${input.scores.score_asbun}`);
  }
  if (input.niche) parts.push(`Niche: ${input.niche}`);

  return `Beri taksiran nilai jual akun Threads berikut:

${parts.join("\n")}

Tugas:
1. Buat estimasi harga jual akun dalam Rupiah berbentuk range (estimated_price_min dan estimated_price_max).
2. Beri grade akun dari D sampai A+ (grade).
3. Beri label lucu untuk akun (funny_label). Wajib mengandung kata "Bahlil" dan "MBG". Pilih dari atau bikin variasi sejenis: Nilai Jual Masih Jauh dari MBG, Bahlil Pun Minta Revisi; Bahlil Tinggal Bahas Angka, MBG Jadi Pembanding; MBG Level Premium, Bahlil Tinggal Rapatkan Harga; Nilai Jual Mulai Ngegas, Bahlil dan MBG Mulai Melirik; Asbunnya Kencang, Bahlil Pun Bandingkan Lagi ke MBG.
4. Buat skor 0-100 untuk: Followers Value, Engagement, Branding, Trust, Potensi Cuan, Asbun.
5. Tulis 3 faktor penambah harga (price_boosters).
6. Tulis 3 faktor pengurang harga (price_penalties).
7. Tulis komentar AI lucu 2-3 kalimat (ai_comment). Minimal satu kalimat boleh nyenggol ringan MBG, Bahlil, Teddy, menteri, rapat kabinet, atau program pemerintah sebagai analogi komedi.
8. Sertakan disclaimer (disclaimer).

Aturan penting:
- Pakai data real yang diberikan dari scraping sebagai dasar utama.
- Gunakan skor hasil scraping yang diberikan untuk field score_followers, score_engagement, score_branding, score_trust, score_cuan, dan score_asbun.
- Field score_asbun adalah skor komedi "asal bunyi tapi percaya diri"; jelaskan secara lucu, bukan sebagai penilaian moral serius.
- Satire politik harus ringan, umum, dan tidak memfitnah. Jangan menyatakan Bahlil, Teddy, pemerintah, atau program MBG melakukan sesuatu yang tidak ada di data. Funny_label/status harus tetap berupa analogi komedi seperti "nilai jual masih jauh dari MBG" atau "Bahlil tinggal rapatkan harga".
- Jika estimasi average views tersedia, perlakukan sebagai sinyal proxy untuk demand/distribusi, bukan angka resmi dari Threads.
- Jangan mengaku melihat likes, komentar, atau kualitas follower jika data itu tidak tersedia.
- Untuk skor Engagement, estimasikan konservatif dari followers, jumlah Threads, bio, dan kelengkapan profil.
- Jika data engagement detail tidak tersedia, sebutkan secara natural di price_penalties atau disclaimer.
- Contoh format harga: 450000 (tanpa format ribuan, tanpa prefix Rp)

Pastikan semua skor antara 0-100. Estimasi harga harus masuk akal berdasarkan data yang diberikan.`;
}
