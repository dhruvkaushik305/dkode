import { TestType } from "@/app/types";
import PageWithNavbar from "../../_components/PageWithNavbar";
import db from "@/db";
import { DeleteTestButton, TestButton } from "./_components/Buttons";

export default async function Page({
  params,
}: Readonly<{
  params: { classroomId: string };
}>) {
  return (
    <PageWithNavbar>
      <main className="h-full">
        <section className="flex flex-col h-full">
          <header className="p-7 text-4xl font-medium border-b border-zinc-300">
            Tests
          </header>
          <Tests classroomId={params.classroomId} />
        </section>
      </main>
    </PageWithNavbar>
  );
}

async function Tests({ classroomId }: Readonly<{ classroomId: string }>) {
  let tests: TestType[] = [];

  const query = await db.test.findMany({
    where: {
      classroomId,
    },
    include: {
      questions: {
        include: {
          testCases: true,
        },
      },
    },
  });

  if (query) {
    tests = query;
  }

  return (
    <section className="grow flex justify-center items-center gap-5 pt-10 p-4">
      {tests.length === 0 ? (
        <TestButton>
          <span className="text-blue-500 hover:underline">Create Test</span>
        </TestButton>
      ) : (
        tests.map((test) => (
          <TestButton key={test.id} testId={test.id}>
            <TestCard test={test} />
          </TestButton>
        ))
      )}
    </section>
  );
}

function TestCard({ test }: Readonly<{ test: TestType }>) {
  const durationMs = test.endDateTime.getTime() - test.startDateTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return (
    <div className="bg-gray-300/50 min-w-[20rem] min-h-[7rem] rounded-md flex flex-col justify-center items-center p-2">
      <header className="text-xl font-medium grow w-full flex items-center justify-between">
        {test.name} <DeleteTestButton id={test.id!} />
      </header>
      <footer className="w-full text-right flex justify-between">
        <p>{test.questions.length} Questions</p>
        <p>
          {durationHours} h {durationMinutes} min
        </p>
      </footer>
    </div>
  );
}
