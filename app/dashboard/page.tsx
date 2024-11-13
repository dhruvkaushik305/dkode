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
    <section className="p-2">
      <header className="text-4xl font-medium p-2">Classrooms</header>
      <section className="flex gap-2 p-3 rounded-lg border border-zinc-200">
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
    <article className="bg-zinc-200/70 w-fit p-4 rounded-md flex flex-col gap-2">
      <header className="text-xl flex flex-col items-end gap-1">
        <Library size="26" />
        <p className="w-full text-left hover:underline">{classroom.name}</p>
      </header>
      <footer className="flex gap-3 text-sm">
        <p>Strength: {classroom.students.length}</p>
        <p>Created at: {classroom.createdAt.toLocaleDateString()}</p>
      </footer>
    </article>
  );
}

function StudentDashboard() {
  return <section></section>;
}
