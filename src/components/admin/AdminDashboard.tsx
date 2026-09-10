import { useState, useEffect, type FormEvent } from 'react';
import {
  Shield,
  Users,
  Award,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Check,
  X,
  Send,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type {
  TuitionRequest,
  Mentor,
  Student,
  WeeklyExam,
} from '../../types/index.ts';

interface AdminDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // Overview data
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Queues
  const [tuitionRequests, setTuitionRequests] = useState<TuitionRequest[]>([]);
  const [mentorsList, setMentorsList] = useState<Mentor[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);

  // Assign Mentor Modal State
  const [assignModalReq, setAssignModalReq] = useState<TuitionRequest | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Create Exam Form State
  const [examForm, setExamForm] = useState({
    title: 'Weekly Assessment: Trigonometric Ratios & Values',
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapterName: 'Introduction to Trigonometry',
    durationMinutes: 30,
    totalMarks: 20,
    topicsCovered: 'Trigonometric ratios, Standard angles (30, 45, 60), Trigonometric identities',
    questionText: 'If sin θ = 3/5, what is the value of cos θ for an acute angle θ?',
    optionA: '4/5',
    optionB: '3/4',
    optionC: '5/4',
    optionD: '1/2',
    correctAnswerIndex: 0,
    topic: 'Trigonometry Ratios',
    explanation: 'Using the fundamental identity sin²θ + cos²θ = 1, cos θ = √(1 - 9/25) = 4/5.',
  });
  const [examPublishing, setExamPublishing] = useState(false);
  const [examSuccess, setExamSuccess] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, [user]);

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const [ov, reqs, mentors, students] = await Promise.all([
        api.getAdminOverview(),
        api.getTuitionRequests(),
        api.getAdminMentors(),
        api.getAdminStudents(),
      ]);
      setOverview(ov);
      setTuitionRequests(reqs);
      setMentorsList(mentors);
      setStudentsList(students);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Assign Mentor
  const handleAssignMentor = async () => {
    if (!assignModalReq || !selectedMentorId) return;
    setAssigning(true);
    try {
      await api.assignMentor({
        tuitionRequestId: assignModalReq.id,
        studentId: assignModalReq.studentId,
        mentorId: selectedMentorId,
      });
      setAssignModalReq(null);
      setSelectedMentorId('');
      alert('Mentor successfully assigned to tuition request!');
      loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to assign mentor.');
    } finally {
      setAssigning(false);
    }
  };

  // Handle Verify Mentor
  const handleVerifyMentor = async (mentorId: string, status: string) => {
    try {
      await api.verifyMentor({ mentorId, status });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update verification.');
    }
  };

  // Handle Create Weekly Exam
  const handleCreateExam = async (e: FormEvent) => {
    e.preventDefault();
    setExamPublishing(true);
    try {
      await api.createWeeklyExam({
        title: examForm.title,
        classGrade: examForm.classGrade,
        board: examForm.board,
        subject: examForm.subject,
        chapterName: examForm.chapterName,
        durationMinutes: Number(examForm.durationMinutes),
        totalMarks: Number(examForm.totalMarks),
        topicsCovered: examForm.topicsCovered.split(',').map((s) => s.trim()),
        questions: [
          {
            id: `q-${Date.now()}-1`,
            questionText: examForm.questionText,
            options: [examForm.optionA, examForm.optionB, examForm.optionC, examForm.optionD],
            correctAnswerIndex: Number(examForm.correctAnswerIndex),
            explanation: examForm.explanation,
            topic: examForm.topic,
          },
        ],
      });
      setExamSuccess(true);
      setTimeout(() => setExamSuccess(false), 3000);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to publish weekly exam.');
    } finally {
      setExamPublishing(false);
    }
  };

  const COLORS = ['#1e3a8a', '#059669', '#d97706', '#dc2626', '#7c3aed'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        {/* Top Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                Staff Administrator
              </span>
              <span className="text-xs text-slate-400">Bihar Academic Operations Control</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              BBA Mentors Administration Panel
            </h1>
            <p className="text-xs text-slate-400">
              Manage student requests, mentor verification, weekly exam authoring, and provincial metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tuition-requests')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Tuition Requests</span>
              <span className="px-1.5 py-0.2 bg-white text-blue-900 rounded-full text-[10px]">
                {tuitionRequests.filter((r) => r.status === 'Pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('mentors-queue')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Mentors Verification</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'analytics', label: 'Platform Analytics' },
            { id: 'tuition-requests', label: `Tuition Queue (${tuitionRequests.length})` },
            { id: 'mentors-queue', label: `Mentor Directory (${mentorsList.length})` },
            { id: 'students-queue', label: `Students Directory (${studentsList.length})` },
            { id: 'create-exam', label: '+ Author Weekly Exam' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === t.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PLATFORM ANALYTICS */}
        {activeTab === 'analytics' && overview && (
          <div className="space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Total Students</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">
                  {overview.metrics.totalStudents}
                </span>
                <span className="text-[10px] text-slate-400">across Bihar</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Verified Mentors</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">
                  {overview.metrics.verifiedMentors}
                </span>
                <span className="text-[10px] text-slate-400">of {overview.metrics.totalMentors} registered</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Pending Requests</span>
                <span className="text-2xl font-black text-amber-600 block mt-1">
                  {overview.metrics.pendingRequests}
                </span>
                <span className="text-[10px] text-amber-800 font-semibold">Needs Assignment</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Avg Student Gain</span>
                <span className="text-2xl font-black text-emerald-600 block mt-1">
                  +{overview.metrics.avgImprovementPercentage}%
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Positive Improvement</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Active Districts</span>
                <span className="text-2xl font-black text-blue-900 block mt-1">
                  {overview.metrics.activeDistrictsCount}
                </span>
                <span className="text-[10px] text-slate-400">Patna, Gaya, Muzaffarpur...</span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students by District */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Bihar District</h3>
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.charts.studentsByDistrict}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="district" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Students by Education Board */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Students Distribution by Board</h3>
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.charts.studentsByBoard}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="board" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TUITION REQUESTS QUEUE */}
        {activeTab === 'tuition-requests' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Parent Tuition Inquiries & Requests</h3>
              <span className="text-xs text-slate-500">{tuitionRequests.length} Total</span>
            </div>

            <div className="space-y-3">
              {tuitionRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{req.studentName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                        {req.classGrade} ({req.board})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Assigned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      <strong>Parent:</strong> {req.parentName} ({req.parentMobile}) • <strong>Location:</strong> {req.city}, {req.district}
                    </p>
                    <p className="text-slate-500">
                      <strong>Subjects:</strong> {req.subjects.join(', ')} • <strong>Budget:</strong> {req.budget} • <strong>Timing:</strong> {req.preferredTiming}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {req.status === 'Pending' ? (
                      <button
                        onClick={() => {
                          setAssignModalReq(req);
                          setSelectedMentorId('');
                        }}
                        className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-xs shadow-xs"
                      >
                        Assign Mentor
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Assigned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MENTORS VERIFICATION QUEUE */}
        {activeTab === 'mentors-queue' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Mentor Verification & Profiles</h3>
              <span className="text-xs text-slate-500">{mentorsList.length} Mentors</span>
            </div>

            <div className="space-y-4">
              {mentorsList.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col lg:flex-row justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={m.profilePhoto}
                      alt={m.fullName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{m.fullName}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.verificationStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {m.qualification} • {m.college} • {m.teachingExperience} Exp
                      </p>
                      <p className="text-slate-500">
                        <strong>District:</strong> {m.district} ({m.preferredAreas.join(', ')}) • <strong>Mobile:</strong> {m.mobile}
                      </p>
                      <p className="text-slate-500">
                        <strong>Subjects:</strong> {m.subjects.join(', ')} • <strong>Classes:</strong> {m.classes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {m.verificationStatus === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleVerifyMentor(m.id, 'Verified')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                        >
                          Approve & Verify
                        </button>
                        <button
                          onClick={() => handleVerifyMentor(m.id, 'Rejected')}
                          className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg font-bold text-xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleVerifyMentor(m.id, 'PENDING')}
                        className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs"
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDENTS DIRECTORY */}
        {activeTab === 'students-queue' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Registered Students Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class & Board</th>
                    <th className="p-3">School Name</th>
                    <th className="p-3">Target Subjects</th>
                    <th className="p-3">Mentor Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {studentsList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3">{s.classGrade} ({s.board})</td>
                      <td className="p-3">{s.schoolName}</td>
                      <td className="p-3">{s.targetSubjects.join(', ')}</td>
                      <td className="p-3">
                        {s.assignedMentorId ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Assigned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CREATE WEEKLY EXAM */}
        {activeTab === 'create-exam' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Weekly Assessment Authoring
              </span>
              <h3 className="text-xl font-black text-slate-900">Publish Standard Weekly Exam</h3>
              <p className="text-xs text-slate-500">
                Created assessments instantly appear on matching students' dashboards.
              </p>
            </div>

            {examSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Weekly Assessment Published Successfully!</span>
              </div>
            )}

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Grade *</label>
                  <select
                    value={examForm.classGrade}
                    onChange={(e) => setExamForm({ ...examForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Board *</label>
                  <select
                    value={examForm.board}
                    onChange={(e) => setExamForm({ ...examForm, board: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="BSEB">BSEB (Bihar Board)</option>
                    <option value="ICSE">ICSE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={examForm.subject}
                    onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Unit *</label>
                  <input
                    type="text"
                    required
                    value={examForm.chapterName}
                    onChange={(e) => setExamForm({ ...examForm, chapterName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Sample Question & MCQ Options
                </h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question Text *</label>
                  <textarea
                    rows={2}
                    required
                    value={examForm.questionText}
                    onChange={(e) => setExamForm({ ...examForm, questionText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Option A *</label>
                    <input
                      type="text"
                      required
                      value={examForm.optionA}
                      onChange={(e) => setExamForm({ ...examForm, optionA: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Option B *</label>
                    <input
                      type="text"
                      required
                      value={examForm.optionB}
                      onChange={(e) => setExamForm({ ...examForm, optionB: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Option C *</label>
                    <input
                      type="text"
                      required
                      value={examForm.optionC}
                      onChange={(e) => setExamForm({ ...examForm, optionC: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Option D *</label>
                    <input
                      type="text"
                      required
                      value={examForm.optionD}
                      onChange={(e) => setExamForm({ ...examForm, optionD: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Correct Option *</label>
                    <select
                      value={examForm.correctAnswerIndex}
                      onChange={(e) => setExamForm({ ...examForm, correctAnswerIndex: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Topic Sub-category</label>
                    <input
                      type="text"
                      value={examForm.topic}
                      onChange={(e) => setExamForm({ ...examForm, topic: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explanation</label>
                  <input
                    type="text"
                    value={examForm.explanation}
                    onChange={(e) => setExamForm({ ...examForm, explanation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={examPublishing}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow transition"
              >
                {examPublishing ? 'Publishing...' : 'Publish Assessment to Students'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ASSIGN MENTOR MODAL */}
      {assignModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative text-left">
            <button
              onClick={() => setAssignModalReq(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Staff Assignment
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Assign Mentor to {assignModalReq.studentName}
              </h3>
              <p className="text-xs text-slate-500">
                Location: {assignModalReq.city}, {assignModalReq.district} • Board: {assignModalReq.board}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Choose Verified Mentor in {assignModalReq.district}
                </label>
                <select
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="">-- Select Verified Mentor --</option>
                  {mentorsList
                    .filter((m) => m.verificationStatus === 'Verified')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.qualification} - {m.district})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalReq(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedMentorId || assigning}
                  onClick={handleAssignMentor}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold disabled:opacity-40"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
