import { TestType } from "@/app/types";
import React from "react";

interface ProviderProps {
  contextRef: React.MutableRefObject<TestType>;
}

const Context = React.createContext<ProviderProps | null>(null);

export default Context;
