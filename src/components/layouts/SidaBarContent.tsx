import { navGroups } from "./NavGroups";
import Link from "next/link";
import { useCurrentPath } from "@/hooks/usePath";
import { LogoutButton } from "./ButtonLogout";
import { useSession } from "next-auth/react";

export default function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const currentPath = useCurrentPath();
  const session = useSession();

  return (
    <>
      {/* Profile card */}
      <div className="mb-5 flex flex-col items-start gap-3">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-sky-600 text-white text-lg font-bold">
          {session.data?.user?.name?.split(" ")[0].toUpperCase()}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-semibold">{session.data?.user?.name}</p>
            <p className="truncate text-xs text-slate-500">
              {session.data?.user?.email}
            </p>
          </div>
        )}
      </div>

      {/* Nav groups */}
      <nav className="space-y-6">
        {navGroups.map((g, gi) => {
          // Filter items by role first
          const visibleItems = g.items;

          // Don't render group if no visible items
          // if (visibleItems.length === 0) return null;

          return (
            <div key={gi}>
              {!collapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {g.label}
                </p>
              )}
              <ul className="space-y-1">
                {visibleItems.map((it, ii) => (
                  <Link
                    href={it.path}
                    // onClick={() => navigation(it.path)}
                    key={ii}
                    className={`group hover:cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      it.path === `/${currentPath}`
                        ? "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {/* <a
                    className={`group hover:cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      it.active
                        ? "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  > */}
                    <it.icon
                      className={it.active ? "text-sky-600" : "text-slate-400"}
                    />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                    {/* </a> */}
                  </Link>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Footer */}
        <div className="pt-2">
          <LogoutButton collapsed={collapsed} />
        </div>
      </nav>

      {/* Login / Device card */}
      {/* {!collapsed && (
        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>Login Terakhir</span>
            <span className="text-slate-400">02 Jul 2025, 21:45 WIB</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Perangkat</span>
            <span className="text-slate-400">iPhone 14 Pro (iOS17.5)</span>
          </div>
        </div>
      )} */}
    </>
  );
}
