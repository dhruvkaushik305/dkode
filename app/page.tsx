import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full flex flex-col lg:gap-10 gap-5 justify-center items-center ">
      <Image
        src="/heroImage.jpg"
        alt="hero image"
        width={400}
        height={400}
        style={{ filter: "blur(6px)", objectFit: "fill" }}
        className="absolute -z-50 h-full w-full"
      />
      <Navbar />
      <section className="grow flex flex-col gap-10 justify-center items-center">
        <p className="text-5xl font-bold lg:text-6xl text-center">
          Streamline your{" "}
          <span className="bg-gradient-to-t from-blue-800 to-blue-500 text-transparent bg-clip-text">
            coding
          </span>{" "}
          classroom
        </p>
        <p className="text-2xl font-medium text-center max-w-[55%]">
          Our coding assessment platform simplifies the process of creating,
          administering, and grading coding assessments, saving teachers time
          and effort.
        </p>
        <GettingStartedButton />
      </section>
      <footer className="text-right text-md lg:text-lg w-full">
        Coming soon...
      </footer>
    </main>
  );
}

async function Navbar() {
  //fetch the user session
  const session = await auth();

  const navButtons = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/signup" },
  ];
  return (
    <nav className="flex justify-around items-center w-full bg-white/70 p-2">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={170} height={100} />
      </Link>
      <section className="flex justify-center items-center gap-5">
        {!session ? ( //show the login, register buttons if the user is not logged in
          navButtons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              className="border-b border-white transition-colors hover:border-zinc-500 duration-300"
            >
              {button.name}
            </Link>
          ))
        ) : (
          //show the dashboard button if the user is logged in
          <Link
            href="/dashboard"
            className="border-b border-white transition-colors hover:border-zinc-500 duration-300"
          >
            Dashboard
          </Link>
        )}
      </section>
    </nav>
  );
}

async function GettingStartedButton() {
  //fetch the user session
  const session = await auth();
  return (
    <>
      {!session ? ( //show the get started button if the user is not logged in
        <Link
          href="/signup"
          className="bg-gradient-to-l from-blue-800 to-blue-500 text-white py-3 px-6 rounded-lg text-xl"
        >
          Get Started
        </Link>
      ) : (
        //show the dashboard button if the user is logged in
        <Link
          href="/dashboard"
          className="bg-gradient-to-l from-blue-800 to-blue-500 text-white py-3 px-6 rounded-lg text-xl"
        >
          Dashboard
        </Link>
      )}
    </>
  );
}
