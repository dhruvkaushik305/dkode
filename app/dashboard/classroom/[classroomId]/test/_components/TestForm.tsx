"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { TestFormProvider, TestFormType } from "./TestFormHooks";
import { CirclePlus, Plus, Trash } from "lucide-react";
import { v4 as uuid } from "uuid";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { createTestAction } from "@/app/actions";
import { TestType } from "@/app/types";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  classroomId: string;
  existingTest: TestType | null;
}

export default function TestForm({
  classroomId,
  existingTest,
}: Readonly<Props>) {
  return (
    <TestFormProvider>
      <TestFormContent classroomId={classroomId} existingTest={existingTest} />
    </TestFormProvider>
  );
}

function TestFormContent({ classroomId, existingTest }: Readonly<Props>) {
  const router = useRouter();
  const pathName = usePathname();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useFormContext<TestFormType>();

  const formSubmissionHandler = async (data: TestFormType) => {
    const query = await createTestAction(classroomId, data);

    if (query.success) {
      //redirect to the test page
      const newUrl = pathName.split("/").slice(0, 4).join("/");

      router.push(newUrl);
    } else {
      toast.error(query.message);
    }
  };

  //FIXME startDateTime and endDateTime not showing the errors as others.
  return (
    <form
      className="h-full flex flex-col p-4 gap-5 items-center"
      onSubmit={handleSubmit(formSubmissionHandler)}
    >
      <header className="p-2 text-2xl font-medium border-b border-gray-300 w-full">
        Create Test
      </header>
      <label className="flex flex-col gap-2 w-full">
        <header className="text-xl font-medium">Name</header>
        <input
          type="text"
          {...register("name")}
          className="input-box"
          placeholder="Enter the name of the test"
        />
        <p className="form-error">{errors.name?.message}</p>
      </label>
      <div className="flex gap-2 items-center w-full">
        <FormField
          control={control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 grow">
              <FormLabel className="text-nowrap">Start date-time</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 grow">
              <FormLabel className="text-nowrap">End date-time</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <RenderQuestions />
      <p className="form-error">{errors.questions?.message}</p>
      <button
        type="submit"
        className="bg-black text-white rounded-xl p-2 w-1/2"
      >
        Submit
      </button>
    </form>
  );
}

function RenderQuestions() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TestFormType>();

  const { append, remove, fields } = useFieldArray({
    name: "questions",
    control,
  });

  const questionDeletionHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    remove(index);
  };

  const sampleQuestion = {
    id: uuid(),
    statement: "",
    testCases: [],
  };

  return (
    <section className="w-full flex flex-col gap-5">
      {fields.map((question, questionIndex) => {
        return (
          <section key={question.id} className="flex flex-col gap-5">
            <header className="text-xl font-medium flex justify-between items-center border-b border-gray-300">
              Question {questionIndex + 1}
              <Trash
                className="cursor-pointer"
                size={20}
                onClick={(e) => questionDeletionHandler(e, questionIndex)}
              />
            </header>
            <label className="flex-col gap-2 w-full">
              <header className="text-xl font-medium">Statement</header>
              <textarea
                {...register(`questions.${questionIndex}.statement`)}
                placeholder="Enter the statement here..."
                className="w-full h-[10rem] focus:outline-none p-2 rounded-md"
              />
              <p className="form-error">
                {errors.questions?.[questionIndex]?.statement?.message}
              </p>
            </label>
            <RenderTestCases questionIndex={questionIndex} />
            <p className="form-error">
              {errors.questions?.[questionIndex]?.testCases?.message}
            </p>
          </section>
        );
      })}

      <button
        type="button"
        className="p-2 border border-blue-500 flex items-center gap-2 rounded-md w-fit"
        onClick={() => {
          append(sampleQuestion);
        }}
      >
        <Plus size={20} color="blue" /> Question
      </button>
    </section>
  );
}

function RenderTestCases({ questionIndex }: { questionIndex: number }) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<TestFormType>();

  const { append, remove, fields } = useFieldArray({
    name: `questions.${questionIndex}.testCases`,
    control,
  });

  const testCaseDeletionHandler = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    remove(index);
  };

  const sampleTestCase = {
    id: uuid(),
    input: "",
    output: "",
    visibility: true,
  };

  return (
    <section className="w-full flex flex-col gap-5">
      {fields.map((testCase, testCaseIndex) => {
        return (
          <section key={testCase.id} className="w-full flex flex-col gap-5">
            <header className="text-xl font-medium flex justify-between items-center border-b border-gray-300">
              Test Case {testCaseIndex + 1}
              <Trash
                className="cursor-pointer"
                size={20}
                onClick={(e) => testCaseDeletionHandler(e, questionIndex)}
              />
            </header>
            <label className="flex-col gap-2 w-full">
              <header className="text-xl font-medium">Input</header>
              <input
                type="text"
                placeholder="Enter the input here"
                className="input-box"
                {...(register(
                  `questions.${questionIndex}.testCases.${testCaseIndex}.input`
                ),
                {
                  onChange: (e) => {
                    //convert the _ to spaces
                    const originalValue = e.target.value.replace(/_/g, " ");
                    //convert the spaces to _
                    const displayValue = originalValue.replace(/ /g, "_");
                    e.target.value = displayValue;
                    //save the value with spaces.
                    setValue(
                      `questions.${questionIndex}.testCases.${testCaseIndex}.input`,
                      originalValue,
                      { shouldValidate: true }
                    );
                  },
                })}
              />
              <p className="form-error">
                {
                  errors.questions?.[questionIndex]?.testCases?.[testCaseIndex]
                    ?.input?.message
                }
              </p>
            </label>
            <label>
              <header className="text-xl font-medium">Output</header>
              <input
                type="text"
                className="input-box"
                placeholder="Enter the input here"
                {...(register(
                  `questions.${questionIndex}.testCases.${testCaseIndex}.output`
                ),
                {
                  onChange: (e) => {
                    //convert the _ to spaces
                    const originalValue = e.target.value.replace(/_/g, " ");
                    console.log("orignal value is", originalValue);
                    //convert the spaces to _
                    const displayValue = originalValue.replace(/ /g, "_");
                    e.target.value = displayValue;
                    //save the value with spaces.
                    setValue(
                      `questions.${questionIndex}.testCases.${testCaseIndex}.output`,
                      originalValue,
                      { shouldValidate: true }
                    );
                  },
                })}
              />
              <p className="form-error">
                {
                  errors.questions?.[questionIndex]?.testCases?.[testCaseIndex]
                    ?.output?.message
                }
              </p>
            </label>
          </section>
        );
      })}
      <button
        type="button"
        className="p-2 border border-red-500 flex items-center gap-2 rounded-md w-fit"
        onClick={() => {
          append(sampleTestCase);
        }}
      >
        Case <CirclePlus size="20" color="red" />
      </button>
    </section>
  );
}
