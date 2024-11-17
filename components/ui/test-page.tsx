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
  // FormDescription,
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
import { CirclePlus, Plus, Trash } from "lucide-react";
import { TestType } from "@/app/types";

const testCaseSchema = z.object({
  id: z.string(),
  input: z.string().min(1, { message: "input cannot be empty" }),
  output: z.string().min(1, { message: "output cannot be empty" }),
  visibility: z.boolean(),
});

// type TestCaseFormInputType = z.infer<typeof testCaseSchema>;

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
  endDateTime: z.date({ message: "enter a valid end date time" }),
  questions: z
    .array(questionSchema)
    .nonempty({ message: "test must have atleast one question" }),
});

type TestFormType = z.infer<typeof testSchema>;

interface TestPageProps {
  existingTest?: TestType;
}

export default function TestPage({ existingTest }: Readonly<TestPageProps>) {
  const methods = useForm<TestFormType>({
    resolver: zodResolver(testSchema),
    defaultValues: existingTest
      ? {
          id: existingTest.id,
          name: existingTest.name,
          startDateTime: new Date(existingTest.startDateTime),
          endDateTime: new Date(existingTest.endDateTime),
          questions: existingTest.questions.map((question) => ({
            id: question.id,
            statement: question.statement,
            testCases: question.testCases.map((testCase) => ({
              id: testCase.id,
              input: testCase.input,
              ouptut: testCase.output,
              visibility: testCase.visibility,
            })),
          })),
        }
      : {
          id: undefined,
          name: "Untitled",
          startDateTime: new Date(),
          endDateTime: new Date(),
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

  const formSubmitionHandler = (data: TestFormType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitionHandler)}>
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
        <div>
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
        <Button type="submit">Submit</Button>
      </form>
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
    <section>
      {fields.map((question, questionIndex) => {
        return (
          <section key={question.id}>
            <header className="text-xl font-medium flex justify-between items-center border-b border-gray-300">
              Question {questionIndex + 1}
              <Trash
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
    <section>
      {fields.map((testCase, testCaseIndex) => {
        return (
          <section key={testCase.id}>
            <header className="text-xl font-medium flex justify-between items-center border-b border-gray-300">
              Test Case {testCaseIndex + 1}
              <Trash
                className="cursor-pointer"
                size={20}
                onClick={(e) => testCaseDeletionHandler(e, questionIndex)}
              />
            </header>
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.testCases.${testCaseIndex}.input`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the input here..."
                      {...field}
                      onChange={(e) => {
                        // Convert underscores to spaces for the original value
                        const originalValue = e.target.value.replace(/_/g, " ");
                        // Convert spaces to underscores for display
                        const newDisplayValue = originalValue.replace(
                          / /g,
                          "_",
                        );
                        e.target.value = newDisplayValue;

                        // Update the form value with the original value (spaces)
                        form.setValue(
                          `questions.${questionIndex}.testCases.${testCaseIndex}.input`,
                          originalValue,
                          { shouldValidate: true },
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.testCases.${testCaseIndex}.output`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the ouptut here..."
                      {...field}
                      onChange={(e) => {
                        // Convert underscores to spaces for the original value
                        const originalValue = e.target.value.replace(/_/g, " ");
                        // Convert spaces to underscores for display
                        const newDisplayValue = originalValue.replace(
                          / /g,
                          "_",
                        );
                        e.target.value = newDisplayValue;

                        // Update the form value with the original value (spaces)
                        form.setValue(
                          `questions.${questionIndex}.testCases.${testCaseIndex}.output`,
                          originalValue,
                          { shouldValidate: true },
                        );
                      }}
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
        onClick={() => {
          append(sampleTestCase);
        }}
      >
        Case <CirclePlus size="20" color="red" />
      </Button>
    </section>
  );
}
