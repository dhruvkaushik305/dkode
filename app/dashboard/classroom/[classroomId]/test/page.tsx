"use client";

import { useSearchParams } from "next/navigation";
import NewTest from "./_components/NewTest";

export default function Page() {
  const searchParams = useSearchParams();

  const testId = searchParams.get("id");

  return (
    <main>
      {testId === "new" ? <NewTest /> : <div>Some existing test</div>}
    </main>
  );
}
