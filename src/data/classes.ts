export const BIHAR_SCHOOL_CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
] as const;

export type SchoolClass = typeof BIHAR_SCHOOL_CLASSES[number];

export interface ClassWingGroup {
  id: string;
  name: string;
  hindiName: string;
  classesRange: string;
  description: string;
  subjects: string;
  badge: string;
}

export const CLASS_WINGS: ClassWingGroup[] = [
  {
    id: 'pre-primary',
    name: 'Pre-Primary Wing',
    hindiName: 'पूर्व-प्राथमिक वर्ग',
    classesRange: 'Nursery, LKG, UKG',
    description: 'खेल-खेल में शिक्षा, अक्षरों और अंकों की पहचान (Phonics & Numeracy), सुंदर लिखावट की नींव, कविताएं और मौखिक संवाद।',
    subjects: 'English Phonics, Hindi Akshar, Basic Math Counting, Rhymes, Drawing & Motor Skills',
    badge: 'Early Foundation',
  },
  {
    id: 'primary',
    name: 'Primary Wing',
    hindiName: 'प्राथमिक वर्ग',
    classesRange: 'Class 1 to 5',
    description: 'बुनियादी गणित पहाड़ा (Tables), जोड़-घटाव-गुणा-भाग, भाषा व व्याकरण, स्कूल होमवर्क में नियमित सहायता और अध्ययन अनुशासन।',
    subjects: 'Mathematics, English, Hindi, EVS (पर्यावरण अध्ययन), General Knowledge',
    badge: 'Foundation & Habits',
  },
  {
    id: 'middle',
    name: 'Middle School',
    hindiName: 'मध्य वर्ग',
    classesRange: 'Class 6 to 8',
    description: 'विज्ञान के प्रयोग, बीजगणित (Algebra), ज्यामिति और विश्लेषणात्मक सोच। कक्षा 9वीं और 10वीं बोर्ड का मजबूत आधार।',
    subjects: 'Maths, Science (Physics/Chemistry/Biology), Social Science, Hindi, English, Sanskrit',
    badge: 'Conceptual Mastery',
  },
  {
    id: 'secondary',
    name: 'Secondary / Board Exam',
    hindiName: 'माध्यमिक वर्ग (मैट्रिक बोर्ड)',
    classesRange: 'Class 9 & 10',
    description: 'BSEB (मैट्रिक) व CBSE बोर्ड परीक्षा की संपूर्ण तैयारी। NCERT पाठ्यपुस्तक, पिछले 10 वर्षों के प्रश्नपत्र (PYQ) और साप्ताहिक टेस्ट।',
    subjects: 'Advanced Mathematics, Science, Social Science, Hindi / Urdu, English, Sanskrit',
    badge: 'Matric / Board Excellence',
  },
];
