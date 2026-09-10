import type {
  User,
  Parent,
  Student,
  Mentor,
  TuitionRequest,
  WeeklyExam,
  ExamAttempt,
  ClassReport,
  AttendanceRecord,
  HomeworkItem,
  NotificationItem,
  StudentProgressSummary,
  BiharDistrict,
} from '../types/index.ts';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('bba_mentors_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) {
        errorMsg = errJson.error;
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string; role?: string }) =>
    request<{ token: string; user: User & { profileId?: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  registerParent: (data: any) =>
    request<{ token: string; user: User; parent: Parent; student?: Student }>('/auth/register-parent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerMentor: (data: any) =>
    request<{ token: string; user: User; mentor: Mentor; message: string }>('/auth/register-mentor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => request<{ user: User; profile: any }>('/auth/me'),

  // Parent Endpoints
  getParentChildren: (parentId?: string) =>
    request<(Student & { mentor?: Mentor | null })[]>(parentId ? `/parent/children?parentId=${parentId}` : '/parent/children'),

  addChild: (data: any) =>
    request<Student>('/parent/children', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStudentSummary: (studentId: string) =>
    request<StudentProgressSummary>(`/student/${studentId}/summary`),

  getStudentAttendance: (studentId: string) =>
    request<AttendanceRecord[]>(`/student/${studentId}/attendance`),

  getStudentClassReports: (studentId: string) =>
    request<ClassReport[]>(`/student/${studentId}/class-reports`),

  getStudentHomework: (studentId: string) =>
    request<HomeworkItem[]>(`/student/${studentId}/homework`),

  getStudentExamHistory: (studentId: string) =>
    request<ExamAttempt[]>(`/student/${studentId}/exam-history`),

  // Exams
  getPublishedExams: (classGrade?: string, board?: string) => {
    const params = new URLSearchParams();
    if (classGrade) params.append('classGrade', classGrade);
    if (board) params.append('board', board);
    const q = params.toString();
    return request<WeeklyExam[]>(q ? `/exams/published?${q}` : '/exams/published');
  },

  getExamForAttempt: (examId: string) =>
    request<WeeklyExam>(`/exams/${examId}`),

  submitExamAttempt: (examId: string, data: { studentId: string; answers: Record<string, string>; startedAt?: string }) =>
    request<{ attempt: ExamAttempt; examReview: any[] }>(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Mentor Endpoints
  getMentorAssignedStudents: () =>
    request<(Student & { parentName?: string; parentMobile?: string; summary: StudentProgressSummary })[]>(
      '/mentor/assigned-students'
    ),

  submitClassReport: (data: any) =>
    request<ClassReport>('/mentor/class-report', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markAttendance: (data: { studentId: string; date: string; status: string; remarks?: string }) =>
    request<AttendanceRecord>('/mentor/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createHomework: (data: any) =>
    request<HomeworkItem>('/mentor/homework', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin Endpoints
  getAdminOverview: () =>
    request<{
      metrics: {
        totalParents: number;
        totalStudents: number;
        totalMentors: number;
        verifiedMentors: number;
        pendingRequests: number;
        activeTuitionStudents: number;
        totalWeeklyExams: number;
        avgImprovementPercentage: number;
        activeDistrictsCount: number;
      };
      charts: {
        studentsByDistrict: { district: string; count: number }[];
        studentsByBoard: { board: string; count: number }[];
        studentsByClass: { grade: string; count: number }[];
        mentorsByDistrict: { district: string; count: number }[];
      };
    }>('/admin/overview'),

  getTuitionRequests: () =>
    request<TuitionRequest[]>('/admin/tuition-requests'),

  assignMentor: (data: { tuitionRequestId?: string; studentId?: string; mentorId: string }) =>
    request<{ success: boolean; message: string; student: Student }>('/admin/assign-mentor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminMentors: () =>
    request<Mentor[]>('/admin/mentors'),

  verifyMentor: (data: { mentorId: string; status: string }) =>
    request<{ success: boolean; mentor: Mentor }>('/admin/verify-mentor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createWeeklyExam: (data: any) =>
    request<WeeklyExam>('/admin/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminStudents: () =>
    request<Student[]>('/admin/students'),

  getAdminParents: () =>
    request<Parent[]>('/admin/parents'),

  // Public Endpoints
  getPublicMentors: (filters: {
    district?: string;
    city?: string;
    classGrade?: string;
    subject?: string;
    board?: string;
    mode?: string;
  } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    const q = params.toString();
    return request<Mentor[]>(q ? `/public/mentors?${q}` : '/public/mentors');
  },

  getBiharDistricts: () =>
    request<BiharDistrict[]>('/public/districts'),

  requestDemoTuition: (data: any) =>
    request<{ success: boolean; message: string }>('/public/demo-request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: () =>
    request<NotificationItem[]>('/notifications'),

  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'POST',
    }),

  resetDemoData: () =>
    request<{ success: boolean; message: string }>('/demo/reset', {
      method: 'POST',
    }),
};
