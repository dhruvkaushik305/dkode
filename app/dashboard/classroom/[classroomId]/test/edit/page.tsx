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
    redirect("/dashboard");
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
      redirect("/dashboard");
    }
  } catch (err) {
    console.error(
      "The following error occurred while fetching the test info",
      err,
    );
    redirect("/dashboard");
  }
  return <main>{test?.name}</main>;
}
