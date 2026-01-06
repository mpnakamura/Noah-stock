import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Mindmap Generator",
  description: "AIが自動的にマインドマップを生成するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
