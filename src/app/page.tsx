import Login from "@/components/auth/login";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <Login />
    </main>
  );
}
