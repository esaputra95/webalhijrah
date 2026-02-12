import { prisma } from "./prisma";
import {
  HalaqohCategory,
  HalaqohMentor,
  Halaqoh,
  RegistrationStatus,
  HalaqohRegistration,
} from "@/types/halaqoh";

export const halaqohService = {
  // --- Categories ---
  async getCategories() {
    return await prisma.halaqoh_categories.findMany({
      orderBy: { title: "asc" },
    });
  },

  async createCategory(data: {
    title: string;
    slug: string;
    description?: string;
  }) {
    return await prisma.halaqoh_categories.create({ data });
  },

  // --- Mentors ---
  async getMentors() {
    return await prisma.halaqoh_mentors.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  },

  async createMentor(data: {
    user_id: number;
    bio?: string;
    specialization?: string;
  }) {
    return await prisma.halaqoh_mentors.create({
      data: { ...data, is_active: true },
    });
  },

  // --- Halaqoh (Classes) ---
  async getHalaqohs(filters?: { category_id?: number; mentor_id?: number }) {
    return await prisma.halaqohs.findMany({
      where: filters,
      include: {
        category: true,
        mentor: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });
  },

  async createHalaqoh(data: any) {
    return await prisma.halaqohs.create({ data });
  },

  // --- Registrations ---
  async register(data: {
    user_id: number;
    category_id: number;
    notes?: string;
  }) {
    return await prisma.halaqoh_registrations.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  },

  async updateRegistrationStatus(
    id: number,
    status: RegistrationStatus,
    test_score?: number,
  ) {
    return await prisma.halaqoh_registrations.update({
      where: { id },
      data: { status, test_score },
    });
  },

  // --- Participants ---
  async addParticipantToHalaqoh(halaqoh_id: number, user_id: number) {
    return await prisma.halaqoh_participants.create({
      data: {
        halaqoh_id,
        user_id,
        status: "ACTIVE",
      },
    });
  },

  // --- Attendance ---
  async submitAttendance(data: {
    halaqoh_id: number;
    user_id: number;
    date: Date;
    status: any;
    notes?: string;
  }) {
    return await prisma.halaqoh_attendance.create({ data });
  },
};
