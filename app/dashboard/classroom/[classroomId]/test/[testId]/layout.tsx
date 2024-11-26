import { TestProvider } from "@/components/Providers/TestProvider";
import React from "react";
import db from "@/db";
import { redirect } from "next/navigation";

interface TestLayoutProps {
  children: React.ReactNode;
  params: { classroomId: string; testId: string; questionNumber: string };
}

export default async function TestLayout({
  children,
  params,
}: TestLayoutProps) {
  try {
    const query = await db.test.findUnique({
      where: {
        id: params.testId,
      },
    });

    if (!query) {
      //the test does not exist => testId is fishy
      redirect("/dashboard");
    }
  } catch (err) {
    console.error(
      "The following error occurred while fetching test info in the Test Layout",
      err
    );
  }

  return <TestProvider>{children}</TestProvider>;
}
