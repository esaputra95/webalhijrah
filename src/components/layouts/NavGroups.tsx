import { FiLayers, FiFileText, FiFile } from "react-icons/fi";

export type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
  role?: string[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      {
        icon: FiLayers,
        label: "Dashboard",
        path: "/admins/",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN", "STAFF"],
      },
    ],
  },
  {
    label: "Data Master",
    items: [
      {
        icon: FiFileText,
        label: "Kategori Artikel",
        path: "/admins/masters/post-categories",
        role: ["SUPER_ADMIN"],
      },
      {
        icon: FiFile,
        label: "Sliders",
        path: "/admins/masters/sliders",
        role: ["SUPER_ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Group Program",
        path: "/admins/masters/program-categories",
        role: ["SUPER_ADMIN"],
      },
      {
        icon: FiFile,
        label: "Pengaturan",
        path: "/admins/masters/settings",
        role: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    label: "Artikel",
    items: [
      {
        icon: FiFileText,
        label: "Artikel",
        path: "/admins/articles",
        role: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    label: "Program",
    items: [
      {
        icon: FiFileText,
        label: "Daftar Donasi",
        path: "/admins/donations",
        role: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    label: "Laporan",
    items: [
      {
        icon: FiFileText,
        label: "Laporan Donasi",
        path: "/admins/reports/request-reports",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Artikel",
        path: "/admins/reports/article-reports",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN"],
      },
    ],
  },
];
