"use server";
import { signIn } from "@/auth";
import db from "@/db";
import bcrypt from "bcryptjs";

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
      10,
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
      err,
    );
    return { success: false, message: "Something went wrong" };
  }
}

//attempts to login using the signIn function from next-auth
export async function loginAction(formData: FormData) {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      newUser: false,
      redirect: false,
    });
    console.log("result is ", result);
    return { success: true };
  } catch (err) {
    if (err.type === "CredentialsSignin") {
      return { success: false, message: err.message };
    } else {
      console.error("the following error occurred while logging in", err);
      return { success: false, message: "Something went wrong" };
    }
  }
}
