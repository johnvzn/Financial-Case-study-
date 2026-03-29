import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UX/UI Portfolio",
  description: "Personal portfolio for a UX/UI designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
