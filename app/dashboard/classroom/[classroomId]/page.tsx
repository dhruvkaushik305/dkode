import { ClassroomWithStudentType, TestType } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/navbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import db from "@/db";
import { Calendar, Clock, EllipsisVertical, List } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
interface ClassroomPageProps {
  params: { classroomId: string };
}
export default async function ClassroomPage({
  params,
}: Readonly<ClassroomPageProps>) {
  const classroomId = params.classroomId;

  return (
    <main className="h-full">
      <Navbar />
      <section className="h-full p-2 w-full max-w-screen-2xl mx-auto flex flex-col gap-4">
        <ClassroomInfo classroomId={classroomId} />
        <RenderTests classroomId={classroomId} />
      </section>
    </main>
  );
}

interface ClassroomInfoProps {
  classroomId: string;
}

async function ClassroomInfo({ classroomId }: Readonly<ClassroomInfoProps>) {
  let classroomInfo: ClassroomWithStudentType | null = null;

  let creatorName: string | undefined = undefined;

  try {
    const queryClassroom = await db.classroom.findUnique({
      where: {
        id: classroomId,
      },
      include: {
        students: true,
      },
    });

    classroomInfo = queryClassroom;

    if (queryClassroom) {
      const queryName = await db.user.findUnique({
        where: {
          id: queryClassroom.creatorId,
        },
        select: {
          name: true,
        },
      });

      creatorName = queryName?.name;
    }
  } catch (err) {
    console.error(
      "The following error occurred while fetching the classroom info",
      err
    );
  }

  return (
    <section className="mx-auto px-4 py-8 w-full">
      <header className="text-4xl font-bold mb-2 border-b border-gray-300">
        {classroomInfo?.name}
      </header>
      <div className="flex justify-between items-center text-gray-600">
        <p>Strength of the Classroom: {classroomInfo?.students.length}</p>
        <div>
          <p>Created by {creatorName}</p>
          <p>Created at: {classroomInfo?.createdAt.toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}
interface RenderTestsProps {
  classroomId: string;
}

async function RenderTests({ classroomId }: Readonly<RenderTestsProps>) {
  let tests: TestType[] = [];

  try {
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

    tests = query;
  } catch (err) {
    console.error(
      "The following error occurred while fetching the tests for the classroom",
      err
    );
  }
  return (
    <section>
      <header className="text-3xl font-semibold p-2 border-b border-gray-300">
        Tests
      </header>
      <section className="grid grid-cols-8 w-full mx-auto gap-6 p-4 rounded-lg">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </section>
    </section>
  );
}

interface TestCardProps {
  test: TestType;
}

function TestCard({ test }: Readonly<TestCardProps>) {
  const durationMs = test.endDateTime.getTime() - test.startDateTime.getTime();

  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));

  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return (
    <div className="border border-gray-200 shadow-sm w-full p-4 rounded-sm flex flex-col gap-4 col-span-2 min-h-[8rem] justify-around">
      <header className="text-xl flex items-center justify-between gap-1">
        <h2 className="w-full text-left hover:underline font-medium">
          {test.name}
        </h2>
        <Dialog>
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical size="17" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-3 w-[10rem]">
              <Button variant="ghost">Edit</Button>
              <DialogTrigger>
                <header className="hover:bg-red-200 p-2 rounded-md">
                  Delete
                </header>
              </DialogTrigger>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete all the related info to this test.This action
              cannot be undone
            </DialogDescription>
            <Button variant="destructive">Delete</Button>
          </DialogContent>
        </Dialog>
      </header>
      <Badge className="flex gap-1 items-center w-fit bg-zinc-200 text-black p-1">
        <Calendar size="15" />
        <p className="text-nowrap">{test.startDateTime.toLocaleString()}</p>
      </Badge>
      <footer className="flex justify-between text-sm">
        <p className="flex gap-2 items-center">
          <List size="20" /> <span>{test.questions.length} questions</span>
        </p>
        <p className="flex gap-2 items-center">
          <Clock size="20" />
          <span>
            Duration: {durationHours} h {durationMinutes} min
          </span>
        </p>
      </footer>
    </div>
  );
}
