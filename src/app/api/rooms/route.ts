import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const rooms = await prisma.room.findMany({
    include: {
      bookings: {
        where: {
          AND: [
            {
              startDate: {
                gte: new Date(),
              },
            },
            {
              endDate: {
                lte: new Date(),
              },
            },
            {
              approved: true,
            },
          ],
        },
      },
    },
  });

  return NextResponse.json(
    rooms.map((room) => ({
      ...room,
      bookings: undefined,
      available: room.bookings.length === 0,
    }))
  );
};
