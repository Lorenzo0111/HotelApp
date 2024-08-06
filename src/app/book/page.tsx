"use client";

import { Room } from "@/components/dashboard/room";
import { useFetcher } from "@/components/fetcher";
import { useToast } from "@/components/ui/use-toast";
import type { Room as RoomType } from "@prisma/client";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

export default function Book({
  searchParams: { startDate, endDate, people },
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
    people?: string;
  };
}) {
  const { data: rooms } = useFetcher<RoomType[]>(
    `/api/rooms?startDate=${startDate}&endDate=${endDate}&people=${people}`
  );
  const { toast } = useToast();
  const router = useRouter();

  if (!startDate || !endDate || !people) return redirect("/");

  return (
    <main className="p-4">
      <div className="flex gap-3 flex-wrap">
        {rooms?.map((room) => (
          <Room
            onClick={() => {
              axios
                .post("/api/rooms/book", {
                  roomId: room.id,
                  startDate,
                  endDate,
                  people: parseInt(people),
                })
                .then(() => {
                  toast({
                    title: "Room booked successfully",
                  });

                  router.push("/");
                });
            }}
            key={room.id}
            room={room}
          />
        ))}
      </div>
    </main>
  );
}
