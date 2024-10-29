export type ClassroomType = {
  id: string;
  name: string;
  createdAt: Date;
  creatorId: string;
};

export type TestType = {
  id: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  startedAt: Date | null;
  classroomId: string;
};
