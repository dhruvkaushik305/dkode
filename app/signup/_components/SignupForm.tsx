"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/app/actions";

export default function SignupForm() {
  const router = useRouter();
  //state variable to show the error message
  const [errorMessage, setErrorMessage] = React.useState("");
  //state variable to show the pending state
  const [pending, setPending] = React.useState(false);

  async function submitAction(formData: FormData) {
    setPending(true);
    const response = await createUserAction(formData);
    if (!response?.success) {
      setErrorMessage(response.message);
    }
    router.push("/dashboard");
    setPending(false);
  }

  return (
    <form
      className="p-5 flex flex-col justify-center gap-10"
      action={submitAction}
    >
      <header className="flex flex-col gap-5 items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={170} height={170} />
        </Link>
        <p className="text-4xl font-semibold">Sign Up</p>
      </header>
      <label className="flex flex-col gap-2">
        <header className="font-medium text-xl">Name</header>
        <input
          type="text"
          placeholder="Dhruv Kaushik"
          className="input-box"
          name="name"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <header className="font-medium text-xl">Email</header>
        <input
          type="email"
          placeholder="dhruv@example.com"
          className="input-box"
          name="email"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <header className="font-medium text-xl">Password</header>
        <input
          type="password"
          placeholder="secret"
          className="input-box"
          name="password"
          required
        />
      </label>
      <label className="flex flex-col">
        <header className="font-medium text-xl">Sign up as </header>
        <div className="flex justify-around text-lg">
          <label className="flex gap-2">
            <input
              type="radio"
              name="role"
              value="STUDENT"
              defaultChecked={true}
            />
            <header>Student</header>
          </label>
          <label className="flex gap-2">
            <input type="radio" name="role" value="TEACHER" />
            <header>Teacher</header>
          </label>
        </div>
      </label>
      <button
        className={`gradient-btn ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={pending}
      >
        Signup
      </button>
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      <p>
        Already have an acount?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
