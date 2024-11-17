import NotFound from "@/app/dashboard/not-found";
import Navbar from "@/components/ui/navbar";
import TestPage from "@/components/ui/test-page";
import db from "@/db";
import { redirect } from "next/navigation";

interface EditTestPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function EditTestPage({
  searchParams,
}: Readonly<EditTestPageProps>) {
  const testId = searchParams["id"];

  if (testId === undefined) {
    return NotFound(); //not found page
  }

  let test;

  try {
    const query = await db.test.findUnique({
      where: {
        id: testId,
      },
      include: {
        questions: {
          include: {
            testCases: true,
          },
        },
      },
    });

    if (query) test = query;
    else {
      return NotFound();
    }
  } catch (err) {
    console.error(
      "The following error occurred while fetching the test info",
      err,
    );

    //this is not the user's fault that we ran into an error, therefore instead of a not found page, gracefully handle.
    redirect("/dashboard");
  }
  return (
    <main>
      <Navbar />
      <TestPage existingTest={test} />
    </main>
  );
}
