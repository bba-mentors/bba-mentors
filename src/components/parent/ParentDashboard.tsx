import { useState, useEffect, type FormEvent } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  User,
  Phone,
  BarChart3,
  FileText,
  AlertCircle,
  Plus,
  Printer,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { BIHAR_SCHOOL_CLASSES } from '../../data/classes.ts';
import type {
  Student,
  Mentor,
  StudentProgressSummary,
  WeeklyExam,
  ExamAttempt,
  ClassReport,
  AttendanceRecord,
  HomeworkItem,
} from '../../types/index.ts';
import { ExamEngineModal } from './ExamEngineModal.tsx';

interface ParentDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const { user } = useAuth();

  // Children State
  const [children, setChildren] = useState<(Student & { mentor?: Mentor | null })[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [loadingChildren, setLoadingChildren] = useState(true);

  // Tab State: 'overview' | 'analytics' | 'exams' | 'reports' | 'attendance' | 'homework' | 'monthly-report'
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Selected Student Data
  const [summary, setSummary] = useState<StudentProgressSummary | null>(null);
  const [classReports, setClassReports] = useState<ClassReport[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [publishedExams, setPublishedExams] = useState<WeeklyExam[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Active Exam Modal
  const [activeExamToTake, setActiveExamToTake] = useState<WeeklyExam | null>(null);

  // Add Child Modal State
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildForm, setNewChildForm] = useState({
    name: '',
    classGrade: 'Class 9',
    board: 'CBSE',
    schoolName: '',
    targetSubjects: 'Mathematics, Science',
    weakSubjects: 'Mathematics',
  });
  const [addingChild, setAddingChild] = useState(false);

  // Initial Load: Fetch Children for logged-in parent
  useEffect(() => {
    loadChildren();
  }, [user]);

  async function loadChildren() {
    setLoadingChildren(true);
    try {
      const kids = await api.getParentChildren();
      setChildren(kids);
      if (kids.length > 0) {
        setSelectedChildId(kids[0].id);
      }
    } catch (err) {
      console.error('Failed to load children:', err);
    } finally {
      setLoadingChildren(false);
    }
  }

  // When selected child changes, load all their records
  useEffect(() => {
    if (!selectedChildId) return;
    loadStudentData(selectedChildId);
  }, [selectedChildId]);

  async function loadStudentData(studentId: string) {
    setLoadingData(true);
    try {
      const selectedKid = children.find((c) => c.id === studentId);
      const [sum, rep, att, hw, exams, pub] = await Promise.all([
        api.getStudentSummary(studentId),
        api.getStudentClassReports(studentId),
        api.getStudentAttendance(studentId),
        api.getStudentHomework(studentId),
        api.getStudentExamHistory(studentId),
        api.getPublishedExams(selectedKid?.classGrade, selectedKid?.board),
      ]);
      setSummary(sum);
      setClassReports(rep);
      setAttendanceRecords(att);
      setHomeworkList(hw);
      setExamHistory(exams);
      setPublishedExams(pub);
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoadingData(false);
    }
  }

  const handleAddChildSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newChildForm.name) return;
    setAddingChild(true);
    try {
      const created = await api.addChild({
        name: newChildForm.name,
        classGrade: newChildForm.classGrade,
        board: newChildForm.board,
        schoolName: newChildForm.schoolName,
        targetSubjects: newChildForm.targetSubjects.split(',').map((s) => s.trim()),
        weakSubjects: newChildForm.weakSubjects.split(',').map((s) => s.trim()),
      });
      setShowAddChildModal(false);
      setNewChildForm({
        name: '',
        classGrade: 'Class 9',
        board: 'CBSE',
        schoolName: '',
        targetSubjects: 'Mathematics, Science',
        weakSubjects: 'Mathematics',
      });
      await loadChildren();
      setSelectedChildId(created.id);
    } catch (err) {
      console.error(err);
      alert('Failed to add child.');
    } finally {
      setAddingChild(false);
    }
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Print progress report handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        {/* TOP BAR: Parent Header & Child Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                Parent Portal
              </span>
              <span className="text-xs text-slate-500">Welcome, {user?.name || 'Parent'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Student Learning & Progress Monitor
            </h1>
            <p className="text-xs text-slate-500">
              Live updates for your enrolled children across Bihar home tuition & weekly assessments.
            </p>
          </div>

          {/* Child Switcher & Add Child */}
          <div className="flex items-center gap-3">
            {children.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <span className="text-xs font-semibold text-slate-600 pl-2">Student:</span>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.classGrade} - {c.board})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setShowAddChildModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Child</span>
            </button>
          </div>
        </div>

        {/* New Registered Parent Welcome State if No Enrolled Children */}
        {children.length === 0 && (
          <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8 text-blue-900" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-xl font-black text-slate-900">Welcome to Bihar Board Achievers Mentors!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your parent account is registered and active. Enroll your child below to begin tracking weekly Sunday assessments, daily home tuition reports, and verified mentor assignments.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowAddChildModal(true)}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll Your Child Now</span>
              </button>
              <button
                onClick={() => onNavigate('find-mentor')}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <span>Find Home Tuition Mentor</span>
              </button>
            </div>
          </div>
        )}

        {/* 6 CORE METRIC CARDS (Mandated) */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Overall Progress */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Overall Progress</span>
              <div className="text-2xl font-black text-slate-900">{summary.overallScore}%</div>
              <span className="text-[10px] text-slate-400">Previous: {summary.previousScore}%</span>
            </div>

            {/* 2. Weekly Score */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Weekly Score</span>
              <div className="text-2xl font-black text-blue-900">{summary.weeklyScore}%</div>
              <span className="text-[10px] text-blue-700 font-semibold">Latest Assessment</span>
            </div>

            {/* 3. Attendance */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Attendance</span>
              <div className="text-2xl font-black text-emerald-700">{summary.attendancePercentage}%</div>
              <span className="text-[10px] text-slate-400">
                {summary.attendedClasses} of {summary.totalClasses} Present
              </span>
            </div>

            {/* 4. Classes Completed */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Classes Completed</span>
              <div className="text-2xl font-black text-slate-900">{summary.attendedClasses}</div>
              <span className="text-[10px] text-slate-400">of {summary.totalClasses} scheduled</span>
            </div>

            {/* 5. Improvement */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Improvement</span>
              <div className="text-2xl font-black text-emerald-600">
                {summary.improvementPercentage >= 0 ? '+' : ''}
                {summary.improvementPercentage}%
              </div>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                Improved
              </span>
            </div>

            {/* 6. Upcoming Exam */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Upcoming Exam</span>
              <div className="text-base font-bold text-slate-900 truncate">
                {publishedExams.length > 0 ? publishedExams[0].title.split(':')[0] : 'Sunday Assessment'}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold block">
                {publishedExams.length > 0 ? `${publishedExams[0].questions.length} MCQs` : 'Scheduled Weekend'}
              </span>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview & Mentor' },
            { id: 'analytics', label: 'Performance Analytics' },
            { id: 'exams', label: `Weekly Assessments (${examHistory.length})` },
            { id: 'reports', label: `Class Reports (${classReports.length})` },
            { id: 'attendance', label: 'Attendance' },
            { id: 'homework', label: `Homework (${homeworkList.length})` },
            { id: 'monthly-report', label: 'Official Monthly Report 📄' },
            { id: 'profile', label: 'Parent & Student Profile 👤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && summary && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Col 1: Assigned Mentor Card */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Assigned Home Tutor & Mentor
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active & Verified
                  </span>
                </div>

                {selectedChild?.mentor ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedChild.mentor.profilePhoto}
                        alt={selectedChild.mentor.fullName}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-900">
                          {selectedChild.mentor.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-blue-900">
                          {selectedChild.mentor.qualification} • {selectedChild.mentor.college}
                        </p>
                        <p className="text-xs text-slate-500">
                          Experience: {selectedChild.mentor.teachingExperience}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{selectedChild.mentor.rating}</span>
                          <span className="text-slate-400 font-normal">({selectedChild.mentor.reviewCount} parent reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Direct Contact:</span>
                        <span className="font-semibold text-slate-800">{selectedChild.mentor.mobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Teaching Mode:</span>
                        <span className="font-semibold text-slate-800">{selectedChild.mentor.teachingMode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Subjects Handled:</span>
                        <span className="font-semibold text-slate-800">{selectedChild.mentor.subjects.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Schedule:</span>
                        <span className="font-semibold text-slate-800">{selectedChild.mentor.availability}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <p className="text-xs text-slate-500">No mentor assigned yet for this child.</p>
                    <button
                      onClick={() => onNavigate('find-mentor')}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold"
                    >
                      Find a Mentor in Your Area
                    </button>
                  </div>
                )}
              </div>

              {/* Col 2: Recent Class Report & Teacher Remarks */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Latest Class Log & Remarks
                  </span>
                  <span className="text-xs text-slate-400">
                    {classReports.length > 0 ? classReports[0].date : 'Recent'}
                  </span>
                </div>

                {classReports.length > 0 ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Topic Covered:</span>
                      <p className="font-bold text-slate-900 text-sm">{classReports[0].topicCovered}</p>
                      <p className="text-slate-500 mt-0.5">{classReports[0].subtopics}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500 block">Understanding Level</span>
                        <span className="font-bold text-emerald-800 text-xs mt-0.5 block">
                          {classReports[0].understandingLevel}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500 block">Class Participation</span>
                        <span className="font-bold text-blue-900 text-xs mt-0.5 block">
                          {classReports[0].classParticipation}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
                        Mentor's Note to Parent:
                      </span>
                      <p className="text-slate-700 italic">"{classReports[0].remarks}"</p>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <strong>Assigned Homework:</strong> {classReports[0].homeworkAssigned}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No class logs recorded yet.</p>
                )}
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Weekly Assessment Ready</h4>
                  <p className="text-[11px] text-slate-500">Test concepts taught this week</p>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800"
                >
                  Take Exam
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Official Progress Report</h4>
                  <p className="text-[11px] text-slate-500">Download or print monthly card</p>
                </div>
                <button
                  onClick={() => setActiveTab('monthly-report')}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                >
                  View Report
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Need Additional Subjects?</h4>
                  <p className="text-[11px] text-slate-500">English, Hindi, or Sanskrit</p>
                </div>
                <button
                  onClick={() => onNavigate('find-mentor')}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  Browse Tutors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PERFORMANCE ANALYTICS TAB */}
        {activeTab === 'analytics' && summary && (
          <div className="space-y-6">
            {/* Progression Chart (Week 1 -> Week 5) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Weekly Assessment Score Progression
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Learning Trajectory</h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +{summary.improvementPercentage}% Net Improvement
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.weeklyScores || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Score']}
                      labelFormatter={(label: any) => `Assessment: ${label}`}
                      contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1e3a8a"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#1e3a8a', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Breakdown & Strong / Weak Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Subject Breakdown Bar Chart */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900">
                  Subject-Wise Performance
                </h3>
                <div className="space-y-3 pt-2">
                  {summary.subjectBreakdown.map((sb) => (
                    <div key={sb.subject} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{sb.subject}</span>
                        <span>{sb.score}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sb.score >= 80
                              ? 'bg-emerald-500'
                              : sb.score >= 70
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${sb.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strong vs Weak Topics Diagnosed */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    Diagnosed Strong Topics (Mastered)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.strongTopics.map((t) => (
                      <span key={t} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                    Focus Target Topics (Needs Practice)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.weakTopics.map((t) => (
                      <span key={t} className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 block text-[11px]">Academic Action Plan:</span>
                  <p className="text-slate-600">{summary.recommendations}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. WEEKLY ASSESSMENTS TAB */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            {/* Published / Available Exams to Take */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Available Weekly Assessments</h3>
                  <p className="text-xs text-slate-500">
                    Standardized curriculum assessments aligned with {selectedChild?.board} • {selectedChild?.classGrade}
                  </p>
                </div>
              </div>

              {publishedExams.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No upcoming assessments pending for this grade.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publishedExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition space-y-3 text-left shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                          {exam.subject} • {exam.board}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {exam.durationMinutes} mins
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Chapter: {exam.chapterName}</p>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <strong>Topics:</strong> {exam.topicsCovered.join(', ')}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                        <span className="text-xs text-slate-500">{exam.totalMarks} Marks • {exam.questions.length} MCQs</span>
                        <button
                          onClick={() => setActiveExamToTake(exam)}
                          className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                        >
                          Take Assessment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exam Attempts History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Completed Assessments History</h3>
              {examHistory.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No assessments completed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                        <th className="p-3">Exam Title</th>
                        <th className="p-3">Date Completed</th>
                        <th className="p-3">Score Obtained</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Score Shift</th>
                        <th className="p-3">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {examHistory.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-900">{att.examTitle}</td>
                          <td className="p-3">{new Date(att.completedAt).toLocaleDateString()}</td>
                          <td className="p-3 font-bold text-slate-900">
                            {att.score} / {att.maxMarks}
                          </td>
                          <td className="p-3 font-bold text-blue-900">{att.percentage}%</td>
                          <td className="p-3 font-bold">
                            {(() => {
                              const impNum = Number(att.improvement ?? att.scoreDifference ?? 0);
                              return (
                                <span className={impNum >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                                  {impNum >= 0 ? '+' : ''}{impNum}%
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-3">
                            {att.correctAnswers} of {att.totalQuestions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. CLASS REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Daily Home Tuition Class Logs</h3>
                <p className="text-xs text-slate-500">
                  Every class recorded and verified by mentor: topics, homework, and student understanding.
                </p>
              </div>
            </div>

            {classReports.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No class reports available.</p>
            ) : (
              <div className="space-y-4">
                {classReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-900 text-white">
                          {report.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{report.topicCovered}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Date: {report.date}</span>
                        <span>Mentor: {report.mentorName}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{report.subtopics}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Understanding</span>
                        <span className="font-bold text-emerald-800">{report.understandingLevel}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Participation</span>
                        <span className="font-bold text-blue-900">{report.classParticipation}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 col-span-2">
                        <span className="text-[10px] text-slate-400 block">Assigned Homework</span>
                        <span className="font-semibold text-slate-800 truncate block">{report.homeworkAssigned}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs italic text-slate-700">
                      <strong>Teacher Remark:</strong> "{report.remarks}"
                    </div>

                    {report.nextClassPlan && (
                      <div className="text-[11px] text-slate-500">
                        <strong>Next Class Plan:</strong> {report.nextClassPlan}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. ATTENDANCE TAB */}
        {activeTab === 'attendance' && summary && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Attendance Log</h3>
                <p className="text-xs text-slate-500">
                  {summary.attendancePercentage}% Attendance Rate ({summary.attendedClasses} of {summary.totalClasses} classes attended)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {summary.attendancePercentage >= 90 ? 'Excellent Regularity' : 'Good Regularity'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Total Sessions</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">{summary.totalClasses}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800">Present</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">{summary.attendedClasses}</span>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="text-xs text-red-800">Absent</span>
                <span className="text-2xl font-black text-red-600 block mt-1">
                  {summary.totalClasses - summary.attendedClasses}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs text-blue-900">Attendance Rate</span>
                <span className="text-2xl font-black text-blue-900 block mt-1">{summary.attendancePercentage}%</span>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Recent Sessions Check-in</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {attendanceRecords.map((att) => (
                  <div key={att.id} className="p-3 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{att.date}</span>
                      <span className="text-slate-500">Time: {att.time || 'Evening'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 italic text-[11px]">{att.remarks}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        att.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'Rescheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {att.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. HOMEWORK TRACKER TAB */}
        {activeTab === 'homework' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Homework & Practice Tracker</h3>
            {homeworkList.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No homework assignments recorded.</p>
            ) : (
              <div className="space-y-3">
                {homeworkList.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 text-sm">{hw.subject} • {hw.topic}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        hw.status === 'REVIEWED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hw.status === 'SUBMITTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hw.status}
                      </span>
                    </div>

                    <p className="text-slate-700">{hw.description}</p>

                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Assigned: {hw.assignedDate} • Due: {hw.dueDate}</span>
                      {hw.teacherFeedback && (
                        <span className="text-emerald-800 font-semibold italic">
                          Feedback: "{hw.teacherFeedback}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. OFFICIAL MONTHLY PROGRESS REPORT TAB (Printable & Downloadable) */}
        {activeTab === 'monthly-report' && summary && selectedChild && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Official academic document ready for printing or parent-teacher review.
              </span>
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

            {/* Printable Formal Card */}
            <div
              id="printable-report"
              className="bg-white rounded-2xl border-2 border-slate-300 p-8 sm:p-10 shadow-md space-y-8 text-left"
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">BBA MENTORS</h2>
                    <p className="text-xs text-blue-900 font-bold tracking-widest uppercase">
                      Official Student Progress & Assessment Report
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-0.5">
                  <p><strong>Report Period:</strong> Term Cycle 1 (Weeks 1 to 5)</p>
                  <p><strong>Issue Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Region:</strong> Bihar Academic Center</p>
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Student Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedChild.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Class & Board:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedChild.classGrade} ({selectedChild.board})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Parent Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{user?.name || 'Rajesh Sharma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned Mentor:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedChild.mentor?.fullName || 'Er. Amit Kumar (NIT Patna)'}
                  </span>
                </div>
              </div>

              {/* Executive Academic Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500">Overall Mastery</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">{summary.overallScore}%</div>
                  <span className="text-[10px] text-slate-400">Baseline: {summary.previousScore}%</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500">Latest Weekly Score</span>
                  <div className="text-3xl font-black text-blue-900 mt-1">{summary.weeklyScore}%</div>
                  <span className="text-[10px] text-blue-700 font-semibold">Standard Test #5</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500">Measured Growth</span>
                  <div className="text-3xl font-black text-emerald-600 mt-1">
                    +{summary.improvementPercentage}%
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">↑ Consistent Gain</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500">Tuition Attendance</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">{summary.attendancePercentage}%</div>
                  <span className="text-[10px] text-slate-400">
                    {summary.attendedClasses} / {summary.totalClasses} Sessions
                  </span>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Subject Performance Assessment
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Assessment Marks</th>
                        <th className="p-3">Evaluation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {summary.subjectBreakdown.map((sb) => (
                        <tr key={sb.subject}>
                          <td className="p-3 font-bold text-slate-900">{sb.subject}</td>
                          <td className="p-3 font-extrabold text-blue-900">{sb.score}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sb.score >= 80 ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                            }`}>
                              {sb.score >= 80 ? 'Distinction Standard' : 'Proficient Standard'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strong & Weak Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase">Strong Topics</h4>
                  <p className="text-xs text-slate-700">{summary.strongTopics.join(', ')}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase">Focus Areas for Next Cycle</h4>
                  <p className="text-xs text-slate-700">{summary.weakTopics.join(', ')}</p>
                </div>
              </div>

              {/* Mentor Remarks & Recommendations */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                  Academic Counselor & Mentor Recommendation:
                </h4>
                <p className="text-slate-700 leading-relaxed italic">
                  "{summary.recommendations}"
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-slate-400 mx-auto w-36 mb-1"></div>
                  <span className="text-slate-600 font-semibold">Assigned Mentor Signature</span>
                </div>
                <div>
                  <div className="h-10 border-b border-slate-400 mx-auto w-36 mb-1"></div>
                  <span className="text-slate-600 font-semibold">BBA Mentors Academic Director</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="h-10 border-b border-slate-400 mx-auto w-36 mb-1"></div>
                  <span className="text-slate-600 font-semibold">Parent Acknowledgement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. PARENT & STUDENT PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Parent & Enrolled Student Profile</h2>
                  <p className="text-xs text-slate-500">
                    Real registered credentials and student details stored in your BBA Mentors account.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddChildModal(true)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Child</span>
                  </button>
                  <button
                    onClick={() => onNavigate('find-mentor')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Find Mentor For Child
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-800" />
                    <span>Parent Registered Information</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Full Name</span>
                      <span className="font-bold text-slate-900 text-sm">{user?.name || 'Registered Parent'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Registered Email</span>
                      <span className="font-semibold text-slate-800">{user?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Contact Mobile</span>
                      <span className="font-semibold text-slate-800">{user?.mobile || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">District & State</span>
                      <span className="font-semibold text-slate-800">
                        {user?.district || 'Patna'}, {user?.state || 'Bihar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enrolled Children Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-800" />
                    <span>Enrolled Student(s) ({children.length})</span>
                  </h3>
                  {children.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <p className="text-xs text-slate-600 font-semibold">No student registered yet.</p>
                      <button
                        onClick={() => setShowAddChildModal(true)}
                        className="px-3 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-lg"
                      >
                        Enroll Child Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {children.map((ch) => (
                        <div key={ch.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900 text-sm">{ch.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                              {ch.classGrade} ({ch.board})
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px]">School: {ch.schoolName || 'Not specified'}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {ch.targetSubjects.map((sub, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE EXAM ENGINE MODAL */}
      {activeExamToTake && selectedChild && (
        <ExamEngineModal
          exam={activeExamToTake}
          studentId={selectedChild.id}
          studentName={selectedChild.name}
          onClose={() => setActiveExamToTake(null)}
          onAttemptCompleted={(attempt) => {
            loadStudentData(selectedChild.id);
          }}
        />
      )}

      {/* ADD CHILD MODAL */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative text-left">
            <h3 className="text-lg font-black text-slate-900">Add Another Child</h3>
            <p className="text-xs text-slate-500">
              Enroll another child to track their tuition and weekly assessments.
            </p>

            <form onSubmit={handleAddChildSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Child's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newChildForm.name}
                  onChange={(e) => setNewChildForm({ ...newChildForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Grade *</label>
                  <select
                    value={newChildForm.classGrade}
                    onChange={(e) => setNewChildForm({ ...newChildForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    {BIHAR_SCHOOL_CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Education Board *</label>
                  <select
                    value={newChildForm.board}
                    onChange={(e) => setNewChildForm({ ...newChildForm, board: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="BSEB">BSEB (Bihar Board)</option>
                    <option value="ICSE">ICSE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  placeholder="e.g. Loyola High School, Patna"
                  value={newChildForm.schoolName}
                  onChange={(e) => setNewChildForm({ ...newChildForm, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subjects Needing Attention</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Science"
                  value={newChildForm.targetSubjects}
                  onChange={(e) => setNewChildForm({ ...newChildForm, targetSubjects: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingChild}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow"
                >
                  {addingChild ? 'Saving...' : 'Add Child to Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
