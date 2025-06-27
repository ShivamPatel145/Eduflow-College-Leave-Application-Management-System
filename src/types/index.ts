export type UserRole = 'student' | 'faculty' | 'hod' | 'principal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: string;
  section?: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  year: string;
  section: string;
  startDate: string;
  endDate: string;
  reason: string;
  applicationLetter: string;
  status: 'pending' | 'approved_by_faculty' | 'approved_by_hod' | 'approved' | 'rejected';
  rejectedBy?: UserRole;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}