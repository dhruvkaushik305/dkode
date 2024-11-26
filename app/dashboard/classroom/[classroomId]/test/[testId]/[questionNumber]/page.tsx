interface QuestionPageProps {
  params: { classroomId: string; testId: string; questionNumber: string };
}

export default function QuestionPage({ params }: Readonly<QuestionPageProps>) {
  return (
    <main>
      This is the page for {params.classroomId}&apos;s {params.testId} test ka
      question {params.questionNumber}
    </main>
  );
}
