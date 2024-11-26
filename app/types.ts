export type ClassroomType = {
  id: string;
  name: string;
  createdAt: Date;
  creatorId: string;
};

export type ClassroomWithStudentType = ClassroomType & {
  students: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    role: "STUDENT" | "TEACHER"
  }[]
}

export type TestType = {
  id?: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  startedAt: Date | null;
  classroomId: string;
  questions: QuestionType[];
};

export type QuestionType = {
  id: string;
  statement: string;
  testId?: string;
  testCases: TestCaseType[];
};

export type TestCaseType = {
  id: string;
  input: string;
  output: string;
  visibility: boolean;
  questionId?: string;
};

export type SourceCodeType = {
  language: string,
  code: string
}