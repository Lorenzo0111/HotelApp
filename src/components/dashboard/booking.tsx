"use client";

import type { Booking as BookingType, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import axios from "axios";

export function Booking({
  booking,
}: {
  booking: BookingType & {
    room: Room;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="w-full flex">
          {booking.room.name}{" "}
          <span className="ml-auto text-sm">
            {booking.approved ? "Approved" : "Pending"}
          </span>
        </CardTitle>
        <CardDescription>
          <span className="font-bold">{booking.people}</span> people
          <br />
          {new Date(booking.startDate).toLocaleString("en-US")} -{" "}
          {new Date(booking.endDate).toLocaleString("en-US")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full gap-3">
        <Button
          onClick={() => {
            axios.post(`/api/bookings/${booking.id}/approve`).then(() => {
              window.location.reload();
            });
          }}
          className="w-full"
          disabled={booking.approved}
        >
          Approve
        </Button>
        <Button
          onClick={() => {
            axios.post(`/api/bookings/${booking.id}/deny`).then(() => {
              window.location.reload();
            });
          }}
          className="w-full"
          variant="destructive"
          disabled={booking.approved}
        >
          Deny
        </Button>
      </CardContent>
    </Card>
  );
}
