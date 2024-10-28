import { auth } from "@/auth";
import PageWithNavbar from "./_components/PageWithNavbar";
import TeacherDashboard from "./_components/TeacherDashboard";
import StudentDashboard from "./_components/StudentDashboard";

export default async function Page() {
  const session = await auth();

  if (!session) {
    console.error("Cricitcal: Dashboad does not have session");
    return null;
  }

  return (
    <main className="h-full w-full">
      <PageWithNavbar>
        {session.user.role === "TEACHER" ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard />
        )}
      </PageWithNavbar>
    </main>
  );
}
