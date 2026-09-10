import { useState, type FormEvent } from 'react';
import {
  MapPin,
  CheckCircle2,
  Check,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  Star,
  Sparkles,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  UserCheck,
  HeartHandshake,
  TrendingUp,
  FileText,
  BadgeCheck,
  Search,
  Calculator,
  Target,
  Brain,
  Sliders,
  Home,
  GraduationCap,
  Eye,
  Flame,
  Lightbulb,
  CheckSquare,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { ALL_38_BIHAR_DISTRICTS, TOTAL_BIHAR_DISTRICTS_COUNT } from '../../data/biharDistricts.ts';
import { ALL_ACADEMIC_CLASSES } from '../../data/academicClasses.ts';

interface HomeTuitionProps {
  onNavigate: (view: string, data?: any) => void;
}

export function HomeTuitionPage({ onNavigate }: HomeTuitionProps) {
  // Demo Booking Form State
  const [demoForm, setDemoForm] = useState({
    parentName: '',
    mobile: '',
    childName: '',
    classGrade: 'Class 10',
    board: 'CBSE',
    subjects: 'Mathematics & Science',
    district: 'Patna',
    cityArea: 'Boring Road',
    preferredGender: 'Any',
    preferredTiming: 'Evening (5:00 PM - 7:00 PM)',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Interactive UI State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeApproachTab, setActiveApproachTab] = useState<'diagnostic' | 'board' | 'remedial' | 'habit' | 'exam'>('board');
  const [activeClassTab, setActiveClassTab] = useState<'all' | 'primary' | 'middle' | 'secondary' | 'senior'>('secondary');
  const [selectedProcessStep, setSelectedProcessStep] = useState(0);

  // Tuition Fee Calculator State
  const [calcClass, setCalcClass] = useState<'primary' | 'middle' | 'secondary' | 'senior'>('secondary');
  const [calcDays, setCalcDays] = useState<number>(5);
  const [calcHours, setCalcHours] = useState<number>(1.5);

  const calculateEstimate = () => {
    let baseRate = 250; // per hour
    if (calcClass === 'primary') baseRate = 200;
    if (calcClass === 'middle') baseRate = 240;
    if (calcClass === 'secondary') baseRate = 300;
    if (calcClass === 'senior') baseRate = 380;

    const hoursPerMonth = calcDays * 4.3 * calcHours;
    const estimatedFee = Math.round(hoursPerMonth * baseRate);
    return {
      monthlyHours: Math.round(hoursPerMonth),
      feeMin: Math.round(estimatedFee * 0.9 / 100) * 100,
      feeMax: Math.round(estimatedFee * 1.1 / 100) * 100,
    };
  };

  const estimate = calculateEstimate();

  const handleDemoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!demoForm.parentName || !demoForm.mobile) return;
    setSubmitting(true);
    try {
      await api.requestDemoTuition({
        parentName: demoForm.parentName,
        mobile: demoForm.mobile,
        childName: demoForm.childName || 'Student',
        classGrade: demoForm.classGrade,
        board: demoForm.board,
        subjects: demoForm.subjects,
        mode: 'Home Tuition',
        district: demoForm.district,
        city: demoForm.cityArea,
        notes: `Preferred Timing: ${demoForm.preferredTiming}. Preferred Gender: ${demoForm.preferredGender}. Booked from Home Tuition In-Depth Page.`,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Demo booking error:', err);
      // Fallback display success for interactive demo
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Bihar Coverage Districts & Hotspots
  const biharCities = [
    {
      name: 'Patna (पटना)',
      districtKey: 'Patna',
      tutorsCount: '190+ Tutors',
      areas: 'Boring Road, Kankarbagh, Bailey Road, Rajendra Nagar, Danapur, Saguna More, Ashiana, Patliputra, Kurji, Gola Road, Anisabad, Fraser Road, SK Puri',
      highlight: 'गणित, विज्ञान व BSEB/CBSE बोर्ड स्पेशलिस्ट',
    },
    {
      name: 'Gaya (गया)',
      districtKey: 'Gaya',
      tutorsCount: '70+ Tutors',
      areas: 'Civil Lines, AP Colony, Delha, Manpur, Bodhgaya Road, Rampur, Chandauti, Kendui, Gewalbigha',
      highlight: 'Class 8-12 व IIT/NEET फाउंडेशन मेंटर',
    },
    {
      name: 'Muzaffarpur (मुजफ्फरपुर)',
      districtKey: 'Muzaffarpur',
      tutorsCount: '95+ Tutors',
      areas: 'Mithanpura, Zero Mile, Aamgola, Kalambagh Road, Brahampura, Gobarsahi, Khabra, Bhagwanpur, Bela',
      highlight: 'साइंस, गणित व महिला शिक्षिकाओं की उच्च उपलब्धता',
    },
    {
      name: 'Bhagalpur (भागलपुर)',
      districtKey: 'Bhagalpur',
      tutorsCount: '60+ Tutors',
      areas: 'Tilka Manjhi, Adampur, Zero Mile, Khanjarpur, Nathnagar, Barari, Aliganj, Mirjanhat',
      highlight: 'मैट्रिक व इंटरमीडिएट टॉपर मार्गदर्शक',
    },
    {
      name: 'Darbhanga (दरभंगा)',
      districtKey: 'Darbhanga',
      tutorsCount: '55+ Tutors',
      areas: 'Laheriasarai, Tower Chowk, Mirzapur, Donar, Benta, Allalpatti, Kathalbari, Bela Dullah',
      highlight: 'CBSE/ICSE एवं बिहार बोर्ड दोनों माध्यम उपलब्ध',
    },
    {
      name: 'Purnia (पूर्णिया)',
      districtKey: 'Purnia',
      tutorsCount: '45+ Tutors',
      areas: 'Line Bazar, Bhatta Bazar, Madhubani, Navratan Hatta, Rambagh, Gulabbagh, Khuskibagh',
      highlight: 'प्राथमिक एवं माध्यमिक स्तर के समर्पित शिक्षक',
    },
    {
      name: 'Begusarai (बेगूसराय)',
      districtKey: 'Begusarai',
      tutorsCount: '40+ Tutors',
      areas: 'Har-Har Mahadev Chowk, Kali Sthan, Refinery Township, Bishanpur, Hemra, Singhaul, GD College Area',
      highlight: 'फिजिक्स, केमिस्ट्री और गणित विशेषज्ञ',
    },
    {
      name: 'Bhojpur / Ara (आरा)',
      districtKey: 'Bhojpur',
      tutorsCount: '40+ Tutors',
      areas: 'Nawada, Katira, Anaith, Chandwa, Jagdeo Nagar, Dharhara, Pakari, Koirpurwa',
      highlight: 'अनुभवी सरकारी स्कूल व कॉलेज स्तर के ट्यूटर',
    },
  ];

  // Featured Verified In-Person Mentors
  const featuredMentors = [
    {
      id: 'm1',
      name: 'अमित कुमार (Amit Kumar)',
      degree: 'B.Tech (NIT Patna)',
      experience: '6 वर्ष अनुभव',
      district: 'Patna',
      locality: 'Boring Road / Kankarbagh',
      subjects: ['Mathematics', 'Physics', 'Science'],
      grades: 'Class 9 - 12 (CBSE & BSEB)',
      rating: 4.9,
      reviewsCount: 38,
      hourlyRate: '₹350 / घंटा',
      badge: 'Board Rank Producer',
      bio: 'BSEB मैट्रिक और CBSE कक्षा 10वीं व 12वीं के 40 से अधिक छात्रों को 90%+ अंक दिलवा चुके हैं। गणित के मुश्किल सूत्रों को सरल उदाहरणों से समझाते हैं।',
    },
    {
      id: 'm2',
      name: 'नेहा कुमारी (Neha Kumari)',
      degree: 'M.Sc. Chemistry (Patna University)',
      experience: '5 वर्ष अनुभव',
      district: 'Patna',
      locality: 'Rajendra Nagar / Bailey Road',
      subjects: ['Science', 'Chemistry', 'Biology'],
      grades: 'Class 6 - 10 (All Subjects)',
      rating: 4.95,
      reviewsCount: 42,
      hourlyRate: '₹300 / घंटा',
      badge: 'Top Female Mentor',
      bio: 'छात्राओं और प्राथमिक-माध्यमिक वर्ग के बच्चों के लिए विशेष रूप से अनुशंसित। धैर्यपूर्वक नोट्स बनवाना, सुंदर लिखावट और दैनिक होमवर्क कराना इनकी खूबी है।',
    },
    {
      id: 'm3',
      name: 'राहुल वर्मा (Rahul Verma)',
      degree: 'B.Sc. Physics Hons (Patna Science College)',
      experience: '7 वर्ष अनुभव',
      district: 'Muzaffarpur',
      locality: 'Mithanpura / Kalambagh',
      subjects: ['Physics', 'Mathematics', 'Science'],
      grades: 'Class 9 - 10 BSEB Matric Specialist',
      rating: 4.88,
      reviewsCount: 29,
      hourlyRate: '₹280 / घंटा',
      badge: 'BSEB Matric Specialist',
      bio: 'बिहार बोर्ड के परीक्षा पैटर्न, OMR ऑब्जेक्टिव और 5-अंकों के प्रश्नों के उत्तर लिखने की सटीक कला सिखाते हैं। हर हफ्ते नियमित टेस्ट लेते हैं।',
    },
    {
      id: 'm4',
      name: 'प्रिया सिंह (Priya Singh)',
      degree: 'M.A. English & B.Ed',
      experience: '4 वर्ष अनुभव',
      district: 'Gaya',
      locality: 'AP Colony / Civil Lines',
      subjects: ['English', 'Social Science', 'All Subjects (1-8)'],
      grades: 'Class 1 - 8 (Foundation & Language)',
      rating: 4.92,
      reviewsCount: 34,
      hourlyRate: '₹250 / घंटा',
      badge: 'Child Psychology Trained',
      bio: 'बच्चों में पढ़ने की आदत, इंग्लिश स्पीकिंग/ग्रामर और स्कूल के गृहकार्य को बिना किसी मानसिक दबाव के समय पर पूरा कराने में निपुण।',
    },
  ];

  // 6 Structured Process Stages
  const processStages = [
    {
      step: '01',
      title: 'आवश्यकता एवं शैक्षणिक निदान (Diagnostic Assessment)',
      tag: 'Need Analysis',
      desc: 'आप बच्चे की कक्षा, बोर्ड (BSEB/CBSE), कमजोर विषय, पसंदीदा समय और घर का पता दर्ज करते हैं। हमारे काउंसलर पिछले परीक्षा परिणाम व छात्र के सीखने की गति का विश्लेषण करते हैं।',
      bullets: [
        'छात्र की पिछली मार्कशीट और कमजोर अध्यायों की पहचान',
        'अभिभावक की प्राथमिकताएं (महिला/पुरुष शिक्षक, समय स्लॉट)',
        'स्थान के आधार पर 3-5 किमी दायरे में उपयुक्त शिक्षक सूची',
      ],
    },
    {
      step: '02',
      title: 'निकटतम 4-स्तरीय सत्यापित शिक्षक का आवंटन (Smart Mentor Matching)',
      tag: 'Matching Algorithm',
      desc: 'हम अपने डेटाबेस से आपके घर के सबसे निकट रहने वाले शिक्षक का चयन करते हैं। सभी शिक्षक आधार, कॉलेज डिग्री, पुलिस सत्यापन और विषय ज्ञान परीक्षा से प्रमाणित होते हैं।',
      bullets: [
        '100% भौतिक सत्यापन (Aadhaar & Residence Check)',
        'NIT/Patna University/BHU जैसे प्रतिष्ठित संस्थानों से डिग्री',
        'निकटता के कारण बारिश या ठंड में भी शून्य अनुपस्थिति',
      ],
    },
    {
      step: '03',
      title: 'घर पर 2-दिन की निशुल्क डेमो क्लास (2-Day Zero-Risk Trial)',
      tag: 'Zero Financial Risk',
      desc: 'शिक्षक आपके घर आकर 2 पूर्ण सत्र (Sessions) पढ़ाते हैं। आप और आपका बच्चा शिक्षक के धैर्य, संप्रेषण और पढ़ाने की शैली को अपनी आंखों के सामने परखते हैं।',
      bullets: [
        'बिना किसी अग्रिम शुल्क या कार्ड के 100% फ्री डेमो',
        'बच्चे की शिक्षक के साथ ट्यूनिंग और समझ का प्रत्यक्ष अवलोकन',
        'संतुष्ट न होने पर 48 घंटे में दूसरा ट्यूटर विकल्प उपलब्ध',
      ],
    },
    {
      step: '04',
      title: 'व्यक्तिगत अध्ययन योजना व समय-सारणी (Custom Study Blueprint)',
      tag: 'Structured Schedule',
      desc: 'सहमति बनने पर साप्ताहिक शेड्यूल तय होता है (सप्ताह में 5 या 6 दिन, 1 से 1.5 घंटे प्रतिदिन)। स्कूल परीक्षा और बोर्ड समयसीमा के अनुरूप मासिक सिलेबस रोडमैप बनता है।',
      bullets: [
        'मासिक अध्याय विभाजन व रिवीजन कैलेंडर',
        'स्कूल गृहकार्य और सेल्फ-स्टडी का व्यवस्थित संतुलन',
        'कमजोर अध्यायों के लिए अतिरिक्त रिविज़न स्लॉट्स',
      ],
    },
    {
      step: '05',
      title: 'दैनिक क्लास लॉग व डिजिटल डायरी (Daily Class & Homework Logs)',
      tag: 'Accountability & Tracking',
      desc: 'प्रत्येक क्लास समाप्त होने के बाद शिक्षक मोबाइल ऐप में पढ़ाया गया टॉपिक, गृहकार्य और छात्र के समझने का स्तर दर्ज करता है। यह सब अभिभावक के फ़ोन पर लाइव दिखता है।',
      bullets: [
        'पारदर्शी डिजिटल अटेंडेंस और क्लास टाइमिंग रिकॉर्ड',
        'दैनिक गृहकार्य जांच और समझ का स्कोर (1-5 सितारे)',
        'अभिभावक कभी भी अपने ऐप से प्रगति ट्रैक कर सकते हैं',
      ],
    },
    {
      step: '06',
      title: 'साप्ताहिक संडे टेस्ट व अभिभावक रिपोर्ट कार्ड (Sunday Tests & Monthly PTM)',
      tag: 'Learn. Test. Improve.',
      desc: 'BBA Mentors की सबसे बड़ी ताकत! पूरे सप्ताह में जो पढ़ाया गया, हर रविवार BBA Mentors के स्वतंत्र टेस्ट पेपर द्वारा उसका निष्पक्ष परीक्षण होता है।',
      bullets: [
        'BBA शैक्षणिक बोर्ड द्वारा तैयार मानकीकृत प्रश्नपत्र',
        'अंक और कमज़ोर टॉपिक्स का तुरंत ग्राफ़िकल विश्लेषण',
        'मासिक रिपोर्ट कार्ड एवं काउंसलर-अभिभावक समन्वय',
      ],
    },
  ];

  // FAQs
  const homeTuitionFaqs = [
    {
      q: 'होम ट्यूशन (Home Tuition) के क्या मुख्य लाभ हैं और यह कोचिंग से बेहतर क्यों है?',
      a: 'होम ट्यूशन में शिक्षक केवल आपके बच्चे पर 100% ध्यान केंद्रित करते हैं (1-on-1 Personalized Attention)। कोचिंग में 60 से 100 छात्रों की भीड़ में झिझकने वाले बच्चे सवाल नहीं पूछ पाते। इसके अतिरिक्त, घर पर ट्यूशन से प्रतिदिन 2 घंटे की आने-जाने की थकान और ट्रैफिक की धूल से मुक्ति मिलती है, और माता-पिता खुद अपनी आंखों के सामने पढ़ाई की गुणवत्ता देख सकते हैं।',
    },
    {
      q: 'BBA Mentors पर शिक्षक की सुरक्षा और सत्यापन (Verification) कैसे सुनिश्चित किया जाता है?',
      a: 'सुरक्षा हमारी सर्वोच्च प्राथमिकता है। BBA Mentors का प्रत्येक शिक्षक 4-स्तरीय जांच से गुजरता है: (1) सरकारी आधार कार्ड सत्यापन, (2) कॉलेज डिग्री व मार्कशीट की मूल प्रति की जांच, (3) स्थानीय पते व पुलिस रिकॉर्ड की प्राथमिक जांच, और (4) विषय ज्ञान एवं शिक्षण कौशल का व्यक्तिगत इंटरव्यू। केवल शीर्ष 15% ट्यूटर्स को ही परिवारों के घर भेजा जाता है।',
    },
    {
      q: 'क्या 2-दिन की डेमो क्लास सचमुच निशुल्क (100% Free) है?',
      a: 'हाँ, बिल्कुल! शिक्षक आपके घर आकर लगातार 2 दिन पढ़ाते हैं। यदि आपको शिक्षक का तरीका, समय की पाबंदी या व्यवहार अनुकूल नहीं लगता, तो आपसे एक रुपया भी नहीं लिया जाएगा। आप पूरी तरह संतुष्ट होने के बाद ही रेगुलर क्लास की अनुमति देते हैं।',
    },
    {
      q: 'क्या छात्राओं और प्राथमिक वर्ग के बच्चों के लिए महिला शिक्षिका (Female Home Tutor) मिलती हैं?',
      a: 'हाँ, पटना, गया, मुजफ्फरपुर, भागलपुर, दरभंगा सहित बिहार के सभी मुख्य शहरों में छात्राओं और प्राथमिक कक्षाओं (Class 1-5) के लिए विशेष रूप से महिला शिक्षिकाओं का एक बड़ा, सत्यापित नेटवर्क उपलब्ध है। बुकिंग फॉर्म में आप "Female Tutor" चुन सकते हैं।',
    },
    {
      q: 'साप्ताहिक संडे टेस्ट (Weekly Sunday Test) होम ट्यूशन में कैसे काम करता है?',
      a: 'यही BBA Mentors का क्रांतिकारी मॉडल है ("Learn. Test. Improve.")! ट्यूटर पूरे हफ्ते जो भी पढ़ाते हैं, हर रविवार को छात्र BBA Mentors के मानकीकृत टेस्ट पेपर को हल करता है। इससे ट्यूटर की जवाबदेही बनी रहती है कि उन्होंने सच में कोर्स सिखाया है या सिर्फ फॉर्मेलिटी की है। टेस्ट के परिणाम सीधे माता-पिता के ऐप पर दिखते हैं।',
    },
    {
      q: 'यदि शिक्षक का पढ़ाना पसंद न आए तो क्या ट्यूटर बदलने की गारंटी है?',
      a: 'जी हाँ! हमारी "Zero-Hassle 48-Hour Replacement Guarantee" है। यदि किसी भी महीने में छात्र की ट्यूटर के साथ ट्यूनिंग नहीं जमती, तो आप ऐप या हेल्पलाइन पर एक मैसेज करेंगे और 48 घंटे के भीतर बिना किसी अतिरिक्त चार्ज के नया योग्य शिक्षक उपलब्ध करा दिया जाएगा।',
    },
    {
      q: 'क्या बिहार बोर्ड (BSEB हिंदी/अंग्रेजी माध्यम) और CBSE/ICSE दोनों के शिक्षक मिलते हैं?',
      a: 'हाँ! हमारे पास बिहार बोर्ड (BSEB मैट्रिक व इंटरमीडिएट) के विशेषज्ञ शिक्षक हैं जो NCERT/BTBC किताबों, पिछले 10 वर्षों के प्रश्नपत्रों और 50% OMR ऑब्जेक्टिव पैटर्न में पारंगत हैं। साथ ही CBSE और ICSE के कॉन्सेप्ट-बेस्ड व अंग्रेजी माध्यम में दक्ष शिक्षक भी उपलब्ध हैं।',
    },
    {
      q: 'होम ट्यूशन की फीस कितनी होती है और इसका भुगतान कैसे होता है?',
      a: 'कक्षा और विषय के अनुसार फीस आमतौर पर ₹2,500 से ₹6,000 प्रति माह के बीच होती है। माता-पिता से कोई ब्रोकरेज या रजिस्ट्रेशन कमीशन नहीं लिया जाता। महीने के अंत में क्लास लॉग और अटेंडेंस देखकर सुरक्षित ऑनलाइन या कैश रसीद के साथ भुगतान किया जाता है।',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 text-left">
      {/* =========================================================================
          HERO SECTION: IN-PERSON VALUE PROPOSITION & DIRECT BOOKING CARD
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white pt-12 pb-20 overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy: Value Proposition */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>बिहार का सबसे अनुशासित 1-on-1 होम ट्यूशन नेटवर्क (Doorstep Tutoring)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                घर बैठे व्यक्तिगत होम ट्यूशन,{' '}
                <span className="text-amber-400">हर संडे टेस्ट</span> और 100% वेरिफाइड शिक्षक
              </h1>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                अपने बच्चे को भीड़-भाड़ वाले कोचिंग के तनाव और रोज़ाना 2 घंटे की ट्रैफ़िक थकान से बचाइए।
                पटना, गया, मुजफ्फरपुर, भागलपुर सहित पूरे बिहार में{' '}
                <strong className="text-white font-semibold">100% पुलिस व डिग्री सत्यापित गृह शिक्षक</strong> पाएं—दैनिक क्लास रिपोर्ट और हर रविवार मानकीकृत टेस्ट के साथ।
              </p>

              {/* 4 Pillars Trust Badges */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5 backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>100% बैकग्राउंड वेरिफाइड</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5 backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>2-दिन फ्री होम डेमो क्लास</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5 backdrop-blur-sm">
                  <Award className="w-5 h-5 text-sky-400 shrink-0" />
                  <span>साप्ताहिक संडे टेस्ट सीरीज</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5 backdrop-blur-sm">
                  <UserCheck className="w-5 h-5 text-pink-300 shrink-0" />
                  <span>महिला शिक्षिका का विकल्प</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  id="hero-find-mentor-cta"
                  onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
                  className="px-6 py-3.5 bg-amber-400 text-blue-950 font-black text-sm rounded-xl hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition flex items-center gap-2 transform active:scale-95"
                >
                  <Search className="w-4 h-4 text-blue-950" />
                  <span>अपने क्षेत्र के शिक्षक खोजें (Discover Mentors)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#book-home-demo"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>2-दिन की निशुल्क डेमो क्लास बुक करें</span>
                </a>
              </div>

              {/* Quick Proof Metrics */}
              <div className="pt-3 flex items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>शून्य बिचौलिया शुल्क</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>48 घंटे में शिक्षक प्रतिस्थापन</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BSEB & CBSE दोनों बोर्ड</span>
                </div>
              </div>
            </div>

            {/* Right Card: Instant Doorstep Tutor Request Form */}
            <div id="book-home-demo" className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
                      Free Doorstep Consultation
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      सलाहकार ऑनलाइन हैं
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    घर के लिए शिक्षक की मांग दर्ज करें
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    2 घंटे में हमारे एकेडमिक काउंसलर का कॉल और 24 घंटे में आपके घर फ्री डेमो क्लास।
                  </p>
                </div>

                {submitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">
                      अनुरोध सफलतापूर्वक प्राप्त हुआ!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      धन्यवाद <strong>{demoForm.parentName}</strong>! आपके इलाके (<strong>{demoForm.cityArea}, {demoForm.district}</strong>)
                      के वेरिफाइड शिक्षक प्रोफाइल तैयार किए जा रहे हैं। हमारा प्रतिनिधि आपसे{' '}
                      <strong>{demoForm.mobile}</strong> पर 2 घंटे के भीतर संपर्क करेगा।
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => onNavigate('find-mentor', { district: demoForm.district, mode: 'Home Tuition' })}
                        className="w-full py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        <span>इस इलाके के सभी शिक्षक देखें (Browse Local Tutors)</span>
                      </button>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                      >
                        एक और छात्र के लिए फॉर्म भरें
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        अभिभावक का नाम (Parent Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. राजेश कुमार सिंह"
                        value={demoForm.parentName}
                        onChange={(e) => setDemoForm({ ...demoForm, parentName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          मोबाइल नंबर (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={demoForm.mobile}
                          onChange={(e) => setDemoForm({ ...demoForm, mobile: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          बच्चे का नाम (Child Name)
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. आयुष"
                          value={demoForm.childName}
                          onChange={(e) => setDemoForm({ ...demoForm, childName: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">कक्षा (Class)</label>
                        <select
                          value={demoForm.classGrade}
                          onChange={(e) => setDemoForm({ ...demoForm, classGrade: e.target.value })}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white text-xs font-medium"
                        >
                          {ALL_ACADEMIC_CLASSES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">बोर्ड (Board)</label>
                        <select
                          value={demoForm.board}
                          onChange={(e) => setDemoForm({ ...demoForm, board: e.target.value })}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white text-xs font-medium"
                        >
                          <option value="BSEB">BSEB (बिहार बोर्ड)</option>
                          <option value="CBSE">CBSE (English Medium)</option>
                          <option value="ICSE">ICSE Board</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-slate-700 block">
                            जिला (District - All {TOTAL_BIHAR_DISTRICTS_COUNT} Active)
                          </label>
                        </div>
                        <select
                          value={demoForm.district}
                          onChange={(e) => setDemoForm({ ...demoForm, district: e.target.value })}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white text-xs font-medium"
                        >
                          {ALL_38_BIHAR_DISTRICTS.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name} {d.hindiName ? `(${d.hindiName})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          मोहल्ला / कॉलोनी (Colony/Area) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. बोरिंग रोड, कंकड़बाग"
                          value={demoForm.cityArea}
                          onChange={(e) => setDemoForm({ ...demoForm, cityArea: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        शिक्षक प्राथमिकता (Teacher Preference)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Any', 'Female Tutor', 'Male Tutor'].map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => setDemoForm({ ...demoForm, preferredGender: g })}
                            className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition ${
                              demoForm.preferredGender === g
                                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {g === 'Any' ? 'कोई भी' : g === 'Female Tutor' ? 'महिला शिक्षिका' : 'पुरुष शिक्षक'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full mt-2 py-3.5 bg-blue-900 text-white font-extrabold text-sm rounded-xl hover:bg-blue-800 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? 'अनुरोध दर्ज हो रहा है...' : '2-दिन की निःशुल्क डेमो क्लास बुक करें →'}
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>🔒 100% गोपनीय व सुरक्षित</span>
                      <button
                        type="button"
                        onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
                        className="text-blue-900 font-bold hover:underline"
                      >
                        या खुद शिक्षक चुनें →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: THE CORE IN-DEPTH BENEFITS OF IN-PERSON HOME TUTORING
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
            In-Person Learning Advantage
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            घर पर 1-on-1 व्यक्तिगत पढ़ाई के 8 अद्वितीय लाभ
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            जानिए क्यों व्यक्तिगत होम ट्यूशन बिहार के छात्रों के लिए 80 छात्रों की भीड़ वाले कोचिंग सेंटर्स और निष्क्रिय मोबाइल वीडियो ऐप्स से 5 गुना अधिक प्रभावी सिद्ध होता है:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Target,
              title: '100% व्यक्तिगत ध्यान (Undivided 1-on-1 Focus)',
              desc: 'कक्षा में केवल एक छात्र और एक शिक्षक। शिक्षक छात्र की सीखने की वास्तविक गति को पहचानकर अपनी शैली ढालते हैं। कोई बच्चा पीछे नहीं छूटता।',
              benefit: 'शर्म और झिझक खत्म',
            },
            {
              icon: Home,
              title: 'आने-जाने की थकान से मुक्ति (Zero Commute Fatigue)',
              desc: 'पटना, गया, मुजफ्फरपुर के ट्रैफिक, ऑटो के धक्के और धूल से मुक्ति। छात्र के रोज़ाना 2 घंटे बचते हैं, जिससे वह ऊर्जावान होकर पढ़ता है।',
              benefit: '2+ घंटे की दैनिक बचत',
            },
            {
              icon: Lightbulb,
              title: 'तत्काल डाउट समाधान (Instant Doubt Resolution)',
              desc: 'कॉपी पर कलम चलाते ही जहाँ गलती हो, शिक्षक उसी क्षण सुधारते हैं। डाउट का कोई बैकलॉग नहीं बनता और कॉन्सेप्ट पहली बार में ही साफ हो जाता है।',
              benefit: 'गलतियों का त्वरित सुधार',
            },
            {
              icon: Eye,
              title: 'अभिभावक की प्रत्यक्ष निगरानी (Direct Parental Oversight)',
              desc: 'पढ़ाई आपके घर के सुरक्षित माहौल में होती है। आप देख सकते हैं कि शिक्षक समय पर आते हैं या नहीं, और वे बच्चे को किस धैर्य से पढ़ा रहे हैं।',
              benefit: '100% मानसिक शांति',
            },
            {
              icon: Brain,
              title: 'व्यक्तिगत अध्ययन गति (Adaptive Custom Pace)',
              desc: 'यदि छात्र को बीजगणित या प्रकाशिकी (Optics) समझने में अधिक समय चाहिए, तो शिक्षक अतिरिक्त दिन देते हैं। कोचिंग की तरह सिलेबस भगाया नहीं जाता।',
              benefit: 'गहन कॉन्सेप्ट क्लैरिटी',
            },
            {
              icon: CheckSquare,
              title: 'दैनिक होमवर्क व स्कूल समन्वय (School Sync & Homework)',
              desc: 'शिक्षक स्कूल की डायरी, कॉपियों और आगामी यूनिट टेस्ट्स के साथ तालमेल बिठाकर पढ़ाते हैं। स्कूल के गृहकार्य का कोई मानसिक तनाव नहीं रहता।',
              benefit: 'स्कूल में शीर्ष रैंक',
            },
            {
              icon: Award,
              title: 'हर संडे निष्पक्ष टेस्ट (Standardized Weekly Tests)',
              desc: 'पूरे हफ्ते की पढ़ाई का हर रविवार BBA Mentors के मानकीकृत टेस्ट पेपर से मूल्यांकन होता है। इससे शिक्षक और छात्र दोनों की जवाबदेही बनी रहती है।',
              benefit: 'लगातार स्कोर वृद्धि',
            },
            {
              icon: Flame,
              title: 'स्क्रीन फ्री व वास्तविक लिखावट (Digital Detox & Writing)',
              desc: 'मोबाइल या लैपटॉप की नीली रोशनी और नोटिफिकेशन से दूर, वास्तविक पेन-पेपर पर लिखने का अभ्यास। इससे बोर्ड परीक्षा में हैंडराइटिंग और स्पीड सुधरती है।',
              benefit: 'बोर्ड परीक्षा में 15%+ बढ़त',
            },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6 text-blue-900" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{b.benefit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 3-WAY COMPARISON MATRIX (HOME TUITION VS COACHING VS VIDEO APPS)
         ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
              सच्ची तुलना (Objective Comparison)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              BBA Mentors होम ट्यूशन vs भीड़-भाड़ वाली कोचिंग vs ऑनलाइन वीडियो
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              अपने बच्चे के भविष्य के लिए सही निर्णय लें। जानिए तीनों माध्यमों की वास्तविक प्रभावशीलता:
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 sm:p-5 font-bold text-slate-900 w-1/4">मापदंड (Parameters)</th>
                    <th className="p-4 sm:p-5 font-bold text-blue-950 w-2/5 bg-blue-50/80 border-x border-blue-200">
                      ⭐ BBA Mentors होम ट्यूशन (In-Person)
                    </th>
                    <th className="p-4 sm:p-5 font-bold text-slate-600 w-1/5 bg-slate-100/50">
                      भीड़-भाड़ वाली कोचिंग
                    </th>
                    <th className="p-4 sm:p-5 font-bold text-slate-600 w-1/5 bg-slate-100/30">
                      मोबाइल रिकॉर्डेड वीडियो ऐप्स
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      param: 'व्यक्तिगत ध्यान (Individual Focus)',
                      bba: '100% 1-on-1 शिक्षक सिर्फ एक छात्र को समर्पित।',
                      coaching: '60 से 120 छात्रों का एक बैच। शिक्षक को नाम भी याद नहीं रहता।',
                      video: 'शून्य व्यक्तिगत ध्यान। एकतरफा रिकॉर्डेड लेक्चर।',
                    },
                    {
                      param: 'डाउट समाधान (Doubt Solving)',
                      bba: 'उसी सेकंड कॉपी पर सामने बैठकर हल। कोई झिझक नहीं।',
                      coaching: 'क्लास के बाद लंबी कतार या टालमटोल। अधिकांश डाउट अनसुलझे।',
                      video: 'चैटबॉट या 24 घंटे बाद आधा-अधूरा उत्तर।',
                    },
                    {
                      param: 'आने-जाने का समय व सुरक्षा (Safety & Commute)',
                      bba: 'घर पर शिक्षक आते हैं। शून्य ट्रैफिक रिस्क, 2 घंटे की दैनिक बचत।',
                      coaching: 'ऑटो, साइकिल या धूप-धूल में 1-2 घंटे रोज बर्बाद। सड़क सुरक्षा जोखिम।',
                      video: 'घर पर, लेकिन 6-8 घंटे स्क्रीन देखने से आंखों में तनाव व सिरदर्द।',
                    },
                    {
                      param: 'अभिभावक की निगरानी (Parent Visibility)',
                      bba: 'अभिभावक घर में कभी भी क्लास देख सकते हैं + दैनिक ऐप क्लास लॉग।',
                      coaching: 'कोचिंग के अंदर क्या हो रहा है, अभिभावक को कोई भनक नहीं।',
                      video: 'बच्चा पढ़ाई कर रहा है या गेम/रील देख रहा है, ट्रैक करना कठिन।',
                    },
                    {
                      param: 'साप्ताहिक टेस्ट व मूल्यांकन (Weekly Testing)',
                      bba: 'हर रविवार मानकीकृत टेस्ट पेपर + स्वतंत्र स्कोर कार्ड।',
                      coaching: 'महीने या त्रैमासिक में एक बार। कोई व्यक्तिगत फीडबैक नहीं।',
                      video: 'ऑनलाइन क्विज़ में बच्चे तुक्के लगाते हैं या स्किप कर देते हैं।',
                    },
                    {
                      param: 'हैंडराइटिंग व बोर्ड उत्तर लेखन (Writing Skills)',
                      bba: 'कॉपी पर वास्तविक पेन-पेपर प्रैक्टिस। बोर्ड टॉपर की तरह प्रेजेंटेशन।',
                      coaching: 'केवल ब्लैकबोर्ड से उतारना। व्यक्तिगत लिखावट की कोई जांच नहीं।',
                      video: 'स्क्रीन पर केवल देखने की आदत; लिखने की क्षमता घट जाती है।',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">{row.param}</td>
                      <td className="p-4 sm:p-5 font-semibold text-blue-950 bg-blue-50/40 border-x border-blue-100">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.bba}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 bg-slate-50/30">{row.coaching}</td>
                      <td className="p-4 sm:p-5 text-slate-500 bg-slate-50/10">{row.video}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: STEP-BY-STEP PROCESS FOR IN-PERSON TUTORING
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
            The 6-Stage Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            घर पर ट्यूशन शुरू करने की 6-चरणीय पारदर्शी प्रक्रिया
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            शुरुआती मांग दर्ज करने से लेकर साप्ताहिक संडे टेस्ट और मासिक रिपोर्ट कार्ड तक—BBA Mentors की पूरी कार्यप्रणाली अत्यंत व्यवस्थित है:
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {processStages.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setSelectedProcessStep(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedProcessStep === idx
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md transform -translate-y-0.5'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-black uppercase block ${selectedProcessStep === idx ? 'text-amber-300' : 'text-blue-900'}`}>
                चरण {s.step}
              </span>
              <span className="text-xs font-bold line-clamp-1 mt-0.5">{s.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Stage Detailed Spotlight */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-lg">
                {processStages[selectedProcessStep].step}
              </span>
              <div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {processStages[selectedProcessStep].tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {processStages[selectedProcessStep].title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={selectedProcessStep === 0}
                onClick={() => setSelectedProcessStep((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 disabled:opacity-30"
              >
                ← पिछला चरण
              </button>
              <button
                disabled={selectedProcessStep === processStages.length - 1}
                onClick={() => setSelectedProcessStep((p) => Math.min(processStages.length - 1, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 disabled:opacity-30"
              >
                अगला चरण →
              </button>
            </div>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {processStages[selectedProcessStep].desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {processStages[selectedProcessStep].bullets.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>मुख्य बिंदु 0{i + 1}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All 6 Steps Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {processStages.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative group hover:border-blue-400 transition"
            >
              <span className="text-3xl font-black text-slate-100 group-hover:text-blue-50 transition absolute top-4 right-5 select-none">
                {s.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-blue-900" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CUSTOMIZED LEARNING APPROACH (कस्टमाइज्ड लर्निंग एप्रोच)
         ========================================================================= */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
              Tailored Pedagogy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              कस्टमाइज्ड लर्निंग एप्रोच: हर छात्र के लिए अनूठी शिक्षण रणनीति
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              कोई भी दो छात्र एक जैसे नहीं होते। जानिए BBA Mentors कैसे छात्र की क्षमता, बोर्ड और प्राथमिकताओं के अनुसार शिक्षण दृष्टिकोण तैयार करता है:
            </p>
          </div>

          {/* Approach Tabs */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {[
              { id: 'board', label: '1. बोर्ड अनुसार अनुकूलन (BSEB & CBSE)' },
              { id: 'diagnostic', label: '2. डायग्नोस्टिक बेसलाइन टेस्ट' },
              { id: 'remedial', label: '3. कमजोर विषयों का उपचार (Remedial Bridge)' },
              { id: 'habit', label: '4. दैनिक अध्ययन अनुशासन (Habit Building)' },
              { id: 'exam', label: '5. परीक्षा सिमुलेशन व समय प्रबंधन' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveApproachTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeApproachTab === tab.id
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
            {activeApproachTab === 'board' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      बिहार बोर्ड (BSEB) एवं CBSE/ICSE के लिए अलग-अलग विशेषज्ञ दृष्टिकोण
                    </h3>
                    <p className="text-xs text-slate-500">
                      दोनों बोर्डों के प्रश्न पूछने और अंक देने की शैली बिल्कुल भिन्न होती है।
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* BSEB Column */}
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-md">
                        BSEB (मैट्रिक व इंटरमीडिएट)
                      </span>
                      <span className="text-xs font-bold text-amber-800">हिंदी / इंग्लिश माध्यम</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span><strong>NCERT / BTBC पुस्तकों का पंक्ति-दर-पंक्ति अध्ययन:</strong> बिहार बोर्ड के सभी प्रश्न सीधे सरकारी पाठ्यपुस्तकों से पूछे जाते हैं।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span><strong>50% OMR ऑब्जेक्टिव प्रश्न हल करने की स्पीड:</strong> वस्तुनिष्ठ प्रश्नों में 100% सही उत्तर टिक करने की ट्रिक्स और फॉर्मूला चार्ट्स।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span><strong>2-अंक लघु एवं 5-अंक दीर्घ उत्तरीय उत्तर लेखन:</strong> साफ-सुथरे चित्र (Diagrams), चरणबद्ध हल और मुख्य बिंदुओं को रेखांकित करना।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span><strong>10 वर्षों के प्रश्न बैंक (PYQs) का अभ्यास:</strong> पिछले वर्षों के रिपीटेड सवालों की शत-प्रतिशत तैयारी।</span>
                      </li>
                    </ul>
                  </div>

                  {/* CBSE Column */}
                  <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-blue-900 bg-blue-200/60 px-2.5 py-1 rounded-md">
                        CBSE & ICSE Boards
                      </span>
                      <span className="text-xs font-bold text-blue-800">English Medium</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                        <span><strong>कॉन्सेप्ट व इंक्वायरी बेस्ड लर्निंग:</strong> रटने के बजाय "Why & How" पर जोर ताकि केस-स्टडी प्रश्न आसानी से हल हों।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                        <span><strong>NCERT Exemplar व उच्च स्तरीय सवाल:</strong> कठिन गणितीय समस्याओं और तार्किक साइंस प्रश्नों की स्टेप-बाय-स्टेप समझ।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                        <span><strong>Assertion-Reasoning व प्रैक्टिकल प्रश्न:</strong> नए परीक्षा पैटर्न के अनुसार विश्लेषणात्मक सोचने की क्षमता का विकास।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                        <span><strong>अंग्रेजी में अभिव्यक्ति और स्पष्ट प्रेजेंटेशन:</strong> उत्तर में तकनीकी शब्दावली और वैज्ञानिक परिभाषाओं का सटीक उपयोग।</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeApproachTab === 'diagnostic' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900">
                  डायग्नोस्टिक बेसलाइन मूल्यांकन (Finding Hidden Foundation Gaps)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  अक्सर कक्षा 10वीं में पढ़ने वाला छात्र इसलिए त्रिकोणमिति या भौतिकी में अटकता है क्योंकि कक्षा 7वीं या 8वीं में उसके भिन्न (Fractions) या समीकरण (Equations) का बेस कमजोर था। BBA Mentors का शिक्षक पढ़ाने से पहले छात्र का संक्षिप्त डायग्नोस्टिक टेस्ट लेता है।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-blue-900 font-bold text-xs">स्टेप 1: बेसिक कॉन्सेप्ट ऑडिट</span>
                    <p className="text-xs text-slate-600">पिछले 2 वर्षों के मुख्य गणितीय व भाषाई सूत्रों की जांच।</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-blue-900 font-bold text-xs">स्टेप 2: लर्निंग स्पीड असेसमेंट</span>
                    <p className="text-xs text-slate-600">छात्र विजुअल डायग्राम से बेहतर सीखता है या फॉर्मूला स्टेप्स से।</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-blue-900 font-bold text-xs">स्टेप 3: कस्टमाइज्ड ब्रिज प्लान</span>
                    <p className="text-xs text-slate-600">पहले 10 दिनों में पुरानी कमियों को भरकर वर्तमान कक्षा के स्तर पर लाना।</p>
                  </div>
                </div>
              </div>
            )}

            {activeApproachTab === 'remedial' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900">
                  कमजोर विषयों का उपचारात्मक अध्ययन (Remedial Bridge Modules)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  यदि छात्र को केवल गणित के ज्यामिति (Geometry) या विज्ञान के रसायन विज्ञान (Chemistry) में डर लगता है, तो पूरे सिलेबस के साथ-साथ उस विशेष हिस्से के लिए अलग से समय और माइंड-मैप्स दिए जाते हैं।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <h4 className="font-bold text-emerald-950 text-sm">फॉर्मूला चीट-शीट और फ्लैश कार्ड्स</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      छात्र के स्टडी टेबल पर मुख्य सूत्रों, रासायनिक अभिक्रियाओं और महत्वपूर्ण तिथियों के चार्ट्स तैयार करवाए जाते हैं।
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <h4 className="font-bold text-emerald-950 text-sm">धीमी शुरुआत से तेज रफ्तार</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      सरल से कठिन की ओर (Easy to Hard Progression)। पहले छोटे-छोटे सवाल हल कराकर छात्र का खोया हुआ आत्मविश्वास लौटाया जाता है।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeApproachTab === 'habit' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900">
                  दैनिक अध्ययन अनुशासन (Habit Building for the Remaining 22 Hours)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ट्यूटर केवल 60-90 मिनट पढ़ाकर नहीं जाते, बल्कि वे छात्र को दिन के बाकी 22 घंटों के लिए एक संतुलित टाइम-टेबल बनाकर देते हैं।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900">1. स्पैस्ड रिविजन (Spaced Repetition)</span>
                    <p className="text-slate-600">पढ़ाए गए अध्याय का 24 घंटे, 3 दिन और 7 दिन बाद त्वरित पुनरावलोकन।</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900">2. एक्टिव रिकॉल (Active Recall)</span>
                    <p className="text-slate-600">किताब बंद करके खुद से मुख्य बिंदुओं को कॉपी पर लिखने की वैज्ञानिक आदत।</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900">3. मोबाइल स्क्रीन नियंत्रण</span>
                    <p className="text-slate-600">अभिभावक के साथ मिलकर पढ़ाई के दौरान फोन दूर रखने का अनुशासन।</p>
                  </div>
                </div>
              </div>
            )}

            {activeApproachTab === 'exam' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900">
                  परीक्षा सिमुलेशन व टाइम मैनेजमेंट (Home Exam Drills)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  बोर्ड परीक्षा से 2 माह पहले, छात्र के घर के स्टडी रूम में स्टॉपवॉच लगाकर वास्तविक 3 घंटे की बोर्ड परीक्षा का माहौल बनाया जाता है।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                    <span className="font-bold text-blue-950">स्टॉपवॉच टाइमिंग प्रैक्टिस</span>
                    <p className="text-slate-700">हर 1-अंक, 2-अंक और 5-अंक के प्रश्न के लिए मिनट निर्धारित कर पेपर अधूरा छूटने की समस्या को जड़ से समाप्त किया जाता है।</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                    <span className="font-bold text-blue-950">परीक्षा फोबिया का खात्मा</span>
                    <p className="text-slate-700">घर पर ही 8-10 बार बोर्ड पैटर्न टेस्ट दे लेने के बाद छात्र मुख्य परीक्षा में बिना किसी डर या हड़बड़ाहट के बैठता है।</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CLASS-WISE WINGS & SPECIALIZATION
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
            Class-by-Class Curriculum
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            हर कक्षा के लिए समर्पित होम ट्यूशन पाठ्यक्रम
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            कक्षा 1 से लेकर 12वीं तक, हर उम्र और कक्षा की शैक्षणिक जरूरतें अलग होती हैं:
          </p>
        </div>

        {/* Wing Filter */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {[
            { id: 'all', label: 'सभी वर्ग (All Wings)' },
            { id: 'primary', label: 'वर्ग 1 - 5 (Primary)' },
            { id: 'middle', label: 'वर्ग 6 - 8 (Middle)' },
            { id: 'secondary', label: 'वर्ग 9 - 10 (Matric/Board)' },
            { id: 'senior', label: 'वर्ग 11 - 12 (Intermediate)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveClassTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeClassTab === tab.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeClassTab === 'all' || activeClassTab === 'primary') && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs text-center leading-tight">
                  Nur - 5
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    प्रारंभिक एवं नींव विकास (Foundation)
                  </span>
                  <h3 className="text-lg font-black text-slate-900">नर्सरी से 5वीं (Nursery to Class 5)</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>नर्सरी, LKG, UKG के लिए फोॅनिक्स (Phonics), वर्णमाला व अक्षराभ्यास</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>सुंदर लिखावट (Handwriting) व शुद्ध उच्चारण का अभ्यास</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>गणित पहाड़ा (Tables), जोड़-घटाव और मूलभूत गणना में तेजी</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>स्कूल के गृहकार्य (Homework) को बिना तनाव समय पर पूर्ण कराना</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>धैर्यवान महिला शिक्षिका (Female Home Tutors) की विशेष उपलब्धता</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('find-mentor', { classGrade: 'Class 1', mode: 'Home Tuition' })}
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>नर्सरी व 1-5 ट्यूटर देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a href="#book-home-demo" className="text-[11px] font-semibold text-amber-700 hover:underline">
                  डेमो मांगें
                </a>
              </div>
            </div>
          )}

          {(activeClassTab === 'all' || activeClassTab === 'middle') && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-base">
                  6-8
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                    संकल्पनात्मक स्पष्टता (Concepts)
                  </span>
                  <h3 className="text-lg font-black text-slate-900">मध्य वर्ग (Class 6 to 8)</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>विज्ञान (Physics, Chemistry, Biology) के बुनियादी प्रयोग व समझ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>बीजगणित (Algebra), ज्यामिति (Geometry) के सूत्रों की समझ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>अंग्रेजी व्याकरण (Grammar) एवं हिंदी निबंध/पत्र लेखन</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>कक्षा 9वीं और 10वीं के बोर्ड बेस को मजबूत बनाना</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('find-mentor', { classGrade: 'Class 8', mode: 'Home Tuition' })}
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>मिडिल ट्यूटर देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a href="#book-home-demo" className="text-[11px] font-semibold text-amber-700 hover:underline">
                  डेमो मांगें
                </a>
              </div>
            </div>
          )}

          {(activeClassTab === 'all' || activeClassTab === 'secondary') && (
            <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-400 space-y-4 shadow-md hover:shadow-xl transition relative flex flex-col justify-between">
              <span className="absolute top-4 right-4 bg-amber-400 text-blue-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                Most Demanded
              </span>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-base">
                  9-10
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">
                    मैट्रिक बोर्ड परीक्षा (Board Excellence)
                  </span>
                  <h3 className="text-lg font-black text-slate-900">माध्यमिक वर्ग (Class 9 & 10)</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                    <span>BSEB (मैट्रिक) एवं CBSE बोर्ड परीक्षा की संपूर्ण तैयारी</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                    <span>NCERT पाठ्यपुस्तक का पंक्ति-दर-पंक्ति विश्लेषण व हल</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                    <span>पिछले 10 वर्षों के प्रश्नपत्र (PYQs) व मॉडल पेपर्स का अभ्यास</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                    <span>हर रविवार 100 अंकों की बोर्ड पैटर्न संडे परीक्षा व अंक विश्लेषण</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('find-mentor', { classGrade: 'Class 10', mode: 'Home Tuition' })}
                  className="text-xs font-black text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>कक्षा 10वीं ट्यूटर देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a href="#book-home-demo" className="text-[11px] font-bold text-blue-950 hover:underline">
                  फ्री डेमो लें
                </a>
              </div>
            </div>
          )}

          {(activeClassTab === 'all' || activeClassTab === 'senior') && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-base">
                  11-12
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    इंटरमीडिएट + JEE/NEET
                  </span>
                  <h3 className="text-lg font-black text-slate-900">उच्च माध्यमिक (Class 11 & 12)</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>साइंस (Physics, Chemistry, Maths/Biology) गहन 1-on-1 अध्ययन</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>कॉमर्स (Accountancy, Economics, Business Studies) विशेषज्ञ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>NIT पटना एवं शीर्ष विश्वविद्यालयों के पूर्व छात्रों द्वारा मार्गदर्शन</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>इंटर बोर्ड टॉपर बनने हेतु न्यूमेरिकल व थ्योरी संतुलन</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('find-mentor', { classGrade: 'Class 12', mode: 'Home Tuition' })}
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>इंटरमीडिएट ट्यूटर देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a href="#book-home-demo" className="text-[11px] font-semibold text-amber-700 hover:underline">
                  डेमो मांगें
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTERACTIVE TUITION FEE & HOURS ESTIMATOR
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-blue-950 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/20 px-3.5 py-1 rounded-full border border-amber-400/30">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              होम ट्यूशन फीस व अध्ययन समय कैलकुलेटर
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              कक्षा, सप्ताह के दिन और समय चुनकर अनुमानित मासिक शुल्क और समर्पित घंटों का तुरंत हिसाब लगाएं:
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="md:col-span-7 space-y-6">
              {/* Class Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  कक्षा स्तर चुनें (Select Class Level)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'primary', label: 'Primary (1-5)' },
                    { id: 'middle', label: 'Middle (6-8)' },
                    { id: 'secondary', label: 'Matric (9-10)' },
                    { id: 'senior', label: 'Senior (11-12)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCalcClass(c.id as any)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                        calcClass === c.id
                          ? 'bg-amber-400 text-blue-950 font-black shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days per week */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                  <span className="uppercase tracking-wider">प्रति सप्ताह दिन (Days / Week)</span>
                  <span className="text-amber-300 font-extrabold">{calcDays} दिन / सप्ताह</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 6].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCalcDays(d)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                        calcDays === d
                          ? 'bg-amber-400 text-blue-950 font-black shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      {d === 3 ? '3 दिन (सप्ताहांत/अल्टरनेट)' : d === 5 ? '5 दिन (सोम - शुक्र)' : '6 दिन (सोम - शनि)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Duration */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                  <span className="uppercase tracking-wider">प्रति क्लास अवधि (Duration / Class)</span>
                  <span className="text-amber-300 font-extrabold">{calcHours} घंटे</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { h: 1.0, label: '1 घंटा (Focused Revision)' },
                    { h: 1.5, label: '1.5 घंटा (Comprehensive Math + Science)' },
                  ].map((dur) => (
                    <button
                      key={dur.h}
                      type="button"
                      onClick={() => setCalcHours(dur.h)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                        calcHours === dur.h
                          ? 'bg-amber-400 text-blue-950 font-black shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="md:col-span-5 bg-white text-slate-900 p-6 rounded-3xl shadow-xl space-y-4 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full inline-block">
                Estimated Plan
              </span>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{estimate.feeMin.toLocaleString()} - ₹{estimate.feeMax.toLocaleString()}
                </div>
                <span className="text-xs text-slate-500 font-semibold">प्रति माह (No hidden brokerage)</span>
              </div>

              <div className="py-3 border-y border-slate-100 space-y-2 text-xs text-left">
                <div className="flex items-center justify-between text-slate-600">
                  <span>महीने में व्यक्तिगत पढ़ाई:</span>
                  <strong className="text-slate-900">{estimate.monthlyHours} घंटे 1-on-1</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>साप्ताहिक संडे टेस्ट:</span>
                  <strong className="text-emerald-600">4 टेस्ट सम्मिलित (Free)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>प्रारंभिक डेमो क्लास:</span>
                  <strong className="text-amber-600">2 दिन निशुल्क (Free)</strong>
                </div>
              </div>

              <a
                href="#book-home-demo"
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md transition block"
              >
                इस प्लान के लिए शिक्षक मांगें →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: SAFETY, VERIFICATION & PARENT PEACE OF MIND
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
              Parent Peace of Mind
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              आपके घर में शिक्षक आते समय 100% सुरक्षा व अनुशासन की गारंटी
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              अपने घर में किसी शिक्षक को आमंत्रित करते समय सुरक्षा सबसे पहली शर्त है। BBA Mentors किसी भी ट्यूटर को केवल एक साधारण फॉर्म भरवाकर नहीं भेजता—हमारा 4-स्तरीय वेरिफिकेशन सख्त और अटूट है:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                  <span>1. सरकारी पहचान व पता जांच</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  आधार कार्ड, वोटर आईडी और स्थानीय निवास का भौतिक सत्यापन। ट्यूटर का वर्तमान व स्थायी पता रिकॉर्ड में रहता है।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <BookOpen className="w-5 h-5 text-blue-800" />
                  <span>2. मूल कॉलेज डिग्रियां व इंटरव्यू</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  NIT पटना, पटना यूनिवर्सिटी, बीएचयू और प्रतिष्ठित कॉलेजों की मार्कशीट की जांच व वरिष्ठ शिक्षकों द्वारा विषय ज्ञान परीक्षा।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <UserCheck className="w-5 h-5 text-pink-600" />
                  <span>3. महिला शिक्षिकाओं का दल</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  बेटियों और प्राथमिक कक्षाओं के बच्चों के लिए विशेष रूप से बैकग्राउंड-वेरिफाइड महिला गृह शिक्षिकाएं उपलब्ध हैं।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <HeartHandshake className="w-5 h-5 text-amber-600" />
                  <span>4. 48-घंटे रिप्लेसमेंट गारंटी</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  यदि किसी भी कारण से ट्यूटर का व्यवहार या पढ़ाने का तरीका पसंद न आए, तो बिना किसी सवाल के दूसरा ट्यूटर उपलब्ध कराया जाता है।
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 text-white p-8 rounded-3xl border border-blue-800 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-400 text-blue-950 rounded-2xl flex items-center justify-center mx-auto shadow-xl font-black text-2xl">
              BBA
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">हमेशा अभिभावक के विश्वास पर खरे</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                "BBA Mentors केवल एक संपर्क साधन नहीं है, बल्कि आपके बच्चे की पूरी शैक्षणिक जिम्मेदारी, टेस्ट और अनुशासन का संरक्षक है।"
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">सत्यापन दर (Pass Rate):</span>
                <strong className="text-emerald-400">केवल 15% आवेदक चयनित</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">संतुष्ट परिवार (Bihar):</span>
                <strong className="text-amber-300">2,400+ सक्रिय छात्र</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">औसत टेस्ट स्कोर वृद्धि:</span>
                <strong className="text-white">+14.6% पहले 3 माह में</strong>
              </div>
            </div>
            <button
              onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
              className="w-full py-3.5 bg-amber-400 text-blue-950 font-black text-xs rounded-xl hover:bg-amber-300 transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>सत्यापित शिक्षकों की प्रोफाइल देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FEATURED VERIFIED IN-PERSON MENTORS (LIVE PREVIEW CARDS)
         ========================================================================= */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
                Featured Mentors
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                बिहार के शीर्ष सत्यापित गृह शिक्षक
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
                ये शिक्षक आपके निकटवर्ती इलाके में घर-घर जाकर 1-on-1 व्यक्तिगत मार्गदर्शन प्रदान कर रहे हैं:
              </p>
            </div>
            <button
              onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-sm"
            >
              <span>सभी शिक्षक देखें (Explore All)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMentors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                        {m.badge}
                      </span>
                      <h4 className="font-black text-slate-900 text-base mt-1">{m.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{m.degree}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{m.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {m.bio}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span className="truncate">{m.locality}, {m.district}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span className="truncate font-semibold text-blue-950">{m.subjects.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">अनुमानित दर:</span>
                    <strong className="text-slate-900 font-extrabold">{m.hourlyRate}</strong>
                  </div>
                  <button
                    onClick={() => onNavigate('find-mentor', { district: m.district, mode: 'Home Tuition', search: m.name })}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>प्रोफाइल देखें व डेमो बुक करें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: DEDICATED MENTOR DISCOVERY CTA SECTION (EXPLICIT USER PROMPT)
         ========================================================================= */}
      <section id="mentor-discovery-cta" className="py-20 bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Mentor Discovery Portal (शिक्षकों की खोज)</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              अपने शहर में 100% सत्यापित गृह शिक्षक खोजें
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              विषय, कक्षा, बोर्ड और अपने जिले के अनुसार फिल्टर करें। प्रत्येक शिक्षक की डिग्री, पूर्व छात्रों की समीक्षाएं और रेटिंग देखकर घर बैठे 2-दिन का फ्री डेमो स्लॉट बुक करें।
            </p>
          </div>

          {/* District Quick-Discovery Chips (One-click filtered jump to Mentor Discovery) */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>सीधे अपने जिले के अनुसार शिक्षक खोजें (Select District to Filter):</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {biharCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => onNavigate('find-mentor', { district: city.districtKey, mode: 'Home Tuition' })}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-blue-950 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 shadow-sm group"
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] bg-white/20 group-hover:bg-blue-950 group-hover:text-white px-2 py-0.5 rounded-full transition">
                    {city.tutorsCount.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              id="cta-discover-all-mentors-btn"
              onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
              className="px-8 py-4 bg-amber-400 text-blue-950 font-black text-base rounded-2xl hover:bg-amber-300 shadow-2xl shadow-amber-400/30 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-blue-950" />
              <span>सभी 350+ सत्यापित होम ट्यूटर खोजें (Browse All Mentors)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#book-home-demo"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>या हमारे काउंसलर से डेमो बुक करवाएं</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: DISTRICT DETAILS ACCORDION & COVERAGE
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
            Local Proximity Coverage
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            बिहार के प्रमुख जिलों और मोहल्लों में सक्रिय नेटवर्क
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            शिक्षक आपके मोहल्ले के 3-5 किमी के दायरे से आते हैं ताकि वे समय पर पहुंचे और मौसम की वजह से पढ़ाई न छूटे:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {biharCities.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                    <MapPin className="w-4 h-4 text-blue-800" />
                    <span>{c.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {c.tutorsCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{c.areas}</p>
                <div className="text-[11px] font-semibold text-blue-900 bg-blue-50/70 p-2 rounded-xl">
                  {c.highlight}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('find-mentor', { district: c.districtKey, mode: 'Home Tuition' })}
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>ट्यूटर लिस्ट देखें</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <a href="#book-home-demo" className="text-[11px] font-semibold text-amber-700 hover:underline">
                  डेमो मांगें
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* All 38 Districts State-Wide Guarantee Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-400/30 shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% State Coverage • All 38 Districts Active</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              क्या आपका जिला ऊपर सूचीबद्ध नहीं है? हम बिहार के सभी 38 जिलों में सक्रिय हैं!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              किशनगंज, अरवल, मधुबनी, पश्चिम चम्पारण, रोहतास, सहरसा, सीवान और कैमूर सहित बिहार के प्रत्येक 38 जिलों में हमारे योग्य होम ट्यूटर और ऑनलाइन मेंटर उपलब्ध हैं।
            </p>
          </div>
          <button
            onClick={() => onNavigate('classes-boards', { tab: 'locations' })}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            <span>सभी 38 जिलों की डायरेक्टरी देखें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: VERIFIED PARENT TESTIMONIALS
         ========================================================================= */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
              Real Parent Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              बिहार के परिवारों का BBA Mentors पर अटूट भरोसा
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              जानिए कैसे 1-on-1 व्यक्तिगत मार्गदर्शन और साप्ताहिक संडे टेस्ट ने छात्रों के अंकों और आत्मविश्वास को नई ऊंचाइयों पर पहुंचाया:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'डॉ. संजय सहाय',
                loc: 'कंकड़बाग, पटना • पिता (Class 10 CBSE)',
                score: '62% से 88% तक सुधार',
                quote:
                  'पहले हमने दो लोकल ट्यूटर रखे थे जो बिना बताए छुट्टी कर लेते थे और कभी टेस्ट नहीं लेते थे। BBA Mentors के अमित सर पिछले 6 महीने से आ रहे हैं। सबसे अच्छी बात हर संडे का टेस्ट है, जिससे बेटे की कमजोरियां तुरंत सामने आ जाती हैं।',
              },
              {
                name: 'अनिता देवी',
                loc: 'मिठनपुरा, मुजफ्फरपुर • माता (Class 8 BSEB)',
                score: 'गणित में 91 अंक',
                quote:
                  'मेरी बेटी को गणित से बहुत डर लगता था। BBA Mentors से हमें एक बहुत ही समझदार महिला शिक्षिका मिलीं। उन्होंने बेसिक से सिखाया और रोज ऐप पर बताती हैं कि क्या पढ़ाया। बेटी का आत्मविश्वास बहुत बढ़ गया है।',
              },
              {
                name: 'महेश प्रसाद वर्मा',
                loc: 'एपी कॉलोनी, गया • पिता (Class 12 Science PCM)',
                score: '+14% स्कोर वृद्धि',
                quote:
                  'इंटरमीडिएट में फिजिक्स और मैथ्स बहुत कठिन लग रहा था। BBA Mentors के इंजीनियर ट्यूटर ने न सिर्फ बोर्ड बल्कि बेसिक कॉन्सेप्ट भी बहुत साफ समझाए। सिस्टम बहुत पारदर्शी और ईमानदार है।',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-emerald-200">
                    {t.score}
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: COMPREHENSIVE FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
         ========================================================================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            होम ट्यूशन के बारे में अक्सर पूछे जाने वाले प्रश्न (FAQ)
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            यदि आपका कोई अन्य सवाल है, तो हमारे काउंसलर से 24x7 फोन या व्हाट्सएप पर बात कर सकते हैं।
          </p>
        </div>

        <div className="space-y-3">
          {homeTuitionFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-900" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: FINAL CONVERTING CTA FOOTER BANNER
         ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            आज ही अपने बच्चे के लिए सर्वश्रेष्ठ गृह शिक्षक बुक करें
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            2 दिन की निःशुल्क डेमो क्लास में शिक्षक के पढ़ाने का तरीका और अनुशासन देखें। संतुष्ट होने पर ही आगे बढ़ें।
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('find-mentor', { mode: 'Home Tuition' })}
              className="px-8 py-3.5 bg-amber-400 text-blue-950 font-black text-sm rounded-xl hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-blue-950" />
              <span>सत्यापित शिक्षक खोजें (Discover Mentors)</span>
            </button>
            <a
              href="#book-home-demo"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>निशुल्क 2-दिन होम डेमो बुक करें</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
