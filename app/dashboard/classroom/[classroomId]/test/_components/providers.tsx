import { TestType } from "@/app/types";
import React from "react";

interface ProviderProps {
  context: TestType;
  setContext: React.Dispatch<React.SetStateAction<TestType>>;
  selectedNav: string;
  setSelectedNav: React.Dispatch<React.SetStateAction<string>>;
}
const Context = React.createContext<ProviderProps | null>(null);

export default Context;
