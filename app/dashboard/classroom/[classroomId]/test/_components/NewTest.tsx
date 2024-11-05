"use client";

import React from "react";
import { TestType } from "@/app/types";
import Context from "./providers";
import UpsertTestPage from "./UpsertTestPage";

interface Props {
  id: string;
}

export default function NewTest({ id }: Props) {
  const initialContextObject: TestType = {
    name: "Untitled",
    startDateTime: new Date(Date.now()),
    endDateTime: new Date(Date.now() + 60 * 60 * 1000),
    startedAt: null,
    classroomId: id,
    questions: [],
  };

  const [context, setContext] = React.useState(initialContextObject);

  return (
    <Context.Provider value={{ context, setContext }}>
      <div className="flex h-full">
        <UpsertTestPage />
      </div>
    </Context.Provider>
  );
}
