import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}
const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        {location}
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div className="flex flex-row gap-2">
          <Image
            src="/icons/calendar.svg"
            alt="location"
            width={14}
            height={14}
          />
          {date}
        </div>
        <div className="flex flex-row gap-2">
          <Image src="/icons/clock.svg" alt="location" width={14} height={14} />
          {time}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
