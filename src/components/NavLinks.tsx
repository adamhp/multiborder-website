import Link from "next/link";
import { nav } from "@/constants";

export function NavLinks() {
  return nav.map(([label, href]) => (
    <Link
      key={label}
      href={href}
      className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-stone-300 transition-colors delay-75 hover:text-stone-100 hover:delay-0 hover:bg-amber-500/25"
    >
      <span className="relative z-10">{label}</span>
    </Link>
  ));
}
