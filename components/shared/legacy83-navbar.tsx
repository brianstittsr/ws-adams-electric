"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import {
  Menu,
  Target,
  Users,
  Settings,
  ArrowRightLeft,
  BookOpen,
  Calendar,
  HelpCircle,
  Info,
  Phone,
  ClipboardCheck,
  LogIn,
  UserPlus,
  ShoppingCart,
} from "lucide-react";
import { CartButton } from "@/components/academy/course-cart-drawer";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Strategic Planning",
    href: "/services/strategic-planning",
    description: "Vision-aligned roadmaps for long-term legacy goals",
    icon: Target,
  },
  {
    title: "Leadership Coaching",
    href: "/services/leadership-coaching",
    description: "Transform your leadership to empower teams",
    icon: Users,
  },
  {
    title: "Operational Excellence",
    href: "/services/operational-excellence",
    description: "Streamline systems, reclaim time, improve margins",
    icon: Settings,
  },
  {
    title: "Legacy Transition",
    href: "/services/legacy-transition",
    description: "Succession planning and exit strategies",
    icon: ArrowRightLeft,
  },
];

const resources = [
  { title: "Academy", href: "/academy", icon: BookOpen },
  { title: "The Legacy Journal", href: "/legacy-journal", icon: BookOpen },
  { title: "Events & Community", href: "/events", icon: Calendar },
  { title: "Success Stories", href: "/success-stories", icon: ClipboardCheck },
  { title: "FAQ", href: "/faq", icon: HelpCircle },
];

export function Legacy83Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <service.icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{service.title}</div>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              )}>
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-4">
                  {resources.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-amber-600" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              )}>
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <CartButton />
          <Link 
            href="/sign-in" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Register
          </Link>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="outline" asChild>
            <Link href="/quiz-intro">Take the Quiz</Link>
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
            <Link href="/schedule-a-call">Schedule a Call</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Services</h3>
                {services.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="flex items-center gap-3 py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <service.icon className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">{service.title}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <Link
                  href="/about"
                  className="flex items-center gap-3 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Info className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">About Icy Williams</span>
                </Link>
                {resources.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-3 py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-amber-600" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="flex items-center gap-3 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Phone className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Contact</span>
                </Link>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-3 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-3 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserPlus className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Register</span>
                </Link>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/quiz-intro" onClick={() => setMobileOpen(false)}>
                    Take the Quiz
                  </Link>
                </Button>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900" asChild>
                  <Link href="/schedule-a-call" onClick={() => setMobileOpen(false)}>
                    Schedule a Call
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
