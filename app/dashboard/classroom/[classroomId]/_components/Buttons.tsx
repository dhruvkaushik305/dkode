"use client";

import { deleteTestAction } from "@/app/actions";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  testId?: string;
  children: React.ReactNode;
}

export function TestButton({ testId, children }: Readonly<Props>) {
  const pathName = usePathname();

  const router = useRouter();

  const testRedirectionHandler = () => {
    const queryParam = testId ?? "new";

    router.push(`${pathName}/test?id=${queryParam}`);
  };

  return <button onClick={testRedirectionHandler}>{children}</button>;
}

export function DeleteTestButton({ id }: { id: string }) {
  const router = useRouter();

  const testDeletionHandler = async () => {
    const response = await deleteTestAction(id);
    if (response.success) {
      router.refresh(); //FIXME this does not work as expected
    } else {
      toast.error(response.message);
    }
  };

  return <Trash size={20} onClick={testDeletionHandler} />;
}
