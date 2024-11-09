"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import {
  createTestAction,
  editTestAction,
  fetchTestAction,
} from "@/app/actions";
import { QuestionType, TestCaseType, TestType } from "@/app/types";
import { toast } from "sonner";
import PageWithNavbar from "@/app/dashboard/_components/PageWithNavbar";
import { Info, Plus, PlusCircle, Trash } from "lucide-react";
import { v4 as uuid } from "uuid";

interface Props {
  params: { classroomId: string };
}

export default function Page({ params }: Readonly<Props>) {
  const searchParams = useSearchParams();

  const testId = searchParams.get("id");

  const [test, setTest] = React.useState<TestType | null>(null);

  React.useEffect(() => {
    if (testId) {
      fetchTestAction(testId!)
        .then((response) => {
          if (response.success) {
            setTest(response.test!);
          }
        })
        .catch((err) => {});
    }
  }, []);

  return (
    <main className="h-full">
      {test ? (
        <UpsertTestPage classroomId={params.classroomId} existingTest={test!} />
      ) : (
        <UpsertTestPage classroomId={params.classroomId} />
      )}
    </main>
  );
}

interface UpsertTestPageProps {
  classroomId: string;
  existingTest?: TestType;
}

function UpsertTestPage({
  classroomId,
  existingTest,
}: Readonly<UpsertTestPageProps>) {
  const router = useRouter();

  const pathName = usePathname();

  const initialTestObject = existingTest ?? {
    name: "Untitled",
    startDateTime: new Date(Date.now()),
    endDateTime: new Date(Date.now() + 60 * 60 * 1000),
    startedAt: null,
    classroomId: classroomId,
    questions: [],
  };

  const [testState, setTestState] = React.useState<TestType>(initialTestObject);

  console.log("initially it was", initialTestObject);
  console.log("state variable is", testState);

  const generalChangeHandler = (field: string, value: any) => {
    setTestState((prevState) => ({ ...prevState, [field]: value }));
  };

  const addQuestionHandler = () => {
    setTestState((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          id: uuid(),
          statement: "Untitled",
          testCases: [],
        },
      ],
    }));
  };

  const formSubmitionHandler = async () => {
    //check that the general is not empty
    if (
      testState.name === "" ||
      testState.startDateTime === null ||
      testState.endDateTime === null
    ) {
      toast.error("General Options in the form are incomplete");
      return;
    }

    //check that the startTime is before the endTime
    if (testState.startDateTime > testState.endDateTime) {
      toast.error("End date&time must be after the Start date&time");
      return;
    }

    //check that questions exist
    if (testState.questions.length === 0) {
      toast.error("No questions provided");
      return;
    }

    // check that no question has any unfilled entry
    const questionsValid = testState.questions.every(
      (question, questionIndex) => {
        if (question.statement === "") {
          toast.error(`No statement in question ${questionIndex + 1}`);
          return false;
        }
        if (question.testCases.length === 0) {
          toast.error(`No test cases in question ${questionIndex + 1}`);
          return false;
        }
        const testCasesValid = question.testCases.every(
          (testCase, testCaseIndex) => {
            if (testCase.input === "" || testCase.output === "") {
              toast.error(
                `Case ${testCaseIndex + 1} of question ${
                  questionIndex + 1
                } is incomplete`
              );
              return false;
            }
            return true;
          }
        );

        if (testCasesValid) return true;
        else return false;
      }
    );

    if (questionsValid) {
      if (testState.id) {
        //an existing test, update the contents
        const query = await editTestAction(
          testState.classroomId,
          testState.id,
          testState
        );
        if (query.success) {
          //redirect to the test page
          const newUrl = pathName.split("/").slice(0, 5).join("/");
          router.push(newUrl);
        } else {
          toast.error(query.message);
        }
      } else {
        //create a new test
        const query = await createTestAction(testState.classroomId, testState);
        console.log("result of query is", query);
        if (query.success) {
          //redirect to the test page
          const newUrl = pathName.split("/").slice(0, 4).join("/");
          router.push(newUrl);
        } else {
          toast.error(query.message);
        }
      }
    }
  };

  return (
    <PageWithNavbar>
      <section className="p-5 h-full flex flex-col gap-5 items-center">
        <section className="flex flex-col gap-5 w-full">
          <header className="font-medium border-b border-gray-300 text-3xl p-2">
            General Options
          </header>
          <form className="flex flex-col gap-7">
            <label className="flex flex-col gap-2">
              <header className="font-medium text-xl">Name:</header>
              <input
                type="text"
                value={testState.name}
                onChange={(e) => generalChangeHandler("name", e.target.value)}
                className="input-box"
              />
            </label>
            <div className="flex items-center gap-3">
              <label className="flex flex-col gap-2 w-full">
                <header className="font-medium text-xl">
                  Start Date and Time:
                </header>
                <input
                  type="datetime-local"
                  value={testState.startDateTime.toISOString().slice(0, 16)}
                  className="input-box"
                  onChange={(e) =>
                    generalChangeHandler(
                      "startDateTime",
                      new Date(e.target.value)
                    )
                  }
                />
              </label>
              <label className="flex flex-col gap-2 w-full">
                <header className="font-medium text-xl">
                  End Date and Time:
                </header>
                <input
                  type="datetime-local"
                  className="input-box"
                  value={testState.endDateTime.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    generalChangeHandler(
                      "endDateTime",
                      new Date(e.target.value)
                    )
                  }
                />
              </label>
            </div>
          </form>
        </section>
        <section className="w-full flex flex-col gap-3">
          {testState.questions.map((question, index) => (
            <RenderQuestion
              key={question.id}
              question={question}
              index={index}
              setTestState={setTestState}
            />
          ))}
          <button
            onClick={addQuestionHandler}
            className="border-2 border-dotted p-2 px-4 rounded-md border-blue-400 text-gray-600 flex gap-2 items-center w-fit"
          >
            Question <PlusCircle size={18} color="blue" />
          </button>
        </section>
        <button
          onClick={formSubmitionHandler}
          className="bg-black text-white p-2 rounded-xl w-1/2"
        >
          {testState.id ? "Update" : "Create"}
        </button>
      </section>
    </PageWithNavbar>
  );
}

function RenderQuestion({
  question,
  index,
  setTestState,
}: Readonly<{
  question: QuestionType;
  index: number;
  setTestState: React.Dispatch<React.SetStateAction<TestType>>;
}>) {
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

    const newTestCase = { id: uuid(), input: "", output: "", visibility: true };

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

  const questionDeletionHandler = () => {
    setTestState((prevState) => ({
      ...prevState,
      questions: prevState.questions.filter(
        (_, questionIndex) => questionIndex != index
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="font-medium border-b border-gray-300 text-2xl p-2 flex justify-between items-center">
        Question {index + 1}
        <Trash onClick={questionDeletionHandler} className="cursor-pointer" />
      </header>
      <form className="flex flex-col gap-8">
        <label className="flex flex-col gap-2">
          <header className="font-medium text-xl">Statement:</header>
          <textarea
            onChange={(e) => questionChangeHandler(index, e.target.value)}
            value={question.statement}
            className="input-box"
          />
        </label>
        <section className="flex flex-col gap-3">
          <header className="font-medium text-xl">Testcases:</header>
          {question.testCases.map((testCase, tcIndex) => (
            <RenderTestCase
              key={testCase.id}
              testCase={testCase}
              questionIndex={index}
              testCaseIndex={tcIndex}
              setTestState={setTestState}
            />
          ))}
          <button
            onClick={addTestCaseHandler}
            className="border-2 border-dotted p-2 px-4 rounded-md border-green-400 text-gray-600 flex gap-2 items-center w-fit"
          >
            TestCase <Plus size={18} color="green" />{" "}
          </button>
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
}: Readonly<{
  testCase: TestCaseType;
  questionIndex: number;
  testCaseIndex: number;
  setTestState: React.Dispatch<React.SetStateAction<TestType>>;
}>) {
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

  const testCaseDeletionHandler = () => {
    setTestState((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              testCases: q.testCases.filter(
                (_, tcIndex) => tcIndex !== testCaseIndex
              ),
            }
          : q
      ),
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <header className="flex justify-between items-center">
        Case {testCaseIndex + 1}{" "}
        <Trash onClick={testCaseDeletionHandler} className="cursor-pointer" />
      </header>
      <label className="flex flex-col gap-2">
        <header className="font-medium text-xl ">Input:</header>
        <input
          type="text"
          value={testCase.input.replace(/ /g, "_")}
          onChange={(e) => testCaseChangeHandler("input", e.target.value)}
          className="input-box"
        />
        <p className="text-sm italic flex items-center gap-2">
          <Info size={15} /> _ denotes space
        </p>
      </label>
      <label className="flex flex-col gap-2">
        <header className="font-medium text-xl">Output:</header>
        <input
          type="text"
          value={testCase.output}
          onChange={(e) => testCaseChangeHandler("output", e.target.value)}
          className="input-box"
        />
        <p className="text-sm italic flex items-center gap-2">
          <Info size={15} /> _ denotes space
        </p>
      </label>
    </div>
  );
}
