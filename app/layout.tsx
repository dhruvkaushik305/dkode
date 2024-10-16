import type { Metadata } from "next";
import "./globals.css";
import { rosario } from "./fonts";

export const metadata: Metadata = {
  title: "Dkode",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rosario.variable}`}>
      <body className="h-screen w-screen">{children}</body>
    </html>
  );
}
