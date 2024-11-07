"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  testId?: string;
  children: React.ReactNode;
}

export default function TestButton({ testId, children }: Readonly<Props>) {
  const pathName = usePathname();

  const router = useRouter();

  const testRedirectionHandler = () => {
    const queryParam = testId ?? "new";

    router.push(`${pathName}/test?id=${queryParam}`);
  };

  return <button onClick={testRedirectionHandler}>{children}</button>;
}
