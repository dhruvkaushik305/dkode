"use server";
import { auth, signIn } from "@/auth";
import db from "@/db";
import bcrypt from "bcryptjs";
import { TestType } from "./types";

export async function createUserAction(formData: FormData) {
  try {
    //check if the user already exists
    const queryUser = await db.user.findUnique({
      where: {
        email: formData.get("email") as string,
      },
    });
    if (queryUser) {
      return {
        success: false,
        message: "A user with this email already exists",
      };
    }
    //hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(
      formData.get("password") as string,
      10
    );
    //add the user to the db
    const queryCreateUser = await db.user.create({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: hashedPassword,
        role: formData.get("role") as "STUDENT" | "TEACHER",
      },
    });
    if (queryCreateUser) {
      //send the user to signin via nextauth
      await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        newUser: true,
        redirect: false,
      });
      return { success: true, message: "User created successfully" };
    } else {
      console.error("Failed to create a user");
      return { success: false, message: "Failed to create a user" };
    }
  } catch (err) {
    console.error(
      "the following error occurred while creating a new user",
      err
    );
    return { success: false, message: "Something went wrong" };
  }
}

interface ErrType {
  NotAuthorized: string;
  type: string;
  kind: string;
  code: string;
  message: string;
}

//when siginIssue is raised, the general object is like
// NotAuthorized: message with a callback trace
// type: 'CredentialsSignin'
// kind: 'signIn'
// code: 'credentials'
// message: CredentialsSignin: The email or password entered is incorrect

//attempts to login using the signIn function from next-auth
export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      newUser: false,
      redirect: false,
    });

    return { success: true, message: "Login completed" };
  } catch (err) {
    const error = err as ErrType;

    if (error.type === "CredentialsSignin") {
      return { success: false, message: error.message };
    } else {
      console.error("the following error occurred while logging in", error);
      return { success: false, message: "Something went wrong" };
    }
  }
}

export async function createClassroomAction(name: string) {
  const session = await auth();

  if (!session) return { success: false, message: "Unauthorised" };

  try {
    const query = await db.classroom.create({
      data: {
        name,
        creatorId: session.user.id,
        teachers: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return {
      success: true,
      message: "Classroom invite copied to clipboard",
      id: query.id,
    };
  } catch (err) {
    console.error(
      "The following error occured while creating a new classroom",
      err
    );
    return { success: false, message: "Something went wrong" };
  }
}

//TODO add a check that specific actions are only called by teachers
export async function createTestAction(
  classroomId: string,
  testData: TestType
) {
  const session = await auth();

  if (!session) return { success: false, message: "Unauthorised" };

  try {
    const newTest = await db.test.create({
      data: {
        name: testData.name,
        startDateTime: testData.startDateTime,
        endDateTime: testData.endDateTime,
        questions: {
          create: testData.questions.map((question) => ({
            statement: question.statement,
            testCases: {
              create: question.testCases,
            },
          })),
        },
        classroomId,
      },
    });
    console.log("result of test creation", newTest);
    return { success: true, message: "Test Created" };
  } catch (err) {
    console.error("The following error occured while createing a test", err);
    return { success: false, message: "Something went wrong" };
  }
}

export async function editTestAction(
  classroomId: string,
  testId: string,
  testData: TestType
) {
  const session = await auth();

  if (!session) return { success: false, message: "Unauthorised" };

  try {
    const editedTest = await db.test.update({
      where: {
        id: testId,
      },
      data: {
        name: testData.name,
        startDateTime: testData.startDateTime,
        endDateTime: testData.endDateTime,
        questions: {
          deleteMany: {
            testId: testId,
            id: { notIn: testData.questions.map((q) => q.id!) },
          },
          upsert: testData.questions.map((question) => ({
            where: { id: question.id },
            create: {
              statement: question.statement,
              testCases: {
                create: question.testCases,
              },
            },
            update: {
              statement: question.statement,
              testCases: {
                deleteMany: {
                  questionId: question.id,
                  id: { notIn: question.testCases.map((tc) => tc.id!) },
                },
                upsert: question.testCases.map((testCase) => ({
                  where: { id: testCase.id },
                  create: {
                    input: testCase.input,
                    output: testCase.output,
                  },
                  update: {
                    input: testCase.input,
                    output: testCase.output,
                  },
                })),
              },
            },
          })),
        },
        classroomId,
      },
    });
    return { success: true, message: "Test Updated" };
  } catch (err) {
    console.error("The following error occured while editing the test", err);
    return { success: false, message: "Something went wrong" };
  }
}
