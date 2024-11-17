"use client";

import React from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "./datetime-picker";
import { Button } from "./button";
import { v4 as uuid } from "uuid";
import { Textarea } from "./textarea";
import { CirclePlus, Plus, X } from "lucide-react";
import { TestType } from "@/app/types";
import { createTestAction, editTestAction } from "@/app/actions";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const testCaseSchema = z.object({
  id: z.string(),
  input: z.string().min(1, { message: "input cannot be empty" }),
  output: z.string().min(1, { message: "output cannot be empty" }),
  visibility: z.boolean(),
});

const questionSchema = z.object({
  id: z.string(),
  statement: z
    .string()
    .min(5, { message: "statement must have atleast 5 characters" }),
  testCases: z
    .array(testCaseSchema)
    .min(1, { message: "questions must have atleaset one test case" }),
});

const testSchema = z.object({
  id: z.optional(z.string()),
  name: z.string().min(2, { message: "name must have atleast 2 characters" }),
  startDateTime: z.date({ message: "enter a valid start date-time" }),
  endDateTime: z.date({ message: "enter a valid end date-time" }),
  classroomId: z.string(),
  startedAt: z.date().nullable().optional().default(null),
  questions: z
    .array(questionSchema)
    .nonempty({ message: "test must have atleast one question" }),
});

export type TestFormType = z.infer<typeof testSchema>;

interface TestPageProps {
  classroomId: string;
  existingTest?: TestType;
}

export default function TestPage({
  classroomId,
  existingTest,
}: Readonly<TestPageProps>) {
  const methods = useForm<TestFormType>({
    resolver: zodResolver(testSchema),
    defaultValues: existingTest
      ? {
          id: existingTest.id,
          name: existingTest.name,
          startDateTime: new Date(existingTest.startDateTime),
          endDateTime: new Date(existingTest.endDateTime),
          startedAt: null,
          classroomId: existingTest.classroomId,
          questions: existingTest.questions.map((question) => ({
            id: question.id,
            statement: question.statement,
            testCases: question.testCases.map((testCase) => ({
              id: testCase.id,
              input: testCase.input.replace(/ /g, "_"),
              output: testCase.output.replace(/ /g, "_"),
              visibility: testCase.visibility,
            })),
          })),
        }
      : {
          id: undefined,
          name: "Untitled",
          startDateTime: new Date(),
          endDateTime: new Date(),
          classroomId: classroomId,
          startedAt: null,
          questions: [
            {
              id: uuid(),
              statement: "",
              testCases: [
                {
                  id: uuid(),
                  input: "",
                  output: "",
                  visibility: true,
                },
              ],
            },
          ],
        },
  });

  return (
    <FormProvider {...methods}>
      <TestFormContent />
    </FormProvider>
  );
}

function TestFormContent() {
  const form = useFormContext<TestFormType>();
  const router = useRouter();
  const pathName = usePathname();

  const formSubmitionHandler = async (data: TestFormType) => {
    if (data.id) {
      //update test
      const query = await editTestAction(data.classroomId, data.id, data);

      if (query.success) {
        const newUrl = pathName.split("/").slice(0, 4).join("/");

        router.push(newUrl);
      } else {
        toast.error(query.message);
      }
    } else {
      //create test
      const query = await createTestAction(data.classroomId, data);

      if (query.success) {
        const newUrl = pathName.split("/").slice(0, 4).join("/");

        router.push(newUrl);
      } else {
        toast.error(query.message);
      }
    }
  };

  return (
    <Form {...form}>
      <main className="w-full max-w-screen-2xl mx-auto p-2 space-y-10">
        <header className="text-3xl font-bold">Test Page</header>
        <form
          onSubmit={form.handleSubmit(formSubmitionHandler)}
          className="space-y-10"
        >
          <section className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name of the test here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5 w-full">
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Start date-time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>End date-time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <RenderQuestions />
          </section>
          <Button type="submit" variant="default">
            Done
          </Button>
        </form>
      </main>
    </Form>
  );
}

function RenderQuestions() {
  const form = useFormContext<TestFormType>();

  const { append, remove, fields } = useFieldArray({
    name: "questions",
    control: form.control,
  });

  const questionDeletionHandler = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    remove(index);
  };

  const sampleQuestion = {
    id: uuid(),
    statement: "",
    testCases: [],
  };

  return (
    <section className="space-y-7">
      {fields.map((question, questionIndex) => {
        return (
          <section
            key={question.id}
            className="space-y-5 border border-zinc-200 p-4 rounded-md"
          >
            <header className="text-xl font-medium flex justify-between items-center">
              Question {questionIndex + 1}
              <X
                className="cursor-pointer"
                size={20}
                onClick={(e) => questionDeletionHandler(e, questionIndex)}
              />
            </header>
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.statement`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the statement here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RenderTestCases questionIndex={questionIndex} />
          </section>
        );
      })}
      <Button
        variant="secondary"
        onClick={() => {
          append(sampleQuestion);
        }}
      >
        <Plus size="20" /> Question
      </Button>
    </section>
  );
}

interface RenderTestCasesProps {
  questionIndex: number;
}
function RenderTestCases({ questionIndex }: Readonly<RenderTestCasesProps>) {
  const form = useFormContext<TestFormType>();

  const { append, remove, fields } = useFieldArray({
    name: `questions.${questionIndex}.testCases`,
    control: form.control,
  });

  const testCaseDeletionHandler = (e: React.MouseEvent, index: number) => {
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
    <section className="space-y-7 pl-5">
      {fields.map((testCase, testCaseIndex) => {
        return (
          <section key={testCase.id} className="space-y-5">
            <header className="text-lg font-medium flex justify-between items-center">
              Test Case {testCaseIndex + 1}
              <X
                className="cursor-pointer hover:bg-red-300 rounded-md"
                size={18}
                onClick={(e) => testCaseDeletionHandler(e, questionIndex)}
              />
            </header>
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.testCases.${testCaseIndex}.input`}
              render={() => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the input here..."
                      value={form
                        .getValues(
                          `questions.${questionIndex}.testCases.${testCaseIndex}.input`
                        )
                        .replace(/ /g, "_")}
                      {...form.register(
                        `questions.${questionIndex}.testCases.${testCaseIndex}.input`
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.testCases.${testCaseIndex}.output`}
              render={() => (
                <FormItem>
                  <FormLabel>Output</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the input here..."
                      value={form
                        .getValues(
                          `questions.${questionIndex}.testCases.${testCaseIndex}.output`
                        )
                        .replace(/ /g, "_")}
                      {...form.register(
                        `questions.${questionIndex}.testCases.${testCaseIndex}.output`
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        );
      })}
      <Button
        variant="outline"
        onClick={() => {
          append(sampleTestCase);
        }}
      >
        Case <CirclePlus size="20" color="red" />
      </Button>
    </section>
  );
}
