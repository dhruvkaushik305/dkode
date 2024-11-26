"use client";

import React from "react";

interface TestContextProps {
  sourceCodes: string[];
  saveCode: (questionNumber: number, newSourceCode: string) => void;
}

const TestContext = React.createContext<TestContextProps | null>(null);

interface TestProviderProps {
  children: React.ReactNode;
}

export function TestProvider({ children }: Readonly<TestProviderProps>) {
  const [sourceCodes, setSourceCodes] = React.useState<string[]>([]);

  const saveCode = (questionNumber: number, newSourceCode: string) => {
    setSourceCodes((prev) => {
      prev[questionNumber] = newSourceCode;
      return prev;
    });
  };

  return (
    <TestContext.Provider value={{ sourceCodes, saveCode }}>
      {children}
    </TestContext.Provider>
  );
}

export const useTestContext = () => React.useContext(TestContext);
