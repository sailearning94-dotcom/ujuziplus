import Link from "next/link";
import { BookOpen, Package, Rocket, Trophy, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { href: "/courses", label: "Browse courses", desc: "Project-based STEM paths", icon: BookOpen },
  { href: "/kits", label: "Learning kits", desc: "Hardware for hands-on labs", icon: Package },
  { href: "/programs", label: "Bootcamps", desc: "Cohort programs with mentors", icon: Rocket },
  { href: "/competitions", label: "Competitions", desc: "Build and compete", icon: Trophy },
] as const;

export function HomeGuestAside() {
  return (
    <div className="home-guest-aside">
      <p className="home-guest-aside__title">Jump in</p>
      <p className="home-guest-aside__desc">Pick a path and start exploring — no scroll required.</p>
      <ul className="home-guest-aside__list">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className="home-guest-aside__link group">
                <span className="home-guest-aside__icon">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="home-guest-aside__link-title">{item.label}</span>
                  <span className="home-guest-aside__link-desc">{item.desc}</span>
                </span>
                <ArrowRight className="home-guest-aside__arrow" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
