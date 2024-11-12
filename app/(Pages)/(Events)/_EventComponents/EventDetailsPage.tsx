"use client";

import React from "react";
import EventDetails from "./EventDetails";

interface EventDetailsPageProps {
    eventId: string;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ eventId }) => {
    console.log(eventId);

    return (
        <main className="overflow-x-hidden">
            <EventDetails />
        </main>
    );
};

export default EventDetailsPage;
