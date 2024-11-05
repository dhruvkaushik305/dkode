"use client";

import { useSearchParams } from "next/navigation";
import UpsertTestPage from "./_components/UpsertTestPage";

export default function Page() {
  const searchParams = useSearchParams();

  const testId = searchParams.get("id");

  return (
    <main className="h-full">
      {testId === "new" ? (
        <UpsertTestPage testId={testId} />
      ) : (
        <div>Some existing test</div>
      )}
    </main>
  );
}
