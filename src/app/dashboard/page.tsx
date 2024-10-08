import { CreateRoom, Room } from "@/components/dashboard/room";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function verifyAdmin() {
  const session = await auth();
  if (!session) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { admin: true },
  });
  if (!user?.admin) return redirect("/login");
}

async function getRooms() {
  return prisma.room.findMany();
}

export default async function Home() {
  await verifyAdmin();
  const rooms = await getRooms();

  return (
    <main className="p-4">
      <div className="flex justify-between w-full">
        <h1 className="font-extrabold text-2xl">Rooms</h1>

        <div className="flex gap-3">
          <CreateRoom />
          <Button asChild variant="secondary">
            <Link href="/dashboard/bookings">Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {rooms.map((room) => (
          <Room key={room.id} room={room} />
        ))}
      </div>
    </main>
  );
}
