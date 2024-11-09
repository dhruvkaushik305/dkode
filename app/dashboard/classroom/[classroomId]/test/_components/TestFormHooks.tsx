import React from "react";
import z from "zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const testCaseSchema = z.object({
  id: z.string(),
  input: z.string().min(1, { message: "input cannot be empty" }),
  output: z.string().min(1, { message: "output cannot be empty" }),
  visibility: z.boolean(),
});

export type TestCaseInputType = z.infer<typeof testCaseSchema>;

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
  startDateTime: z.coerce.date({ message: "enter a valid start date-time" }),
  endDateTime: z.coerce.date({ message: "enter a valid end date-time" }),
  questions: z
    .array(questionSchema)
    .nonempty({ message: "test must have atleast one question" }),
});

export type TestFormType = z.infer<typeof testSchema>;

export function TestFormProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm<TestFormType>({
    resolver: zodResolver(testSchema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
