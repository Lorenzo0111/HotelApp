"use client";

import type { Room } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function Room({ room }: { room: Room }) {
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

export function CreateRoom() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new room</DialogTitle>
          <DialogDescription>Create a new room</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const data = new FormData(e.target as HTMLFormElement);
            const name = data.get("name") as string;
            const capacity = parseInt(data.get("capacity") as string);

            axios
              .post(`/api/rooms`, {
                name,
                capacity,
              })
              .then(() => {
                window.location.reload();
              })
              .catch((error) => {
                alert(error.response.data.error);
              });
          }}
        >
          <div className="flex flex-col gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Example" />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                placeholder="0"
                type="number"
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="mt-3" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
