import { auth } from "@/auth";
import PageWithNavbar from "./_components/PageWithNavbar";
import TeacherDashboard from "./_components/TeacherDashboard";
import StudentDashboard from "./_components/StudentDashboard";
import Navbar from "@/components/ui/navbar";

export default async function Page() {
  const session = await auth();

  if (!session) {
    console.error("Cricitcal: Dashboad does not have session");
    return null;
  }

  return (
    <main className="h-full w-full">
      <Navbar />
    </main>
  );
}
