"use client";

import React from "react";
import { QuestionType, TestCaseType, TestType } from "@/app/types";
import PageWithNavbar from "@/app/dashboard/_components/PageWithNavbar";

export default function UpsertTestPage({
  testId,
  existingTest,
}: {
  readonly testId: string;
  readonly existingTest?: TestType;
}) {
  let initialTestObject: TestType = {
    name: "Untitled",
    startDateTime: new Date(Date.now()),
    endDateTime: new Date(Date.now() + 60 * 60 * 1000),
    startedAt: null,
    classroomId: testId,
    questions: [],
  };

  if (existingTest) {
    initialTestObject = existingTest;
  }

  const [testState, setTestState] = React.useState(initialTestObject);

  const generalChangeHandler = (field: string, value: any) => {
    setTestState((prevState) => ({ ...prevState, [field]: value }));
  };

  const addQuestionHandler = () => {
    setTestState((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          statement: "Untitled",
          testCases: [],
        },
      ],
    }));
  };

  const formSubmitionHandler = () => {
    //check that the general is not empty
    console.log("context is ", testState);
    if (
      testState.name === "" ||
      testState.startDateTime === null ||
      testState.endDateTime === null
    ) {
      alert("form details are incomplete");
    }

    //check that questions exist
    if (testState.questions.length === 0) alert("no questions given");

    //check that no question has any unfilled entry
    testState.questions.every((question, questionIndex) => {
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
                value={testState.name}
                onChange={(e) => generalChangeHandler("name", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <header>Start Date and Time:</header>
              <input
                type="datetime-local"
                value={testState.startDateTime.toISOString().slice(0, 16)}
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
                value={testState.endDateTime.toISOString().slice(0, 16)}
                onChange={(e) =>
                  generalChangeHandler("endDateTime", new Date(e.target.value))
                }
              />
            </label>
          </form>
        </section>
        <section>
          {testState.questions.map((question, index) => (
            <RenderQuestion
              key={index}
              question={question}
              index={index}
              setTestState={setTestState}
            />
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
  setTestState,
}: {
  readonly question: QuestionType;
  readonly index: number;
  readonly setTestState: React.Dispatch<React.SetStateAction<TestType>>;
}) {
  const questionChangeHandler = (index: number, value: string) => {
    setTestState((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, statement: value } : question
      ),
    }));
  };

  const addTestCaseHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const newTestCase = { input: "", output: "", visibility: true };

    setTestState((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, questionIndex) =>
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
              setTestState={setTestState}
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
  setTestState,
}: {
  readonly testCase: TestCaseType;
  readonly questionIndex: number;
  readonly testCaseIndex: number;
  readonly setTestState: React.Dispatch<React.SetStateAction<TestType>>;
}) {
  const updateTestCase = (
    testCase: TestCaseType,
    field: string,
    value: string,
    testCaseIndex: number,
    tcIndex: number
  ) => {
    return tcIndex === testCaseIndex
      ? { ...testCase, [field]: value }
      : testCase;
  };

  const updateQuestion = (
    question: QuestionType,
    field: string,
    value: string,
    questionIndex: number,
    testCaseIndex: number,
    qIndex: number
  ) => {
    return qIndex === questionIndex
      ? {
          ...question,
          testCases: question.testCases.map((testCase, tcIndex) =>
            updateTestCase(testCase, field, value, testCaseIndex, tcIndex)
          ),
        }
      : question;
  };

  const testCaseChangeHandler = (field: string, value: string) => {
    setTestState((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, qIndex) =>
        updateQuestion(
          question,
          field,
          value,
          questionIndex,
          testCaseIndex,
          qIndex
        )
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
