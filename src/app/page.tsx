"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateRange = [Date, Date];

export default function Home() {
  const [dates, setDates] = useState<DateRange>([new Date(), new Date()]);
  const { toast } = useToast();

  return (
    <main className="w-full h-screen flex flex-col gap-3 justify-center items-center">
      <Calendar
        selectRange
        locale="en-US"
        value={dates}
        onChange={(e) => {
          if (Array.isArray(e)) {
            setDates(e as DateRange);
          }
        }}
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const startDate = dates[0].toISOString().split("T")[0];
          const endDate = dates[1].toISOString().split("T")[0];

          const formData = new FormData(e.target as HTMLFormElement);
          axios
            .post("/api/rooms/book", {
              roomId: "todo",
              startDate,
              endDate,
              people: parseInt(formData.get("people") as string),
            })
            .then(() => {
              toast({
                title: "Room booked successfully",
              });
            });
        }}
        className="w-1/4 flex gap-3"
      >
        <Input type="number" min={1} placeholder="People" />
        <Button type="submit">Book</Button>
      </form>
    </main>
  );
}
