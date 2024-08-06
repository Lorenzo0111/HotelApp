"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type DateRange = [Date, Date];

export default function Home() {
  const [dates, setDates] = useState<DateRange>([new Date(), new Date()]);
  const router = useRouter();

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

          const formData = new FormData(e.target as HTMLFormElement);
          const people = formData.get("people");
          if (!dates[0] || !dates[1] || !people) return;

          const startDate = dates[0].toISOString().split("T")[0];
          const endDate = dates[1].toISOString().split("T")[0];

          router.push(
            `/book?startDate=${startDate}&endDate=${endDate}&people=${people}`
          );
        }}
        className="w-1/4 flex gap-3"
      >
        <Input type="number" name="people" min={1} placeholder="People" />
        <Button type="submit">Book</Button>
      </form>
    </main>
  );
}
