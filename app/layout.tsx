import type { Metadata } from "next";
import "./globals.css";
import { rosario } from "./fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dkode",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  auth: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rosario.variable}`}>
      <body className="w-screen h-screen">
        <section className="h-full">{children}</section>
        <Toaster />
      </body>
    </html>
  );
}
