"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const data = [
  {
    id: 1,
    name: "Student Discounts",
    path: "/events/01studentDiscount.jpg",
  },
  {
    id: 2,
    name: "Christmas",
    path: "/events/02christmasTree.jpg",
  },
  {
    id: 3,
    name: "Valentine's Day",
    path: "/events/03valentinesDay.jpg",
  },
  {
    id: 4,
    name: "President's Day",
    path: "/events/04presidentsDay.jpg",
  },
  {
    id: 5,
    name: "Easter",
    path: "/events/05easter.jpg",
  },
  {
    id: 6,
    name: "Mother's Day",
    path: "/events/06mothersDay.jpg",
  },
  {
    id: 7,
    name: "Memorial Day",
    path: "/events/07memorialDay.jpg",
  },
  {
    id: 8,
    name: "Father's Day",
    path: "/events/08fathersDay.jpg",
  },
  {
    id: 9,
    name: "4th of July",
    path: "/events/09_4thOfJuly.jpg",
  },
  {
    id: 10,
    name: "Back to School",
    path: "/events/10backToSchool.jpg",
  },
  {
    id: 11,
    name: "Labor Day",
    path: "/events/11laborDay.jpg",
  },
  {
    id: 12,
    name: "Halloween",
    path: "/events/12halloween.jpg",
  },
  {
    id: 13,
    name: "Thanksgiving Day",
    path: "/events/13thanksgivingDay.jpg",
  },
  {
    id: 14,
    name: "Cyber Monday",
    path: "/events/14cyberMonday.jpg",
  },
  {
    id: 15,
    name: "Black Friday",
    path: "/events/15blackFriday.jpg",
  },
  {
    id: 16,
    name: "Veterans Day",
    path: "/events/16veteransDay.jpg",
  },
];

const EventDisplay = () => {
  return (
    <div className="mt-6 min-h-[30vh] w-full rounded-md bg-[#f2f0e6] p-4 dark:bg-accent">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((event) => (
          <div
            key={event.id}
            className="flex max-w-72 flex-col items-center gap-4 rounded-md bg-popover p-4 shadow-md sm:max-w-80 lg:max-w-full py-4"
          >
            <h2 className="mt-2 text-lg font-semibold">{event.name}</h2>
            <Image
              src={event.path}
              alt={event.name}
              width={600}
              height={600}
              className="w-36 h-36 object-cover mt-5"
            />
            <Button
              className="w-full rounded-lg bg-app-main hover:bg-app-main mt-5"
              asChild
            >
              <Link href={`/events/${event.id}`}>Reveal Deals</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDisplay;
