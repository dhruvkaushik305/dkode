import PageWithNavbar from "@/app/dashboard/_components/PageWithNavbar";
import db from "@/db";
import TestForm from "./_components/TestForm";

interface Props {
  params: { classroomId: string };
  searchParams: { [key: string]: string | undefined };
}

export default async function Page({ params, searchParams }: Readonly<Props>) {
  const classroomId = params.classroomId;

  const testId = searchParams["id"] || "new";

  try {
    const test = await db.test.findUnique({
      where: { id: testId },
    });

    console.log("the test fetched is", test);
  } catch (err) {
    console.error("The following error occurred while fetching the test", err);
  }

  return (
    <PageWithNavbar>
      <TestForm />
    </PageWithNavbar>
  );
}
