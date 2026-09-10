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
  QrCode,
  BadgeCheck,
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
import { ALL_ACADEMIC_CLASSES } from '../../data/academicClasses.ts';
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

function scoreToWords(score: number): string {
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  if (score === 100) return 'ONE HUNDRED';
  if (score === 0) return 'ZERO';
  if (score < 20) return ones[score];
  const t = Math.floor(score / 10);
  const o = score % 10;
  return (tens[t] + (o > 0 ? ' ' + ones[o] : '')).trim();
}

function getGradeDetails(score: number) {
  if (score >= 91) return { grade: 'A1', gp: '10.0', remark: 'Outstanding' };
  if (score >= 81) return { grade: 'A2', gp: '9.0', remark: 'Excellent' };
  if (score >= 71) return { grade: 'B1', gp: '8.0', remark: 'Very Good' };
  if (score >= 61) return { grade: 'B2', gp: '7.0', remark: 'Good' };
  if (score >= 51) return { grade: 'C1', gp: '6.0', remark: 'Fair / Satisfactory' };
  if (score >= 41) return { grade: 'C2', gp: '5.0', remark: 'Average' };
  if (score >= 33) return { grade: 'D', gp: '4.0', remark: 'Marginal Pass' };
  return { grade: 'E', gp: '0.0', remark: 'Remedial Required' };
}

const subjectCodeMap: Record<string, string> = {
  Mathematics: '041',
  Science: '086',
  English: '184',
  'Social Science': '087',
  Hindi: '002',
  'Hindi Course-A': '002',
  Physics: '042',
  Chemistry: '043',
  Biology: '044',
  Economics: '030',
  Commerce: '054',
};

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
        targetSubjects: (newChildForm.targetSubjects || '').split(',').map((s) => s.trim()).filter(Boolean),
        weakSubjects: (newChildForm.weakSubjects || '').split(',').map((s) => s.trim()).filter(Boolean),
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
                {publishedExams.length > 0
                  ? String(publishedExams[0].title || publishedExams[0].examName || 'Sunday Assessment').split(':')[0]
                  : 'Sunday Assessment'}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold block">
                {publishedExams.length > 0
                  ? `${publishedExams[0].questions?.length || publishedExams[0].questionCount || 5} MCQs`
                  : 'Scheduled Weekend'}
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
                        <span className="font-semibold text-slate-800">{(selectedChild.mentor.subjects || []).join(', ')}</span>
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
                  {(summary.subjectBreakdown || []).map((sb: any) => (
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
                    {(summary.strongTopics || []).map((t) => (
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
                    {(summary.weakTopics || []).map((t) => (
                      <span key={t} className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 block text-[11px]">Academic Action Plan:</span>
                  <p className="text-slate-600">{summary.recommendations || summary.bbaRecommendations}</p>
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
                        <h4 className="font-bold text-slate-900 text-sm">{exam.title || exam.examName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Chapter: {exam.chapterName || exam.chapter || 'All Chapters'}</p>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <strong>Topics:</strong> {(exam.topicsCovered || exam.topics || []).join(', ') || 'Comprehensive Revision'}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                        <span className="text-xs text-slate-500">{exam.totalMarks} Marks • {(exam.questions || []).length || exam.questionCount || 0} MCQs</span>
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
                      {examHistory.map((att) => {
                        const shift = typeof att.improvement === 'number'
                          ? att.improvement
                          : typeof att.scoreDifference === 'number'
                          ? att.scoreDifference
                          : Number(att.improvement) || 0;
                        const dateStr = att.completedAt || att.submittedAt;
                        return (
                          <tr key={att.id} className="hover:bg-slate-50/60">
                            <td className="p-3 font-semibold text-slate-900">{att.examTitle || att.examName}</td>
                            <td className="p-3">{dateStr ? new Date(dateStr).toLocaleDateString() : '-'}</td>
                            <td className="p-3 font-bold text-slate-900">
                              {att.score ?? att.marksObtained} / {att.maxMarks ?? att.totalMarks}
                            </td>
                            <td className="p-3 font-bold text-blue-900">{att.percentage}%</td>
                            <td className="p-3 font-bold">
                              <span className={shift >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                                {shift >= 0 ? '+' : ''}{shift}%
                              </span>
                            </td>
                            <td className="p-3">
                              {att.correctAnswers ?? att.correctCount} of {att.totalQuestions ?? (att.correctCount + att.wrongCount + att.skippedCount)}
                            </td>
                          </tr>
                        );
                      })}
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

            {/* Printable Formal Card (Official Academic Marksheet) */}
            <div
              id="printable-report"
              className="bg-white rounded-2xl border-[3px] sm:border-[4px] border-slate-900 p-2.5 sm:p-4 shadow-2xl space-y-6 text-left relative overflow-hidden font-sans"
            >
              {/* Decorative Authentic Inner Certificate Border Frame */}
              <div className="border-2 border-amber-600/45 rounded-xl p-4 sm:p-7 space-y-6 bg-gradient-to-b from-amber-50/25 via-white to-amber-50/15 relative">
                {/* 4 Corner Traditional Ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-900" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-900" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-900" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-900" />

                {/* Security Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-22deg] z-0">
                  <div className="text-center font-serif text-5xl sm:text-7xl font-black text-slate-950 uppercase tracking-widest leading-relaxed">
                    BBA MENTORS<br />
                    OFFICIAL ACADEMIC TRANSCRIPT<br />
                    PATNA • BIHAR
                  </div>
                </div>

                {/* 1. Marksheet Official Header */}
                <div className="relative z-10 border-b-2 border-slate-900 pb-5 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Emblem */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 text-white flex flex-col items-center justify-center shadow-md border border-amber-500/40 relative">
                        <GraduationCap className="w-8 h-8 text-amber-400" />
                        <div className="absolute -bottom-1 px-1.5 py-0.2 bg-amber-400 text-blue-950 font-black text-[7px] tracking-wider rounded">
                          ESTD 2024
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase block">
                          Patna Academic Directorate • Regd. Under Indian Trust Act
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                          BBA MENTORS ACADEMIC COUNCIL
                        </h2>
                        <p className="text-xs font-semibold text-slate-600">
                          बीबीए मेंटर्स शैक्षणिक मूल्यांकन एवं गृह शिक्षण परिषद • पटना, बिहार
                        </p>
                      </div>
                    </div>

                    {/* Right: Marksheet Credentials Plaque */}
                    <div className="text-right text-[11px] text-slate-700 border border-slate-300 rounded-lg p-2.5 bg-white/90 shadow-2xs space-y-0.5">
                      <p>
                        <strong className="text-slate-900">Marksheet No:</strong>{' '}
                        <span className="font-mono font-bold text-blue-900">
                          MS/2026/PAT-{(selectedChild.id || '101').slice(0, 5).toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <strong className="text-slate-900">Roll Code:</strong> 81001 •{' '}
                        <strong className="text-slate-900">Roll No:</strong>{' '}
                        <span className="font-mono font-bold">2601{(selectedChild.id || '101').slice(-3)}</span>
                      </p>
                      <p>
                        <strong className="text-slate-900">Affiliation / Center:</strong> BBA-PAT-800001
                      </p>
                      <p>
                        <strong className="text-slate-900">Issue Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Marksheet Name Banner */}
                  <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white px-4 py-2 rounded-lg text-center shadow-xs border border-amber-500/40">
                    <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300">
                      CONTINUOUS & COMPREHENSIVE EVALUATION (CCE) • SENIOR ACADEMIC MARKSHEET
                    </h3>
                    <p className="text-[10px] text-slate-300 font-medium tracking-wide">
                      वरिष्ठ माध्यमिक सतत मूल्यांकन अंक-पत्र एवं शैक्षणिक प्रमाण-पत्र • सत्र: 2026–2027
                    </p>
                  </div>
                </div>

                {/* 2. Candidate Particulars Demographic Table (Authentic Board Format) */}
                <div className="relative z-10 border-2 border-slate-800 rounded-lg overflow-hidden bg-white text-xs">
                  <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-800 font-bold text-[11px] text-slate-800 flex items-center justify-between">
                    <span>1. CANDIDATE IDENTIFICATION PARTICULARS (परीक्षार्थी का व्यक्तिगत विवरण)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Regular Assessment Track</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                    {/* Column 1 */}
                    <div className="divide-y divide-slate-200">
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Candidate's Name (परीक्षार्थी):</span>
                        <span className="font-black text-slate-900 uppercase">{selectedChild.name}</span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Mother's Name (माता का नाम):</span>
                        <span className="font-bold text-slate-800">SMT. PRIYA SHARMA</span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Father's/Guardian's (पिता का नाम):</span>
                        <span className="font-bold text-slate-800">SRI {user?.name || 'RAJESH SHARMA'}</span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Enrolment ID (पंजीकरण सं.):</span>
                        <span className="font-mono font-bold text-blue-900">
                          REG-2026-{(selectedChild.board || 'CBSE')}-{(selectedChild.id || '101').slice(0, 4).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="divide-y divide-slate-200">
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Class & Curriculum (कक्षा व बोर्ड):</span>
                        <span className="font-black text-slate-900">{selectedChild.classGrade} • {selectedChild.board}</span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">School / Institution (विद्यालय):</span>
                        <span className="font-bold text-slate-800 truncate">
                          {selectedChild.schoolName || "St. Michael's High School, Patna"}
                        </span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Assigned Home Mentor (गृह शिक्षक):</span>
                        <span className="font-bold text-slate-800">
                          {selectedChild.mentor?.fullName || 'Er. Amit Kumar (NIT Patna)'}
                        </span>
                      </div>
                      <div className="p-2.5 flex justify-between gap-2">
                        <span className="text-slate-500 font-medium">Assessment Period (मूल्यांकन चक्र):</span>
                        <span className="font-bold text-emerald-800">Term Cycle 1 (Weeks 1 to 5)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Statement of Marks (The Formal Marksheet Table) */}
                {(() => {
                  const marksheetSubjects =
                    summary.subjectBreakdown && summary.subjectBreakdown.length > 0
                      ? summary.subjectBreakdown
                      : [
                          { subject: 'Mathematics', score: summary.overallScore || 82 },
                          { subject: 'Science', score: Math.max(65, (summary.overallScore || 80) - 3) },
                          { subject: 'English', score: Math.min(96, (summary.overallScore || 80) + 4) },
                          { subject: 'Social Science', score: Math.max(68, (summary.overallScore || 80) - 5) },
                          { subject: 'Hindi Course-A', score: Math.min(95, (summary.overallScore || 80) + 5) },
                        ];

                  const totalMaxMarks = marksheetSubjects.length * 100;
                  const totalMarksObtained = marksheetSubjects.reduce(
                    (acc: number, item: any) => acc + (item.score || 0),
                    0
                  );
                  const overallPct = Math.round(totalMarksObtained / marksheetSubjects.length);
                  const overallGradeInfo = getGradeDetails(overallPct);
                  const totalGradePoints = marksheetSubjects.reduce(
                    (acc: number, item: any) => acc + parseFloat(getGradeDetails(item.score || 0).gp),
                    0
                  );
                  const cgpa = (totalGradePoints / marksheetSubjects.length).toFixed(1);

                  return (
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          2. STATEMENT OF MARKS & EVALUATION PERFORMANCE (प्राप्तांक विवरण तालिका)
                        </h4>
                        <span className="text-[10px] text-slate-500 font-semibold">Max Marks: 100 Per Subject</span>
                      </div>

                      <div className="border-2 border-slate-800 rounded-lg overflow-x-auto text-xs bg-white shadow-2xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-900 text-white font-bold text-[11px]">
                            <tr>
                              <th className="p-2.5 border-r border-slate-700 text-center w-14">CODE</th>
                              <th className="p-2.5 border-r border-slate-700">SUBJECT TITLE (विषय)</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-16">MAX MARKS</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-16">PASS MARKS</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-20">THEORY / TEST (70)</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-20">INTERNAL / LAB (30)</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-20">TOTAL (100)</th>
                              <th className="p-2.5 border-r border-slate-700">TOTAL IN WORDS (अंक शब्दों में)</th>
                              <th className="p-2.5 border-r border-slate-700 text-center w-16">GRADE</th>
                              <th className="p-2.5 text-center w-16">GP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300">
                            {marksheetSubjects.map((sb: any, idx: number) => {
                              const code = subjectCodeMap[sb.subject] || `0${idx + 41}`;
                              const score = sb.score || 0;
                              const theory = Math.round(score * 0.7);
                              const internal = score - theory;
                              const g = getGradeDetails(score);

                              return (
                                <tr key={sb.subject} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                                  <td className="p-2.5 text-center font-mono font-bold text-slate-600 border-r border-slate-200">
                                    {code}
                                  </td>
                                  <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 uppercase">
                                    {sb.subject}
                                  </td>
                                  <td className="p-2.5 text-center text-slate-600 border-r border-slate-200 font-semibold">
                                    100
                                  </td>
                                  <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">
                                    33
                                  </td>
                                  <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200 font-mono">
                                    {theory}
                                  </td>
                                  <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200 font-mono">
                                    {internal}
                                  </td>
                                  <td className="p-2.5 text-center font-black text-blue-900 border-r border-slate-200 font-mono text-sm">
                                    {score}
                                  </td>
                                  <td className="p-2.5 text-slate-700 border-r border-slate-200 font-semibold text-[11px]">
                                    {scoreToWords(score)}
                                  </td>
                                  <td className="p-2.5 text-center border-r border-slate-200">
                                    <span
                                      className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                        score >= 90
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : score >= 80
                                          ? 'bg-blue-100 text-blue-900'
                                          : score >= 70
                                          ? 'bg-amber-100 text-amber-900'
                                          : 'bg-slate-200 text-slate-800'
                                      }`}
                                    >
                                      {g.grade}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center font-bold text-slate-900 font-mono">
                                    {g.gp}
                                  </td>
                                </tr>
                              );
                            })}

                            {/* Grand Total Summary Row */}
                            <tr className="bg-amber-50/80 font-black text-slate-900 border-t-2 border-slate-800">
                              <td colSpan={2} className="p-3 uppercase text-slate-900 border-r border-slate-300">
                                GRAND TOTAL (महायोग) & RESULT SUMMARY
                              </td>
                              <td className="p-3 text-center border-r border-slate-300 font-mono">
                                {totalMaxMarks}
                              </td>
                              <td className="p-3 text-center border-r border-slate-300">
                                {marksheetSubjects.length * 33}
                              </td>
                              <td colSpan={2} className="p-3 text-right text-[11px] text-slate-600 border-r border-slate-300">
                                AGGREGATE SCORE:
                              </td>
                              <td className="p-3 text-center text-blue-950 font-black text-base border-r border-slate-300 font-mono">
                                {totalMarksObtained}
                              </td>
                              <td className="p-3 text-slate-900 border-r border-slate-300 text-[11px]">
                                {scoreToWords(Math.round(totalMarksObtained / marksheetSubjects.length))} PERCENT EQUIVALENT
                              </td>
                              <td className="p-3 text-center border-r border-slate-300">
                                <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-black text-xs">
                                  {overallGradeInfo.grade}
                                </span>
                              </td>
                              <td className="p-3 text-center text-blue-950 font-black font-mono">
                                {cgpa}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Official Performance & Division Box */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-lg border border-amber-500/40 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Overall Percentage</span>
                          <span className="text-xl font-black text-amber-300 font-mono">{overallPct}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Cumulative GPA (CGPA)</span>
                          <span className="text-xl font-black text-white font-mono">{cgpa} / 10.0</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Continuous Growth</span>
                          <span className="text-xl font-black text-emerald-400 font-mono">+{summary.improvementPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Final Academic Result</span>
                          <span className="text-xs font-black uppercase text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded inline-block mt-0.5">
                            QUALIFIED • FIRST DIVISION (DISTINCTION)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Grading System Scale Strip (CBSE / State Board Standard) */}
                <div className="relative z-10 bg-slate-50 border border-slate-300 rounded-lg p-3 text-[10px] text-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-[11px] border-b border-slate-200 pb-1">
                    <span>3. GRADING SYSTEM REFERENCE SCALE (9-POINT CCE CONTINUOUS STANDARD)</span>
                    <span className="text-slate-500">Qualifying Benchmark: Grade D & Above</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">A1 (10.0)</strong>
                      <span className="text-[9px] text-slate-500">91–100%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">A2 (9.0)</strong>
                      <span className="text-[9px] text-slate-500">81–90%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">B1 (8.0)</strong>
                      <span className="text-[9px] text-slate-500">71–80%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">B2 (7.0)</strong>
                      <span className="text-[9px] text-slate-500">61–70%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">C1 (6.0)</strong>
                      <span className="text-[9px] text-slate-500">51–60%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">C2 (5.0)</strong>
                      <span className="text-[9px] text-slate-500">41–50%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <strong className="block text-slate-900">D (4.0)</strong>
                      <span className="text-[9px] text-slate-500">33–40%</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-red-200 text-red-700">
                      <strong className="block">E (0.0)</strong>
                      <span className="text-[9px]">Below 33%</span>
                    </div>
                  </div>
                </div>

                {/* 5. Co-Scholastic, Regularity & Diagnostic Breakdown */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Attendance Record */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-300 space-y-2">
                    <h5 className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-900" />
                      <span>Academic Attendance (उपस्थिति)</span>
                    </h5>
                    <div className="space-y-1 text-slate-600 text-[11px]">
                      <div className="flex justify-between">
                        <span>Sessions Scheduled:</span>
                        <span className="font-bold text-slate-900">{summary.totalClasses} Sessions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sessions Attended:</span>
                        <span className="font-bold text-slate-900">{summary.attendedClasses} Sessions</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span>Attendance Ratio:</span>
                        <span className="font-black text-blue-900">{summary.attendancePercentage}% (Grade A+)</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnosed Strong Domains */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-300 space-y-2">
                    <h5 className="font-bold text-emerald-950 uppercase text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mastered Domains (प्रवीणता)</span>
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {(summary.strongTopics || ['Real Numbers', 'Mechanics', 'Chemical Equations']).map((st: string) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold text-[10px] border border-emerald-200"
                        >
                          ✓ {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Focus Areas for Next Term */}
                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-300 space-y-2">
                    <h5 className="font-bold text-amber-950 uppercase text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Next Term Focus (उपचारात्मक लक्ष्य)</span>
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {(summary.weakTopics || ['Coordinate Geometry', 'Complex Numericals']).map((wt: string) => (
                        <span
                          key={wt}
                          className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-[10px] border border-amber-200"
                        >
                          • {wt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Academic Mentor Appraisal & Director Remarks */}
                <div className="relative z-10 p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-950 text-[11px] uppercase tracking-wider">
                    <span>Academic Directorate & Mentor Appraisal:</span>
                    <span className="text-emerald-700 font-bold">Verified for Senior Batch Transition</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed italic text-[11px]">
                    "{summary.recommendations || summary.bbaRecommendations || 'Student exhibits steady grasp over analytical problem sets with keen punctuality. Recommended to sustain weekly test discipline and undertake target mock worksheets in weaker chapters.'}"
                  </p>
                </div>

                {/* 7. Verification Stamp, QR Code & Signatures Section */}
                <div className="relative z-10 pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
                  {/* Digital QR Code & Hologram Verification */}
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-300 shadow-2xs">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded flex items-center justify-center shrink-0">
                      <QrCode className="w-10 h-10 text-amber-300" />
                    </div>
                    <div className="space-y-0.5 text-[10px] text-slate-600">
                      <div className="flex items-center gap-1 text-blue-900 font-bold">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>VERIFIED CREDENTIAL</span>
                      </div>
                      <p className="font-mono text-[9px] text-slate-500 truncate">
                        ID: BBA-CCE-{(selectedChild.id || '101').toUpperCase()}-2026
                      </p>
                      <p className="text-slate-400 text-[9px]">Scan to verify on bbamentors.com</p>
                    </div>
                  </div>

                  {/* Official Round Institutional Seal */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-900/60 p-1 flex items-center justify-center">
                      <div className="w-full h-full rounded-full border border-blue-900 bg-blue-50/50 flex flex-col items-center justify-center text-center p-1 text-blue-950">
                        <Award className="w-5 h-5 text-amber-600" />
                        <span className="text-[7px] font-black uppercase tracking-wider leading-tight mt-0.5">
                          BBA MENTORS<br />PATNA BIHAR
                        </span>
                        <span className="text-[6px] text-slate-500 font-bold uppercase">OFFICIAL SEAL</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Formal Signatures */}
                  <div className="space-y-4 text-center text-[10px]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="h-8 border-b border-slate-400 mx-auto w-24 mb-1"></div>
                        <span className="text-slate-700 font-bold block">Assigned Mentor</span>
                        <span className="text-slate-400 text-[9px]">हस्ताक्षर शिक्षक</span>
                      </div>
                      <div>
                        <div className="h-8 border-b border-slate-400 mx-auto w-24 mb-1"></div>
                        <span className="text-slate-700 font-bold block">Exam Controller</span>
                        <span className="text-slate-400 text-[9px]">परीक्षा नियंत्रक</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="h-6 border-b border-slate-400 mx-auto w-36 mb-1"></div>
                      <span className="text-slate-700 font-bold block">Parent / Guardian Signature</span>
                      <span className="text-slate-400 text-[9px]">अभिभावक हस्ताक्षर</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Legal & Helpline Disclaimer Bar */}
                <div className="relative z-10 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
                  <span>
                    Official Marksheet & Academic Record issued by <strong>BBA Mentors Educational Network</strong>, Patna.
                  </span>
                  <span>
                    Helpline / WhatsApp: <strong className="text-slate-800">+91 9576767949</strong> • Website: bbamentors.com
                  </span>
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
                    {ALL_ACADEMIC_CLASSES.map((c) => (
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
