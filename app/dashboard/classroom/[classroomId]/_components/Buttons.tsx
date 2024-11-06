"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function TestButton({
  testId,
  children,
}: {
  testId?: string;
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const router = useRouter();

  const testRedirectionHandler = () => {
    const queryParam = testId ?? "new";

    router.push(`${pathName}/test?id=${queryParam}`);
  };

  return <button onClick={testRedirectionHandler}>{children}</button>;
}
