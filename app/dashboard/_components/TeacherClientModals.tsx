"use client";

import { createClassroomAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function OpenedModalComponent() {
  const router = useRouter();

  async function formSubmitionHandler(formData: FormData) {
    const classroomName = formData.get("classroomName");

    if (!classroomName) return;

    const query = await createClassroomAction(classroomName as string);

    if (query.success) {
      const newClassroomId = query.id;

      navigator.clipboard.writeText(newClassroomId!);

      toast.success(query.message);

      router.push("/dashboard");
    } else {
      toast.error(query.message);
    }
  }

  return (
    <section className="flex flex-col gap-5 p-3">
      <header className="font-semibold text-3xl">Create a new classroom</header>
      <form className="flex flex-col gap-7" action={formSubmitionHandler}>
        <label className="flex flex-col gap-2">
          <span className="text-xl">Name:</span>
          <input
            type="text"
            name="classroomName"
            placeholder="What should we call it?"
            className="input-box"
          />
        </label>
        <button className="p-3 bg-black text-white rounded-xl">Create</button>
      </form>
    </section>
  );
}

export function ClosedModalComponent() {
  return (
    <p className="text-center text-blue-600 hover:underline">
      Create a Classroom
    </p>
  );
}
