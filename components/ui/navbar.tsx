import { auth } from "@/auth";
import Image from "next/image";
import db from "@/db";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "./signoutButton";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="h-[4rem] w-full border-b border-zinc-200 flex items-center p-2 justify-around">
      <Link href="/dashboard">
        <Image src="/logo.png" alt="logo" width={150} height={150} />
      </Link>
      <Avatar />
    </nav>
  );
}

async function Avatar() {
  const session = await auth();

  const userId = session?.user.id;

  let userName = null;

  try {
    const queryUserName = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    if (queryUserName) {
      userName = queryUserName.name;
    }
  } catch (err) {
    console.error(
      "The following error occurred while fetching the username for the avatar",
      err
    );
    return;
  }

  return (
    <figure>
      <Popover>
        <PopoverTrigger>
          <Badge
            variant={"secondary"}
            className="w-[2.5rem] h-[2.5rem] flex justify-center items-center text-md"
          >
            {userName && userName[0].toUpperCase()}
          </Badge>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-3">
            <section className="space-y-1 p-2">
              <header className="font-medium text-center text-md">
                {userName && userName}
              </header>
              <header className="text-sm text-center underline underline-offset-4">
                @{session && titleCase(session.user.role)}
              </header>
            </section>
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
    </figure>
  );
}

function titleCase(str: string) {
  const strList = str.toLowerCase().split(" ");
  for (var i = 0; i < strList.length; i++) {
    strList[i] = strList[i].charAt(0).toUpperCase() + strList[i].slice(1);
  }
  return strList.join(" ");
}
