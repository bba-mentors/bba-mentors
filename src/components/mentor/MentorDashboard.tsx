import { useState, useEffect, type FormEvent } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Calendar,
  BookOpen,
  FileText,
  AlertCircle,
  Plus,
  Clock,
  Star,
  Send,
  X,
  TrendingUp,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type {
  Student,
  StudentProgressSummary,
  ClassReport,
  AttendanceRecord,
} from '../../types/index.ts';

interface MentorDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export function MentorDashboard({ onNavigate }: MentorDashboardProps) {
  const { user } = useAuth();
  const [assignedStudents, setAssignedStudents] = useState<
    (Student & { parentName?: string; parentMobile?: string; summary: StudentProgressSummary })[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [reportModalStudent, setReportModalStudent] = useState<Student | null>(null);
  const [attendanceModalStudent, setAttendanceModalStudent] = useState<Student | null>(null);
  const [homeworkModalStudent, setHomeworkModalStudent] = useState<Student | null>(null);
  const [studentDetailModal, setStudentDetailModal] = useState<
    (Student & { summary: StudentProgressSummary; parentName?: string; parentMobile?: string }) | null
  >(null);

  // Form states
  const [reportForm, setReportForm] = useState({
    subject: 'Mathematics',
    topicCovered: '',
    subtopics: '',
    homeworkAssigned: '',
    understandingLevel: 'Good' as 'Excellent' | 'Good' | 'Average' | 'Needs Improvement',
    classParticipation: 'Active' as 'Active' | 'Moderate' | 'Passive',
    difficultiesObserved: '',
    nextClassPlan: '',
    remarks: '',
  });

  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'RESCHEDULED',
    remarks: 'Regular scheduled session completed on time.',
  });

  const [homeworkForm, setHomeworkForm] = useState({
    subject: 'Mathematics',
    topic: '',
    description: '',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMentorData();
  }, [user]);

  async function loadMentorData() {
    setLoading(true);
    try {
      const students = await api.getMentorAssignedStudents();
      setAssignedStudents(students);
    } catch (err) {
      console.error('Failed to load mentor students:', err);
    } finally {
      setLoading(false);
    }
  }

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Submit Class Report
  const handleReportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reportModalStudent || !reportForm.topicCovered) return;
    setSubmitting(true);
    try {
      await api.submitClassReport({
        studentId: reportModalStudent.id,
        date: new Date().toISOString().split('T')[0],
        subject: reportForm.subject,
        topicCovered: reportForm.topicCovered,
        subtopics: reportForm.subtopics,
        homeworkAssigned: reportForm.homeworkAssigned,
        understandingLevel: reportForm.understandingLevel,
        classParticipation: reportForm.classParticipation,
        difficultiesObserved: reportForm.difficultiesObserved,
        nextClassPlan: reportForm.nextClassPlan,
        remarks: reportForm.remarks,
      });
      setReportModalStudent(null);
      setReportForm({
        subject: 'Mathematics',
        topicCovered: '',
        subtopics: '',
        homeworkAssigned: '',
        understandingLevel: 'Good',
        classParticipation: 'Active',
        difficultiesObserved: '',
        nextClassPlan: '',
        remarks: '',
      });
      showToast('Daily class report logged successfully! Sent to Parent Dashboard.');
      loadMentorData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit class report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Attendance
  const handleAttendanceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!attendanceModalStudent) return;
    setSubmitting(true);
    try {
      await api.markAttendance({
        studentId: attendanceModalStudent.id,
        date: attendanceForm.date,
        status: attendanceForm.status,
        remarks: attendanceForm.remarks,
      });
      setAttendanceModalStudent(null);
      showToast('Attendance updated successfully.');
      loadMentorData();
    } catch (err) {
      console.error(err);
      alert('Failed to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Homework
  const handleHomeworkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!homeworkModalStudent || !homeworkForm.description) return;
    setSubmitting(true);
    try {
      await api.createHomework({
        studentId: homeworkModalStudent.id,
        subject: homeworkForm.subject,
        topic: homeworkForm.topic,
        description: homeworkForm.description,
        dueDate: homeworkForm.dueDate,
        assignedDate: new Date().toISOString().split('T')[0],
      });
      setHomeworkModalStudent(null);
      setHomeworkForm({
        subject: 'Mathematics',
        topic: '',
        description: '',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      });
      showToast('Homework assigned and notified to student & parent.');
    } catch (err) {
      console.error(err);
      alert('Failed to assign homework.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        {/* Success notification banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mentor Profile Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl">
              AK
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Mentor Portal
                </span>
                <span className="text-xs text-slate-500">Verified Educator • NIT Patna</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user?.name || 'Er. Amit Kumar'}
              </h1>
              <p className="text-xs text-slate-500">
                Mathematics & Science • 6+ Years Experience • Patna & Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px]">Assigned Students</span>
              <span className="font-extrabold text-slate-900 text-base">{assignedStudents.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px]">Mentor Rating</span>
              <span className="font-extrabold text-amber-600 text-base flex items-center gap-1 justify-center">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                4.9
              </span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Assigned Home Tuition Students</h2>
            <p className="text-xs text-slate-500">
              Submit daily session logs, mark check-ins, and view weak topics diagnosed by BBA Mentors assessments.
            </p>
          </div>
        </div>

        {/* Assigned Students List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading student rosters...</div>
        ) : assignedStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <p className="text-sm font-bold text-slate-700">No active students assigned yet.</p>
            <p className="text-xs text-slate-500">
              The BBA Mentors administration team will match pending tuition inquiries in your preferred areas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Student Info & Stats */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900">{student.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                      {student.classGrade} ({student.board})
                    </span>
                    <span className="text-xs text-slate-500">{student.schoolName}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Overall Score</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {student.summary.overallScore}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Weekly Assessment</span>
                      <span className="font-extrabold text-blue-900 text-sm mt-0.5 block">
                        {student.summary.weeklyScore}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Growth</span>
                      <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">
                        +{student.summary.improvementPercentage}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Attendance</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {student.summary.attendancePercentage}% ({student.summary.attendedClasses} classes)
                      </span>
                    </div>
                  </div>

                  {/* Weak Topics to Focus on During Tuition */}
                  <div className="text-xs flex items-center gap-2 flex-wrap pt-1">
                    <span className="font-bold text-amber-800">Target Weak Topics to Clear:</span>
                    {student.summary.weakTopics.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex lg:flex-col justify-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setReportModalStudent(student);
                      setReportForm((prev) => ({
                        ...prev,
                        subject: student.targetSubjects?.[0] || 'Mathematics',
                      }));
                    }}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition text-center shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Submit Class Report</span>
                  </button>

                  <button
                    onClick={() => setAttendanceModalStudent(student)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Mark Attendance</span>
                  </button>

                  <button
                    onClick={() => {
                      setHomeworkModalStudent(student);
                      setHomeworkForm((prev) => ({
                        ...prev,
                        subject: student.targetSubjects?.[0] || 'Mathematics',
                      }));
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Assign Homework</span>
                  </button>

                  <button
                    onClick={() => setStudentDetailModal(student)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition text-center"
                  >
                    View Academic Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: SUBMIT CLASS REPORT */}
      {reportModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 relative max-h-[92vh] overflow-y-auto text-left">
            <button
              onClick={() => setReportModalStudent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                Daily Tuition Log
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Log Class for {reportModalStudent.name}
              </h3>
              <p className="text-xs text-slate-500">
                Submitted reports automatically update the Parent's Dashboard feed.
              </p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={reportForm.subject}
                    onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Understanding Level *</label>
                  <select
                    value={reportForm.understandingLevel}
                    onChange={(e) => setReportForm({ ...reportForm, understandingLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Excellent">Excellent (Mastered concept)</option>
                    <option value="Good">Good (Clear with minor hints)</option>
                    <option value="Average">Average (Requires more practice)</option>
                    <option value="Needs Improvement">Needs Improvement (Struggling)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Main Topic Covered *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Chapter 8: Introduction to Trigonometry"
                  value={reportForm.topicCovered}
                  onChange={(e) => setReportForm({ ...reportForm, topicCovered: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtopics & Exercises Solved</label>
                <input
                  type="text"
                  placeholder="e.g. Trigonometric ratios formulas, Ex 8.1 Q1 to Q8"
                  value={reportForm.subtopics}
                  onChange={(e) => setReportForm({ ...reportForm, subtopics: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Homework *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Ex 8.1 remaining questions & revise sin/cos values table"
                  value={reportForm.homeworkAssigned}
                  onChange={(e) => setReportForm({ ...reportForm, homeworkAssigned: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Participation</label>
                  <select
                    value={reportForm.classParticipation}
                    onChange={(e) => setReportForm({ ...reportForm, classParticipation: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Active">Active & Responsive</option>
                    <option value="Moderate">Moderate Focus</option>
                    <option value="Passive">Passive / Distracted</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulties Observed</label>
                  <input
                    type="text"
                    placeholder="e.g. Confused between sec and cosec"
                    value={reportForm.difficultiesObserved}
                    onChange={(e) => setReportForm({ ...reportForm, difficultiesObserved: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks for Parent *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Aarav was focused today. Speed improved noticeably."
                  value={reportForm.remarks}
                  onChange={(e) => setReportForm({ ...reportForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Session Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Specific angles (30, 45, 60 degrees) & Ex 8.2"
                  value={reportForm.nextClassPlan}
                  onChange={(e) => setReportForm({ ...reportForm, nextClassPlan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold transition shadow"
                >
                  {submitting ? 'Submitting...' : 'Save & Publish Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MARK ATTENDANCE */}
      {attendanceModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 relative text-left">
            <button
              onClick={() => setAttendanceModalStudent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-black text-slate-900">Mark Attendance</h3>
              <p className="text-xs text-slate-500">Student: {attendanceModalStudent.name}</p>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Date</label>
                <input
                  type="date"
                  required
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                >
                  <option value="PRESENT">PRESENT (Conducted)</option>
                  <option value="ABSENT">ABSENT (Student cancelled)</option>
                  <option value="RESCHEDULED">RESCHEDULED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  value={attendanceForm.remarks}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceModalStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  {submitting ? 'Updating...' : 'Save Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN HOMEWORK */}
      {homeworkModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative text-left">
            <button
              onClick={() => setHomeworkModalStudent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-black text-slate-900">Assign Homework Task</h3>
              <p className="text-xs text-slate-500">For {homeworkModalStudent.name}</p>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={homeworkForm.subject}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic / Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 8: Trigonometry Questions"
                  value={homeworkForm.topic}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Description & Instructions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specific questions to complete in homework notebook..."
                  value={homeworkForm.description}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHomeworkModalStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold"
                >
                  {submitting ? 'Assigning...' : 'Assign Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: STUDENT ACADEMIC PROFILE */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setStudentDetailModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Academic Profile & Assessment Insights
              </span>
              <h3 className="text-xl font-black text-slate-900">{studentDetailModal.name}</h3>
              <p className="text-xs text-slate-500">
                {studentDetailModal.classGrade} ({studentDetailModal.board}) • {studentDetailModal.schoolName}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Parent Contact:</span>
                <p className="text-slate-600">
                  {studentDetailModal.parentName || 'Rajesh Sharma'} ({studentDetailModal.parentMobile || '+91 98350 12345'})
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1">Strong Topics:</span>
                <p className="text-emerald-800">{studentDetailModal.summary.strongTopics.join(', ')}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900 block mb-1">Weak Topics (To clear in next sessions):</span>
                <p className="text-amber-800">{studentDetailModal.summary.weakTopics.join(', ')}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-1">BBA Mentors Recommendation:</span>
                <p className="text-blue-900 italic">"{studentDetailModal.summary.recommendations}"</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setStudentDetailModal(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
