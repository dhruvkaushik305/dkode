import { auth } from "@/auth";
import Navbar from "@/components/ui/navbar";
import db from "@/db";
import { ClassroomType, ClassroomWithStudentType } from "../types";
import { Library } from "lucide-react";

export default function Page() {
  return (
    <main className="h-full w-full flex flex-col">
      <Navbar />
      <DashbooardWrapper />
    </main>
  );
}

async function DashbooardWrapper() {
  const session = await auth();

  if (!session) {
    console.error("Critical: Unauthenticated user entered on the Dashboard");

    return null;
  }

  return (
    <main className="flex flex-col grow">
      {session.user.role === "TEACHER" ? (
        <TeacherDashboard teacherId={session.user.id} />
      ) : (
        <StudentDashboard />
      )}
    </main>
  );
}

interface TeacherDashboardProps {
  teacherId: string;
}

async function TeacherDashboard({
  teacherId,
}: Readonly<TeacherDashboardProps>) {
  let classrooms: ClassroomWithStudentType[] = [];

  try {
    const query = await db.classroom.findMany({
      where: {
        teachers: {
          some: {
            id: teacherId,
          },
        },
      },
      include: {
        students: true,
      },
    });

    classrooms = query;
  } catch (err) {
    console.error(
      "The following error occurred while fetching the classrooms that the teacher is a part of",
      err
    );
  }

  return (
    <section className="p-2 w-full max-w-screen-2xl mx-auto">
      <header className="text-4xl font-semibold p-2">Classrooms</header>
      <section className="grid grid-cols-8 w-full mx-auto gap-6 p-4 rounded-lg border border-zinc-200">
        {classrooms.map((classroom) => (
          <TeacherClassroomCard key={classroom.id} classroom={classroom} />
        ))}
      </section>
    </section>
  );
}

interface TeacherClassroomCardProps {
  classroom: ClassroomWithStudentType;
}

function TeacherClassroomCard({
  classroom,
}: Readonly<TeacherClassroomCardProps>) {
  return (
    <article className="bg-zinc-100 shadow-md w-full p-4 rounded-sm flex flex-col gap-2 col-span-2 h-[8rem] justify-around">
      <header className="text-xl flex items-center justify-between gap-1">
        <h2 className="w-full text-left hover:underline font-medium">
          {classroom.name}
        </h2>
        <Library size={20} />
      </header>
      <footer className="flex gap-3 text-sm justify-between">
        <p>Strength: {classroom.students.length}</p>
        <p>Created at: {classroom.createdAt.toLocaleDateString()}</p>
      </footer>
    </article>
  );
}

function StudentDashboard() {
  return <section></section>;
}
