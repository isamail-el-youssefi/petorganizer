"use client";
import Link from "next/link";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", path: "/app/dashboard" },
  { label: "Account", path: "/app/account" },
];

export default function AppHeader() {
  const activePthname = usePathname();

  return (
    <header className="flex justify-between items-center border-b border-white/10 py-2">
      <Logo />

      <nav>
        <ul className="flex gap-4 text-sm">
          {routes.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                className={cn(
                  "text-white/70 rounded-md px-3 p-3 pt-2 hover:text-white focus:text-white transition duration-300",
                  {
                    " bg-black/10 text-white": activePthname === path,
                  }
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
