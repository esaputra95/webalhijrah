export type HalaqohLocation = "ONLINE" | "OFFLINE";
export type HalaqohStatus = "OPEN" | "CLOSED";
export type RegistrationStatus =
  | "PENDING"
  | "TESTING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";
export type ParticipantStatus = "ACTIVE" | "GRADUATED" | "DROPPED";
export type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALPA";

export interface HalaqohCategory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  date_test?: Date | null;
  link_meet?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface HalaqohMentor {
  id: number;
  user_id: number;
  bio?: string;
  specialization?: string;
  is_active: boolean;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
}

export interface Halaqoh {
  id: number;
  category_id: number;
  mentor_id: number;
  title: string;
  schedule_info?: string;
  location_type: HalaqohLocation;
  meeting_link?: string;
  status: HalaqohStatus;
  category?: HalaqohCategory;
  mentor?: HalaqohMentor;
}

export interface HalaqohRegistration {
  id: number;
  user_id: number;
  category_id: number;
  status: RegistrationStatus;
  phone_number?: string;
  address?: string;
  gender?: string;
  test_score?: number;
  notes?: string;
  date?: Date | null;
  date_test?: Date | null;
  created_at?: Date;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  category?: HalaqohCategory;
  participant_id?: number;
}

export interface HalaqohParticipant {
  id: number;
  halaqoh_id: number;
  user_id: number;
  status: ParticipantStatus;
  joined_at?: Date;
  user?: {
    name: string;
    email: string;
  };
  halaqoh?: Halaqoh;
}

export interface HalaqohAttendance {
  id: number;
  halaqoh_id: number;
  user_id: number;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}
