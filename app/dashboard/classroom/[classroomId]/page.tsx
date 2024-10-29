export default function Page({ params }: { params: { classroomId: string } }) {
  return <div>Classroom Page {params.classroomId}</div>;
}
