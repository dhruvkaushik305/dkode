"use client";

import React from "react";
import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PageWithNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full">
      <Navbar />
      <section className="rounded-tl-[4rem] h-full w-full bg-zinc-100">
        {children}
      </section>
    </main>
  );
}
const Navbar = React.memo(function () {
  return (
    <nav className="flex flex-col p-5 items-center gap-5 w-[23rem]">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={130} height={130} />
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 w-full justify-center"
      >
        <House size={25} /> <p className="text-xl">Dashboard</p>
      </Link>
    </nav>
  );
});
