import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export function EventCard(props: EventCardProps) {
  const { image, title, location, date, slug, time } = props;

  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />

      <div className="flex gap-2">
        <Image
          src="/icons/pin.svg"
          alt="location"
          width={14}
          height={14}
          className="object-contain"
        />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div className="flex gap-2">
          <Image
            src="/icons/calendar.svg"
            alt="date"
            width={14}
            height={14}
            className="object-contain"
          />
          <p>{date}</p>
        </div>
        <div className="flex gap-2">
          <Image
            src="/icons/clock.svg"
            alt="time"
            width={14}
            height={14}
            className="object-contain"
          />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
}
