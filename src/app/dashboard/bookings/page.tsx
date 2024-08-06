import { Booking } from "@/components/dashboard/booking";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

async function getBookings() {
  return prisma.booking.findMany({
    where: {
      OR: [
        { startDate: { gte: new Date() } },
        { endDate: { gte: new Date() } },
      ],
    },
    include: { room: true },
  });
}

export default async function Home() {
  await verifyAdmin();
  const bookings = await getBookings();

  return (
    <main className="p-4">
      <div className="flex justify-between w-full">
        <h1 className="font-extrabold text-2xl">Bookings</h1>
      </div>

      <div className="flex gap-3 flex-wrap">
        {bookings.map((booking) => (
          <Booking key={booking.id} booking={booking} />
        ))}
      </div>
    </main>
  );
}
