import { FiLayers, FiFileText, FiFile, FiUsers } from "react-icons/fi";

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
        role: ["ADMIN", "MENTOR", "USER", "ADMIN_TAKMIR", "ADMIN_KESANTRIAN"],
      },
    ],
  },
  {
    label: "Data Master",
    items: [
      {
        icon: FiUsers,
        label: "Pengguna",
        path: "/admins/users",
        role: ["ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Kategori Artikel",
        path: "/admins/masters/post-categories",
        role: ["ADMIN", "ADMIN_TAKMIR"],
      },
      {
        icon: FiFile,
        label: "Sliders",
        path: "/admins/masters/sliders",
        role: ["ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Group Program",
        path: "/admins/masters/program-categories",
        role: ["ADMIN", "ADMIN_TAKMIR"],
      },
      {
        icon: FiFile,
        label: "Pengaturan",
        path: "/admins/masters/settings",
        role: ["ADMIN", "ADMIN_TAKMIR"],
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
        role: ["ADMIN", "ADMIN_TAKMIR"],
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
        role: ["ADMIN", "ADMIN_TAKMIR"],
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
        role: ["ADMIN", "ADMIN_TAKMIR"],
      },
      {
        icon: FiFileText,
        label: "Laporan Artikel",
        path: "/admins/reports/article-reports",
        role: ["ADMIN"],
      },
      // {
      //   icon: FiFileText,
      //   label: "Analytics Halaman",
      //   path: "/admins/reports/page-analytics",
      //   role: ["ADMIN", "ADMIN_TAKMIR"],
      // },
    ],
  },
  {
    label: "Halaqoh",
    items: [
      {
        icon: FiFileText,
        label: "Kategori Halaqoh",
        path: "/admins/halaqoh/categories",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Pembimbing",
        path: "/admins/halaqoh/mentors",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Grup Kelas",
        path: "/admins/halaqoh/classes",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Absensi Halaqoh",
        path: "/admins/halaqoh/attendance",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Pendaftaran",
        path: "/admins/halaqoh/registrations",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Follow Up",
        path: "/admins/halaqoh/follow-up",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Tingkatan Materi",
        path: "/admins/halaqoh/material-levels",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Perpindahan Kelas",
        path: "/admins/halaqoh/promotions",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
    ],
  },
  {
    label: "Laporan Halaqoh",
    items: [
      {
        icon: FiFileText,
        label: "Laporan Kehadiran",
        path: "/admins/halaqoh/reports/attendance",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Peserta",
        path: "/admins/halaqoh/reports/participants",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Registrasi",
        path: "/admins/halaqoh/reports/registrations",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Kenaikan Level",
        path: "/admins/halaqoh/reports/promotions",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Per Mentor",
        path: "/admins/halaqoh/reports/mentors",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Per Kategori",
        path: "/admins/halaqoh/reports/categories",
        role: ["ADMIN", "ADMIN_KESANTRIAN"],
      },
    ],
  },
];
