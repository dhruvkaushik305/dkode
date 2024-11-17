import Navbar from "@/components/ui/navbar";
import TestPage from "@/components/ui/test-page";

interface CreateTestPageProps {
  params: { classroomId: string };
}

export default function CreateTestPage({
  params,
}: Readonly<CreateTestPageProps>) {
  return (
    <main className="flex flex-col gap-3">
      <Navbar />
      <TestPage classroomId={params.classroomId} />
    </main>
  );
}
