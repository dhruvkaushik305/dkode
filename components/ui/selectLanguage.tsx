"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTestContext } from "../Providers/TestProvider";

interface SelectLanguageProps {
  questionNumber: string;
}

export default function SelectLanguage({
  questionNumber,
}: Readonly<SelectLanguageProps>) {
  const context = useTestContext();

  if (!context) throw new Error("Test Context not provided");

  const { changeLanguage } = context;

  let questionNo: number = 1;

  try {
    questionNo = parseInt(questionNumber);
  } catch (err) {
    console.error("Question number is not a valid number", err);
  }

  const languageChangeHandler = (language: string) => {
    changeLanguage(questionNo, language);
  };

  return (
    <Select onValueChange={languageChangeHandler}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cpp">C++</SelectItem>
      </SelectContent>
    </Select>
  );
}
