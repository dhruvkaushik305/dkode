"use client";

import React, { useContext } from "react";
import { TestType } from "@/app/types";
import Context from "./providers";
import { Trash } from "lucide-react";

interface Props {
  id: string;
}

export default function NewTest({ id }: Props) {
  const initialContextObject: TestType = {
    name: "Untitled",
    startDateTime: new Date(Date.now()),
    endDateTime: new Date(Date.now()),
    startedAt: null,
    classroomId: id,
    questions: [],
  };

  const [context, setContext] = React.useState(initialContextObject);

  const [selectedNav, setSelectedNav] = React.useState<string>("General");

  return (
    <Context.Provider
      value={{ context, setContext, selectedNav, setSelectedNav }}
    >
      <div className="flex h-full">
        <Sidebar />
        <DisplayPanel />
      </div>
    </Context.Provider>
  );
}

function Sidebar() {
  const { context, setContext, selectedNav, setSelectedNav } =
    useContext(Context);

  //memoising this computation
  const navItems = React.useMemo(() => {
    const items = ["General"]; //if this name is changed, change the conditional condition in the trash icon

    //adding the context questions into the navItems
    for (let i = 0; i < context.questions.length; i++) {
      items.push("Question " + (i + 1));
    }

    return items;
  }, [context.questions]);

  const addQuestionHandler = React.useCallback(() => {
    const newQuestions = [
      ...context.questions,
      { statement: "Untitled", testCases: [] },
    ];

    setContext((prevContext) => ({ ...prevContext, questions: newQuestions }));

    //adding an extra 1 because state doesn't update immediately and the length will be the old length
    setSelectedNav("Question " + (context.questions.length + 1));
  }, [context.questions, setContext, setSelectedNav]);

  const navSelectionHandler = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setSelectedNav(e.currentTarget.innerText);
    },
    [setSelectedNav],
  );

  const deleteNavItemHandler = React.useCallback(
    (indexOfQuestion: number) => {
      //this index is 1-based because the 0th item is "General"
      const newQuestions = context.questions.filter(
        (question, index) => index !== indexOfQuestion - 1,
      );

      //the questions are re-named according to their order because of the for loop that adds questions into the navItems
      setContext((prevContext) => ({
        ...prevContext,
        questions: newQuestions,
      }));
    },
    [setContext, context.questions],
  );

  return (
    <nav className="h-full w-[30rem] flex flex-col gap-5">
      {navItems.map((item, index) => {
        const deletetionHandler = () => deleteNavItemHandler(index);
        return (
          <div
            key={index}
            onClick={navSelectionHandler}
            className={`w-full p-2 text-lg hover:font-medium cursor-pointer flex items-center justify-between text-center ${item === selectedNav ? "underline" : ""}`}
          >
            {item} {item !== "General" && <Trash onClick={deletetionHandler} />}
          </div>
        );
      })}
      <button
        className="text-blue-500 hover:underline"
        onClick={addQuestionHandler}
      >
        Add Question
      </button>
    </nav>
  );
}

function DisplayPanel() {
  const { selectedNav } = useContext(Context);

  let questionNumber: number | null = null;

  if (selectedNav !== "General") {
    questionNumber = parseInt(selectedNav.split(" ")[1]);
  }
  return (
    <>
      {questionNumber ? (
        <QuestionsPage index={questionNumber} />
      ) : (
        <GeneralPage />
      )}
    </>
  );
}

function GeneralPage() {
  return (
    <section className="bg-red-200 h-full w-full">General settings</section>
  );
}

function QuestionsPage({ index }: { index: number }) {
  return (
    <section className="bg-red-200 h-full w-full">Question {index}</section>
  );
}
