import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <header>The requested resource cannot be found</header>
      <header>Make sure you don&apos;t have any typos in the url</header>
      <Link href="/dashboard">Take me back Home</Link>
    </main>
  );
}
