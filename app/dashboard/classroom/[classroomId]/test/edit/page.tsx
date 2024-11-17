import NotFound from "@/app/dashboard/not-found";
import db from "@/db";
import { redirect } from "next/navigation";

interface EditTestPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function EditTestPage({
  searchParams,
}: Readonly<EditTestPageProps>) {
  const testId = searchParams["id"];

  //the testId should not be undefined/null
  if (testId === undefined) {
    return NotFound(); //not found page
  }

  let test;

  try {
    const query = await db.test.findUnique({
      where: {
        id: testId,
      },
    });

    if (query) test = query;
    else {
      //if it is not a valid testId that exists then redirect it to the dashboard
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
  return <main>{test?.name}</main>;
}
