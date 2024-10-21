"use server";
import db from "@/app/db";
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
      //sign the user in
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
