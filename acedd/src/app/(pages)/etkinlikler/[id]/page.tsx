import React from "react";
import { Metadata } from "next";
import { EventDetail } from "../components/EventDetail";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  // Burada gerçek uygulamada etkinlik verilerini API'den çekebilirsiniz
  const { id: eventId } = await params;
  
  return {
    title: `Etkinlik Detayı - ${eventId}`,
    description: "Etkinlik detayları ve katılım bilgileri",
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  return <EventDetail eventId={id} />;
}
