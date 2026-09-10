export const ALL_ACADEMIC_CLASSES: string[] = [
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
  'Class 11',
  'Class 12',
];

export interface AcademicLevel {
  level: string;
  classes: string;
  focus: string;
  subjects: string;
}

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  {
    level: 'Early Childhood & Pre-Primary',
    classes: 'Nursery, LKG, UKG',
    focus: 'Early foundational literacy, phonics, numbers, shapes, rhymes, motor skills, neat coloring, and playful learning habits at home.',
    subjects: 'English Phonics, Hindi Varnamala, Basic Counting & Math, Rhymes, Drawing, General Curiosity',
  },
  {
    level: 'Primary Wing',
    classes: 'Class 1 to 5',
    focus: 'Foundational reading fluency, basic arithmetic (addition, subtraction, tables, fractions), cursive handwriting, and disciplined self-study habits.',
    subjects: 'Mathematics, English, Hindi, EVS (Environmental Studies), General Knowledge & Computer Basics',
  },
  {
    level: 'Middle School',
    classes: 'Class 6 to 8',
    focus: 'Transition to analytical thinking, algebra, geometry theorems, conceptual science (Physics, Chemistry, Biology), and grammar mastery.',
    subjects: 'Mathematics, Science (Phy/Chem/Bio), Social Science (History/Civics/Geo), English, Hindi, Sanskrit',
  },
  {
    level: 'Secondary / Board Exam',
    classes: 'Class 9 & 10',
    focus: 'Matric & Secondary Board excellence (BSEB, CBSE, ICSE). NCERT and textbook concept drills, formula revisions, and past 10 years board paper solving.',
    subjects: 'Standard/Basic Mathematics, Science (Physics/Chemistry/Biology), Social Science, English, Hindi/Urdu, Sanskrit',
  },
  {
    level: 'Senior Secondary',
    classes: 'Class 11 & 12',
    focus: 'Rigorous preparation for intermediate board exams (BSEB / CBSE) along with competitive entrance foundations (JEE Main, NEET, CUET, CA Foundation).',
    subjects: 'PCM (Physics, Chemistry, Math), PCB (Biology), Commerce (Accountancy, BST, Economics), Arts / Humanities',
  },
];
