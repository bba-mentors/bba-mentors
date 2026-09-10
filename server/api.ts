import express, { Router, type Response } from 'express';
import crypto from 'crypto';
import {
  dbInstance,
  hashPassword,
  verifyPassword,
  getStudentProgressSummary,
  resetDatabase,
} from './db.ts';
import {
  generateToken,
  authenticateToken,
  requireRole,
  type AuthenticatedRequest,
} from './auth.ts';
import {
  createRateLimiter,
  sanitizeString,
  isValidEmail,
  isValidIndianPhone,
  normalizePhone,
} from './security.ts';
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
  SupportTicket,
  BiharDistrict,
} from '../src/types/index.ts';

const apiRouter = Router();

// ==========================================
// SECURITY RATE LIMITERS
// Protect endpoints against brute force & spam
// ==========================================

// Login: max 10 attempts per 5 minutes per IP
const authLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. For your security, please wait 5 minutes before trying again.',
});

// Registration: max 8 accounts per 10 minutes per IP
const registerLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: 'Too many registration requests. Please wait a few minutes before trying again.',
});

// Public Demo / Consultation: max 10 requests per 5 minutes per IP
const demoLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Demo inquiry already received. Our academic counselors will call you shortly.',
});

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Login endpoint (Parent, Mentor, or Admin)
apiRouter.post('/auth/login', authLimiter, (req, res) => {
  const emailRaw = req.body.email;
  const passwordRaw = req.body.password;
  const role = req.body.role;

  if (!emailRaw || !passwordRaw) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const cleanEmail = sanitizeString(emailRaw, 150).toLowerCase();

  const user = dbInstance.users.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // If specific role requested, verify it matches
  if (role && user.role !== role) {
    res.status(403).json({ error: `Account is registered as ${user.role}, not ${role}` });
    return;
  }

  const storedPwd = dbInstance.passwords[user.id];
  if (!storedPwd || !verifyPassword(passwordRaw, storedPwd.hash, storedPwd.salt)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user);

  let profileId: string | undefined;
  if (user.role === 'PARENT') {
    profileId = dbInstance.parents.find((p) => p.userId === user.id)?.id;
  } else if (user.role === 'MENTOR') {
    profileId = dbInstance.mentors.find((m) => m.userId === user.id)?.id;
  }

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
      city: user.city,
      district: user.district,
      profileId,
    },
  });
});

// Register Parent
apiRouter.post('/auth/register-parent', registerLimiter, (req, res) => {
  const {
    name,
    mobile,
    email,
    password,
    city,
    district,
    state = 'Bihar',
    address,
    // Optional first child profile
    child,
  } = req.body;

  if (!name || !mobile || !email || !password || !district) {
    res.status(400).json({ error: 'Please provide all mandatory parent registration details' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return;
  }

  if (!isValidIndianPhone(mobile)) {
    res.status(400).json({ error: 'Please provide a valid 10-digit mobile number' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  const cleanName = sanitizeString(name, 100);
  const cleanEmail = sanitizeString(email, 150).toLowerCase();
  const cleanMobile = normalizePhone(mobile);
  const cleanCity = sanitizeString(city || district, 80);
  const cleanDistrict = sanitizeString(district, 80);
  const cleanAddress = address ? sanitizeString(address, 300) : undefined;

  const existing = dbInstance.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email address already exists' });
    return;
  }

  const userId = `user-parent-${Date.now()}`;
  const pwdData = hashPassword(password);

  const newUser: User = {
    id: userId,
    email: cleanEmail,
    role: 'PARENT',
    name: cleanName,
    mobile: cleanMobile,
    city: cleanCity,
    district: cleanDistrict,
    state,
    createdAt: new Date().toISOString(),
  };

  dbInstance.users.push(newUser);
  dbInstance.passwords[userId] = pwdData;

  const parentId = `parent-${Date.now()}`;
  const newParent: Parent = {
    id: parentId,
    userId,
    name: cleanName,
    mobile: cleanMobile,
    email: cleanEmail,
    city: cleanCity,
    district: cleanDistrict,
    state,
    address: cleanAddress,
    createdAt: new Date().toISOString(),
  };
  dbInstance.parents.push(newParent);

  // If child details provided during registration
  let createdStudent: Student | undefined;
  if (child && child.name) {
    const studentId = `student-${Date.now()}`;
    createdStudent = {
      id: studentId,
      parentId,
      name: child.name,
      classGrade: child.classGrade || 'Class 10',
      board: child.board || 'CBSE',
      schoolName: child.schoolName || '',
      gender: child.gender || 'Not specified',
      dob: child.dob,
      subjects: child.subjects && child.subjects.length > 0 ? child.subjects : ['Mathematics', 'Science'],
      learningGoals: child.learningGoals || 'Regular weekly testing & conceptual improvement',
      currentAcademicLevel: child.currentAcademicLevel || 'Average',
      address: address || '',
      district,
      city: city || district,
      preferredMode: child.preferredMode || 'Home Tuition',
      preferredTutorGender: child.preferredTutorGender || 'No Preference',
      preferredTiming: child.preferredTiming || '5:00 PM - 6:30 PM',
      monthlyBudget: child.monthlyBudget || '₹4,000',
      status: 'Pending Mentor',
      createdAt: new Date().toISOString(),
    };
    dbInstance.students.push(createdStudent);

    // Auto-create initial tuition request
    dbInstance.tuitionRequests.push({
      id: `req-${Date.now()}`,
      parentId,
      studentId,
      studentName: child.name,
      classGrade: createdStudent.classGrade,
      board: createdStudent.board,
      subjects: createdStudent.subjects,
      district,
      city: city || district,
      area: address || district,
      preferredTiming: createdStudent.preferredTiming,
      budget: createdStudent.monthlyBudget,
      teachingMode: createdStudent.preferredMode,
      genderPreference: createdStudent.preferredTutorGender,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });
  }

  // Welcome notification
  dbInstance.notifications.push({
    id: `notif-${Date.now()}`,
    userId,
    role: 'PARENT',
    title: 'Welcome to BBA Mentors!',
    message: 'Your parent account has been created. Our academic coordinator will match a certified mentor soon.',
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      mobile: newUser.mobile,
      city: newUser.city,
      district: newUser.district,
      profileId: parentId,
    },
    parent: newParent,
    student: createdStudent,
  });
});

// Register Mentor
apiRouter.post('/auth/register-mentor', registerLimiter, (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    qualification,
    college,
    teachingExperience,
    subjects,
    classes,
    boards,
    preferredAreas,
    district,
    city,
    pincode,
    teachingMode,
    availability,
    expectedFee,
    about,
    profilePhoto,
  } = req.body;

  if (!fullName || !mobile || !email || !password || !qualification || !district) {
    res.status(400).json({ error: 'Please provide all required mentor application details' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return;
  }

  if (!isValidIndianPhone(mobile)) {
    res.status(400).json({ error: 'Please provide a valid 10-digit mobile number' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  const cleanFullName = sanitizeString(fullName, 100);
  const cleanEmail = sanitizeString(email, 150).toLowerCase();
  const cleanMobile = normalizePhone(mobile);
  const cleanQualification = sanitizeString(qualification, 100);
  const cleanCollege = college ? sanitizeString(college, 150) : 'University in Bihar';
  const cleanDistrict = sanitizeString(district, 80);
  const cleanCity = sanitizeString(city || district, 80);
  const cleanPincode = pincode ? sanitizeString(pincode, 10) : '800001';
  const cleanAbout = about ? sanitizeString(about, 1000) : 'Dedicated mentor committed to personalized student mentoring.';

  const existing = dbInstance.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const userId = `user-mentor-${Date.now()}`;
  const pwdData = hashPassword(password);

  const newUser: User = {
    id: userId,
    email: cleanEmail,
    role: 'MENTOR',
    name: cleanFullName,
    mobile: cleanMobile,
    city: cleanCity,
    district: cleanDistrict,
    state: 'Bihar',
    createdAt: new Date().toISOString(),
  };

  dbInstance.users.push(newUser);
  dbInstance.passwords[userId] = pwdData;

  const mentorId = `mentor-${Date.now()}`;
  const newMentor: Mentor = {
    id: mentorId,
    userId,
    fullName: cleanFullName,
    mobile: cleanMobile,
    email: cleanEmail,
    qualification: cleanQualification,
    college: cleanCollege,
    teachingExperience: teachingExperience || '1+ Year',
    subjects: Array.isArray(subjects) && subjects.length > 0 ? subjects.map((s: string) => sanitizeString(s, 50)) : ['Mathematics', 'Science'],
    classes: Array.isArray(classes) && classes.length > 0 ? classes.map((c: string) => sanitizeString(c, 50)) : ['Class 9', 'Class 10'],
    boards: (Array.isArray(boards) && boards.length > 0 ? boards.map((b: string) => sanitizeString(b, 30)) : ['CBSE', 'BSEB']) as any,
    preferredAreas: Array.isArray(preferredAreas) && preferredAreas.length > 0 ? preferredAreas.map((a: string) => sanitizeString(a, 80)) : [cleanCity],
    district: cleanDistrict,
    city: cleanCity,
    pincode: cleanPincode,
    teachingMode: teachingMode || 'Home Tuition',
    availability: availability || 'Evenings 4:00 PM - 8:00 PM',
    expectedFee: expectedFee || '₹3,500 - ₹5,000 / month',
    about: cleanAbout,
    profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    rating: 5.0,
    reviewCount: 0,
    verificationStatus: 'Pending', // Admin must approve
    createdAt: new Date().toISOString(),
  };

  dbInstance.mentors.push(newMentor);

  // Admin notification
  const admin = dbInstance.users.find((u) => u.role === 'ADMIN');
  if (admin) {
    dbInstance.notifications.push({
      id: `notif-${Date.now()}`,
      userId: admin.id,
      role: 'ADMIN',
      title: 'New Mentor Application',
      message: `${fullName} (${qualification}, ${district}) has applied to become a BBA Mentor.`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      mobile: newUser.mobile,
      profileId: mentorId,
    },
    mentor: newMentor,
    message: 'Application submitted successfully! Your profile is currently under review by the BBA Mentors academic team.',
  });
});

// Current User Info
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = dbInstance.users.find((u) => u.id === req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  let profile: any = null;
  if (user.role === 'PARENT') {
    profile = dbInstance.parents.find((p) => p.userId === user.id);
  } else if (user.role === 'MENTOR') {
    profile = dbInstance.mentors.find((m) => m.userId === user.id);
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
      city: user.city,
      district: user.district,
    },
    profile,
  });
});

// ==========================================
// 2. PARENT PORTAL ROUTES
// ==========================================

// Get Children of Logged-in Parent
apiRouter.get('/parent/children', authenticateToken, requireRole(['PARENT', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const parent = dbInstance.parents.find((p) => p.userId === req.user!.userId);
  if (!parent && req.user!.role !== 'ADMIN') {
    res.status(404).json({ error: 'Parent record not found' });
    return;
  }

  const parentId = parent ? parent.id : (req.query.parentId as string);
  const children = parentId
    ? dbInstance.students.filter((s) => s.parentId === parentId)
    : dbInstance.students;

  // Enrich with assigned mentor info
  const enriched = children.map((c) => {
    const mentor = c.assignedMentorId ? dbInstance.mentors.find((m) => m.id === c.assignedMentorId) : null;
    return {
      ...c,
      mentor: mentor
        ? {
            id: mentor.id,
            fullName: mentor.fullName,
            qualification: mentor.qualification,
            college: mentor.college,
            mobile: mentor.mobile,
            rating: mentor.rating,
            profilePhoto: mentor.profilePhoto,
          }
        : null,
    };
  });

  res.json(enriched);
});

// Add Child
apiRouter.post('/parent/children', authenticateToken, requireRole(['PARENT']), (req: AuthenticatedRequest, res: Response) => {
  const parent = dbInstance.parents.find((p) => p.userId === req.user!.userId);
  if (!parent) {
    res.status(404).json({ error: 'Parent record not found' });
    return;
  }

  const {
    name,
    classGrade,
    board,
    schoolName,
    gender,
    dob,
    subjects,
    learningGoals,
    currentAcademicLevel,
    address,
    preferredMode,
    preferredTutorGender,
    preferredTiming,
    monthlyBudget,
  } = req.body;

  if (!name || !classGrade || !board) {
    res.status(400).json({ error: 'Name, Class, and Board are required' });
    return;
  }

  const studentId = `student-${Date.now()}`;
  const newStudent: Student = {
    id: studentId,
    parentId: parent.id,
    name,
    classGrade,
    board,
    schoolName: schoolName || '',
    gender: gender || 'Not specified',
    dob,
    subjects: subjects && subjects.length > 0 ? subjects : ['Mathematics', 'Science'],
    learningGoals: learningGoals || 'Improve conceptual depth and exam performance',
    currentAcademicLevel: currentAcademicLevel || 'Average',
    address: address || parent.address || '',
    district: parent.district,
    city: parent.city,
    preferredMode: preferredMode || 'Home Tuition',
    preferredTutorGender: preferredTutorGender || 'No Preference',
    preferredTiming: preferredTiming || '5:00 PM - 6:30 PM',
    monthlyBudget: monthlyBudget || '₹4,000',
    status: 'Pending Mentor',
    createdAt: new Date().toISOString(),
  };

  dbInstance.students.push(newStudent);

  // Automatically submit tuition request
  dbInstance.tuitionRequests.push({
    id: `req-${Date.now()}`,
    parentId: parent.id,
    studentId,
    studentName: name,
    classGrade,
    board,
    subjects: newStudent.subjects,
    district: parent.district,
    city: parent.city,
    area: parent.address || parent.city,
    preferredTiming: newStudent.preferredTiming,
    budget: newStudent.monthlyBudget,
    teachingMode: newStudent.preferredMode,
    genderPreference: newStudent.preferredTutorGender,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newStudent);
});

// Student Progress Summary
apiRouter.get('/student/:id/summary', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const summary = getStudentProgressSummary(id);

  if (!summary) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  res.json(summary);
});

// Student Attendance
apiRouter.get('/student/:id/attendance', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const attendance = dbInstance.attendance
    .filter((a) => a.studentId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json(attendance);
});

// Student Class Reports
apiRouter.get('/student/:id/class-reports', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const reports = dbInstance.classReports
    .filter((c) => c.studentId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(reports);
});

// Student Homework
apiRouter.get('/student/:id/homework', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const homework = dbInstance.homework
    .filter((h) => h.studentId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(homework);
});

// ==========================================
// 3. WEEKLY EXAMS & EXAM ENGINE
// ==========================================

// Get All Published Exams
apiRouter.get('/exams/published', (req, res) => {
  const { classGrade, board } = req.query;
  let exams = dbInstance.weeklyExams.filter((e) => e.status === 'Published');

  if (classGrade) {
    exams = exams.filter((e) => e.classGrade === classGrade);
  }
  if (board) {
    exams = exams.filter((e) => e.board === board);
  }

  res.json(exams);
});

// Get Exam Details for Attempting
apiRouter.get('/exams/:id', (req, res) => {
  const { id } = req.params;
  const exam = dbInstance.weeklyExams.find((e) => e.id === id);

  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }

  // Hide correct answers and explanations when student is fetching questions to take the test
  const sanitizedQuestions = exam.questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    type: q.type,
    options: q.options,
    marks: q.marks,
    topic: q.topic,
  }));

  res.json({
    ...exam,
    questions: sanitizedQuestions,
  });
});

// Submit Exam Attempt & Calculate Instant Results
apiRouter.post('/exams/:id/submit', (req, res) => {
  const { id } = req.params;
  const { studentId, answers, startedAt } = req.body;

  if (!studentId || !answers) {
    res.status(400).json({ error: 'Student ID and answers map are required' });
    return;
  }

  const exam = dbInstance.weeklyExams.find((e) => e.id === id);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }

  const student = dbInstance.students.find((s) => s.id === studentId);
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  // Compute grading
  let marksObtained = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const topicPerformance: Record<string, { correct: number; total: number; percentage: number }> = {};

  exam.questions.forEach((q) => {
    if (!topicPerformance[q.topic]) {
      topicPerformance[q.topic] = { correct: 0, total: 0, percentage: 0 };
    }
    topicPerformance[q.topic].total += 1;

    const studentAns = answers[q.id];
    if (!studentAns) {
      skippedCount += 1;
    } else if (studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
      correctCount += 1;
      marksObtained += q.marks;
      topicPerformance[q.topic].correct += 1;
    } else {
      wrongCount += 1;
    }
  });

  // Calculate percentages
  Object.keys(topicPerformance).forEach((topic) => {
    const item = topicPerformance[topic];
    item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  const percentage = Math.round((marksObtained / exam.totalMarks) * 100);

  // Retrieve previous score for this student to calculate exact improvement
  const previousAttempts = dbInstance.examAttempts
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const previousScore = previousAttempts.length > 0 ? previousAttempts[0].percentage : 70;
  const scoreDifference = percentage - previousScore;

  let improvementStatus: 'Improved' | 'Needs Attention' | 'Stable' = 'Stable';
  if (scoreDifference > 1) {
    improvementStatus = 'Improved';
  } else if (scoreDifference < -1) {
    improvementStatus = 'Needs Attention';
  }

  const attempt: ExamAttempt = {
    id: `att-${Date.now()}`,
    examId: exam.id,
    examName: exam.examName,
    subject: exam.subject,
    studentId,
    startedAt: startedAt || new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    answers,
    marksObtained,
    totalMarks: exam.totalMarks,
    percentage,
    correctCount,
    wrongCount,
    skippedCount,
    topicPerformance,
    previousScore,
    scoreDifference,
    improvementStatus,
  };

  dbInstance.examAttempts.push(attempt);

  // Trigger Parent Notification
  const parent = dbInstance.parents.find((p) => p.id === student.parentId);
  if (parent) {
    dbInstance.notifications.push({
      id: `notif-${Date.now()}`,
      userId: parent.userId,
      role: 'PARENT',
      title: `Assessment Completed: ${exam.examName}`,
      message: `${student.name} scored ${marksObtained}/${exam.totalMarks} (${percentage}%). Improvement: ${scoreDifference >= 0 ? '+' : ''}${scoreDifference}%.`,
      type: 'result',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  res.json({
    attempt,
    examReview: exam.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      studentAnswer: answers[q.id] || 'Not Answered',
      isCorrect: answers[q.id] === q.correctAnswer,
      explanation: q.explanation,
      marks: q.marks,
      topic: q.topic,
    })),
  });
});

// Student's Exam History
apiRouter.get('/student/:id/exam-history', (req, res) => {
  const { id } = req.params;
  const attempts = dbInstance.examAttempts
    .filter((a) => a.studentId === id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  res.json(attempts);
});

// ==========================================
// 4. MENTOR PORTAL ROUTES
// ==========================================

// Get Mentor's Assigned Students
apiRouter.get('/mentor/assigned-students', authenticateToken, requireRole(['MENTOR']), (req: AuthenticatedRequest, res: Response) => {
  const mentor = dbInstance.mentors.find((m) => m.userId === req.user!.userId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor profile not found' });
    return;
  }

  const students = dbInstance.students.filter((s) => s.assignedMentorId === mentor.id);

  // Attach parents details and latest summary for each student
  const enriched = students.map((s) => {
    const parent = dbInstance.parents.find((p) => p.id === s.parentId);
    const summary = getStudentProgressSummary(s.id);
    return {
      ...s,
      parentName: parent?.name,
      parentMobile: parent?.mobile,
      summary,
    };
  });

  res.json(enriched);
});

// Mentor Submits Class Report
apiRouter.post('/mentor/class-report', authenticateToken, requireRole(['MENTOR']), (req: AuthenticatedRequest, res: Response) => {
  const mentor = dbInstance.mentors.find((m) => m.userId === req.user!.userId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor profile not found' });
    return;
  }

  const {
    studentId,
    date,
    subject,
    topicCovered,
    subtopics,
    homework,
    studentUnderstanding,
    classParticipation,
    difficulties,
    nextClassPlan,
    mentorRemarks,
  } = req.body;

  if (!studentId || !date || !subject || !topicCovered || !studentUnderstanding) {
    res.status(400).json({ error: 'Student, date, subject, topic, and understanding level are required' });
    return;
  }

  const report: ClassReport = {
    id: `cr-${Date.now()}`,
    studentId,
    mentorId: mentor.id,
    mentorName: mentor.fullName,
    date,
    subject,
    topicCovered,
    subtopics: subtopics || '',
    homework: homework || '',
    studentUnderstanding,
    classParticipation: classParticipation || 'High',
    difficulties: difficulties || 'None observed',
    nextClassPlan: nextClassPlan || '',
    mentorRemarks: mentorRemarks || 'Good participation and attention throughout the class.',
    createdAt: new Date().toISOString(),
  };

  dbInstance.classReports.push(report);

  // Auto record attendance as Present for this class date
  dbInstance.attendance.push({
    id: `att-${Date.now()}`,
    studentId,
    mentorId: mentor.id,
    date,
    status: 'Present',
    remarks: `Class on ${topicCovered}`,
  });

  // Notify parent
  const student = dbInstance.students.find((s) => s.id === studentId);
  if (student) {
    const parent = dbInstance.parents.find((p) => p.id === student.parentId);
    if (parent) {
      dbInstance.notifications.push({
        id: `notif-${Date.now()}`,
        userId: parent.userId,
        role: 'PARENT',
        title: `Class Completed: ${subject}`,
        message: `${mentor.fullName} submitted report for ${student.name}. Topic: ${topicCovered}. Understanding: ${studentUnderstanding}.`,
        type: 'report',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  res.status(201).json(report);
});

// Mentor Marks Attendance
apiRouter.post('/mentor/attendance', authenticateToken, requireRole(['MENTOR']), (req: AuthenticatedRequest, res: Response) => {
  const mentor = dbInstance.mentors.find((m) => m.userId === req.user!.userId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor profile not found' });
    return;
  }

  const { studentId, date, status, remarks } = req.body;

  if (!studentId || !date || !status) {
    res.status(400).json({ error: 'Student, date, and status are required' });
    return;
  }

  const record: AttendanceRecord = {
    id: `att-${Date.now()}`,
    studentId,
    mentorId: mentor.id,
    date,
    status,
    remarks,
  };

  dbInstance.attendance.push(record);
  res.status(201).json(record);
});

// Mentor Creates Homework
apiRouter.post('/mentor/homework', authenticateToken, requireRole(['MENTOR']), (req: AuthenticatedRequest, res: Response) => {
  const mentor = dbInstance.mentors.find((m) => m.userId === req.user!.userId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor profile not found' });
    return;
  }

  const { studentId, subject, topic, description, dueDate, totalMarks } = req.body;

  if (!studentId || !subject || !topic || !description || !dueDate) {
    res.status(400).json({ error: 'Student, subject, topic, description, and due date are required' });
    return;
  }

  const hw: HomeworkItem = {
    id: `hw-${Date.now()}`,
    studentId,
    mentorId: mentor.id,
    subject,
    topic,
    description,
    dueDate,
    totalMarks: totalMarks || 10,
    submissionStatus: 'Pending',
    createdAt: new Date().toISOString(),
  };

  dbInstance.homework.push(hw);

  // Notify parent
  const student = dbInstance.students.find((s) => s.id === studentId);
  if (student) {
    const parent = dbInstance.parents.find((p) => p.id === student.parentId);
    if (parent) {
      dbInstance.notifications.push({
        id: `notif-${Date.now()}`,
        userId: parent.userId,
        role: 'PARENT',
        title: `New Homework Assigned (${subject})`,
        message: `${topic} assigned by ${mentor.fullName}. Due date: ${dueDate}.`,
        type: 'homework',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  res.status(201).json(hw);
});

// ==========================================
// 5. ADMIN PANEL ROUTES
// ==========================================

// Admin Analytics Overview
apiRouter.get('/admin/overview', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const totalParents = dbInstance.parents.length;
  const totalStudents = dbInstance.students.length;
  const totalMentors = dbInstance.mentors.length;
  const verifiedMentors = dbInstance.mentors.filter((m) => m.verificationStatus === 'Verified').length;
  const pendingRequests = dbInstance.tuitionRequests.filter((r) => r.status === 'Pending').length;
  const activeTuitionStudents = dbInstance.students.filter((s) => s.status === 'Active').length;
  const totalWeeklyExams = dbInstance.weeklyExams.length;

  // Compute average student improvement
  const allAttempts = dbInstance.examAttempts;
  const avgImprovement =
    allAttempts.length > 0
      ? Math.round(
          allAttempts.reduce((acc, a) => acc + (a.scoreDifference || 0), 0) / allAttempts.length
        )
      : 7;

  // Students by District
  const studentsByDistrict: Record<string, number> = {};
  dbInstance.students.forEach((s) => {
    studentsByDistrict[s.district] = (studentsByDistrict[s.district] || 0) + 1;
  });

  // Students by Board
  const studentsByBoard: Record<string, number> = {};
  dbInstance.students.forEach((s) => {
    studentsByBoard[s.board] = (studentsByBoard[s.board] || 0) + 1;
  });

  // Students by Class
  const studentsByClass: Record<string, number> = {};
  dbInstance.students.forEach((s) => {
    studentsByClass[s.classGrade] = (studentsByClass[s.classGrade] || 0) + 1;
  });

  // Mentors by District
  const mentorsByDistrict: Record<string, number> = {};
  dbInstance.mentors.forEach((m) => {
    mentorsByDistrict[m.district] = (mentorsByDistrict[m.district] || 0) + 1;
  });

  res.json({
    metrics: {
      totalParents,
      totalStudents,
      totalMentors,
      verifiedMentors,
      pendingRequests,
      activeTuitionStudents,
      totalWeeklyExams,
      avgImprovementPercentage: avgImprovement,
      activeDistrictsCount: Object.keys(studentsByDistrict).length || 5,
    },
    charts: {
      studentsByDistrict: Object.entries(studentsByDistrict).map(([district, count]) => ({ district, count })),
      studentsByBoard: Object.entries(studentsByBoard).map(([board, count]) => ({ board, count })),
      studentsByClass: Object.entries(studentsByClass).map(([grade, count]) => ({ grade, count })),
      mentorsByDistrict: Object.entries(mentorsByDistrict).map(([district, count]) => ({ district, count })),
    },
  });
});

// Admin: Get Tuition Requests
apiRouter.get('/admin/tuition-requests', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbInstance.tuitionRequests);
});

// Admin: Assign Mentor to Student / Request
apiRouter.post('/admin/assign-mentor', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { tuitionRequestId, studentId, mentorId } = req.body;

  if (!mentorId || (!studentId && !tuitionRequestId)) {
    res.status(400).json({ error: 'Mentor ID and Student ID/Request ID are required' });
    return;
  }

  const mentor = dbInstance.mentors.find((m) => m.id === mentorId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' });
    return;
  }

  let student: Student | undefined;
  if (studentId) {
    student = dbInstance.students.find((s) => s.id === studentId);
  } else if (tuitionRequestId) {
    const reqItem = dbInstance.tuitionRequests.find((r) => r.id === tuitionRequestId);
    if (reqItem) {
      student = dbInstance.students.find((s) => s.id === reqItem.studentId);
    }
  }

  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  // Update student
  student.assignedMentorId = mentor.id;
  student.status = 'Active';

  // Update tuition request if exists
  if (tuitionRequestId) {
    const reqItem = dbInstance.tuitionRequests.find((r) => r.id === tuitionRequestId);
    if (reqItem) {
      reqItem.status = 'Assigned';
      reqItem.assignedMentorId = mentor.id;
    }
  }

  // Notify parent
  const parent = dbInstance.parents.find((p) => p.id === student.parentId);
  if (parent) {
    dbInstance.notifications.push({
      id: `notif-${Date.now()}`,
      userId: parent.userId,
      role: 'PARENT',
      title: 'Mentor Assigned!',
      message: `${mentor.fullName} (${mentor.qualification}, ${mentor.teachingExperience}) has been assigned to ${student.name}.`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Notify mentor
  dbInstance.notifications.push({
    id: `notif-${Date.now() + 1}`,
    userId: mentor.userId,
    role: 'MENTOR',
    title: 'New Student Assigned',
    message: `You have been matched with ${student.name} (${student.classGrade}, ${student.board}) in ${student.city}.`,
    type: 'assignment',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `Successfully assigned ${mentor.fullName} to ${student.name}.`,
    student,
  });
});

// Admin: Mentors Management
apiRouter.get('/admin/mentors', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbInstance.mentors);
});

// Admin: Verify/Update Mentor Status
apiRouter.post('/admin/verify-mentor', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { mentorId, status } = req.body;

  const mentor = dbInstance.mentors.find((m) => m.id === mentorId);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' });
    return;
  }

  mentor.verificationStatus = status;

  // Notify mentor
  dbInstance.notifications.push({
    id: `notif-${Date.now()}`,
    userId: mentor.userId,
    role: 'MENTOR',
    title: `Verification Status Updated: ${status}`,
    message:
      status === 'Verified'
        ? 'Congratulations! Your profile is now verified and active for student allocations.'
        : `Your profile verification status has been marked as ${status}.`,
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, mentor });
});

// Admin: Create Weekly Assessment
apiRouter.post('/admin/exams', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const {
    examName,
    weekNumber,
    classGrade,
    board,
    subject,
    chapter,
    topics,
    durationMinutes,
    difficulty,
    instructions,
    questions,
  } = req.body;

  if (!examName || !classGrade || !board || !subject || !questions || questions.length === 0) {
    res.status(400).json({ error: 'Exam name, class, board, subject, and questions are required' });
    return;
  }

  const examId = `exam-${Date.now()}`;
  const totalMarks = questions.reduce((acc: number, q: any) => acc + (q.marks || 4), 0);

  const newExam: WeeklyExam = {
    id: examId,
    examName,
    weekNumber: weekNumber || 6,
    classGrade,
    board,
    subject,
    chapter: chapter || 'Weekly Revision',
    topics: topics && topics.length > 0 ? topics : ['Core Concepts'],
    totalMarks,
    durationMinutes: durationMinutes || 30,
    questionCount: questions.length,
    examDate: new Date().toISOString().slice(0, 10),
    difficulty: difficulty || 'Medium',
    instructions: instructions || 'Weekly assessment prepared by BBA Mentors Academic Team.',
    questions: questions.map((q: any, i: number) => ({
      id: `q-${examId}-${i + 1}`,
      questionText: q.questionText,
      type: q.type || 'MCQ',
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      marks: q.marks || 4,
      topic: q.topic || 'General',
    })),
    status: 'Published',
  };

  dbInstance.weeklyExams.push(newExam);

  // Broadcast notification to all matching parents
  const matchingStudents = dbInstance.students.filter(
    (s) => s.classGrade === classGrade && s.board === board
  );
  matchingStudents.forEach((st) => {
    const parent = dbInstance.parents.find((p) => p.id === st.parentId);
    if (parent) {
      dbInstance.notifications.push({
        id: `notif-${Date.now()}-${st.id}`,
        userId: parent.userId,
        role: 'PARENT',
        title: `New Weekly Exam: ${examName}`,
        message: `Assessment is now live for ${st.name} (${classGrade}, ${board}). Duration: ${durationMinutes || 30} mins.`,
        type: 'exam',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  });

  res.status(201).json(newExam);
});

// Admin: List Students
apiRouter.get('/admin/students', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbInstance.students);
});

// Admin: List Parents
apiRouter.get('/admin/parents', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbInstance.parents);
});

// ==========================================
// 6. PUBLIC ROUTES & SEARCH
// ==========================================

// Search Mentors Directory (Public)
apiRouter.get(['/mentors', '/public/mentors'], (req, res) => {
  const { district, city, classGrade, subject, board, gender, mode } = req.query;

  let mentors = dbInstance.mentors.filter((m) => m.verificationStatus === 'Verified');

  if (district) {
    mentors = mentors.filter((m) => m.district.toLowerCase() === (district as string).toLowerCase());
  }
  if (city) {
    mentors = mentors.filter((m) => m.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (classGrade) {
    mentors = mentors.filter((m) => m.classes.some((c) => c.toLowerCase() === (classGrade as string).toLowerCase()));
  }
  if (subject) {
    mentors = mentors.filter((m) => m.subjects.some((s) => s.toLowerCase() === (subject as string).toLowerCase()));
  }
  if (board) {
    mentors = mentors.filter((m) => m.boards.some((b) => b.toLowerCase() === (board as string).toLowerCase()));
  }
  if (mode) {
    mentors = mentors.filter((m) => m.teachingMode === mode || m.teachingMode === 'Hybrid');
  }

  // Safe public view (hide private phone/email until assigned)
  const sanitized = mentors.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    qualification: m.qualification,
    college: m.college,
    teachingExperience: m.teachingExperience,
    subjects: m.subjects,
    classes: m.classes,
    boards: m.boards,
    district: m.district,
    city: m.city,
    preferredAreas: m.preferredAreas,
    teachingMode: m.teachingMode,
    availability: m.availability,
    expectedFee: m.expectedFee,
    about: m.about,
    profilePhoto: m.profilePhoto,
    rating: m.rating,
    reviewCount: m.reviewCount,
    verificationStatus: m.verificationStatus,
    specialization: m.specialization,
  }));

  res.json(sanitized);
});

// Bihar Districts
apiRouter.get('/public/districts', (req, res) => {
  res.json(dbInstance.districts);
});

// Demo / Contact Request
apiRouter.post('/public/demo-request', demoLimiter, (req, res) => {
  const { parentName, mobile, studentClass, classGrade, board, district, city, childName, subjects, mode, notes } = req.body;
  const grade = studentClass || classGrade || 'Class 10';

  if (!parentName || !mobile) {
    res.status(400).json({ error: 'Please provide parent name and phone number' });
    return;
  }

  if (!isValidIndianPhone(mobile)) {
    res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
    return;
  }

  const cleanParentName = sanitizeString(parentName, 100);
  const cleanMobile = normalizePhone(mobile);
  const cleanChildName = childName ? sanitizeString(childName, 100) : 'Student';
  const cleanDistrict = sanitizeString(district || 'Patna', 80);
  const cleanCity = sanitizeString(city || 'Patna', 80);
  const cleanNotes = notes ? sanitizeString(notes, 500) : '';

  // Also record in tuition requests queue for Admin matching
  const newTuitionReq: TuitionRequest = {
    id: `req-${Date.now()}`,
    parentId: `p-guest-${Date.now()}`,
    studentId: `s-lead-${Date.now()}`,
    studentName: cleanChildName,
    classGrade: grade,
    board: (board as any) || 'CBSE',
    subjects: Array.isArray(subjects) ? subjects.map((s: string) => sanitizeString(s, 50)) : [subjects ? sanitizeString(subjects, 50) : 'General'],
    teachingMode: (mode as any) || 'Home Tuition',
    district: cleanDistrict,
    city: cleanCity,
    area: cleanCity,
    preferredTiming: 'Evening (5:00 PM - 7:00 PM)',
    budget: '₹3,500 - ₹5,000 / month',
    genderPreference: 'No Preference',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    notes: `${cleanNotes ? cleanNotes + '. ' : ''}Registered from Home Tuition demo form. Parent: ${cleanParentName}, Phone: ${cleanMobile}`,
  };
  dbInstance.tuitionRequests.push(newTuitionReq);

  // Record support ticket / demo lead
  dbInstance.supportTickets.push({
    id: `lead-${Date.now()}`,
    userId: 'guest',
    userName: cleanParentName,
    role: 'PARENT',
    subject: `Home Tuition Demo Request for ${grade} (${board || 'CBSE'})`,
    message: `Parent Mobile: ${cleanMobile}. District: ${cleanDistrict}. Area: ${cleanCity}. Mode: ${mode || 'Home Tuition'}.`,
    status: 'Open',
    priority: 'High',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Thank you! A BBA Mentors academic counselor will call you within 2 business hours.',
  });
});

// User Notifications
apiRouter.get('/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const notifs = dbInstance.notifications
    .filter((n) => n.userId === req.user!.userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(notifs);
});

// Mark Notification as Read
apiRouter.post('/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const notif = dbInstance.notifications.find((n) => n.id === req.params.id && n.userId === req.user!.userId);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

// Reset Demo Data (ADMIN ONLY - protected from public access & tampering)
apiRouter.post('/demo/reset', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  resetDatabase();
  res.json({ success: true, message: 'Database reset to initial demo seeds.' });
});

export default apiRouter;
