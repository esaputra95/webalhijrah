"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  HiMenu,
  HiX,
  HiUserCircle,
  HiLogout,
  HiViewGrid,
  HiBriefcase,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/about" },
  { name: "Program", href: "/programs" },
  { name: "Halaqoh", href: "/halaqoh" },
  { name: "Artikel", href: "/articles" },
  { name: "Live Ashiil TV", href: "/live-ashiil" },
  { name: "Donasi", href: "/donasi" },
];

export default function PublicNavbar({
  withScrolled = true,
}: {
  withScrolled?: boolean;
}) {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    if (href === "/") {
      return pathname === "/" && currentHash === "";
    }

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
    handleScroll();
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

          {status === "authenticated" ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  isScrolled || !withScrolled
                    ? "border-gray-200 hover:bg-gray-50"
                    : "border-white/30 hover:bg-white/10"
                }`}
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User"
                    width={28}
                    height={28}
                    className="rounded-full overflow-hidden border border-brand-gold"
                  />
                ) : (
                  <HiUserCircle className="text-2xl" />
                )}
                <span className="text-sm font-semibold truncate max-w-[100px]">
                  {session.user?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-gray-800"
                  >
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href={
                          String(session.user?.role).toUpperCase() === "MENTOR"
                            ? "/dashboard/mentor"
                            : "/dashboard"
                        }
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <HiViewGrid className="text-lg" />
                        <span>Dashboard Saya</span>
                      </Link>

                      {String(session.user?.role).toUpperCase() ===
                        "MENTOR" && (
                        <Link
                          href="/dashboard/mentor"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <HiBriefcase className="text-lg" />
                          <span>Mentor Panel</span>
                        </Link>
                      )}

                      {(String(session.user?.role).toUpperCase() === "ADMIN" ||
                        String(session.user?.role).toUpperCase() ===
                          "ADMIN_TAKMIR" ||
                        String(session.user?.role).toUpperCase() ===
                          "ADMIN_KESANTRIAN") && (
                        <Link
                          href="/admins"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <HiBriefcase className="text-lg" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                      >
                        <HiLogout className="text-lg" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className={`font-medium transition-colors ${
                  pathname === "/login"
                    ? "text-brand-gold font-bold"
                    : isScrolled || !withScrolled
                      ? "text-gray-700 hover:text-brand-gold"
                      : "text-white hover:text-brand-gold"
                }`}
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {status === "authenticated" && (
            <Link
              href={
                String(session.user?.role).toUpperCase() === "MENTOR"
                  ? "/dashboard/mentor"
                  : "/dashboard"
              }
              className={`text-2xl ${isScrolled || !withScrolled ? "text-gray-800" : "text-white"}`}
            >
              <HiUserCircle />
            </Link>
          )}
          <button
            className={`text-2xl transition-colors ${
              isScrolled || !withScrolled ? "text-gray-800" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
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
              {status === "authenticated" ? (
                <>
                  <Link
                    href={
                      String(session.user?.role).toUpperCase() === "MENTOR"
                        ? "/dashboard/mentor"
                        : "/dashboard"
                    }
                    className="w-4/5 text-center px-6 py-3 rounded-full font-bold bg-brand-gold/10 text-brand-gold transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard Saya
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-4/5 text-center px-6 py-3 rounded-full font-bold bg-red-50 text-red-600 transition-all"
                  >
                    Keluar
                  </button>
                </>
              ) : (
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
