import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
}

const EventCard = ({ title, image }: Props) => {
    return (
        <Link href="/events">
            <div id="event-card" className="flex flex-col gap-3">
                <Image src={image} alt={title} width={410} height={300} className="poster" />
                <p className="title">{title}</p>
            </div>
        </Link>
    );
};

export default EventCard;