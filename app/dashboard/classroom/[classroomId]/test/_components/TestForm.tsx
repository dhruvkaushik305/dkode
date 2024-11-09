"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { TestFormProvider, TestFormType } from "./TestFormHooks";
import { Trash } from "lucide-react";
import { v4 as uuid } from "uuid";

export default function TestForm() {
  return (
    <TestFormProvider>
      <TestFormContent />
    </TestFormProvider>
  );
}

function TestFormContent() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<TestFormType>();

  const formSubmissionHandler = (data: TestFormType) => {
    console.log("data received is", data);
  };

  const onError = (errors: any) => {
    console.log("errros faced are", errors);
  };
  return (
    <form
      className="p-5 flex flex-col gap-5"
      onSubmit={handleSubmit(formSubmissionHandler, onError)}
    >
      <label>
        <p>Name</p>
        <input type="text" {...register("name")} />
        <p>{errors.name?.message}</p>
      </label>
      <label>
        <input type="datetime-local" {...register("startDateTime")} />
        <p>{errors.startDateTime?.message}</p>
      </label>
      <label>
        <input type="datetime-local" {...register("endDateTime")} />
        <p>{errors.endDateTime?.message}</p>
      </label>
      <RenderQuestions />
      <p>{errors.questions?.message}</p>
      <button type="submit">Submit</button>
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

  const sampleQuestion = {
    id: uuid(),
    statement: "",
    testCases: [],
  };

  return (
    <section>
      {fields.map((question, questionIndex) => {
        return (
          <div key={question.id}>
            <label>
              <p>Question {questionIndex + 1}</p>
              <Trash
                onClick={(e) => {
                  e.preventDefault();
                  remove(questionIndex);
                }}
              />
              <textarea {...register(`questions.${questionIndex}.statement`)} />
              <p>{errors.questions?.[questionIndex]?.statement?.message}</p>
            </label>
            <RenderTestCases questionIndex={questionIndex} />
            <p>{errors.questions?.[questionIndex]?.testCases?.message}</p>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => {
          append(sampleQuestion);
        }}
      >
        Add Question
      </button>
    </section>
  );
}

function RenderTestCases({ questionIndex }: { questionIndex: number }) {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<TestFormType>();

  const { append, remove, fields } = useFieldArray({
    name: `questions.${questionIndex}.testCases`,
    control,
  });

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
          <div key={testCase.id}>
            <header>
              Test Case {testCaseIndex + 1}
              <Trash
                onClick={(e) => {
                  e.preventDefault();
                  remove(testCaseIndex);
                }}
              />
            </header>
            <label>
              <p>Input</p>
              <input
                type="text"
                {...register(
                  `questions.${questionIndex}.testCases.${testCaseIndex}.input`
                )}
              />
              <p>
                {
                  errors.questions?.[questionIndex]?.testCases?.[testCaseIndex]
                    ?.input?.message
                }
              </p>
            </label>
            <label>
              <p>Output</p>
              <input
                type="text"
                {...register(
                  `questions.${questionIndex}.testCases.${testCaseIndex}.output`
                )}
              />
              <p>
                {
                  errors.questions?.[questionIndex]?.testCases?.[testCaseIndex]
                    ?.output?.message
                }
              </p>
            </label>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          append(sampleTestCase);
        }}
      >
        Add Test Case
      </button>
    </section>
  );
}
