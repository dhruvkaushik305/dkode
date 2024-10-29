import { TestType } from "@/app/types";
import PageWithNavbar from "../../_components/PageWithNavbar";
import db from "@/db";

export default async function Page({
  params,
}: {
  params: { classroomId: string };
}) {
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

async function Tests({ classroomId }: { classroomId: string }) {
  let tests: TestType[] = [];

  const query = await db.test.findMany({
    where: {
      classroomId,
    },
  });

  if (query) {
    tests = query;
  }

  return (
    <section className="flex-1 flex items-center justify-center">
      {tests.length === 0 ? (
        <p>No tests</p>
      ) : (
        tests.map((test, index) => <TestCard key={index} test={test} />)
      )}
    </section>
  );
}

function TestCard({ test }: { test: TestType }) {
  return <div>{test.name}</div>;
}
