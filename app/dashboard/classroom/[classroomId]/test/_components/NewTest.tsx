"use client";

import React, { useContext } from "react";
import { TestType } from "@/app/types";
import Context from "./providers";

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

  const navItems: string[] = ["General"];

  //adding the questions into the navItems
  for (let i = 0; i < context.questions.length; i++) {
    navItems.push("Question " + (i + 1));
  }

  const addQuestionHandler = () => {
    const newQuestions = [
      ...context.questions,
      { statement: "Untitled", testCases: [] },
    ];

    setContext((prevContext) => ({ ...prevContext, questions: newQuestions }));

    //adding an extra 1 because state doesn't update immediately and the length will be the old length
    setSelectedNav("Question " + (context.questions.length + 1));
  };

  const navSelectionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedNav(e.currentTarget.innerText);
  };

  return (
    <nav className="h-full w-[30rem] bg-red-100 flex flex-col gap-5">
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={navSelectionHandler}
          className={`w-full text-lg hover:font-medium cursor-pointer text-center ${item === selectedNav ? "underline" : ""}`}
        >
          {item}
        </div>
      ))}
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
  return <section>Question{index}</section>;
}
