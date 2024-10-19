import Image from "next/image";
import Link from "next/link";

export default function SignupForm() {
  async function submitAction(formData: FormData) {
    "use server";
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };
    console.log(rawData);
  }

  return (
    <form
      className="p-5 rounded-xl border border-zinc-300 flex flex-col justify-center gap-10"
      action={submitAction}
    >
      <header className="flex flex-col gap-5 items-center">
        <Image src="/logo.png" alt="logo" width={170} height={170} />
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
              value="student"
              defaultChecked={true}
            />
            <header>Student</header>
          </label>
          <label className="flex gap-2">
            <input type="radio" name="role" value="teacher" />
            <header>Teacher</header>
          </label>
        </div>
      </label>
      <button className="gradient-btn" type="submit">
        Signup
      </button>
      <p>
        Already have an acount?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
