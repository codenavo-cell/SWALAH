export interface Student {
  admissionNumber: number;
  fullName: string;
  role?: string; // e.g., 'President', 'Treasurer', 'student'
  teamId?: number; // 1, 2, or 3
  attendancePercentage: number;
  programsParticipated: string[];
  achievements?: string[];
  bio?: string;
  skills?: string[];
  certificates?: string[];
  photoUrl?: string;
  socialLinks?: {
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface TeacherOrCommittee {
  id: string;
  name: string;
  position: string;
  avatar: string;
  adNo?: number;
}

export interface Team {
  id: number;
  name: string;
  captainId: number; // Student AD.NO
  assistantId: number; // Student AD.NO
  memberIds: number[]; // Student AD.NOs
  score: number;
  rank: number;
  dutiesCompleted: number;
}

export interface LanguageWing {
  id: string;
  name: string; // Arabic Wing, etc.
  chairmanId: number; // Student AD.NO
  convenerId: number; // Student AD.NO
  color: string;
}

export interface Program {
  id: string;
  title: string;
  date: string;
  venue: string;
  category: 'Arabic' | 'English' | 'Urdu' | 'Kannada' | 'General';
  assignedTeamId?: number;
  status: 'Upcoming' | 'Completed' | 'Registration Open';
  registrationDeadline?: string;
  registeredUsers?: number[]; // list of AD.NOs
  description: string;
}

export interface EventCalendarItem {
  id: string;
  title: string;
  date: string;
  category: string;
  venue?: string;
  assignedTeam?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  programId: string;
  programTitle: string;
  presentAdNos: number[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  type: 'general' | 'meeting' | 'exam' | 'scholarship' | 'announcement';
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
  date: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string; // "Anonymous" or student name
  votes: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Reviewed';
}

export interface Memory {
  id: string;
  imageUrl: string;
  message: string;
  author: string;
  date: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  category: 'Poetry' | 'Essay' | 'Interview' | 'Article';
  excerpt: string;
  content: string;
  date: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Study Material' | 'Form' | 'Report' | 'Certificate';
  date: string;
  description: string;
  downloadUrl: string;
}

export interface Winner {
  id: string;
  studentName: string;
  admissionNumber: number;
  teamId?: number;
  competitionName: string;
  position: 'First' | 'Second' | 'Third';
  date: string;
  category: 'Quiz Competition' | 'Speech Competition' | 'Essay Writing' | 'Poetry Competition' | 'Arabic Symposium' | 'Creative Canvas' | 'Swalah Talent' | 'Sports Events';
  year: string;
  photoUrl?: string;
  certificateUrl?: string;
}

