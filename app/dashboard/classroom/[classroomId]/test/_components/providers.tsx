import { TestType } from "@/app/types";
import React from "react";

interface ProviderProps {
  context: TestType;
  setContext: React.Dispatch<React.SetStateAction<TestType>>;
}

const Context = React.createContext<ProviderProps | null>(null);

export default Context;
