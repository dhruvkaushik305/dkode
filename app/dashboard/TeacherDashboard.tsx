import { auth } from "@/auth";
import db from "@/db";
import { ClassroomType } from "../types";
export default function TeacherDashboard() {
  return (
    <main className="h-full">
      <section className="flex flex-col h-full">
        <header className="p-7 text-4xl font-medium border-b border-zinc-300">
          Classrooms
        </header>
        <Classrooms />
      </section>
    </main>
  );
}

async function Classrooms() {
  const session = await auth();
  if (!session) {
    console.error("Critical: Classroom section does not have session");
    return null;
  }

  let classrooms: ClassroomType[] = [];
  //fetch the classrooms that the teacher is a part of
  const query = await db.classroom.findMany({
    where: {
      teachers: {
        some: {
          id: session.user.id,
        },
      },
    },
  });
  //if foumd, set the default list to this
  if (query) {
    classrooms = query;
  }

  return (
    <section className="flex-1 flex items-center justify-center">
      {classrooms.length === 0 ? (
        <p className="text-center">
          No classrooms found. <br /> Create one
        </p>
      ) : (
        classrooms.map((classroom, index) => (
          <div key={index}>{JSON.stringify(classroom)}</div>
        ))
      )}
    </section>
  );
}
