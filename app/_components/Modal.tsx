"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="relative p-2 bg-white rounded-xl flex flex-col gap-1 shadow-lg max-w-lg w-full">
        <button
          onClick={() => router.back()}
          className="flex justify-end w-full"
        >
          <X />
        </button>
        <section>{children}</section>
      </div>
    </div>
  );
}
