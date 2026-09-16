export type BubbleShape = 'circle' | 'square' | 'rounded';
export type QuestionLayout = 'auto' | '1' | '2' | '3' | '4';
export type PageSize = 'A4' | 'A5' | 'Letter';
export type PageOrientation = 'portrait' | 'landscape';
export type NumberingStyle = 'numbers' | 'leading-zeros' | 'q-prefix' | 'q-dot';
export type RollNumberStyle = 'bubbles' | 'boxes' | 'both';

export interface OMRSectionConfig {
  id: string;
  name: string; // e.g. "Physics", "Chemistry", "Section A"
  startQ: number;
  endQ: number;
  startQuestion?: number;
  endQuestion?: number;
}

export interface OMRCustomField {
  id: string;
  label: string;
  type: 'text' | 'boxes' | 'bubbles';
  digits?: number;
}

export interface OMRFieldConfig {
  id: string;
  name: string;
  enabled: boolean;
  type: 'text' | 'number' | 'signature' | 'date';
  width?: 'full' | 'half' | 'third';
  customLabel?: string;
}

export interface OMRHeaderConfig {
  schoolName: string;
  tagline: string;
  examName: string;
  subjectName: string;
  date: string;
  timeDuration: string;
  setSeries: string; // e.g. "A", "B", "C", "D"
  logoUrl?: string;
  logoPosition: 'left' | 'center' | 'right';
  textAlignment: 'left' | 'center' | 'right';
  showDivider: boolean;
  showBorder: boolean;
  contactInfo?: string;
  sessionYear?: string;
  headerFontSize?: 'small' | 'medium' | 'large';
}

export interface OMRBubbleConfig {
  shape: BubbleShape;
  size: 'small' | 'medium' | 'large'; // 14px, 18px, 22px
  spacing: 'compact' | 'normal' | 'spacious';
  borderThickness: 'thin' | 'normal' | 'thick';
  fillColor: string;
}

export interface OMRPageConfig {
  size: PageSize;
  orientation: PageOrientation;
  marginTop: number; // mm
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'small' | 'medium' | 'large';
}

export interface OMRConfig {
  id: string;
  title: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;

  // Question specifications
  questionsCount: number;
  startingQuestionNumber?: number; // default 1
  optionsCount: number; // 2, 3, 4, 5, 6
  optionLabels: string[]; // ['A', 'B', 'C', 'D']
  layoutColumns: QuestionLayout;
  numberingStyle: NumberingStyle;
  gridDensity?: 'standard' | 'compact' | 'spacious';

  // Sections (Optional section groupings like Physics, Chemistry, Biology)
  enableSections?: boolean;
  sections?: OMRSectionConfig[];

  // Grid & Bubbles
  bubble: OMRBubbleConfig;
  page: OMRPageConfig;

  // Header & Branding
  header: OMRHeaderConfig;

  // Student Fields
  enableRollNumber: boolean;
  rollNumberDigits: number; // 4 - 10
  rollNumberStyle: RollNumberStyle;
  enableRegistrationNumber?: boolean;
  registrationNumberDigits?: number;
  enableCenterCode?: boolean;
  centerCodeDigits?: number;
  enableCandidateName: boolean;
  enableFatherName: boolean;
  enableSubjectExam: boolean;
  enableSetSeries: boolean;
  enableDateField: boolean;
  enableClassBatch: boolean;

  // Custom User Fields
  customFields?: OMRCustomField[];

  // Instructions & Footer
  enableInstructions: boolean;
  instructions: string[];
  enableSignatureBox: boolean;
  enableInvigilatorSign: boolean;
  footerText: string;
  enableWatermark: boolean;
  enableQrCode: boolean;
  enableBarcode: boolean;
  enableCornerMarks?: boolean; // scanner registration marks
  printMode?: 'monochrome' | 'navy';

  // Design mode custom offsets (optional)
  customLayouts?: Record<string, { x: number; y: number }>;
}

export interface OMRTemplate {
  id: string;
  name: string;
  description: string;
  category: 'School' | 'Coaching' | 'Competitive' | 'Practice' | 'Blank';
  questions: number;
  options: number;
  columns: number;
  badge?: string;
  config: OMRConfig;
}

export interface TestResult {
  id: string;
  testName: string;
  date: string;
  totalQuestions?: number;
  score: number;
  totalMarks: number;
  percentage: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: string;
  accuracy: number;
  questions: {
    questionNo: number;
    studentAnswer?: string;
    correctAnswer: string;
    status: 'correct' | 'wrong' | 'skipped';
    subject?: string;
  }[];
  subjectWise: {
    subject: string;
    score: number;
    total: number;
    percentage: number;
  }[];
}

export interface PracticeTest {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number; // e.g. -1
  marksPerQuestion: number; // e.g. 4
  questionsData?: {
    qNo: number;
    text: string;
    options: string[];
    correctAnswer: string;
    subject: string;
  }[];
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
}
