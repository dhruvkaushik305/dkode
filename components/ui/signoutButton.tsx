"use client";

import { signOut } from "@/auth";
import { Button } from "./button";

export default function SignOutButton() {
  const signOutHandler = async () => {
    await signOut();
  };

  return (
    <Button
      variant={"ghost"}
      onClick={signOutHandler}
      className="text-md border border-zinc-200"
    >
      Sign out
    </Button>
  );
}
