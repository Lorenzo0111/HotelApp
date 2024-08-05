import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

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

const requestSchema = z.object({
  name: z.string(),
  capacity: z.number().min(1),
});
export const POST = auth(async (req) => {
  if (!req.auth?.user)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  const userData = await prisma.user.findUnique({
    where: { id: req.auth.user.id },
    select: { admin: true },
  });

  if (!userData?.admin)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  const json = await req.json();
  const data = requestSchema.safeParse(json);

  if (!data.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }

  const room = await prisma.room.create({
    data: {
      name: data.data.name,
      capacity: data.data.capacity,
    },
  });

  return NextResponse.json(room);
});
