import type { Metadata } from "next";
import "./globals.css";
import { rosario } from "./fonts";

export const metadata: Metadata = {
  title: "Dkode",
  description: "",
};

export default function RootLayout({
  auth,
  children,
}: Readonly<{
  auth: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rosario.variable}`}>
      <body className="w-screen h-screen">
        <section className="absolute">{auth}</section>
        <section className="h-full">{children}</section>
      </body>
    </html>
  );
}
