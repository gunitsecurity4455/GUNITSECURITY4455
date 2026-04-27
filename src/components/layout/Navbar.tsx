"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/career", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled || mobileOpen
          ? "bg-navy-deep/85 backdrop-blur-xl border-b border-red-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-[3px]">
          <span className="brand-gradient-text">G UNIT</span>
          <span className="text-off-white/80 ml-2 text-sm tracking-[4px] font-body font-medium">
            SECURITY
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-wider font-medium transition ${
                  active ? "text-red-bright" : "text-off-white/85 hover:text-off-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-red-bright to-blue-light rounded-full" />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-widest uppercase font-medium px-5 py-2.5 rounded-lg transition shadow-[0_10px_30px_-10px_rgba(200,16,46,0.5)]"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-off-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-navy-light bg-navy-deep/95 backdrop-blur-xl">
          <div className="flex flex-col py-4">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-3 text-sm tracking-wider transition ${
                    active ? "text-red-bright bg-red-primary/10" : "text-off-white/85 hover:bg-navy-mid"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mx-6 mt-3 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-primary to-red-deep text-white text-xs tracking-widest uppercase font-medium px-5 py-3 rounded-lg"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
