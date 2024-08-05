import type { Room } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function Room({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>
          <span className="font-bold">{room.capacity}</span> people
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
