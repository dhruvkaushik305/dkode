"use client";

import React from "react";
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

  const contextRef = React.useRef(initialContextObject);

  return (
    <Context.Provider value={{ contextRef }}>
      <Sidebar />
      <DisplayPanel />
    </Context.Provider>
  );
}

function Sidebar() {
  return <nav></nav>;
}

function DisplayPanel() {
  return <section></section>;
}
