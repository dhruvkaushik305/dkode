"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAction } from "../actions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  //state variable to show the error message
  const [errorMessage, setErrorMessage] = React.useState("");
  //state variable to show the pending state
  const [pending, setPending] = React.useState(false);

  async function submitAction(formData: FormData) {
    setPending(true);
    const response = await loginAction(formData);
    if (!response?.success) {
      setErrorMessage(response?.message);
    }
    router.push("/dashboard");
    setPending(false);
  }

  return (
    <form
      className="p-5 flex flex-col justify-center gap-7"
      action={submitAction}
    >
      <header className="flex flex-col gap-5 items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={170} height={170} />
        </Link>
        <p className="text-4xl font-semibold">Login</p>
      </header>
      <label>
        <header className="font-medium text-lg">Email</header>
        <input
          type="email"
          placeholder="dhruv@example.com"
          className="input-box"
          name="email"
          required
        />
      </label>
      <label>
        <header className="font-medium text-lg">Password</header>
        <input
          type="password"
          placeholder="secret"
          className="input-box"
          name="password"
          required
        />
      </label>
      <button
        className={`gradient-btn ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={pending}
      >
        Login
      </button>
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      <p>
        Don&apos;t have an acount?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
}
