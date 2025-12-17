import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import Brand from "./Brand";

export default function Header({
  collapsed,
  setCollapsed,
  openMobile,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  openMobile: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-8xl items-center gap-3 px-4 py-3">
        {/* Mobile: hamburger */}
        <button
          className="rounded-xl border border-slate-200 p-2 md:hidden"
          onClick={openMobile}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>

        {/* Desktop: collapse toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
          <Brand />
        </div>

        {/* Mobile brand */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white font-bold">
            LP
          </div>
          <div className="leading-tight">
            <p className="font-semibold">Markaz Al Hijrah</p>
            <p className="text-xs text-slate-500">Nusantara</p>
          </div>
        </div>

        {/* Breadcrumb / Title */}
        {/* <div className="ml-2 hidden flex-1 items-center gap-2 md:flex">
          <span className="text-sm text-slate-500">
            Investasi & Hasil Pengembangan
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold">Ringkasan Informasi</span>
        </div> */}

        {/* Search desktop */}
        <div className="relative ml-auto hidden md:block"></div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Mobile search icon */}
          <button
            className="rounded-xl border border-slate-200 p-2 md:hidden"
            aria-label="Search"
          >
            <FiSearch />
          </button>
          <button className="relative rounded-xl border border-slate-200 p-2 hover:bg-slate-100">
            <FiBell />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white md:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100">
              <FiUser className="text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
