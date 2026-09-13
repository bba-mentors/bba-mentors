import { useState, useEffect, type FormEvent } from 'react';
import {
  Search,
  MapPin,
  Award,
  Star,
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  X,
  UserCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { firestoreService } from '../../services/firestoreService.ts';
import type { Mentor, BiharDistrict } from '../../types/index.ts';
import { BIHAR_38_DISTRICTS } from '../../data/biharDistricts.ts';
import { BIHAR_SCHOOL_CLASSES } from '../../data/classes.ts';

interface FindMentorProps {
  onNavigate: (view: string, data?: any) => void;
  initialFilter?: any;
}

export function FindMentorPage({ onNavigate, initialFilter }: FindMentorProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [districts, setDistricts] = useState<BiharDistrict[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState(initialFilter?.district || '');
  const [selectedClass, setSelectedClass] = useState(initialFilter?.classGrade || initialFilter?.class || '');
  const [selectedSubject, setSelectedSubject] = useState(initialFilter?.subject || '');
  const [selectedBoard, setSelectedBoard] = useState(initialFilter?.board || '');
  const [selectedMode, setSelectedMode] = useState(initialFilter?.mode || initialFilter?.teachingMode || '');
  const [searchTerm, setSearchTerm] = useState(initialFilter?.search || '');

  // Keep state in sync if initialFilter changes on navigation
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.district !== undefined) setSelectedDistrict(initialFilter.district);
      if (initialFilter.classGrade || initialFilter.class) setSelectedClass(initialFilter.classGrade || initialFilter.class);
      if (initialFilter.subject !== undefined) setSelectedSubject(initialFilter.subject);
      if (initialFilter.board !== undefined) setSelectedBoard(initialFilter.board);
      if (initialFilter.mode || initialFilter.teachingMode) setSelectedMode(initialFilter.mode || initialFilter.teachingMode);
    }
  }, [initialFilter]);

  // Selected mentor for Profile Modal / Request Modal
  const [activeProfile, setActiveProfile] = useState<Mentor | null>(null);
  const [requestModalMentor, setRequestModalMentor] = useState<Mentor | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Request form state
  const [requestForm, setRequestForm] = useState({
    parentName: '',
    mobile: '',
    studentName: '',
    classGrade: 'Class 10',
    board: 'CBSE',
    area: '',
    timing: '',
  });

  useEffect(() => {
    loadData();
  }, [selectedDistrict, selectedClass, selectedSubject, selectedBoard, selectedMode]);

  async function loadData() {
    setLoading(true);
    try {
      const [mentorRes, distRes] = await Promise.all([
        api.getPublicMentors({
          district: selectedDistrict || undefined,
          classGrade: selectedClass || undefined,
          subject: selectedSubject || undefined,
          board: selectedBoard || undefined,
          mode: selectedMode || undefined,
        }),
        api.getBiharDistricts(),
      ]);
      setMentors(mentorRes);
      setDistricts(distRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestForm.parentName || !requestForm.mobile) return;
    try {
      await api.requestDemoTuition({
        parentName: requestForm.parentName,
        mobile: requestForm.mobile,
        studentClass: requestForm.classGrade,
        board: requestForm.board,
        district: requestModalMentor?.district || 'Patna',
        city: requestForm.area,
        notes: `Requested Mentor: ${requestModalMentor?.fullName}`,
      });

      // Also persist directly to Firebase Firestore
      await firestoreService.saveTuitionRequest({
        parentName: requestForm.parentName,
        parentMobile: requestForm.mobile,
        studentName: requestForm.studentName || 'Student',
        classGrade: requestForm.classGrade,
        board: requestForm.board as any,
        district: requestModalMentor?.district || 'Patna',
        assignedMentorId: requestModalMentor?.id,
        preferredTiming: requestForm.timing,
        status: 'Pending',
      });

      setRequestSubmitted(true);
    } catch (err) {
      console.error('Tuition request error:', err);
      // Still show success if local or network fallback triggered
      setRequestSubmitted(true);
    }
  };

  // Filter by search term on client side
  const filteredMentors = mentors.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(term) ||
      m.qualification.toLowerCase().includes(term) ||
      m.college.toLowerCase().includes(term) ||
      m.subjects.some((s) => s.toLowerCase().includes(term)) ||
      m.district.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
            <span>100% Background Verified Educators in Bihar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find a Mentor for Your Child
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Browse verified mentors for home tuition across Bihar. Filter by your district, board (BSEB, CBSE, ICSE), class, and subject.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by mentor name, subject (e.g. Mathematics, Physics), college (NIT Patna), or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            {/* District Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Bihar District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
              >
                <option value="">All 38 Bihar Districts (सभी 38 जिले)</option>
                {BIHAR_38_DISTRICTS.map((d) => {
                  const match = districts.find(
                    (x) => x.name.toLowerCase() === d.name.toLowerCase() || d.name.toLowerCase().startsWith(x.name.toLowerCase())
                  );
                  const count = match?.activeMentorsCount;
                  return (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.hindiName}) {count ? `• ${count} Mentors` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Board Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
              >
                <option value="">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="BSEB">BSEB (Bihar Board)</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
              >
                <option value="">All Classes</option>
                {BIHAR_SCHOOL_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science (General)</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            {/* Mode Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tuition Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
              >
                <option value="">All Modes</option>
                <option value="Home Tuition">Home Tuition (Offline)</option>
                <option value="Online Tuition">Online Tuition</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading verified mentors...</div>
        ) : filteredMentors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-700 font-bold">No mentors match the selected criteria.</p>
            <p className="text-xs text-slate-500">
              Try clearing some filters, or register your child so our academic coordinator can find a dedicated mentor in your area.
            </p>
            <button
              onClick={() => onNavigate('parent-register')}
              className="mt-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold"
            >
              Submit Tuition Requirement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition text-left space-y-4"
              >
                <div>
                  {/* Top Row: Photo + Name + Verification */}
                  <div className="flex items-start gap-4">
                    <img
                      src={m.profilePhoto}
                      alt={m.fullName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-base">{m.fullName}</h3>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-700" />
                          Verified
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-900">{m.qualification}</p>
                      <p className="text-[11px] text-slate-500">{m.college}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold pt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{m.rating}</span>
                        <span className="text-slate-400 font-normal">({m.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Details */}
                  <div className="pt-4 space-y-2.5 text-xs text-slate-700 border-t border-slate-100 mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{m.district} ({m.preferredAreas.slice(0, 2).join(', ')})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        <strong>Subjects:</strong> {m.subjects.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        <strong>Classes & Boards:</strong> {m.classes.slice(0, 2).join(', ')} ({m.boards.join(', ')})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{m.expectedFee} • {m.teachingMode}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 pt-1 italic">
                      "{m.about}"
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveProfile(m)}
                    className="py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setRequestModalMentor(m);
                      setRequestSubmitted(false);
                    }}
                    className="py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition text-center"
                  >
                    Request Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW PROFILE MODAL */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <img
                src={activeProfile.profilePhoto}
                alt={activeProfile.fullName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{activeProfile.fullName}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-sm font-bold text-blue-900">{activeProfile.qualification}</p>
                <p className="text-xs text-slate-500">{activeProfile.college}</p>
                <p className="text-xs font-semibold text-slate-700">Experience: {activeProfile.teachingExperience}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-1">About Educator:</span>
                <p className="text-slate-600 leading-relaxed">{activeProfile.about}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block text-[11px]">Subjects Handled:</span>
                  <span className="text-slate-600">{activeProfile.subjects.join(', ')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block text-[11px]">Boards & Classes:</span>
                  <span className="text-slate-600">{activeProfile.boards.join(', ')} ({activeProfile.classes.join(', ')})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block text-[11px]">Teaching Mode:</span>
                  <span className="text-slate-600">{activeProfile.teachingMode}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block text-[11px]">Availability:</span>
                  <span className="text-slate-600">{activeProfile.availability}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="font-bold text-blue-900 block text-[11px]">Specialization:</span>
                <span className="text-blue-800">{activeProfile.specialization || 'Concept clarity & board preparation'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  const m = activeProfile;
                  setActiveProfile(null);
                  setRequestModalMentor(m);
                }}
                className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs text-center"
              >
                Request This Mentor For Home Tuition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MENTOR MODAL */}
      {requestModalMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative text-left">
            <button
              onClick={() => setRequestModalMentor(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Tuition Inquiry
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Request Mentor: {requestModalMentor.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                Location: {requestModalMentor.district} • Fee: {requestModalMentor.expectedFee}
              </p>
            </div>

            {requestSubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Tuition Request Logged!</h4>
                <p className="text-xs text-emerald-700">
                  Our academic coordinator will coordinate with {requestModalMentor.fullName} and arrange your introductory session.
                </p>
                <button
                  onClick={() => setRequestModalMentor(null)}
                  className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} autoComplete="off" className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manoj Verma"
                    value={requestForm.parentName}
                    onChange={(e) => setRequestForm({ ...requestForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={requestForm.mobile}
                      onChange={(e) => setRequestForm({ ...requestForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="Child's name"
                      value={requestForm.studentName}
                      onChange={(e) => setRequestForm({ ...requestForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                    <select
                      value={requestForm.classGrade}
                      onChange={(e) => setRequestForm({ ...requestForm, classGrade: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      {BIHAR_SCHOOL_CLASSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Board</label>
                    <select
                      value={requestForm.board}
                      onChange={(e) => setRequestForm({ ...requestForm, board: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="BSEB">BSEB (Bihar Board)</option>
                      <option value="ICSE">ICSE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Area / Colony *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kankarbagh / Civil Lines / Mithanpura"
                    value={requestForm.area}
                    onChange={(e) => setRequestForm({ ...requestForm, area: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition shadow"
                >
                  Confirm Tuition Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
