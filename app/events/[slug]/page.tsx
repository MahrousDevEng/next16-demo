import Image from "next/image";
import { notFound } from "next/navigation";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { BookEvent } from "@/components/book-event";
import type { IEvent } from "@/database";
import { EventCard } from "@/components/event-card";

interface EventDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { slug } = await params;

  let event;

  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/events/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }

      throw new Error(`Failed to fetch event: ${request.statusText}`);
    }

    const response = await request.json();
    event = response.event;

    if (!event) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    organizer,
    tags,
  } = event;

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Event Content */}
        <div className="content">
          {image && (
            <Image
              src={image}
              alt="Event Banner"
              width={800}
              height={800}
              className="banner"
            />
          )}

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      {similarEvents?.length > 0 && (
        <div className="flex flex-col w-full gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
            {similarEvents?.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface EventDetailItemProps {
  icon: string;
  alt: string;
  label: string;
}

function EventDetailItem(props: EventDetailItemProps) {
  const { icon, alt, label } = props;

  if (!icon) return null;

  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt || "icon"} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
}

function EventAgenda({ agendaItems }: { agendaItems: string[] }) {
  return (
    <div className="agenda">
      <h2>Agenda</h2>

      {agendaItems && (
        <ul>
          {agendaItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EventTags({ tags }: { tags: string[] }) {
  if (!tags) return null;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div key={tag} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
}
