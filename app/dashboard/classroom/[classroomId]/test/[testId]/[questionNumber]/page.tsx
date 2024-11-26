import { TestCaseType } from "@/app/types";
import RenderCodeEditor from "@/components/ui/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SelectLanguage from "@/components/ui/selectLanguage";
import db from "@/db";

interface QuestionPageProps {
  params: { classroomId: string; testId: string; questionNumber: string };
}

export default async function QuestionPage({
  params,
}: Readonly<QuestionPageProps>) {
  return (
    <main className="h-full flex flex-col overflow-hidden">
      <Header questionNumber={params.questionNumber}></Header>
      <ResizablePanelGroup direction="horizontal" className="grow">
        <ResizablePanel>
          <RenderQuestion
            questionNumber={params.questionNumber}
            testId={params.testId}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <RenderCodeEditor questionNumber={params.questionNumber} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

interface HeaderProps {
  questionNumber: string;
}

function Header({ questionNumber }: Readonly<HeaderProps>) {
  return (
    <header className="h-[4rem] flex items-center border-b border-gray-200 justify-between px-20">
      <h2 className="text-3xl">Question {questionNumber}</h2>
      <SelectLanguage questionNumber={questionNumber} />
    </header>
  );
}

interface RenderQuestionProps {
  testId: string;
  questionNumber: string;
}

async function RenderQuestion({
  testId,
  questionNumber,
}: Readonly<RenderQuestionProps>) {
  let questionContent = null;

  let questionNo: number = 1;

  try {
    questionNo = parseInt(questionNumber);
  } catch (err) {
    console.error("Question number is not a valid number", err);
  }

  try {
    const query = await db.test.findUnique({
      where: {
        id: testId,
      },
      include: {
        questions: {
          include: {
            testCases: true,
          },
        },
      },
    });

    if (!query) throw new Error("why wasn't the testId verified by now");

    questionContent = query.questions[questionNo - 1]; //TODO There must be a way to do this better
  } catch (err) {
    console.error("Couldn't fetch the questions", err);
  }
  return (
    <section className="space-y-8 h-full overflow-y-auto overflow-x-hidden">
      <div className="p-4">
        <header className="text-3xl">Statement</header>
        <article className="text-lg">{questionContent?.statement}</article>
      </div>
      <div className="p-4 space-y-5">
        <header className="text-2xl">Test Cases</header>
        {questionContent?.testCases.map(
          (testCase) =>
            testCase.visibility && (
              <RenderTestCase key={testCase.id} testCase={testCase} />
            )
        )}
      </div>
    </section>
  );
}

interface RenderTestCaseProps {
  testCase: TestCaseType;
}

function RenderTestCase({ testCase }: Readonly<RenderTestCaseProps>) {
  return (
    <div className="space-y-2 border border-gray-200 p-2 rounded-md">
      <div>
        <h2 className="font-medium">Input</h2>
        <p>{testCase.input}</p>
      </div>
      <div>
        <h2 className="font-medium">Output</h2>
        <p>{testCase.output}</p>
      </div>
    </div>
  );
}
