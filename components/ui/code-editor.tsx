"use client";
import { Editor } from "@monaco-editor/react";
import { useTestContext } from "../Providers/TestProvider";

interface RenderCodeEditorProps {
  questionNumber: string;
}

export default function RenderCodeEditor({
  questionNumber,
}: Readonly<RenderCodeEditorProps>) {
  const context = useTestContext();

  if (!context) throw new Error("Test context cannot be null");

  const { sourceCodes } = context;

  let questionNo: number = 1;

  try {
    questionNo = parseInt(questionNumber);
  } catch (err) {
    console.error("Question number is not a valid number", err);
  }

  return (
    <section className="h-full">
      <Editor language={sourceCodes[questionNo].language} />
    </section>
  );
}
