"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  whenOpen: React.ReactNode;
  whenClose: React.ReactNode;
}

export default function Modal({ whenOpen, whenClose }: Readonly<ModalProps>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModalHandler = () => {
    setIsOpen(true);
  };

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const preventPropogationHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {!isOpen ? (
        <button onClick={openModalHandler}>{whenClose}</button>
      ) : (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={closeModalHandler}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeModalHandler();
            }
          }}
        >
          <div
            className="relative p-2 bg-white rounded-xl flex flex-col shadow-lg max-w-lg w-full"
            onClick={preventPropogationHandler}
          >
            <button
              onClick={closeModalHandler}
              className="flex justify-end w-full"
            >
              <X />
            </button>
            {whenOpen}
          </div>
        </div>
      )}
    </>
  );
}
