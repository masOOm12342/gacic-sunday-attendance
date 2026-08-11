export interface Member {
  id: number;
  reg_id: string;
  full_name: string;
  mobile_number: string;
  email?: string | null;
  address: string;
  place_city: string;
  gender?: string | null;
  dob?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  member_id: number;
  reg_id: string;
  service_date: string;
  check_in_time: string;
  status: 'Present' | 'Late' | 'Excused';
  scanned_by: string;
  created_at: string;
  full_name?: string;
  mobile_number?: string;
  place_city?: string;
}

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'REJECTED';
  created_at: string;
  last_login?: string | null;
}

export interface AdminRequestItem {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  reviewed_at?: string | null;
}

export interface DashboardStats {
  totalMembers: number;
  todayCheckIns: number;
  notCheckedIn: number;
  attendancePercentage: number;
  isTodaySunday: boolean;
  activeServiceDate: string;
  recentRegistrations: Member[];
  recentCheckIns: AttendanceRecord[];
  notCheckedInMembers: Member[];
  attendanceTrend: { service_date: string; count: number }[];
}
