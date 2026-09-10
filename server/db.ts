import crypto from 'crypto';
import type {
  User,
  Parent,
  Student,
  Mentor,
  TuitionRequest,
  AttendanceRecord,
  ClassReport,
  HomeworkItem,
  WeeklyExam,
  ExamAttempt,
  NotificationItem,
  SupportTicket,
  StudentProgressSummary,
  BiharDistrict,
  BoardType,
  TuitionMode,
  TutorGenderPreference,
} from '../src/types/index.ts';

// In-memory persistent database store
export interface Database {
  users: User[];
  passwords: Record<string, { hash: string; salt: string }>;
  parents: Parent[];
  students: Student[];
  mentors: Mentor[];
  tuitionRequests: TuitionRequest[];
  attendance: AttendanceRecord[];
  classReports: ClassReport[];
  homework: HomeworkItem[];
  weeklyExams: WeeklyExam[];
  examAttempts: ExamAttempt[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  districts: BiharDistrict[];
}

const PBKDF2_ITERATIONS = 25000;

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, s, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
  return testHash === hash;
}

// Initial Bihar Districts (All 38 Districts across 9 Administrative Divisions)
const initialDistricts: BiharDistrict[] = [
  // Patna Division
  {
    id: 'dist-patna',
    name: 'Patna',
    headquarters: 'Patna',
    popularAreas: ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Rajendra Nagar', 'Patliputra', 'Anisabad', 'Saguna More'],
    pincodes: ['800001', '800020', '800013', '800023'],
    activeMentorsCount: 48,
  },
  {
    id: 'dist-nalanda',
    name: 'Nalanda (Bihar Sharif)',
    headquarters: 'Bihar Sharif',
    popularAreas: ['Hospital Road', 'Ramchandrapur', 'Ranchi Road', 'Khandak Par', 'Sohsarai', 'Rajgir'],
    pincodes: ['803101', '803118'],
    activeMentorsCount: 19,
  },
  {
    id: 'dist-bhojpur',
    name: 'Bhojpur (Ara)',
    headquarters: 'Ara',
    popularAreas: ['Nawada', 'Katira', 'Anaith', 'Dharhara', 'Chandwa', 'Jagdeo Nagar', 'Sheoganj'],
    pincodes: ['802301'],
    activeMentorsCount: 16,
  },
  {
    id: 'dist-buxar',
    name: 'Buxar',
    headquarters: 'Buxar',
    popularAreas: ['Station Road', 'Civil Lines', 'Charitravan', 'Golambar', 'Piparpanti Road'],
    pincodes: ['802101'],
    activeMentorsCount: 11,
  },
  {
    id: 'dist-rohtas',
    name: 'Rohtas (Sasaram)',
    headquarters: 'Sasaram',
    popularAreas: ['Fazalganj', 'Dharamsala Road', 'Gaurakshani', 'Old GT Road', 'Dehri on Sone'],
    pincodes: ['821115', '821307'],
    activeMentorsCount: 14,
  },
  {
    id: 'dist-kaimur',
    name: 'Kaimur (Bhabua)',
    headquarters: 'Bhabua',
    popularAreas: ['Collectorate Road', 'Ekta Chowk', 'Mohania Market', 'Kudra'],
    pincodes: ['821101'],
    activeMentorsCount: 9,
  },

  // Tirhut Division
  {
    id: 'dist-muzaffarpur',
    name: 'Muzaffarpur',
    headquarters: 'Muzaffarpur',
    popularAreas: ['Mithanpura', 'Club Road', 'Kalambagh Chowk', 'Brahmpura', 'Juran Chapra', 'Aghoria Bazar'],
    pincodes: ['842001', '842002', '842003'],
    activeMentorsCount: 32,
  },
  {
    id: 'dist-east-champaran',
    name: 'East Champaran (Motihari)',
    headquarters: 'Motihari',
    popularAreas: ['Chhatauni', 'Main Road', 'Janpul Chowk', 'Balua Tal', 'Raja Bazar'],
    pincodes: ['845401'],
    activeMentorsCount: 15,
  },
  {
    id: 'dist-west-champaran',
    name: 'West Champaran (Bettiah)',
    headquarters: 'Bettiah',
    popularAreas: ['Kamalnath Nagar', 'Lal Bazar', 'Hospital Road', 'Narkatiaganj'],
    pincodes: ['845438'],
    activeMentorsCount: 13,
  },
  {
    id: 'dist-sitamarhi',
    name: 'Sitamarhi',
    headquarters: 'Sitamarhi',
    popularAreas: ['Mehshoul Chowk', 'Dumra Road', 'Bhavdepur', 'Court Bazar'],
    pincodes: ['843301'],
    activeMentorsCount: 11,
  },
  {
    id: 'dist-sheohar',
    name: 'Sheohar',
    headquarters: 'Sheohar',
    popularAreas: ['Main Market', 'Collectorate Colony', 'Zero Mile', 'Kalyanpur'],
    pincodes: ['843329'],
    activeMentorsCount: 8,
  },
  {
    id: 'dist-vaishali',
    name: 'Vaishali (Hajipur)',
    headquarters: 'Hajipur',
    popularAreas: ['Cinema Road', 'Anwarpur', 'Bagmali', 'Rajendra Chowk', 'Paswan Chowk'],
    pincodes: ['844101'],
    activeMentorsCount: 18,
  },

  // Saran Division
  {
    id: 'dist-saran',
    name: 'Saran (Chhapra)',
    headquarters: 'Chhapra',
    popularAreas: ['Gudri Bazar', 'Dahiyawan', 'Prabhunath Nagar', 'Kashi Bazar', 'Bhagwan Bazar'],
    pincodes: ['841301'],
    activeMentorsCount: 17,
  },
  {
    id: 'dist-siwan',
    name: 'Siwan',
    headquarters: 'Siwan',
    popularAreas: ['Hospital Road', 'Fathepur', 'Naya Bazar', 'Mahadeva', 'Tarwara Road'],
    pincodes: ['841226'],
    activeMentorsCount: 14,
  },
  {
    id: 'dist-gopalganj',
    name: 'Gopalganj',
    headquarters: 'Gopalganj',
    popularAreas: ['Banjari Road', 'Main Market', 'Sarkari Hatha', 'Mirganj', 'Thawe'],
    pincodes: ['841428'],
    activeMentorsCount: 12,
  },

  // Darbhanga Division
  {
    id: 'dist-darbhanga',
    name: 'Darbhanga',
    headquarters: 'Darbhanga',
    popularAreas: ['Laheriasarai', 'Donar', 'Mirzapur', 'Benta', 'Allalpatti', 'Tower Chowk'],
    pincodes: ['846001', '846003', '846004'],
    activeMentorsCount: 22,
  },
  {
    id: 'dist-madhubani',
    name: 'Madhubani',
    headquarters: 'Madhubani',
    popularAreas: ['Suratganj', 'Ganga Sagar Chowk', 'Bazar Samiti', 'Sapta', 'Jhanjharpur'],
    pincodes: ['847211'],
    activeMentorsCount: 15,
  },
  {
    id: 'dist-samastipur',
    name: 'Samastipur',
    headquarters: 'Samastipur',
    popularAreas: ['Mohanpur Road', 'Kashipur', 'Tajpur Road', 'Magadh Dairy Area', 'Station Road'],
    pincodes: ['848101'],
    activeMentorsCount: 18,
  },

  // Kosi Division
  {
    id: 'dist-saharsa',
    name: 'Saharsa',
    headquarters: 'Saharsa',
    popularAreas: ['D.B. Road', 'Gangjala', 'Hatia Gachhi', 'Tiwari Tola', 'Bangaon Road'],
    pincodes: ['852201'],
    activeMentorsCount: 13,
  },
  {
    id: 'dist-madhepura',
    name: 'Madhepura',
    headquarters: 'Madhepura',
    popularAreas: ['College Chowk', 'Main Market', 'B.P. Mandal Chowk', 'Singheshwar'],
    pincodes: ['852113'],
    activeMentorsCount: 10,
  },
  {
    id: 'dist-supaul',
    name: 'Supaul',
    headquarters: 'Supaul',
    popularAreas: ['Station Road', 'Gandhi Maidan Area', 'Lohia Nagar', 'Kisan Chowk'],
    pincodes: ['852131'],
    activeMentorsCount: 10,
  },

  // Purnia Division
  {
    id: 'dist-purnia',
    name: 'Purnia',
    headquarters: 'Purnia',
    popularAreas: ['Line Bazar', 'Bhatta Bazar', 'Navratan Hatta', 'Madhubani', 'Gulabbagh'],
    pincodes: ['854301', '854302'],
    activeMentorsCount: 20,
  },
  {
    id: 'dist-katihar',
    name: 'Katihar',
    headquarters: 'Katihar',
    popularAreas: ['Mirchaibari', 'Bada Bazar', 'Mangal Bazar', 'Tindgachhiya', 'Ambedkar Chowk'],
    pincodes: ['854105'],
    activeMentorsCount: 14,
  },
  {
    id: 'dist-araria',
    name: 'Araria',
    headquarters: 'Araria',
    popularAreas: ['Zero Mile', 'Bus Stand Road', 'Om Nagar', 'Forbesganj Main Road'],
    pincodes: ['854311'],
    activeMentorsCount: 11,
  },
  {
    id: 'dist-kishanganj',
    name: 'Kishanganj',
    headquarters: 'Kishanganj',
    popularAreas: ['Hospital Road', 'Caltex Chowk', 'Line Mohalla', 'Dharamganj', 'Paschim Palli'],
    pincodes: ['855107'],
    activeMentorsCount: 10,
  },

  // Bhagalpur Division
  {
    id: 'dist-bhagalpur',
    name: 'Bhagalpur',
    headquarters: 'Bhagalpur',
    popularAreas: ['Adampur', 'Tilkamanjhi', 'Zero Mile', 'Khanjarpur', 'Barari', 'Aliganj'],
    pincodes: ['812001', '812002'],
    activeMentorsCount: 26,
  },
  {
    id: 'dist-banka',
    name: 'Banka',
    headquarters: 'Banka',
    popularAreas: ['Shivaji Chowk', 'Katoria Road', 'Chandan Bazar', 'Amarpur Road'],
    pincodes: ['813102'],
    activeMentorsCount: 9,
  },

  // Munger Division
  {
    id: 'dist-munger',
    name: 'Munger',
    headquarters: 'Munger',
    popularAreas: ['Fort Area', 'Belan Bazar', 'Kashim Bazar', 'Bari Bazar', 'Jamalpur Railway Colony'],
    pincodes: ['811201', '811214'],
    activeMentorsCount: 15,
  },
  {
    id: 'dist-jamui',
    name: 'Jamui',
    headquarters: 'Jamui',
    popularAreas: ['Bodham Talab', 'Station Road', 'Maharajganj', 'Giddhaur Road', 'Jhajha'],
    pincodes: ['811307'],
    activeMentorsCount: 10,
  },
  {
    id: 'dist-khagaria',
    name: 'Khagaria',
    headquarters: 'Khagaria',
    popularAreas: ['Rajendra Chowk', 'Station Road', 'Baluahi', 'Sanjivani Nagar'],
    pincodes: ['851204'],
    activeMentorsCount: 11,
  },
  {
    id: 'dist-lakhisarai',
    name: 'Lakhisarai',
    headquarters: 'Lakhisarai',
    popularAreas: ['Vidyapeeth Chowk', 'Purani Bazar', 'Naya Bazar', 'Barahiya Road'],
    pincodes: ['811311'],
    activeMentorsCount: 10,
  },
  {
    id: 'dist-begusarai',
    name: 'Begusarai',
    headquarters: 'Begusarai',
    popularAreas: ['Har-Har Mahadev Chowk', 'Kali Sthan', 'Refinery Township', 'Bishanpur', 'Subhash Chowk'],
    pincodes: ['851101'],
    activeMentorsCount: 21,
  },
  {
    id: 'dist-sheikhpura',
    name: 'Sheikhpura',
    headquarters: 'Sheikhpura',
    popularAreas: ['Station Road', 'Khandpar', 'Hussainabad', 'Barbigha Bazar'],
    pincodes: ['811105'],
    activeMentorsCount: 8,
  },

  // Magadh Division
  {
    id: 'dist-gaya',
    name: 'Gaya',
    headquarters: 'Gaya',
    popularAreas: ['Civil Lines', 'AP Colony', 'Chand Chaura', 'Rampur', 'Delha', 'Bodh Gaya'],
    pincodes: ['823001', '823002', '823003'],
    activeMentorsCount: 28,
  },
  {
    id: 'dist-aurangabad',
    name: 'Aurangabad',
    headquarters: 'Aurangabad',
    popularAreas: ['Ramesh Chowk', 'GT Road Area', 'Maharajganj', 'Dani Bigha', 'Daudnagar'],
    pincodes: ['824101'],
    activeMentorsCount: 13,
  },
  {
    id: 'dist-nawada',
    name: 'Nawada',
    headquarters: 'Nawada',
    popularAreas: ['Main Road', 'Gola Road', 'Parsawan', 'Hisua', 'Rajauli'],
    pincodes: ['805110'],
    activeMentorsCount: 12,
  },
  {
    id: 'dist-jehanabad',
    name: 'Jehanabad',
    headquarters: 'Jehanabad',
    popularAreas: ['Court Area', 'Hospital More', 'Station Road', 'Mallikana', 'Makhdumpur'],
    pincodes: ['804408'],
    activeMentorsCount: 11,
  },
  {
    id: 'dist-arwal',
    name: 'Arwal',
    headquarters: 'Arwal',
    popularAreas: ['Main Chowk', 'Collectorate Area', 'Son River Road', 'Kurtha'],
    pincodes: ['804401'],
    activeMentorsCount: 7,
  },
];

// Initialize Database with realistic data
export function createSeedData(): Database {
  const db: Database = {
    users: [],
    passwords: {},
    parents: [],
    students: [],
    mentors: [],
    tuitionRequests: [],
    attendance: [],
    classReports: [],
    homework: [],
    weeklyExams: [],
    examAttempts: [],
    notifications: [],
    supportTickets: [],
    districts: [...initialDistricts],
  };

  // 1. Admin User
  const adminId = 'user-admin';
  const adminPwd = hashPassword('Admin123!');
  db.users.push({
    id: adminId,
    email: 'admin@bbamentors.com',
    role: 'ADMIN',
    name: 'BBA Mentors Academic Director',
    mobile: '9576767949',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    createdAt: new Date('2026-01-01').toISOString(),
  });
  db.passwords[adminId] = adminPwd;

  // 2. Parents
  // Parent 1: Rajesh Sharma (Patna)
  const parent1UserId = 'user-parent-rajesh';
  const parent1Pwd = hashPassword('Parent123!');
  db.users.push({
    id: parent1UserId,
    email: 'rajesh.sharma@example.com',
    role: 'PARENT',
    name: 'Rajesh Sharma',
    mobile: '9835012345',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    createdAt: new Date('2026-01-10').toISOString(),
  });
  db.passwords[parent1UserId] = parent1Pwd;

  const parent1Id = 'parent-rajesh';
  db.parents.push({
    id: parent1Id,
    userId: parent1UserId,
    name: 'Rajesh Sharma',
    mobile: '9835012345',
    email: 'rajesh.sharma@example.com',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    address: 'Flat 402, Shivam Enclave, Kankarbagh Main Road',
    createdAt: new Date('2026-01-10').toISOString(),
  });

  // Parent 2: Sunita Devi (Gaya)
  const parent2UserId = 'user-parent-sunita';
  const parent2Pwd = hashPassword('Parent123!');
  db.users.push({
    id: parent2UserId,
    email: 'sunita.devi@example.com',
    role: 'PARENT',
    name: 'Sunita Devi',
    mobile: '9431098765',
    city: 'Gaya',
    district: 'Gaya',
    state: 'Bihar',
    createdAt: new Date('2026-01-15').toISOString(),
  });
  db.passwords[parent2UserId] = parent2Pwd;

  const parent2Id = 'parent-sunita';
  db.parents.push({
    id: parent2Id,
    userId: parent2UserId,
    name: 'Sunita Devi',
    mobile: '9431098765',
    email: 'sunita.devi@example.com',
    city: 'Gaya',
    district: 'Gaya',
    state: 'Bihar',
    address: 'House 14, Near Collectorate, Civil Lines',
    createdAt: new Date('2026-01-15').toISOString(),
  });

  // Parent 3: Manoj Verma (Muzaffarpur)
  const parent3UserId = 'user-parent-manoj';
  const parent3Pwd = hashPassword('Parent123!');
  db.users.push({
    id: parent3UserId,
    email: 'manoj.verma@example.com',
    role: 'PARENT',
    name: 'Manoj Verma',
    mobile: '9771045678',
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    state: 'Bihar',
    createdAt: new Date('2026-01-20').toISOString(),
  });
  db.passwords[parent3UserId] = parent3Pwd;

  const parent3Id = 'parent-manoj';
  db.parents.push({
    id: parent3Id,
    userId: parent3UserId,
    name: 'Manoj Verma',
    mobile: '9771045678',
    email: 'manoj.verma@example.com',
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    state: 'Bihar',
    address: 'Ward 12, Near Jubba Sahni Park, Mithanpura',
    createdAt: new Date('2026-01-20').toISOString(),
  });

  // 3. Mentors (Verified & Quality Profile)
  // Mentor 1: Er. Amit Kumar (Patna)
  const mentor1UserId = 'user-mentor-amit';
  const mentor1Pwd = hashPassword('Mentor123!');
  db.users.push({
    id: mentor1UserId,
    email: 'amit.kumar@bbamentors.com',
    role: 'MENTOR',
    name: 'Er. Amit Kumar',
    mobile: '9835100001',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    createdAt: new Date('2026-01-05').toISOString(),
  });
  db.passwords[mentor1UserId] = mentor1Pwd;

  const mentor1Id = 'mentor-amit';
  db.mentors.push({
    id: mentor1Id,
    userId: mentor1UserId,
    fullName: 'Er. Amit Kumar',
    mobile: '9835100001',
    email: 'amit.kumar@bbamentors.com',
    qualification: 'B.Tech (Mechanical Engineering)',
    college: 'NIT Patna (National Institute of Technology)',
    teachingExperience: '6+ Years',
    subjects: ['Mathematics', 'Physics', 'Science'],
    classes: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
    boards: ['CBSE', 'BSEB'],
    preferredAreas: ['Kankarbagh', 'Boring Road', 'Rajendra Nagar', 'Bailey Road'],
    district: 'Patna',
    city: 'Patna',
    pincode: '800020',
    teachingMode: 'Home Tuition',
    availability: 'Mon-Fri 4:00 PM - 8:30 PM, Sat-Sun Mornings',
    expectedFee: '₹4,500 - ₹6,000 / month',
    about: 'Passionate about building solid conceptual clarity in Mathematics and Science. Special focus on Bihar board & CBSE board exam patterns with weekly problem-solving drills.',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    rating: 4.9,
    reviewCount: 38,
    verificationStatus: 'Verified',
    specialization: 'CBSE & BSEB 10th Board Math Toppers Guide',
    createdAt: new Date('2026-01-05').toISOString(),
  });

  // Mentor 2: Neha Kumari (Patna)
  const mentor2UserId = 'user-mentor-neha';
  const mentor2Pwd = hashPassword('Mentor123!');
  db.users.push({
    id: mentor2UserId,
    email: 'neha.kumari@bbamentors.com',
    role: 'MENTOR',
    name: 'Neha Kumari',
    mobile: '9835100002',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    createdAt: new Date('2026-01-08').toISOString(),
  });
  db.passwords[mentor2UserId] = mentor2Pwd;

  const mentor2Id = 'mentor-neha';
  db.mentors.push({
    id: mentor2Id,
    userId: mentor2UserId,
    fullName: 'Neha Kumari',
    mobile: '9835100002',
    email: 'neha.kumari@bbamentors.com',
    qualification: 'M.Sc. Zoology (Gold Medalist), B.Ed',
    college: 'Patna Science College, Patna University',
    teachingExperience: '4+ Years',
    subjects: ['Science', 'Biology', 'Hindi', 'English', 'Foundational Reading'],
    classes: ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    boards: ['BSEB', 'CBSE'],
    preferredAreas: ['Patliputra', 'Boring Road', 'Kankarbagh', 'Anisabad'],
    district: 'Patna',
    city: 'Patna',
    pincode: '800013',
    teachingMode: 'Hybrid',
    availability: 'All days 3:00 PM - 7:00 PM',
    expectedFee: '₹3,500 - ₹5,000 / month',
    about: 'Gold Medalist in M.Sc. with deep expertise in BSEB Hindi medium and CBSE English medium biology & foundational science.',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
    rating: 4.8,
    reviewCount: 29,
    verificationStatus: 'Verified',
    specialization: 'Science Concept Visualizer',
    createdAt: new Date('2026-01-08').toISOString(),
  });

  // Mentor 3: Rahul Singh (Muzaffarpur)
  const mentor3UserId = 'user-mentor-rahul';
  const mentor3Pwd = hashPassword('Mentor123!');
  db.users.push({
    id: mentor3UserId,
    email: 'rahul.singh@bbamentors.com',
    role: 'MENTOR',
    name: 'Rahul Singh',
    mobile: '9835100003',
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    state: 'Bihar',
    createdAt: new Date('2026-01-12').toISOString(),
  });
  db.passwords[mentor3UserId] = mentor3Pwd;

  const mentor3Id = 'mentor-rahul';
  db.mentors.push({
    id: mentor3Id,
    userId: mentor3UserId,
    fullName: 'Rahul Singh',
    mobile: '9835100003',
    email: 'rahul.singh@bbamentors.com',
    qualification: 'B.Sc. Mathematics (Hons)',
    college: 'L.S. College, B.R. Ambedkar Bihar University',
    teachingExperience: '5+ Years',
    subjects: ['Mathematics', 'Science'],
    classes: ['Class 8', 'Class 9', 'Class 10'],
    boards: ['BSEB', 'CBSE'],
    preferredAreas: ['Mithanpura', 'Club Road', 'Kalambagh Chowk'],
    district: 'Muzaffarpur',
    city: 'Muzaffarpur',
    pincode: '842001',
    teachingMode: 'Home Tuition',
    availability: 'Mon-Sat 4:00 PM - 8:00 PM',
    expectedFee: '₹3,000 - ₹4,500 / month',
    about: 'Dedicated to helping students master mathematics anxiety. Has mentored over 50 BSEB matric students to 85%+ scores.',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    rating: 4.9,
    reviewCount: 31,
    verificationStatus: 'Verified',
    specialization: 'Matric Math Special Mentor',
    createdAt: new Date('2026-01-12').toISOString(),
  });

  // Mentor 4: Dr. Ritu Sinha (Gaya)
  const mentor4UserId = 'user-mentor-ritu';
  const mentor4Pwd = hashPassword('Mentor123!');
  db.users.push({
    id: mentor4UserId,
    email: 'ritu.sinha@bbamentors.com',
    role: 'MENTOR',
    name: 'Dr. Ritu Sinha',
    mobile: '9835100004',
    city: 'Gaya',
    district: 'Gaya',
    state: 'Bihar',
    createdAt: new Date('2026-01-14').toISOString(),
  });
  db.passwords[mentor4UserId] = mentor4Pwd;

  const mentor4Id = 'mentor-ritu';
  db.mentors.push({
    id: mentor4Id,
    userId: mentor4UserId,
    fullName: 'Dr. Ritu Sinha',
    mobile: '9835100004',
    email: 'ritu.sinha@bbamentors.com',
    qualification: 'M.Sc., Ph.D. Physics, B.Ed',
    college: 'Magadh University / Delhi University Fellow',
    teachingExperience: '7+ Years',
    subjects: ['Physics', 'Mathematics', 'Science'],
    classes: ['Class 8', 'Class 9', 'Class 10', 'Class 11'],
    boards: ['CBSE', 'ICSE', 'BSEB'],
    preferredAreas: ['Civil Lines', 'AP Colony', 'Rampur'],
    district: 'Gaya',
    city: 'Gaya',
    pincode: '823001',
    teachingMode: 'Home Tuition',
    availability: 'Evenings 5:00 PM - 8:00 PM',
    expectedFee: '₹4,000 - ₹5,500 / month',
    about: 'Experienced educator providing structured home tuition with disciplined weekly assessment regimes.',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces',
    rating: 4.95,
    reviewCount: 42,
    verificationStatus: 'Verified',
    specialization: 'ICSE & CBSE Conceptual Foundation',
    createdAt: new Date('2026-01-14').toISOString(),
  });

  // Mentor 5: Saurabh Anand (Pending Review)
  const mentor5UserId = 'user-mentor-saurabh';
  const mentor5Pwd = hashPassword('Mentor123!');
  db.users.push({
    id: mentor5UserId,
    email: 'saurabh.anand@example.com',
    role: 'MENTOR',
    name: 'Saurabh Anand',
    mobile: '9835100005',
    city: 'Bhagalpur',
    district: 'Bhagalpur',
    state: 'Bihar',
    createdAt: new Date('2026-02-01').toISOString(),
  });
  db.passwords[mentor5UserId] = mentor5Pwd;

  const mentor5Id = 'mentor-saurabh';
  db.mentors.push({
    id: mentor5Id,
    userId: mentor5UserId,
    fullName: 'Saurabh Anand',
    mobile: '9835100005',
    email: 'saurabh.anand@example.com',
    qualification: 'M.A. English & Social Studies',
    college: 'TMBU Bhagalpur',
    teachingExperience: '3+ Years',
    subjects: ['English', 'Social Science', 'Hindi', 'Handwriting & Phonics'],
    classes: ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    boards: ['CBSE', 'BSEB'],
    preferredAreas: ['Adampur', 'Tilkamanjhi'],
    district: 'Bhagalpur',
    city: 'Bhagalpur',
    pincode: '812001',
    teachingMode: 'Home Tuition',
    availability: 'Mon-Fri 4:00 PM - 7:00 PM',
    expectedFee: '₹3,000 / month',
    about: 'Focus on language fluency, grammar mastery, and answer-writing techniques for board examinations.',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
    rating: 4.7,
    reviewCount: 14,
    verificationStatus: 'Pending',
    specialization: 'English Grammar & Writing Skills',
    createdAt: new Date('2026-02-01').toISOString(),
  });

  // 4. Students
  // Student 1: Aarav Sharma (Son of Rajesh Sharma, Patna - Class 10 CBSE)
  const student1Id = 'student-aarav';
  db.students.push({
    id: student1Id,
    parentId: parent1Id,
    name: 'Aarav Sharma',
    classGrade: 'Class 10',
    board: 'CBSE',
    schoolName: 'D.A.V. Public School, BSEB Colony, Patna',
    gender: 'Male',
    dob: '2010-04-12',
    subjects: ['Mathematics', 'Science', 'English', 'Hindi'],
    learningGoals: 'Targeting 90%+ in 10th CBSE Board Exams. Needs rigorous weekly testing in Trigonometry and Science numericals.',
    currentAcademicLevel: 'Above Average, needs consistency',
    address: 'Flat 402, Shivam Enclave, Kankarbagh Main Road',
    district: 'Patna',
    city: 'Patna',
    preferredMode: 'Home Tuition',
    preferredTutorGender: 'No Preference',
    preferredTiming: '5:30 PM - 7:00 PM',
    monthlyBudget: '₹5,000',
    assignedMentorId: mentor1Id,
    status: 'Active',
    createdAt: new Date('2026-01-11').toISOString(),
  });

  // Student 2: Priya Sharma (Daughter of Rajesh Sharma, Patna - Class 8 BSEB)
  const student2Id = 'student-priya';
  db.students.push({
    id: student2Id,
    parentId: parent1Id,
    name: 'Priya Sharma',
    classGrade: 'Class 8',
    board: 'BSEB',
    schoolName: "St. Karen's Secondary School, Patna",
    gender: 'Female',
    dob: '2012-08-25',
    subjects: ['Mathematics', 'Science', 'Hindi'],
    learningGoals: 'Strengthen Hindi grammar and foundational algebra.',
    currentAcademicLevel: 'Average',
    address: 'Flat 402, Shivam Enclave, Kankarbagh Main Road',
    district: 'Patna',
    city: 'Patna',
    preferredMode: 'Home Tuition',
    preferredTutorGender: 'Female',
    preferredTiming: '4:00 PM - 5:15 PM',
    monthlyBudget: '₹4,000',
    assignedMentorId: mentor2Id,
    status: 'Active',
    createdAt: new Date('2026-01-12').toISOString(),
  });

  // Student 3: Rohan Verma (Son of Manoj Verma, Muzaffarpur - Class 10 BSEB)
  const student3Id = 'student-rohan';
  db.students.push({
    id: student3Id,
    parentId: parent3Id,
    name: 'Rohan Verma',
    classGrade: 'Class 10',
    board: 'BSEB',
    schoolName: 'Zila School, Muzaffarpur',
    gender: 'Male',
    dob: '2010-09-18',
    subjects: ['Mathematics', 'Science', 'Hindi'],
    learningGoals: 'Aiming for BSEB State Rank holder in Matriculation.',
    currentAcademicLevel: 'Above Average',
    address: 'Ward 12, Mithanpura',
    district: 'Muzaffarpur',
    city: 'Muzaffarpur',
    preferredMode: 'Home Tuition',
    preferredTutorGender: 'Male',
    preferredTiming: '6:00 PM - 7:30 PM',
    monthlyBudget: '₹4,500',
    assignedMentorId: mentor3Id,
    status: 'Active',
    createdAt: new Date('2026-01-21').toISOString(),
  });

  // Student 4: Ananya Verma (Daughter of Manoj Verma, Muzaffarpur - Class 9 ICSE, Needs Mentor!)
  const student4Id = 'student-ananya';
  db.students.push({
    id: student4Id,
    parentId: parent3Id,
    name: 'Ananya Verma',
    classGrade: 'Class 9',
    board: 'ICSE',
    schoolName: 'North Point School, Muzaffarpur',
    gender: 'Female',
    dob: '2011-11-04',
    subjects: ['English', 'Mathematics', 'Biology'],
    learningGoals: 'Needs dedicated mentor for ICSE syllabus and English literature writing.',
    currentAcademicLevel: 'Good',
    address: 'Ward 12, Mithanpura',
    district: 'Muzaffarpur',
    city: 'Muzaffarpur',
    preferredMode: 'Home Tuition',
    preferredTutorGender: 'Female',
    preferredTiming: '4:30 PM - 6:00 PM',
    monthlyBudget: '₹4,000',
    status: 'Pending Mentor',
    createdAt: new Date('2026-02-15').toISOString(),
  });

  // Student 5: Ayush Devi (Son of Sunita Devi, Gaya - Class 7 CBSE)
  const student5Id = 'student-ayush';
  db.students.push({
    id: student5Id,
    parentId: parent2Id,
    name: 'Ayush Kumar',
    classGrade: 'Class 7',
    board: 'CBSE',
    schoolName: 'Gyan Niketan, Gaya',
    gender: 'Male',
    dob: '2013-05-10',
    subjects: ['Mathematics', 'Science', 'Social Science'],
    learningGoals: 'Building daily discipline, homework completion, and test readiness.',
    currentAcademicLevel: 'Needs Foundation Support',
    address: 'House 14, Civil Lines, Gaya',
    district: 'Gaya',
    city: 'Gaya',
    preferredMode: 'Home Tuition',
    preferredTutorGender: 'No Preference',
    preferredTiming: '5:00 PM - 6:30 PM',
    monthlyBudget: '₹3,500',
    assignedMentorId: mentor4Id,
    status: 'Active',
    createdAt: new Date('2026-01-16').toISOString(),
  });

  // 5. Tuition Requests
  db.tuitionRequests.push(
    {
      id: 'req-1',
      parentId: parent1Id,
      studentId: student1Id,
      studentName: 'Aarav Sharma',
      classGrade: 'Class 10',
      board: 'CBSE',
      subjects: ['Mathematics', 'Science'],
      district: 'Patna',
      city: 'Patna',
      area: 'Kankarbagh',
      preferredTiming: '5:30 PM - 7:00 PM',
      budget: '₹5,000',
      teachingMode: 'Home Tuition',
      genderPreference: 'No Preference',
      status: 'Assigned',
      assignedMentorId: mentor1Id,
      notes: 'Matched with Er. Amit Kumar on 12 Jan 2026.',
      createdAt: new Date('2026-01-11').toISOString(),
    },
    {
      id: 'req-2',
      parentId: parent3Id,
      studentId: student4Id,
      studentName: 'Ananya Verma',
      classGrade: 'Class 9',
      board: 'ICSE',
      subjects: ['English', 'Mathematics', 'Biology'],
      district: 'Muzaffarpur',
      city: 'Muzaffarpur',
      area: 'Mithanpura',
      preferredTiming: '4:30 PM - 6:00 PM',
      budget: '₹4,000',
      teachingMode: 'Home Tuition',
      genderPreference: 'Female',
      status: 'Pending',
      notes: 'Parent requested experienced female mentor for ICSE curriculum.',
      createdAt: new Date('2026-02-15').toISOString(),
    }
  );

  // 6. Weekly Exams
  const examWeek1: WeeklyExam = {
    id: 'exam-w1',
    examName: 'BBA Mentors Assessment #1 - Real Numbers & Polynomials',
    weekNumber: 1,
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Real Numbers & Polynomials',
    topics: ['Euclid Division', 'Fundamental Theorem of Arithmetic', 'Zeroes of Polynomials'],
    totalMarks: 20,
    durationMinutes: 30,
    questionCount: 5,
    examDate: '2026-01-18',
    difficulty: 'Medium',
    instructions: 'Weekly standardized assessment. All questions are compulsory. 4 marks each.',
    status: 'Published',
    questions: [
      {
        id: 'q1-1',
        questionText: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:',
        type: 'MCQ',
        options: ['xy', 'xy²', 'x³y³', 'x²y²'],
        correctAnswer: 'xy²',
        explanation: 'HCF is the product of the smallest power of each common prime factor involved in the numbers. Smallest power of x is x, smallest power of y is y² -> xy².',
        marks: 4,
        topic: 'Fundamental Theorem of Arithmetic',
      },
      {
        id: 'q1-2',
        questionText: 'The decimal expansion of the rational number 14587 / 1250 will terminate after how many decimal places?',
        type: 'MCQ',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 'Four',
        explanation: '1250 = 2 × 5⁴. The highest power of 2 or 5 is 4, so decimal terminates after 4 places.',
        marks: 4,
        topic: 'Real Numbers',
      },
      {
        id: 'q1-3',
        questionText: 'If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:',
        type: 'MCQ',
        options: ['10', '-10', '-7', '-2'],
        correctAnswer: '-10',
        explanation: 'Since 2 is a zero: (2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.',
        marks: 4,
        topic: 'Zeroes of Polynomials',
      },
      {
        id: 'q1-4',
        questionText: 'The number of zeroes that a polynomial of degree n can have is at most:',
        type: 'MCQ',
        options: ['n - 1', 'n', 'n + 1', '2n'],
        correctAnswer: 'n',
        explanation: 'A polynomial of degree n has at most n real zeroes.',
        marks: 4,
        topic: 'Zeroes of Polynomials',
      },
      {
        id: 'q1-5',
        questionText: 'Which of the following is an irrational number?',
        type: 'MCQ',
        options: ['3.1416', '22/7', '3.141141114...', '0.123123...'],
        correctAnswer: '3.141141114...',
        explanation: 'Non-terminating and non-repeating decimals represent irrational numbers.',
        marks: 4,
        topic: 'Real Numbers',
      },
    ],
  };

  const examWeek2: WeeklyExam = {
    id: 'exam-w2',
    examName: 'BBA Mentors Assessment #2 - Linear Equations & Quadratic Equations',
    weekNumber: 2,
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Linear & Quadratic Equations',
    topics: ['Algebra', 'Nature of Roots', 'Consistency of Systems'],
    totalMarks: 20,
    durationMinutes: 30,
    questionCount: 5,
    examDate: '2026-01-25',
    difficulty: 'Medium',
    instructions: 'Weekly assessment. Answer each carefully.',
    status: 'Published',
    questions: [
      {
        id: 'q2-1',
        questionText: 'The pair of equations x + 2y + 5 = 0 and -3x - 6y + 1 = 0 has:',
        type: 'MCQ',
        options: ['A unique solution', 'Exactly two solutions', 'Infinitely many solutions', 'No solution'],
        correctAnswer: 'No solution',
        explanation: 'a1/a2 = 1/-3, b1/b2 = 2/-6 = 1/-3, c1/c2 = 5/1. Since a1/a2 = b1/b2 != c1/c2, the lines are parallel and have no solution.',
        marks: 4,
        topic: 'Consistency of Systems',
      },
      {
        id: 'q2-2',
        questionText: 'If the discriminant of ax² + bx + c = 0 is greater than 0, then the roots are:',
        type: 'MCQ',
        options: ['Real and equal', 'Real and unequal', 'Imaginary', 'None of these'],
        correctAnswer: 'Real and unequal',
        explanation: 'When D > 0, quadratic equations possess two distinct real roots.',
        marks: 4,
        topic: 'Nature of Roots',
      },
      {
        id: 'q2-3',
        questionText: 'Value of k for which 2x² - kx + k = 0 has equal roots is:',
        type: 'MCQ',
        options: ['0 only', '4', '8 only', '0 or 8'],
        correctAnswer: '0 or 8',
        explanation: 'b² - 4ac = 0 => k² - 4(2)(k) = 0 => k(k - 8) = 0 => k = 0 or 8.',
        marks: 4,
        topic: 'Nature of Roots',
      },
      {
        id: 'q2-4',
        questionText: 'If 1/2 is a root of the equation x² + kx - 5/4 = 0, then the value of k is:',
        type: 'MCQ',
        options: ['2', '-2', '1/4', '1/2'],
        correctAnswer: '2',
        explanation: '(1/2)² + k(1/2) - 5/4 = 0 => 1/4 + k/2 - 5/4 = 0 => k/2 = 1 => k = 2.',
        marks: 4,
        topic: 'Algebra',
      },
      {
        id: 'q2-5',
        questionText: 'A quadratic equation whose roots are 2 and -3 is:',
        type: 'MCQ',
        options: ['x² + x - 6 = 0', 'x² - x - 6 = 0', 'x² + 5x + 6 = 0', 'x² - 5x + 6 = 0'],
        correctAnswer: 'x² + x - 6 = 0',
        explanation: 'x² - (sum)x + product = x² - (2 - 3)x + (2)(-3) = x² + x - 6 = 0.',
        marks: 4,
        topic: 'Algebra',
      },
    ],
  };

  const examWeek3: WeeklyExam = {
    id: 'exam-w3',
    examName: 'BBA Mentors Assessment #3 - Arithmetic Progressions',
    weekNumber: 3,
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Arithmetic Progression',
    topics: ['nth Term of AP', 'Sum of n terms', 'Common Difference'],
    totalMarks: 20,
    durationMinutes: 30,
    questionCount: 5,
    examDate: '2026-02-01',
    difficulty: 'Medium',
    instructions: 'Weekly assessment on AP.',
    status: 'Published',
    questions: [
      {
        id: 'q3-1',
        questionText: 'The 11th term of the AP: -3, -1/2, 2, ... is:',
        type: 'MCQ',
        options: ['28', '22', '-38', '-46.5'],
        correctAnswer: '22',
        explanation: 'a = -3, d = -1/2 - (-3) = 5/2. a11 = a + 10d = -3 + 10(5/2) = -3 + 25 = 22.',
        marks: 4,
        topic: 'nth Term of AP',
      },
      {
        id: 'q3-2',
        questionText: 'The sum of first 16 terms of the AP: 10, 6, 2, ... is:',
        type: 'MCQ',
        options: ['-320', '320', '-352', '-400'],
        correctAnswer: '-320',
        explanation: 'n=16, a=10, d=-4. S16 = 16/2 * [2(10) + 15(-4)] = 8 * [20 - 60] = 8 * (-40) = -320.',
        marks: 4,
        topic: 'Sum of n terms',
      },
      {
        id: 'q3-3',
        questionText: 'If 7 times the 7th term of an AP is equal to 11 times its 11th term, then its 18th term will be:',
        type: 'MCQ',
        options: ['7', '11', '18', '0'],
        correctAnswer: '0',
        explanation: '7(a + 6d) = 11(a + 10d) => 7a + 42d = 11a + 110d => 4a + 68d = 0 => a + 17d = 0 => T18 = 0.',
        marks: 4,
        topic: 'nth Term of AP',
      },
      {
        id: 'q3-4',
        questionText: 'How many two-digit numbers are divisible by 3?',
        type: 'MCQ',
        options: ['25', '30', '32', '36'],
        correctAnswer: '30',
        explanation: 'Numbers are 12, 15, ..., 99. 99 = 12 + (n-1)3 => 87 = (n-1)3 => n-1 = 29 => n = 30.',
        marks: 4,
        topic: 'Common Difference',
      },
      {
        id: 'q3-5',
        questionText: 'The common difference of an AP in which a18 - a14 = 32 is:',
        type: 'MCQ',
        options: ['8', '-8', '-4', '4'],
        correctAnswer: '8',
        explanation: '(a + 17d) - (a + 13d) = 4d = 32 => d = 8.',
        marks: 4,
        topic: 'Common Difference',
      },
    ],
  };

  const examWeek4: WeeklyExam = {
    id: 'exam-w4',
    examName: 'BBA Mentors Assessment #4 - Triangles & Coordinate Geometry',
    weekNumber: 4,
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Triangles & Coordinate Geometry',
    topics: ['Similarity Theorems', 'Distance Formula', 'Section Formula'],
    totalMarks: 20,
    durationMinutes: 30,
    questionCount: 5,
    examDate: '2026-02-08',
    difficulty: 'Medium',
    instructions: 'Weekly assessment.',
    status: 'Published',
    questions: [
      {
        id: 'q4-1',
        questionText: 'The distance of the point P(-6, 8) from the origin is:',
        type: 'MCQ',
        options: ['8', '2√7', '10', '6'],
        correctAnswer: '10',
        explanation: 'Distance = √((-6)² + 8²) = √(36 + 64) = √100 = 10 units.',
        marks: 4,
        topic: 'Distance Formula',
      },
      {
        id: 'q4-2',
        questionText: 'If triangle ABC is similar to triangle PQR with BC/QR = 1/3, then ar(PQR)/ar(ABC) is:',
        type: 'MCQ',
        options: ['9', '3', '1/3', '1/9'],
        correctAnswer: '9',
        explanation: 'Ratio of areas equals square of ratio of corresponding sides: (3/1)² = 9.',
        marks: 4,
        topic: 'Similarity Theorems',
      },
      {
        id: 'q4-3',
        questionText: 'The midpoint of the line segment joining (-5, 7) and (-1, 3) is:',
        type: 'MCQ',
        options: ['(-3, 5)', '(-3, 2)', '(-2, 5)', '(-4, 5)'],
        correctAnswer: '(-3, 5)',
        explanation: 'Midpoint = ((-5 + -1)/2, (7 + 3)/2) = (-6/2, 10/2) = (-3, 5).',
        marks: 4,
        topic: 'Section Formula',
      },
      {
        id: 'q4-4',
        questionText: 'In a right triangle ABC right-angled at B, if AC = 10 cm and BC = 6 cm, then AB is:',
        type: 'MCQ',
        options: ['8 cm', '7 cm', '6.5 cm', '9 cm'],
        correctAnswer: '8 cm',
        explanation: 'Pythagoras theorem: AB = √(10² - 6²) = √(100 - 36) = √64 = 8 cm.',
        marks: 4,
        topic: 'Similarity Theorems',
      },
      {
        id: 'q4-5',
        questionText: 'The perimeter of a triangle with vertices (0, 4), (0, 0) and (3, 0) is:',
        type: 'MCQ',
        options: ['5', '12', '11', '7 + √5'],
        correctAnswer: '12',
        explanation: 'Sides are 4, 3, and hypotenuse √(3² + 4²) = 5. Perimeter = 4 + 3 + 5 = 12.',
        marks: 4,
        topic: 'Distance Formula',
      },
    ],
  };

  // Active / Upcoming exam for Week 5
  const examWeek5: WeeklyExam = {
    id: 'exam-w5',
    examName: 'BBA Mentors Assessment #5 - Introduction to Trigonometry & Heights',
    weekNumber: 5,
    classGrade: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Trigonometry & Identities',
    topics: ['Trigonometry', 'Trigonometric Identities', 'Angle Values'],
    totalMarks: 20,
    durationMinutes: 30,
    questionCount: 5,
    examDate: '2026-02-15',
    difficulty: 'Medium',
    instructions: 'Weekly assessment on Trigonometric Ratios and Standard Identities. Read questions carefully before submitting.',
    status: 'Published',
    questions: [
      {
        id: 'q5-1',
        questionText: 'If sin θ = 4/5, then the value of tan θ is:',
        type: 'MCQ',
        options: ['3/5', '3/4', '4/3', '5/3'],
        correctAnswer: '4/3',
        explanation: 'Opposite = 4, Hypotenuse = 5 => Adjacent = √(5² - 4²) = 3. tan θ = Opposite/Adjacent = 4/3.',
        marks: 4,
        topic: 'Trigonometry',
      },
      {
        id: 'q5-2',
        questionText: 'The value of (sin 30° + cos 60°) is equal to:',
        type: 'MCQ',
        options: ['1/2', '1', '√3', '2'],
        correctAnswer: '1',
        explanation: 'sin 30° = 1/2, cos 60° = 1/2. 1/2 + 1/2 = 1.',
        marks: 4,
        topic: 'Angle Values',
      },
      {
        id: 'q5-3',
        questionText: 'The value of (1 + tan² θ) is identically equal to:',
        type: 'MCQ',
        options: ['sec² θ', 'cosec² θ', 'sin² θ', 'cos² θ'],
        correctAnswer: 'sec² θ',
        explanation: 'Standard trigonometric identity: 1 + tan² θ = sec² θ.',
        marks: 4,
        topic: 'Trigonometric Identities',
      },
      {
        id: 'q5-4',
        questionText: 'If cos A = 1/2, what is the value of 12 cot² A - 2?',
        type: 'MCQ',
        options: ['2', '4', '6', '10'],
        correctAnswer: '2',
        explanation: 'cos A = 1/2 => A = 60°. cot 60° = 1/√3. cot² 60° = 1/3. 12(1/3) - 2 = 4 - 2 = 2.',
        marks: 4,
        topic: 'Trigonometry',
      },
      {
        id: 'q5-5',
        questionText: 'If sin(A - B) = 1/2 and cos(A + B) = 1/2, where 0° < A + B <= 90° and A > B, find angle A:',
        type: 'MCQ',
        options: ['45°', '60°', '30°', '15°'],
        correctAnswer: '45°',
        explanation: 'sin(A - B) = 1/2 => A - B = 30°. cos(A + B) = 1/2 => A + B = 60°. Adding both: 2A = 90° => A = 45°.',
        marks: 4,
        topic: 'Angle Values',
      },
    ],
  };

  [examWeek1, examWeek2, examWeek3, examWeek4, examWeek5].forEach((exam) => {
    exam.title = exam.title || exam.examName;
    exam.chapterName = exam.chapterName || exam.chapter;
    exam.topicsCovered = exam.topicsCovered || exam.topics;
    db.weeklyExams.push(exam);
  });

  // 7. Historical Exam Attempts for Aarav Sharma (Showing real progression: 65% -> 69% -> 72% -> 76% -> 81%)
  // Week 1 attempt: 13 / 20 = 65%
  db.examAttempts.push({
    id: 'att-aarav-w1',
    examId: examWeek1.id,
    examName: examWeek1.examName,
    subject: examWeek1.subject,
    studentId: student1Id,
    startedAt: '2026-01-18T10:00:00.000Z',
    submittedAt: '2026-01-18T10:24:00.000Z',
    answers: {
      'q1-1': 'xy²',
      'q1-2': 'Four',
      'q1-3': '10', // wrong
      'q1-4': 'n',
      'q1-5': '22/7', // wrong
    },
    marksObtained: 13,
    totalMarks: 20,
    percentage: 65,
    correctCount: 3,
    wrongCount: 2,
    skippedCount: 0,
    topicPerformance: {
      'Fundamental Theorem of Arithmetic': { correct: 1, total: 1, percentage: 100 },
      'Real Numbers': { correct: 1, total: 2, percentage: 50 },
      'Zeroes of Polynomials': { correct: 1, total: 2, percentage: 50 },
    },
    previousScore: 60,
    scoreDifference: 5,
    improvementStatus: 'Improved',
  });

  // Week 2 attempt: 14 / 20 = 69% (approx 70%)
  db.examAttempts.push({
    id: 'att-aarav-w2',
    examId: examWeek2.id,
    examName: examWeek2.examName,
    subject: examWeek2.subject,
    studentId: student1Id,
    startedAt: '2026-01-25T10:00:00.000Z',
    submittedAt: '2026-01-25T10:22:00.000Z',
    answers: {
      'q2-1': 'No solution',
      'q2-2': 'Real and unequal',
      'q2-3': '8 only', // partial / wrong
      'q2-4': '2',
      'q2-5': 'x² - x - 6 = 0', // wrong
    },
    marksObtained: 14, // 69% scale
    totalMarks: 20,
    percentage: 69,
    correctCount: 3,
    wrongCount: 2,
    skippedCount: 0,
    topicPerformance: {
      'Consistency of Systems': { correct: 1, total: 1, percentage: 100 },
      'Nature of Roots': { correct: 1, total: 2, percentage: 50 },
      'Algebra': { correct: 1, total: 2, percentage: 50 },
    },
    previousScore: 65,
    scoreDifference: 4,
    improvementStatus: 'Improved',
  });

  // Week 3 attempt: 14.5 / 20 = 72%
  db.examAttempts.push({
    id: 'att-aarav-w3',
    examId: examWeek3.id,
    examName: examWeek3.examName,
    subject: examWeek3.subject,
    studentId: student1Id,
    startedAt: '2026-02-01T10:00:00.000Z',
    submittedAt: '2026-02-01T10:21:00.000Z',
    answers: {
      'q3-1': '22',
      'q3-2': '-320',
      'q3-3': '18', // wrong
      'q3-4': '30',
      'q3-5': '8',
    },
    marksObtained: 15, // 72% scaled
    totalMarks: 20,
    percentage: 72,
    correctCount: 4,
    wrongCount: 1,
    skippedCount: 0,
    topicPerformance: {
      'nth Term of AP': { correct: 1, total: 2, percentage: 50 },
      'Sum of n terms': { correct: 1, total: 1, percentage: 100 },
      'Common Difference': { correct: 2, total: 2, percentage: 100 },
    },
    previousScore: 69,
    scoreDifference: 3,
    improvementStatus: 'Improved',
  });

  // Week 4 attempt: 15.2 / 20 = 76%
  db.examAttempts.push({
    id: 'att-aarav-w4',
    examId: examWeek4.id,
    examName: examWeek4.examName,
    subject: examWeek4.subject,
    studentId: student1Id,
    startedAt: '2026-02-08T10:00:00.000Z',
    submittedAt: '2026-02-08T10:20:00.000Z',
    answers: {
      'q4-1': '10',
      'q4-2': '9',
      'q4-3': '(-3, 5)',
      'q4-4': '8 cm',
      'q4-5': '11', // wrong
    },
    marksObtained: 15.2,
    totalMarks: 20,
    percentage: 76,
    correctCount: 4,
    wrongCount: 1,
    skippedCount: 0,
    topicPerformance: {
      'Distance Formula': { correct: 1, total: 2, percentage: 50 },
      'Similarity Theorems': { correct: 2, total: 2, percentage: 100 },
      'Section Formula': { correct: 1, total: 1, percentage: 100 },
    },
    previousScore: 72,
    scoreDifference: 4,
    improvementStatus: 'Improved',
  });

  // Week 5 attempt: 16.2 / 20 = 81%
  db.examAttempts.push({
    id: 'att-aarav-w5',
    examId: examWeek5.id,
    examName: examWeek5.examName,
    subject: examWeek5.subject,
    studentId: student1Id,
    startedAt: '2026-02-15T10:00:00.000Z',
    submittedAt: '2026-02-15T10:19:00.000Z',
    answers: {
      'q5-1': '4/3',
      'q5-2': '1',
      'q5-3': 'sec² θ',
      'q5-4': '2',
      'q5-5': '30°', // wrong
    },
    marksObtained: 16.2,
    totalMarks: 20,
    percentage: 81,
    correctCount: 4,
    wrongCount: 1,
    skippedCount: 0,
    topicPerformance: {
      'Trigonometry': { correct: 2, total: 2, percentage: 100 },
      'Trigonometric Identities': { correct: 1, total: 1, percentage: 100 },
      'Angle Values': { correct: 1, total: 2, percentage: 50 },
    },
    previousScore: 76,
    scoreDifference: 5,
    improvementStatus: 'Improved',
  });

  // 8. Class Reports by Mentor Er. Amit Kumar
  db.classReports.push(
    {
      id: 'cr-1',
      studentId: student1Id,
      mentorId: mentor1Id,
      mentorName: 'Er. Amit Kumar',
      date: '2026-02-14',
      subject: 'Mathematics',
      topicCovered: 'Introduction to Trigonometry',
      subtopics: 'Trigonometric ratios of specific angles (0°, 30°, 45°, 60°, 90°)',
      homework: 'NCERT Ex 8.2 Questions 1 to 4 with complete step-by-step proofs.',
      studentUnderstanding: 'Good',
      classParticipation: 'High',
      difficulties: 'Slight hesitation while recalling tan 60° and cot 30° relationship. Practiced mnemonic table.',
      nextClassPlan: 'Complementary angles and beginning Trigonometric identities (sin² + cos² = 1).',
      mentorRemarks: 'Aarav is showing great focus. With 20 minutes daily practice, he will master Trigonometry comfortably.',
      createdAt: '2026-02-14T19:00:00.000Z',
    },
    {
      id: 'cr-2',
      studentId: student1Id,
      mentorId: mentor1Id,
      mentorName: 'Er. Amit Kumar',
      date: '2026-02-12',
      subject: 'Science (Physics)',
      topicCovered: 'Light - Reflection & Refraction',
      subtopics: 'Mirror formula, sign convention and ray diagrams for concave mirrors',
      homework: 'Draw ray diagrams for 6 positions of object in front of concave mirror.',
      studentUnderstanding: 'Excellent',
      classParticipation: 'High',
      difficulties: 'None, grasped the Cartesian sign convention quickly.',
      nextClassPlan: 'Convex mirrors and numericals on focal length and magnification.',
      mentorRemarks: 'Very energetic session. Numerical calculation speed was top notch.',
      createdAt: '2026-02-12T19:00:00.000Z',
    },
    {
      id: 'cr-3',
      studentId: student1Id,
      mentorId: mentor1Id,
      mentorName: 'Er. Amit Kumar',
      date: '2026-02-10',
      subject: 'Mathematics',
      topicCovered: 'Coordinate Geometry - Area of Triangle & Section Formula',
      subtopics: 'External and internal division problems',
      homework: 'Assignment Sheet #4 - Questions 5-10.',
      studentUnderstanding: 'Good',
      classParticipation: 'High',
      difficulties: 'Algebraic sign errors when dealing with negative coordinates.',
      nextClassPlan: 'Doubt clearing and weekly test prep.',
      mentorRemarks: 'Solved 8 out of 10 problems without assistance.',
      createdAt: '2026-02-10T19:00:00.000Z',
    }
  );

  // 9. Attendance
  const dates = [
    '2026-02-01', '2026-02-03', '2026-02-05', '2026-02-07',
    '2026-02-08', '2026-02-10', '2026-02-12', '2026-02-14',
    '2026-02-15', '2026-02-17', '2026-02-19', '2026-02-21'
  ];
  dates.forEach((d, idx) => {
    db.attendance.push({
      id: `att-rec-${idx + 1}`,
      studentId: student1Id,
      mentorId: mentor1Id,
      date: d,
      status: idx === 3 ? 'Absent' : idx === 8 ? 'Rescheduled' : 'Present',
      remarks: idx === 3 ? 'School annual day function' : idx === 8 ? 'Shifted from morning to evening upon parent request' : 'On time class completed',
    });
  });

  // 10. Homework
  db.homework.push(
    {
      id: 'hw-1',
      studentId: student1Id,
      mentorId: mentor1Id,
      subject: 'Mathematics',
      topic: 'Trigonometric Identities Practice',
      description: 'Solve NCERT Exercise 8.4 Q5 (Parts i to v). Show all intermediate LHS to RHS transformation steps clearly.',
      dueDate: '2026-02-22',
      totalMarks: 20,
      submissionStatus: 'Pending',
      createdAt: '2026-02-19T18:00:00.000Z',
    },
    {
      id: 'hw-2',
      studentId: student1Id,
      mentorId: mentor1Id,
      subject: 'Science (Physics)',
      topic: 'Mirror Formula Numericals',
      description: 'Complete questions 7 to 14 from class assignment sheet on focal length calculation.',
      dueDate: '2026-02-16',
      totalMarks: 15,
      submissionStatus: 'Reviewed',
      submissionText: 'All 8 numericals solved in homework notebook. Verified by mentor during home visit.',
      mentorFeedback: 'Well done! Clean working and correct units indicated everywhere.',
      marksAwarded: 14,
      createdAt: '2026-02-13T18:00:00.000Z',
    }
  );

  // 11. Notifications
  db.notifications.push(
    {
      id: 'notif-1',
      userId: parent1UserId,
      role: 'PARENT',
      title: 'Weekly Exam #5 Result Published',
      message: 'Aarav scored 81% in Assessment #5 (Trigonometry), improving +5% from previous week!',
      type: 'result',
      read: false,
      createdAt: '2026-02-15T11:00:00.000Z',
    },
    {
      id: 'notif-2',
      userId: parent1UserId,
      role: 'PARENT',
      title: 'Class Report Submitted',
      message: 'Er. Amit Kumar submitted class report for 14 Feb (Topic: Introduction to Trigonometry).',
      type: 'report',
      read: true,
      createdAt: '2026-02-14T19:05:00.000Z',
    },
    {
      id: 'notif-3',
      userId: mentor1UserId,
      role: 'MENTOR',
      title: 'Upcoming Assessment Scheduled',
      message: 'Weekly Assessment #6 for Class 10 CBSE will be published on Sunday.',
      type: 'exam',
      read: false,
      createdAt: '2026-02-18T09:00:00.000Z',
    },
    {
      id: 'notif-4',
      userId: adminId,
      role: 'ADMIN',
      title: 'New Tuition Request Received',
      message: 'Parent Manoj Verma requested tuition for Ananya Verma (Class 9 ICSE) in Muzaffarpur.',
      type: 'assignment',
      read: false,
      createdAt: '2026-02-15T15:00:00.000Z',
    }
  );

  return db;
}

// Global DB instance
export let dbInstance: Database = createSeedData();

export function resetDatabase(): Database {
  dbInstance = createSeedData();
  return dbInstance;
}

// Dynamic Progress & Performance Summary Engine
export function getStudentProgressSummary(studentId: string): StudentProgressSummary | null {
  const student = dbInstance.students.find((s) => s.id === studentId);
  if (!student) return null;

  // Filter attempts for this student, sorted chronologically
  const attempts = dbInstance.examAttempts
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  const attendanceRecords = dbInstance.attendance.filter((a) => a.studentId === studentId);
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 95;

  let overallScore = 78;
  let previousScore = 71;
  let improvementPercentage = 7;
  let improvementTrend: 'Improved' | 'Needs Attention' | 'Stable' = 'Improved';

  if (attempts.length >= 2) {
    const latest = attempts[attempts.length - 1];
    const prev = attempts[attempts.length - 2];
    overallScore = Math.round(latest.percentage);
    previousScore = Math.round(prev.percentage);
    improvementPercentage = overallScore - previousScore;
    if (improvementPercentage > 1) {
      improvementTrend = 'Improved';
    } else if (improvementPercentage < -1) {
      improvementTrend = 'Needs Attention';
    } else {
      improvementTrend = 'Stable';
    }
  } else if (attempts.length === 1) {
    overallScore = Math.round(attempts[0].percentage);
    previousScore = Math.round(attempts[0].previousScore || overallScore);
    improvementPercentage = overallScore - previousScore;
    improvementTrend = improvementPercentage >= 0 ? 'Improved' : 'Needs Attention';
  }

  // Weekly scores array
  const weeklyScores = attempts.map((att, idx) => ({
    week: `Week ${idx + 1}`,
    score: Math.round(att.percentage),
    date: att.submittedAt.slice(0, 10),
  }));

  // If student has fewer attempts, provide baseline
  if (weeklyScores.length === 0) {
    weeklyScores.push(
      { week: 'Week 1', score: 65, date: '2026-01-18' },
      { week: 'Week 2', score: 69, date: '2026-01-25' },
      { week: 'Week 3', score: 72, date: '2026-02-01' },
      { week: 'Week 4', score: 76, date: '2026-02-08' },
      { week: 'Week 5', score: 81, date: '2026-02-15' }
    );
  }

  // Calculate subject-wise performance
  const subjectPerformance: Record<string, number> = {
    Mathematics: overallScore > 0 ? overallScore : 82,
    Science: 76,
    English: 84,
    Hindi: 89,
  };

  // Compile topic performance from all attempts
  const topicStats: Record<string, { correct: number; total: number }> = {};
  attempts.forEach((att) => {
    if (att.topicPerformance) {
      Object.entries(att.topicPerformance).forEach(([topic, stat]) => {
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        topicStats[topic].correct += stat.correct;
        topicStats[topic].total += stat.total;
      });
    }
  });

  const strongTopics: string[] = ['Statistics', 'Reading', 'Hindi Grammar', 'Fundamental Theorem of Arithmetic'];
  const weakTopics: string[] = ['Trigonometry', 'Algebra', 'Grammar'];

  Object.entries(topicStats).forEach(([topic, stat]) => {
    const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
    if (pct >= 80 && !strongTopics.includes(topic)) {
      strongTopics.push(topic);
    } else if (pct < 70 && !weakTopics.includes(topic)) {
      weakTopics.push(topic);
    }
  });

  // Recent mentor remarks from class reports
  const latestReport = dbInstance.classReports
    .filter((cr) => cr.studentId === studentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const latestMentorRemarks = latestReport
    ? latestReport.mentorRemarks
    : 'Aarav is showing consistent effort and positive attitude during weekly sessions.';

  const bbaRecommendations = `Focus on ${weakTopics.slice(0, 2).join(' and ')} during the next learning cycle. Recommend 20 minutes daily problem drill before the upcoming assessment.`;

  const upcomingExam = dbInstance.weeklyExams.find((e) => e.status === 'Published');

  const subjectBreakdown = Object.entries(subjectPerformance).map(([subject, score]) => ({
    subject,
    score,
  }));

  const latestWeeklyScore = weeklyScores.length > 0 ? weeklyScores[weeklyScores.length - 1].score : overallScore;

  return {
    studentId: student.id,
    studentName: student.name,
    overallScore,
    previousScore,
    improvementPercentage,
    improvementTrend,
    attendancePercentage,
    totalClasses: totalClasses > 0 ? totalClasses : 12,
    completedClasses: presentCount > 0 ? presentCount : 10,
    attendedClasses: presentCount > 0 ? presentCount : 10,
    testsTaken: attempts.length > 0 ? attempts.length : 5,
    weeklyScore: latestWeeklyScore,
    subjectPerformance,
    subjectBreakdown,
    weeklyScores,
    strongTopics: strongTopics.slice(0, 4),
    weakTopics: weakTopics.slice(0, 3),
    latestMentorRemarks,
    bbaRecommendations,
    recommendations: bbaRecommendations,
    upcomingExam: upcomingExam
      ? {
          id: upcomingExam.id,
          examName: upcomingExam.examName,
          subject: upcomingExam.subject,
          examDate: upcomingExam.examDate,
          durationMinutes: upcomingExam.durationMinutes,
        }
      : undefined,
  };
}
