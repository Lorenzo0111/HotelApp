import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  roomId: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  people: z.number().min(1),
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

  const json = await req.json();
  const data = requestSchema.safeParse(json);

  if (
    !data.success ||
    new Date(data.data.startDate) < new Date() ||
    new Date(data.data.endDate) < new Date(data.data.startDate)
  ) {
    return NextResponse.json(
      {
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        roomId: data.data.roomId,
        startDate: new Date(data.data.startDate),
        endDate: new Date(data.data.endDate),
        people: data.data.people,
        userId: req.auth.user.id,
      },
    });

    return NextResponse.json(booking);
  } catch (_) {
    return NextResponse.json(
      {
        error: "Booking failed",
      },
      { status: 400 }
    );
  }
});
