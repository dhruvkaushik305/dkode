import Image from "next/image";
import SignupForm from "../_components/SignupForm";

export default function Login() {
  return (
    <main className="h-full grid grid-cols-5 grid-rows-1">
      <section className="col-span-3 flex rounded-xl flex-col gap-20 justify-center p-6 h-full w-[80%] mx-auto">
        <SignupForm />
      </section>
      <section className="col-span-2 h-full flex flex-col justify-center">
        <Image
          src="/signupImage.jpg"
          alt="signup vector image"
          width={400}
          height={400}
          style={{ width: "100%", height: "auto" }}
          className="w-full h-full"
        />
        <p className="w-full flex items-center justify-center text-3xl italic font-medium">
          &quot;Give your students the confidence to code&quot;
        </p>
      </section>
    </main>
  );
}