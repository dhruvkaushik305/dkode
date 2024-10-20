import Image from "next/image";
import Link from "next/link";
import React from "react";
export default function LoginForm() {
  async function submitAction(formData: FormData) {
    "use server";
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(rawData);
  }
  return (
    <form
      className="p-8 flex flex-col justify-center gap-7"
      action={submitAction}
    >
      <header className="flex flex-col gap-5 items-center">
        <Image src="/logo.png" alt="logo" width={170} height={170} />
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
      <button className="gradient-btn" type="submit">
        Login
      </button>
      <p>
        Don&apos;t have an acount?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
}
