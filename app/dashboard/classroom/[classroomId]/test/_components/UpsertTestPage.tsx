"use client";

import React from "react";
import Context from "./providers";
import { QuestionType, TestCaseType } from "@/app/types";
import PageWithNavbar from "@/app/dashboard/_components/PageWithNavbar";

export default function UpsertTestPage() {
  const contextObj = React.useContext(Context);

  if (!contextObj)
    throw new Error("Upsert Test Page was not given any Context");

  const { context, setContext } = contextObj;

  const generalChangeHandler = (field: string, value: any) => {
    setContext((prevContext) => ({ ...prevContext, [field]: value }));
  };

  const addQuestionHandler = () => {
    setContext((prevContext) => ({
      ...prevContext,
      questions: [
        ...prevContext.questions,
        {
          statement: "Untitled",
          testCases: [],
        },
      ],
    }));
  };

  const formSubmitionHandler = () => {
    //check that the general is not empty
    console.log("context is ", context);
    if (
      context.name === "" ||
      context.startDateTime === null ||
      context.endDateTime === null
    ) {
      alert("form details are incomplete");
    }

    //check that questions exist
    if (context.questions.length === 0) alert("no questions given");

    //check that no question has any unfilled entry
    context.questions.every((question, questionIndex) => {
      if (question.statement === "")
        alert(`incomplete question ${questionIndex + 1}`);
      if (question.testCases.length === 0)
        alert(`no test cases in question ${questionIndex + 1}`);
      question.testCases.every((testCase, testCaseIndex) => {
        if (testCase.input === "" || testCase.output === "") {
          alert(
            `test case ${testCaseIndex + 1} of ${
              questionIndex + 1
            } is incomplete`
          );
        }
      });
    });
  };

  return (
    <PageWithNavbar>
      <section className="p-7">
        <section>
          <header>General</header>
          <form className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <header>Name:</header>
              <input
                type="text"
                value={context.name}
                onChange={(e) => generalChangeHandler("name", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <header>Start Date and Time:</header>
              <input
                type="datetime-local"
                value={context.startDateTime.toISOString().slice(0, 16)}
                onChange={(e) =>
                  generalChangeHandler(
                    "startDateTime",
                    new Date(e.target.value)
                  )
                }
              />
            </label>
            <label className="flex flex-col gap-2">
              <header>End Date and Time:</header>
              <input
                type="datetime-local"
                value={context.endDateTime.toISOString().slice(0, 16)}
                onChange={(e) =>
                  generalChangeHandler("endDateTime", new Date(e.target.value))
                }
              />
            </label>
          </form>
        </section>
        <section>
          {context.questions.map((question, index) => (
            <RenderQuestion key={index} question={question} index={index} />
          ))}
          <button onClick={addQuestionHandler}>Add Question</button>
        </section>
        <button onClick={formSubmitionHandler}>Submit</button>
      </section>
    </PageWithNavbar>
  );
}

function RenderQuestion({
  question,
  index,
}: {
  question: QuestionType;
  index: number;
}) {
  const contextObj = React.useContext(Context);

  if (!contextObj)
    throw new Error("Testpage must be used inside a context provider");

  const { setContext } = contextObj;

  const questionChangeHandler = (index: number, value: string) => {
    setContext((prevContext) => ({
      ...prevContext,
      questions: prevContext.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, statement: value } : question
      ),
    }));
  };

  const addTestCaseHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const newTestCase = { input: "", output: "", visibility: true };

    setContext((prevContext) => ({
      ...prevContext,
      questions: prevContext.questions.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              testCases: [...question.testCases, newTestCase],
            }
          : question
      ),
    }));
  };

  return (
    <div>
      <header>Question {index + 1}</header>
      <form className="flex flex-col gap-8">
        <label className="flex flex-col gap-2">
          <header>Statement:</header>
          <textarea
            onChange={(e) => questionChangeHandler(index, e.target.value)}
            value={question.statement}
          />
        </label>
        <section>
          <header>Testcases:</header>
          {question.testCases.map((testCase, index) => (
            <RenderTestCase
              key={index}
              testCase={testCase}
              questionIndex={index}
              testCaseIndex={index}
            />
          ))}
          <button onClick={addTestCaseHandler}>Add TestCase</button>
        </section>
      </form>
    </div>
  );
}

function RenderTestCase({
  testCase,
  questionIndex,
  testCaseIndex,
}: {
  testCase: TestCaseType;
  questionIndex: number;
  testCaseIndex: number;
}) {
  const contextObj = React.useContext(Context);

  if (!contextObj)
    throw new Error("Test page must be inside a context provider");

  const { setContext } = contextObj;

  const testCaseChangeHandler = (field: string, value: string) => {
    setContext((prevContext) => ({
      ...prevContext,
      questions: prevContext.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              testCases: question.testCases.map((testCase, tcIndex) =>
                tcIndex === testCaseIndex
                  ? { ...testCase, [field]: value }
                  : testCase
              ),
            }
          : question
      ),
    }));
  };

  return (
    <div>
      <label className="flex flex-col gap-2">
        <header>Input:</header>
        <input
          type="text"
          value={testCase.input}
          onChange={(e) => testCaseChangeHandler("input", e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2">
        <header>Output:</header>
        <input
          type="text"
          value={testCase.output}
          onChange={(e) => testCaseChangeHandler("output", e.target.value)}
        />
      </label>
    </div>
  );
}
