import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async (req, { params }) => {
  if (!req.auth?.user)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  if (!params?.id || typeof params.id !== "string")
    return NextResponse.json(
      {
        error: "Invalid booking ID",
      },
      {
        status: 400,
      }
    );

  const user = await prisma.user.findUnique({
    where: {
      id: req.auth.user.id,
    },
    select: {
      admin: true,
    },
  });

  if (!user?.admin)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  await prisma.booking.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({ success: true });
});
