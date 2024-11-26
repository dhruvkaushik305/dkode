"use client";

import { SourceCodeType } from "@/app/types";
import React from "react";

interface TestContextProps {
  sourceCodes: SourceCodeType[];
  saveCode: (questionNumber: number, newSourceCode: string) => void;
  changeLanguage: (questionNumber: number, newLanguage: string) => void;
}

const TestContext = React.createContext<TestContextProps | null>(null);

interface TestProviderProps {
  children: React.ReactNode;
}

export function TestProvider({ children }: Readonly<TestProviderProps>) {
  const [sourceCodes, setSourceCodes] = React.useState<SourceCodeType[]>([
    { language: "cpp", code: "" },
    { language: "cpp", code: "" },
  ]); //FIXME there should be logic to define this

  const saveCode = (questionNumber: number, newSourceCode: string) => {
    setSourceCodes((prev) => {
      prev[questionNumber]["code"] = newSourceCode;
      return prev;
    });
  };

  const changeLanguage = (questionNumber: number, newLanguage: string) => {
    setSourceCodes((prev) => {
      prev[questionNumber]["language"] = newLanguage;
      return prev;
    });
  };

  return (
    <TestContext.Provider value={{ sourceCodes, saveCode, changeLanguage }}>
      {children}
    </TestContext.Provider>
  );
}

export const useTestContext = () => React.useContext(TestContext);
