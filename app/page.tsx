import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full flex flex-col lg:gap-10 gap-5 justify-center items-center ">
      <section className="flex-1 flex flex-col gap-10 justify-center items-center">
        <Image src="/logo.png" alt="logo" width={250} height={200} />
        <p className="font-rosario text-3xl lg:text-4xl text-center">
          Your <span className="text-dk-blue">classroom</span>, Your{" "}
          <span className="text-dk-blue">coding lab.</span>
        </p>
      </section>
      <footer className="text-right text-md lg:text-lg w-full">
        Coming soon...
      </footer>
    </main>
  );
}
