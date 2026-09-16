import { TestResult, PracticeTest } from '../types/omr';

export const MOCK_STUDENT_STATS = {
  testsTaken: 12,
  averageScore: 78,
  bestScore: 92,
  practiceTime: '6h 40m',
  trend: '+8.4% this month',
};

export const MOCK_RECENT_TESTS = [
  {
    id: 'test-1',
    testName: 'NEET Biology Mock',
    questions: 50,
    score: 82,
    total: 100,
    date: '12 Sep 2025',
    status: 'Evaluated',
    category: 'Medical',
  },
  {
    id: 'test-2',
    testName: 'Physics Chapter Test',
    questions: 30,
    score: 67,
    total: 100,
    date: '10 Sep 2025',
    status: 'Evaluated',
    category: 'Physics',
  },
  {
    id: 'test-3',
    testName: 'Full Syllabus Mock',
    questions: 100,
    score: 72,
    total: 100,
    date: '05 Sep 2025',
    status: 'Evaluated',
    category: 'All Subjects',
  },
  {
    id: 'test-4',
    testName: 'Chemistry Practice',
    questions: 50,
    score: 88,
    total: 100,
    date: '01 Sep 2025',
    status: 'Evaluated',
    category: 'Chemistry',
  },
];

export const MOCK_SAMPLE_RESULT: TestResult = {
  id: 'result-neet-bio-1',
  testName: 'NEET Biology Mock',
  date: '12 Sep 2025',
  score: 72,
  totalMarks: 100,
  percentage: 72,
  attempted: 92,
  correct: 72,
  wrong: 20,
  skipped: 8,
  timeTaken: '1h 42m',
  accuracy: 78,
  questions: Array.from({ length: 50 }, (_, i) => {
    const qNo = i + 1;
    // generate realistic distribution: mostly correct, some wrong, few skipped
    let status: 'correct' | 'wrong' | 'skipped' = 'correct';
    if ([7, 13, 19, 28, 34, 42].includes(qNo)) status = 'wrong';
    else if ([9, 21, 38].includes(qNo)) status = 'skipped';

    const opts = ['A', 'B', 'C', 'D'];
    const correct = opts[(qNo * 3) % 4];
    const student = status === 'skipped' ? undefined : (status === 'correct' ? correct : opts[(qNo + 1) % 4]);

    let subject = 'Botany';
    if (qNo > 15 && qNo <= 30) subject = 'Zoology';
    else if (qNo > 30 && qNo <= 40) subject = 'Ecology';
    else if (qNo > 40) subject = 'Plant Physiology';

    return {
      questionNo: qNo,
      studentAnswer: student,
      correctAnswer: correct,
      status,
      subject,
    };
  }),
  subjectWise: [
    { subject: 'Botany', score: 28, total: 36, percentage: 78 },
    { subject: 'Zoology', score: 26, total: 40, percentage: 65 },
    { subject: 'Ecology', score: 33, total: 40, percentage: 82 },
    { subject: 'Plant Physiology', score: 28, total: 40, percentage: 71 },
  ],
};

export const MOCK_PRACTICE_TESTS: PracticeTest[] = [
  {
    id: 'pt-1',
    title: 'NEET Speed Booster - General Biology',
    subject: 'Biology',
    questionsCount: 25,
    durationMinutes: 30,
    totalMarks: 100,
    negativeMarking: 1,
    marksPerQuestion: 4,
    questionsData: [
      {
        qNo: 1,
        text: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
        correctAnswer: 'B',
        subject: 'Cell Biology',
      },
      {
        qNo: 2,
        text: 'The process of photosynthesis takes place mainly in which cellular structure?',
        options: ['Chloroplast', 'Vacuole', 'Centrosome', 'Endoplasmic reticulum'],
        correctAnswer: 'A',
        subject: 'Plant Physiology',
      },
      {
        qNo: 3,
        text: 'What is the standard genetic material in retroviruses like HIV?',
        options: ['Double-stranded DNA', 'Single-stranded RNA', 'Plasmid', 'Prion protein'],
        correctAnswer: 'B',
        subject: 'Microbiology',
      },
      {
        qNo: 4,
        text: 'Human heart has how many distinct chambers?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctAnswer: 'C',
        subject: 'Human Physiology',
      },
      {
        qNo: 5,
        text: 'Which vitamin is synthesized in the human skin on exposure to sunlight?',
        options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
        correctAnswer: 'D',
        subject: 'Biochemistry',
      },
    ],
  },
  {
    id: 'pt-2',
    title: 'Physics Mechanics Speed Drill',
    subject: 'Physics',
    questionsCount: 20,
    durationMinutes: 25,
    totalMarks: 80,
    negativeMarking: 1,
    marksPerQuestion: 4,
  },
  {
    id: 'pt-3',
    title: 'Inorganic Chemistry Quick Quiz',
    subject: 'Chemistry',
    questionsCount: 25,
    durationMinutes: 30,
    totalMarks: 100,
    negativeMarking: 1,
    marksPerQuestion: 4,
  },
];

export const MOCK_SAVED_SHEETS = [
  {
    id: 'saved-1',
    title: 'Mid-Term Science Exam (50 Qs)',
    institute: 'Delhi Public School',
    questions: 50,
    columns: 2,
    createdAt: '12 Sep 2025',
    lastPrinted: '14 Sep 2025',
  },
  {
    id: 'saved-2',
    title: 'Weekly Ranker Series 100 Qs',
    institute: 'Apex IIT-JEE Academy',
    questions: 100,
    columns: 3,
    createdAt: '08 Sep 2025',
    lastPrinted: '11 Sep 2025',
  },
  {
    id: 'saved-3',
    title: 'All India NEET Mock Test Sheet',
    institute: 'NTA Test Prep Center',
    questions: 180,
    columns: 4,
    createdAt: '02 Sep 2025',
    lastPrinted: '05 Sep 2025',
  },
  {
    id: 'saved-4',
    title: 'Daily Practice Sheet (25 Qs)',
    institute: 'Self Study Practice',
    questions: 25,
    columns: 1,
    createdAt: '28 Aug 2025',
    lastPrinted: '29 Aug 2025',
  },
];

export const MOCK_BLOG_ARTICLES = [
  {
    id: 'art-1',
    title: 'How to Fill OMR Sheet Correctly Without Errors',
    excerpt: 'Avoid the common pitfalls: double bubbling, partial darkening, and wrong roll number marking that cost thousands of marks.',
    category: 'Exam Tips',
    date: '10 Sep 2025',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-2',
    title: 'OMR vs Online Tests: Which is Better for Competitive Practice?',
    excerpt: 'Why physical bubbling speed and motor memory still determine final exam scores in NEET, UPSC, and State PSCs.',
    category: 'Analysis',
    date: '05 Sep 2025',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-3',
    title: 'NEET 2026 OMR Format & Bubble Pattern Explained',
    excerpt: 'Detailed breakdown of Section A and Section B optional questions, timer strategies, and page layout guidelines.',
    category: 'NEET Guide',
    date: '28 Aug 2025',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-4',
    title: '5 Golden Printing Rules for High-Accuracy OMR Sheets',
    excerpt: 'Paper GSM, print contrast, margins, and scanner alignment tips for coaching directors and teachers.',
    category: 'Printing Guide',
    date: '20 Aug 2025',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
  },
];

export const MOCK_FAQS = [
  {
    category: 'General',
    items: [
      {
        q: 'What is OMRWallah?',
        a: 'OMRWallah is India’s dedicated complete OMR platform. It allows students, teachers, schools, and coaching institutes to design custom A4 OMR answer sheets, export high-resolution print-ready PDFs, practice bubbling in real-time, scan completed sheets via phone camera or scanner, and evaluate answers with instant analytics.',
      },
      {
        q: 'Is OMRWallah free to use?',
        a: 'Yes! You can create unlimited custom OMR sheets, preview them, and download print-ready PDFs completely free. Pro and Institute plans offer advanced features like bulk evaluations, mobile scanner AI, and student performance tracking.',
      },
      {
        q: 'Can I use OMRWallah without logging in?',
        a: 'Absolutely. Guest mode allows anyone to design, customize, and print OMR sheets right away without creating an account.',
      },
    ],
  },
  {
    category: 'OMR Creator',
    items: [
      {
        q: 'How many questions can I put on one sheet?',
        a: 'You can choose preset question counts (10, 20, 25, 50, 80, 100, 150, 180) or enter any custom count up to 200 questions. The smart layout engine automatically balances the columns for clean A4 printing.',
      },
      {
        q: 'Can I add my school or coaching institute logo?',
        a: 'Yes! In the Header tab, you can enter your institute name, tagline, exam title, and upload your custom institute logo.',
      },
      {
        q: 'Can I change option labels (e.g. 1 2 3 4 instead of A B C D)?',
        a: 'Yes! OMRWallah supports A B C D, A B C D E, 1 2 3 4, or custom alphanumeric labels for up to 6 choices per question.',
      },
      {
        q: 'Can I add a roll number grid?',
        a: 'Yes! You can toggle a customizable roll number grid from 4 to 10 digits with options for bubble grids, box grids, or dual formats.',
      },
    ],
  },
  {
    category: 'Printing & PDF',
    items: [
      {
        q: 'Are the downloaded PDFs print-ready for standard printers?',
        a: 'Yes. Every sheet is rendered to strict A4 dimensions (210mm × 297mm) with safe printable margins so nothing gets cut off on laser or inkjet printers.',
      },
      {
        q: 'What paper GSM is recommended for OMR printing?',
        a: 'For practice tests, standard 70–75 GSM copier paper is completely fine. For high-stakes institutional exams, 80–100 GSM paper ensures bubbles do not show through on the reverse side.',
      },
    ],
  },
  {
    category: 'Scanning & Results',
    items: [
      {
        q: 'How does the OMR phone scanner work?',
        a: 'The scanner uses corner reticle alignment to detect the four corners of the sheet, correct perspective distortion, and scan dark bubble values against an uploaded answer key in seconds.',
      },
      {
        q: 'What if a student makes a faint mark or double bubbles?',
        a: 'The evaluation engine detects ambiguous or multiple marks and flags them with an alert so teachers or students can review and verify manually.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    items: [
      {
        q: 'What is included in the Pro plan?',
        a: 'Pro unlocks advanced OMR customization, unlimited saved sheets, phone camera scanner access, comprehensive mistake analysis, and priority support.',
      },
      {
        q: 'Can coaching institutes manage multiple student batches?',
        a: 'Yes, the Institute plan includes a multi-student dashboard, batch test scheduling, CSV answer key upload, and automated rank generation.',
      },
    ],
  },
];
