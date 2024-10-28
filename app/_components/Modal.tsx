"use client";
import React from "react";
import { X } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpened] = React.useState(false);

  const closeModalHandler = () => {
    setIsOpened(false);
  };

  const preventPropogationHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={closeModalHandler}
    >
      <div
        className="relative p-2 bg-white rounded-xl flex flex-col shadow-lg max-w-lg w-full"
        onClick={preventPropogationHandler}
      >
        <button onClick={closeModalHandler} className="flex justify-end w-full">
          <X />
        </button>
        {isOpen && children}
      </div>
    </div>
  );
}
