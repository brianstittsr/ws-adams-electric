"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Legacy83Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={isHome ? "/images/adamselectric_logo.png" : "/legacy83Logo.webp"}
            alt={isHome ? "Adams Electric" : "Legacy 83 Business Inc"}
            width={isHome ? 200 : 180}
            height={isHome ? 60 : 60}
            className="h-12 w-auto"
            priority
            unoptimized={isHome}
          />
        </Link>



      </div>
    </header>
  );
}
