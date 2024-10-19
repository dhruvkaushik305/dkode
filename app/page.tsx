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
        style={{ filter: "blur(4px)", objectFit: "fill" }}
        className="absolute -z-50 h-full w-full"
      />
      <section className="flex-1 flex flex-col gap-10 justify-center items-center">
        <Image src="/logo.png" alt="logo" width={250} height={200} />
        <p className="font-rosario text-3xl lg:text-4xl text-center">
          Your <span className="text-dk-blue">classroom</span>, Your{" "}
          <span className="text-dk-blue">coding lab.</span>
        </p>
        <p className="flex justify-center gap-10 items-center">
          <Link href={"/login"} className="gradient-btn">
            Login
          </Link>
          <Link href={"/signup"} className="gradient-btn">
            Signup
          </Link>
        </p>
      </section>
      <footer className="text-right text-md lg:text-lg w-full">
        Coming soon...
      </footer>
    </main>
  );
}
