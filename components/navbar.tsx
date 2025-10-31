import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={24}
            height={24}
            className="object-contain"
          />

          <span>DevEvent</span>
        </Link>

        <ul className="list-none">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/">Create Event</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
