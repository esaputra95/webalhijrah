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
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN", "STAFF", "MENTOR"],
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
  {
    label: "Halaqoh",
    items: [
      {
        icon: FiFileText,
        label: "Kategori Halaqoh",
        path: "/admins/halaqoh/categories",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Pembimbing",
        path: "/admins/halaqoh/mentors",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Grup Kelas",
        path: "/admins/halaqoh/classes",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Absensi Halaqoh",
        path: "/admins/halaqoh/attendance",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Pendaftaran",
        path: "/admins/halaqoh/registrations",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Follow Up",
        path: "/admins/halaqoh/follow-up",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Tingkatan Materi",
        path: "/admins/halaqoh/material-levels",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Perpindahan Kelas",
        path: "/admins/halaqoh/promotions",
        role: ["SUPER_ADMIN", "ADMIN"],
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
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Peserta",
        path: "/admins/halaqoh/reports/participants",
        role: ["SUPER_ADMIN", "ADMIN"],
      },
      // {
      //   icon: FiFileText,
      //   label: "Laporan Registrasi",
      //   path: "/admins/halaqoh/reports/registrations",
      //   role: ["SUPER_ADMIN", "ADMIN"],
      // },
      // {
      //   icon: FiFileText,
      //   label: "Laporan Kenaikan Level",
      //   path: "/admins/halaqoh/reports/promotions",
      //   role: ["SUPER_ADMIN", "ADMIN"],
      // },
      // {
      //   icon: FiFileText,
      //   label: "Laporan Per Mentor",
      //   path: "/admins/halaqoh/reports/mentors",
      //   role: ["SUPER_ADMIN", "ADMIN"],
      // },
      // {
      //   icon: FiFileText,
      //   label: "Laporan Per Kategori",
      //   path: "/admins/halaqoh/reports/categories",
      //   role: ["SUPER_ADMIN", "ADMIN"],
      // },
    ],
  },
];
