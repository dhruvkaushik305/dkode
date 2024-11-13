"use client";

import React from "react";
import { createClassroomAction } from "@/app/actions";
import { Button } from "./button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateClassroomForm() {
  const router = useRouter();

  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const submitionHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!nameRef.current) return;

    const name = nameRef.current.value;

    if (name === "") return;

    const query = await createClassroomAction(name);

    if (query.success) {
      //copy the classroom id
      await navigator.clipboard.writeText(query.id);

      toast.success("Copied the id");

      //FIXME this does not refresh the page smh
      router.refresh();
    } else {
      toast.error(query.message);
    }
  };

  return (
    <form className="flex flex-col gap-7">
      <label className="flex flex-col gap-2">
        <header className="font-medium text-md">What should we call it?</header>
        <input
          type="text"
          placeholder="Type here..."
          className="input-box"
          ref={nameRef}
        />
      </label>
      <Button onClick={submitionHandler}>Create Classroom</Button>
    </form>
  );
}
