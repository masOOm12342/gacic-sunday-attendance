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
  adhaar_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: number;
  visitor_id: string;
  full_name: string;
  mobile_number: string;
  address: string;
  place_city: string;
  adhaar_number?: string | null;
  dob?: string | null;
  invited_by?: string | null;
  notes?: string | null;
  status: 'ACTIVE' | 'TRANSFERRED';
  transferred_member_reg_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  member_id: number;
  reg_id: string;
  service_date: string; // YYYY-MM-DD (IST)
  check_in_time: string; // HH:MM:SS AM/PM (IST)
  status: 'Present' | 'Late' | 'Excused';
  scanned_by: string;
  created_at: string;
  // Joined member details
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

export interface AdminRequest {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  reviewed_at?: string | null;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  full_name: string;
}
