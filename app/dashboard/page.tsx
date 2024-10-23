import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <main>
      You&apos;re at the dashboard <br /> {JSON.stringify(session)}
    </main>
  );
}
