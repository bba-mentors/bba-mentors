export type Role = 'PARENT' | 'MENTOR' | 'ADMIN';

export type BoardType = 'BSEB' | 'CBSE' | 'ICSE';

export type TuitionMode = 'Home Tuition' | 'Online Tuition' | 'Hybrid';

export type TutorGenderPreference = 'Male' | 'Female' | 'No Preference';

export type VerificationStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended';

export type StudentUnderstanding = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

export type AttendanceStatus = 'Present' | 'Absent' | 'Rescheduled';

export type ImprovementTrend = 'Improved' | 'Needs Attention' | 'Stable';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  mobile: string;
  city?: string;
  district?: string;
  state?: string;
  createdAt: string;
}

export interface Parent {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  district: string;
  state: string;
  address?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  parentId: string;
  name: string;
  classGrade: string; // e.g. "Class 10"
  board: BoardType;
  schoolName: string;
  gender: string;
  dob?: string;
  subjects: string[];
  targetSubjects?: string[];
  weakSubjects?: string[];
  learningGoals: string;
  currentAcademicLevel: string; // e.g. "Average", "Above Average", "Needs Foundation Support"
  address: string;
  district: string;
  city: string;
  preferredMode: TuitionMode;
  preferredTutorGender: TutorGenderPreference;
  preferredTiming: string;
  monthlyBudget: string;
  assignedMentorId?: string;
  status: 'Active' | 'Pending Mentor' | 'Inactive';
  createdAt: string;
}

export interface Mentor {
  id: string;
  userId: string;
  fullName: string;
  mobile: string;
  email: string;
  qualification: string;
  college: string;
  teachingExperience: string; // e.g. "4+ Years"
  subjects: string[];
  classes: string[];
  boards: BoardType[];
  preferredAreas: string[];
  district: string;
  city: string;
  pincode: string;
  teachingMode: TuitionMode;
  availability: string;
  expectedFee: string;
  about: string;
  profilePhoto: string;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  specialization?: string;
  createdAt: string;
}

export interface TuitionRequest {
  id: string;
  parentId: string;
  studentId: string;
  studentName: string;
  classGrade: string;
  board: BoardType;
  subjects: string[];
  district: string;
  city: string;
  area: string;
  preferredTiming: string;
  budget: string;
  teachingMode: TuitionMode;
  genderPreference: TutorGenderPreference;
  status: 'Pending' | 'Assigned' | 'Completed' | 'Cancelled';
  assignedMentorId?: string;
  notes?: string;
  parentName?: string;
  parentMobile?: string;
  createdAt: string;
}

export interface ClassSession {
  id: string;
  studentId: string;
  mentorId: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  mode: TuitionMode;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  mentorId: string;
  date: string;
  time?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface ClassReport {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName?: string;
  date: string;
  subject: string;
  topicCovered: string;
  subtopics: string;
  homework: string;
  homeworkAssigned?: string;
  studentUnderstanding: StudentUnderstanding;
  understandingLevel?: string;
  classParticipation: 'High' | 'Medium' | 'Low';
  difficulties: string;
  nextClassPlan: string;
  mentorRemarks: string;
  remarks?: string;
  createdAt: string;
}

export interface HomeworkItem {
  id: string;
  studentId: string;
  mentorId: string;
  subject: string;
  topic: string;
  description: string;
  dueDate: string;
  assignedDate?: string;
  attachmentUrl?: string;
  totalMarks?: number;
  status?: string;
  submissionStatus: 'Pending' | 'Submitted' | 'Reviewed';
  submissionText?: string;
  mentorFeedback?: string;
  teacherFeedback?: string;
  marksAwarded?: number;
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  type: 'MCQ' | 'True/False' | 'Short Answer';
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  topic: string;
}

export interface WeeklyExam {
  id: string;
  examName: string;
  title?: string;
  weekNumber: number;
  classGrade: string;
  board: BoardType;
  subject: string;
  chapter: string;
  chapterName?: string;
  topics: string[];
  topicsCovered?: string[];
  totalMarks: number;
  durationMinutes: number;
  questionCount: number;
  examDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string;
  questions: ExamQuestion[];
  status: 'Published' | 'Draft' | 'Archived';
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examName: string;
  examTitle?: string;
  subject: string;
  studentId: string;
  startedAt: string;
  submittedAt: string;
  completedAt?: string;
  answers: Record<string, string>; // questionId -> selectedOption
  marksObtained: number;
  score?: number;
  totalMarks: number;
  maxMarks?: number;
  percentage: number;
  correctCount: number;
  correctAnswers?: number;
  wrongCount: number;
  skippedCount: number;
  totalQuestions?: number;
  topicPerformance: Record<string, { correct: number; total: number; percentage: number }>;
  previousScore: number;
  scoreDifference: number;
  improvement?: number | string;
  improvementStatus: ImprovementTrend;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: Role;
  title: string;
  message: string;
  type: 'assignment' | 'class' | 'homework' | 'exam' | 'result' | 'report' | 'attendance' | 'support' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Normal' | 'High' | 'Urgent';
  response?: string;
  createdAt: string;
}

export interface StudentProgressSummary {
  studentId: string;
  studentName: string;
  overallScore: number;
  previousScore: number;
  improvementPercentage: number;
  improvementTrend: ImprovementTrend;
  trajectory?: string;
  attendancePercentage: number;
  totalClasses: number;
  completedClasses: number;
  attendedClasses?: number;
  testsTaken: number;
  weeklyScore?: number;
  subjectPerformance: Record<string, number>;
  subjectBreakdown?: any;
  weeklyScores: { week: string; score: number; date: string }[];
  strongTopics: string[];
  weakTopics: string[];
  latestMentorRemarks: string;
  recommendations?: string;
  bbaRecommendations: string;
  upcomingExam?: {
    id: string;
    examName: string;
    subject: string;
    examDate: string;
    durationMinutes: number;
  };
}

export interface BiharDistrict {
  id: string;
  name: string;
  hindiName?: string;
  division?: string;
  headquarters: string;
  popularAreas: string[];
  pincodes: string[];
  activeMentorsCount: number;
}
