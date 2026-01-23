"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/about" },
  { name: "Program", href: "/programs" },
  { name: "Artikel", href: "/articles" },
  { name: "Live Ashiil TV", href: "/live-ashiil" },
  { name: "Donasi", href: "/donasi" },
];

export default function PublicNavbar({
  withScrolled = true,
}: {
  withScrolled?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    const currentHash = hash;

    // Beranda ("/") → aktif hanya jika pathname "/" dan tidak ada hash
    if (href === "/") {
      return pathname === "/" && currentHash === "";
    }

    // Hash sections ("/#about")
    if (href.includes("#")) {
      const [path, section] = href.split("#");
      const currentPath = pathname === "/" ? "" : pathname;
      const targetPath = path === "/" ? "" : path;
      const targetSection = `#${section}`;

      return currentPath === targetPath && currentHash === targetSection;
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Sync immediately on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClasses =
    isScrolled || !withScrolled
      ? "bg-white shadow-lg py-3 text-gray-800 border-b border-gray-100"
      : "bg-transparent py-5 text-white";

  return (
    <nav
      className={`fixed w-full z-50 transition-[padding,background-color,box-shadow,color] duration-300 ${navbarClasses}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setHash("")}
        >
          <Image
            src="/logoalhijrah.png"
            alt="Logo"
            width={50}
            height={50}
            className="w-full h-10 flex items-center justify-center font-bold text-xl transition-colors text-brand-brown"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  if (link.href.includes("#")) {
                    const h = link.href.split("#")[1];
                    setHash(`#${h}`);
                  } else {
                    setHash("");
                  }
                }}
                className={`font-medium transition-all duration-300 ${
                  active
                    ? "px-5 py-2 rounded-full font-bold bg-brand-gold text-brand-brown shadow-sm"
                    : isScrolled || !withScrolled
                      ? "text-gray-700 hover:text-brand-gold"
                      : "text-white hover:text-brand-gold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admins?callbackUrl=/admins"
              className={`font-medium transition-colors ${
                pathname === "/admins"
                  ? "text-brand-gold font-bold"
                  : isScrolled || !withScrolled
                    ? "text-gray-700 hover:text-brand-gold"
                    : "text-white hover:text-brand-gold"
              }`}
            >
              Login
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden text-2xl transition-colors ${
            isScrolled || !withScrolled ? "text-gray-800" : "text-white"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl overflow-hidden"
          >
            <div className="py-6 flex flex-col items-center gap-5 text-gray-800">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-semibold text-lg transition-colors ${
                      active
                        ? "text-brand-gold"
                        : "text-gray-700 hover:text-brand-gold"
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (link.href.includes("#")) {
                        const h = link.href.split("#")[1];
                        setHash(`#${h}`);
                      } else {
                        setHash("");
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/login"
                className={`w-4/5 text-center px-6 py-3 rounded-full font-bold transition-all ${
                  pathname === "/login"
                    ? "bg-brand-gold text-brand-brown"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
