import { cacheLife } from "next/cache";
import { ExploreBtn } from "@/components/explore-btn";
import { EventCard } from "@/components/event-card";
import type { IEvent } from "@/database";

export default async function HomePage() {
  "use cache";

  cacheLife("hours");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/events`
  );

  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      {events && events.length > 0 && (
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">
            {events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
