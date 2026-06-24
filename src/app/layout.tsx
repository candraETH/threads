import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taksir Threads - Cek Harga Akun Threads Kamu",
  description:
    "Tempel username Threads, biar AI taksir kira-kira akunmu kalau dijual hari ini harganya berapa. Hiburan, tapi siapa tahu akunmu ternyata aset digital.",
  openGraph: {
    title: "Taksir Threads - Cek Harga Akun Threads Kamu",
    description: "AI penaksir nilai jual akun Threads. Cek sekarang!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
