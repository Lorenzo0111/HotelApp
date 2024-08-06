import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams;
  const startDate =
    query.get("startDate") || new Date().toISOString().split("T")[0];
  const endDate =
    query.get("endDate") || new Date().toISOString().split("T")[0];
  const people = query.get("people") || "0";

  const rooms = await prisma.room.findMany({
    where: {
      capacity: { gte: parseInt(people) },
      bookings: {
        none: {
          AND: [
            { startDate: { lte: new Date(endDate) } },
            { endDate: { gte: new Date(startDate) } },
          ],
        },
      },
    },
  });

  return NextResponse.json(rooms);
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
