import { SEOProps } from './seo';

export const SEO_CONFIG: Record<string, SEOProps> = {
  home: {
    title: 'OMR Sheet Generator Online | Create, Print & Practice OMR Sheets - OMRWallah',
    description:
      "India's intuitive online OMR sheet generator and maker. Design custom answer sheets, download print-ready A4 PDFs, and practice OMR bubbling for schools, coaching institutes, and competitive exams.",
    canonicalPath: '/',
    type: 'website',
    breadcrumbs: [{ name: 'Home', path: '/' }],
  },

  creator: {
    title: 'Custom OMR Sheet Designer | Interactive Visual Builder - OMRWallah',
    description:
      'Design customized A4 OMR answer sheets with real-time vector preview. Customize question count, option labels, roll number grids, and institute branding for free.',
    canonicalPath: '/creator',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR Designer', path: '/creator' },
    ],
  },

  templates: {
    title: 'Free OMR Sheet Templates PDF | 20, 50, 100, 180, 200 Questions - OMRWallah',
    description:
      'Download free print-ready A4 OMR sheet templates for NEET, JEE, SSC, UPSC, and classroom unit tests. Standard formats calibrated for laser and inkjet printing.',
    canonicalPath: '/templates',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Template Gallery', path: '/templates' },
    ],
  },

  practice: {
    title: 'Online OMR Sheet Practice Simulator | Timed Mock Bubbling - OMRWallah',
    description:
      'Practice bubbling OMR sheets online with active timer countdowns, negative marking calculation, and instant score analysis. Build exam speed and accuracy.',
    canonicalPath: '/practice',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Practice Online', path: '/practice' },
    ],
  },

  pricing: {
    title: 'OMRWallah Pricing Plans | Free for Students, Pro for Institutes',
    description:
      'Explore simple, transparent pricing for OMRWallah. Free unlimited OMR sheet creation and PDF downloads, with Pro and Coaching plans for bulk camera scanning.',
    canonicalPath: '/pricing',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Pricing Plans', path: '/pricing' },
    ],
  },

  blog: {
    title: 'OMR Knowledge Hub & Guides | Tips, Tutorials & Exam Strategies - OMRWallah',
    description:
      'Expert guides on OMR sheet generation, printing best practices, pen selection, scanning troubleshooting, and time-management strategies for competitive exams.',
    canonicalPath: '/blog',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Knowledge Hub', path: '/blog' },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions | OMR Creation, Printing & Scanning - OMRWallah',
    description:
      'Find clear answers to common questions about generating OMR sheets, recommended paper GSM, printer settings, bubble recognition, and coaching plans.',
    canonicalPath: '/faq',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'FAQs', path: '/faq' },
    ],
    faqs: [
      {
        question: 'What is OMRWallah?',
        answer:
          'OMRWallah is India’s dedicated complete OMR platform. It allows students, teachers, schools, and coaching institutes to design custom A4 OMR answer sheets, export high-resolution print-ready PDFs, practice bubbling in real-time, scan completed sheets via phone camera or scanner, and evaluate answers with instant analytics.',
      },
      {
        question: 'Is OMRWallah free to use?',
        answer:
          'Yes! You can create unlimited custom OMR sheets, preview them, and download print-ready PDFs completely free. Pro and Institute plans offer advanced features like bulk evaluations, mobile scanner AI, and student performance tracking.',
      },
      {
        question: 'Can I use OMRWallah without logging in?',
        answer:
          'Absolutely. Guest mode allows anyone to design, customize, and print OMR sheets right away without creating an account.',
      },
      {
        question: 'How many questions can I put on one sheet?',
        answer:
          'You can choose preset question counts (10, 20, 25, 50, 80, 100, 150, 180) or enter any custom count up to 200 questions. The smart layout engine automatically balances the columns for clean A4 printing.',
      },
      {
        question: 'Are the downloaded PDFs print-ready for standard printers?',
        answer:
          'Yes. Every sheet is rendered to strict A4 dimensions (210mm × 297mm) with safe printable margins so nothing gets cut off on laser or inkjet printers.',
      },
      {
        question: 'What paper GSM is recommended for OMR printing?',
        answer:
          'For practice tests, standard 70–75 GSM copier paper is completely fine. For high-stakes institutional exams, 80–100 GSM paper ensures bubbles do not show through on the reverse side.',
      },
    ],
  },

  // ================= High-Intent SEO Landing Pages =================
  'omr-sheet-generator': {
    title: 'OMR Sheet Generator Online | Create, Print & Practice OMR Sheets - OMRWallah',
    description:
      'Create custom OMR sheets online with OMRWallah. Design, print, download PDF and practice OMR answer sheets for exams, schools and coaching institutes.',
    canonicalPath: '/omr-sheet-generator',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR Sheet Generator', path: '/omr-sheet-generator' },
    ],
    faqs: [
      {
        question: 'How does the online OMR sheet generator work?',
        answer:
          'The OMR sheet generator allows you to configure question counts (from 10 to 300), select bubble options (A-D, A-E), add custom institute branding, set roll number formats, and generate a print-ready vector PDF in seconds.',
      },
      {
        question: 'Can I download the generated OMR sheet in A4 PDF format?',
        answer:
          'Yes, every generated sheet is mathematically calibrated to standard A4 dimensions (210mm x 297mm) with corner registration marks and optical timing tracks for laser and inkjet printers.',
      },
      {
        question: 'Is there a cost to generate OMR sheets online?',
        answer:
          'Basic OMR sheet generation, layout customization, and standard PDF downloads are 100% free with no watermark.',
      },
      {
        question: 'Can I customize subject headers like Physics, Chemistry, and Biology?',
        answer:
          'Yes, our generator allows you to enable multi-subject sections with specific question ranges, negative marking indicators, and instructions.',
      },
    ],
  },

  'omr-sheet-maker': {
    title: 'OMR Sheet Maker Online | Custom Bubble Grid & Roll Matrix Designer - OMRWallah',
    description:
      'Make custom OMR answer sheets with precise bubble sizing, multi-digit roll matrices, custom section titles, and 2-up per A4 page paper-saving options.',
    canonicalPath: '/omr-sheet-maker',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR Sheet Maker', path: '/omr-sheet-maker' },
    ],
    faqs: [
      {
        question: 'What is the difference between an OMR maker and a generic template?',
        answer:
          'A generic template is fixed and unchangeable, whereas our OMR Sheet Maker lets you customize every design parameter: circle bubble sizes, spacing, roll number columns, section headings, school logos, and exam series sets.',
      },
      {
        question: 'Can I set roll number bubbles for my institute exams?',
        answer:
          'Yes! You can configure roll number matrices from 4 to 12 digits, as well as boxes, bubbles, or combined formats.',
      },
      {
        question: 'Can I design 2 sheets on a single A4 page to save printing paper?',
        answer:
          'Yes, our maker supports 1 or 2 sheets per A4 page, which is ideal for 20-30 question daily classroom quizzes.',
      },
      {
        question: 'Do I need graphic design software to make OMR sheets?',
        answer:
          'No. The entire maker runs in your web browser with a real-time live preview, producing publication-grade vector documents without Photoshop or CorelDraw.',
      },
    ],
  },

  'omr-sheet-pdf': {
    title: 'OMR Sheet PDF Download | Free Printable A4 Blank Answer Sheets - OMRWallah',
    description:
      'Download free high-resolution printable OMR sheet PDFs in 25, 50, 100, 180, and 200 question formats. Vector calibrated for standard A4 desktop printers.',
    canonicalPath: '/omr-sheet-pdf',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR Sheet PDF', path: '/omr-sheet-pdf' },
    ],
    faqs: [
      {
        question: 'Are the downloaded OMR sheet PDFs high resolution?',
        answer:
          'Yes, our PDFs are generated using vector rendering with 300+ DPI equivalent sharpness, ensuring optical scanner markers and bubble perimeters print crisply without pixelation.',
      },
      {
        question: 'What paper size should I use to print the OMR PDF?',
        answer:
          'Standard A4 paper (210mm x 297mm) is the standard size. We recommend 70 GSM to 80 GSM white paper to prevent ink bleed-through when students darken bubbles with ballpoint pens.',
      },
      {
        question: 'Do I need to select "Fit to Page" when printing?',
        answer:
          'No, always select "Actual Size" (100% scale) in your printer settings to prevent distortion of registration timing marks.',
      },
      {
        question: 'Are there watermarks on the downloaded PDF?',
        answer:
          'No, all downloaded PDFs are 100% clean and free of watermarks.',
      },
    ],
  },

  'online-omr-sheet': {
    title: 'Online OMR Sheet Simulator | Interactive Digital Test Platform - OMRWallah',
    description:
      'Practice on an interactive digital OMR sheet on your phone or laptop. Features live countdown timer, realistic bubble darkening, and instant automated grading.',
    canonicalPath: '/online-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Online OMR Sheet', path: '/online-omr-sheet' },
    ],
    faqs: [
      {
        question: 'Can I practice filling an OMR sheet directly on my mobile or laptop?',
        answer:
          'Yes, our interactive Online OMR Sheet allows you to tap or click bubbles with realistic darkening animations, a countdown timer, and negative marking tracking.',
      },
      {
        question: 'Does the online sheet calculate negative marking automatically?',
        answer:
          'Yes, it provides instant automated evaluation with +4 for correct and -1 for wrong answers (or custom marking schemes), along with accuracy percentages and subject breakdowns.',
      },
      {
        question: 'Can I upload a custom answer key to evaluate my test?',
        answer:
          'Yes! You can paste or input your official answer key, and the system compares your marked bubbles instantly upon completion.',
      },
      {
        question: 'Is my test progress saved if I accidentally close the tab?',
        answer:
          'Yes, ongoing practice responses are preserved in local state so you never lose your answers during an active session.',
      },
    ],
  },

  'omr-sheet-for-coaching': {
    title: 'OMR Sheets for Coaching Institutes | Branded Test Series Templates - OMRWallah',
    description:
      'Professional OMR answer sheet generation for coaching institutes and academies. Add institute logos, roll number matrices, Section A/B optional patterns, and bulk PDF export.',
    canonicalPath: '/omr-sheet-for-coaching',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR for Coaching', path: '/omr-sheet-for-coaching' },
    ],
    faqs: [
      {
        question: 'Can coaching institutes add their custom institute logo to the OMR sheet?',
        answer:
          'Yes, OMRWallah allows coaching centers to add institute names, branch details, test series codes, and custom header notes to give mock tests a branded, professional look.',
      },
      {
        question: 'Does it support Section A and Section B optional question patterns for NEET/JEE?',
        answer:
          'Yes, our generator supports multi-section structures with custom question numbering, starting offsets, and section labels.',
      },
      {
        question: 'Can we print these OMR sheets on regular Xerox or laser printers?',
        answer:
          'Yes! Our sheets are mathematically formatted for standard A4 paper, allowing coaching centers to print test batches using standard office printers without expensive specialized OMR paper.',
      },
      {
        question: 'How does OMRWallah help coaching centers evaluate bulk mock tests?',
        answer:
          'Our platform pairs printable test sheets with an integrated mobile camera scanner and digital evaluation pipeline, allowing faculty to scan and evaluate batches quickly.',
      },
    ],
  },

  'omr-sheet-for-schools': {
    title: 'OMR Sheets for Schools & Teachers | Classroom Unit Test Templates - OMRWallah',
    description:
      'Fast and easy OMR answer sheet generator for school educators. Create 20 to 50 question unit tests, print 2 sheets per A4 page, and grade with phone camera scanning.',
    canonicalPath: '/omr-sheet-for-schools',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR for Schools', path: '/omr-sheet-for-schools' },
    ],
    faqs: [
      {
        question: 'How can school teachers use OMRWallah for classroom tests?',
        answer:
          'Teachers can generate 20 to 50 question unit test sheets with the school name, class/section fields, student admission numbers, and exam date, and print them on standard office printers in minutes.',
      },
      {
        question: 'Can teachers print 2 mini OMR sheets on one A4 paper?',
        answer:
          'Yes, our 2-sheets-per-page option is popular among schools for daily quizzes and chapter reviews because it cuts printing and paper costs in half.',
      },
      {
        question: 'Is OMRWallah suitable for CBSE and State Board mock exams?',
        answer:
          'Yes, you can format multiple-choice question sheets matching CBSE Class 10 and 12 term assessment structures as well as Olympiad formats.',
      },
      {
        question: 'Do teachers need special scanning machines to check these sheets?',
        answer:
          'No. Teachers can check sheets visually with an answer overlay or use our built-in camera scanner on a smartphone or tablet.',
      },
    ],
  },

  'omr-practice': {
    title: 'Online OMR Practice & Speed Training | Timed Exam Bubbling Drills - OMRWallah',
    description:
      'Boost exam bubbling speed and eliminate misaligned bubble marks. Practice timed OMR answer filling with realistic countdowns and negative marking calculation.',
    canonicalPath: '/omr-practice',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'OMR Practice Drills', path: '/omr-practice' },
    ],
    faqs: [
      {
        question: 'Why should I practice bubbling on an OMR sheet before the actual exam?',
        answer:
          'In exams like NEET, UPSC, and State PSCs, bubbling takes 25 to 35 minutes of your total exam time. Incomplete darkening, row misalignment errors, or slow motor speed often cost candidates 10 to 30 marks. Regular timed practice builds physical muscle memory.',
      },
      {
        question: 'Can I practice online or should I practice on physical paper?',
        answer:
          'Both! OMRWallah allows you to download printable A4 PDFs to practice with an actual ballpoint pen, or use our digital practice mode with countdown timers and automated negative marking calculations on your phone or laptop.',
      },
      {
        question: 'What is the "Solve 20, Bubble 20" batching strategy?',
        answer:
          'Instead of bubbling after every single question (which breaks solving flow) or saving all bubbling for the last 10 minutes (which causes panic and catastrophic row misalignment), top scorers solve a batch of 15-20 questions in their booklet and then bubble that entire batch methodically.',
      },
      {
        question: 'How does OMRWallah calculate negative marking during practice?',
        answer:
          'Our practice engine allows you to configure marking schemes (e.g. +4 for correct, -1 for incorrect, 0 for unattempted) and provides an itemized score breakdown instantly.',
      },
    ],
  },

  // ================= Competitive Exam Guides =================
  'omr-exams': {
    title: 'Competitive Exam OMR Practice Sheets Hub | NEET, JEE, SSC, CUET - OMRWallah',
    description:
      'Download free mock practice OMR sheets and exam pattern guides for major competitive exams in India including NEET UG, JEE Main, SSC CGL, CUET, and CTET.',
    canonicalPath: '/omr-exams',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
    ],
  },

  'neet-omr-sheet': {
    title: 'NEET OMR Sheet 200 Questions PDF & Mock Practice Guide - OMRWallah',
    description:
      'Download 200-question NEET mock practice OMR sheets with Section A & Section B layouts for Physics, Chemistry, and Biology. Master bubble timing and negative marking.',
    canonicalPath: '/neet-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
      { name: 'NEET OMR Guide', path: '/neet-omr-sheet' },
    ],
    faqs: [
      {
        question: 'What is the structure of the NEET practice OMR sheet?',
        answer:
          'The NEET mock practice format consists of 200 questions divided into Physics, Chemistry, Botany, and Zoology. Each subject features Section A (35 mandatory questions) and Section B (15 questions where candidates choose 10 to attempt).',
      },
      {
        question: 'Which pen should be used for NEET OMR bubbling?',
        answer:
          'A ballpoint pen (blue or black) with a medium tip is standard. Gel pens and fountain pens should never be used as ink bleeds through the paper.',
      },
      {
        question: 'How much time should I reserve for bubbling in NEET?',
        answer:
          'Experienced educators recommend allocating 25 to 30 minutes for bubbling, using a batch strategy (e.g. solving and bubbling 20-30 questions per subject block) rather than leaving all 180 questions for the last 15 minutes.',
      },
      {
        question: 'Is this an official NTA NEET OMR sheet?',
        answer:
          'No. This is an independent educational practice sheet created by OMRWallah for student mock preparation and self-assessment. We have no affiliation with the National Testing Agency (NTA).',
      },
    ],
  },

  'jee-omr-sheet': {
    title: 'JEE Main OMR Practice Sheet PDF & Offline Mock Guide - OMRWallah',
    description:
      'Download JEE Main offline mock OMR answer sheets with Physics, Chemistry, and Math sections. Build test endurance and accurate bubbling habits.',
    canonicalPath: '/jee-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
      { name: 'JEE OMR Guide', path: '/jee-omr-sheet' },
    ],
    faqs: [
      {
        question: 'Is JEE Main conducted on paper OMR or online CBT?',
        answer:
          'JEE Main is officially conducted in Computer Based Test (CBT) mode. However, most leading coaching institutes (such as in Kota, Hyderabad, and Delhi) administer regular offline paper-based mock tests with OMR answer sheets to build problem-solving stamina and evaluate students in physical exam environments.',
      },
      {
        question: 'What is the question format for JEE mock practice sheets?',
        answer:
          'A typical JEE practice sheet covers Physics, Chemistry, and Mathematics with multiple-choice questions (MCQs) and numerical value sections, totaling 75 to 90 questions.',
      },
      {
        question: 'How does OMRWallah help JEE aspirants?',
        answer:
          'OMRWallah enables students and coaching centers to download customized 75-90 question practice sheets formatted for Physics, Chemistry, and Math with +4 / -1 negative marking indicators.',
      },
    ],
  },

  'ssc-omr-sheet': {
    title: 'SSC 100-Question OMR Practice Sheet PDF Download - OMRWallah',
    description:
      'Download 100-question OMR answer sheets for SSC CGL, CHSL, MTS, and State PSC tier exams. 4-column balanced A4 printable layout.',
    canonicalPath: '/ssc-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
      { name: 'SSC 100Q OMR Guide', path: '/ssc-omr-sheet' },
    ],
    faqs: [
      {
        question: 'What is the standard 100-question format used for SSC and State PSC practice?',
        answer:
          'A 100-question layout is typically arranged in 4 clean columns of 25 questions each, covering Quantitative Aptitude, Reasoning, General Awareness, and English.',
      },
      {
        question: 'Can I download the 100-question practice sheet in A4 PDF?',
        answer:
          'Yes, OMRWallah provides a free, instant 100-question A4 vector PDF format ready to print on any home or office printer.',
      },
      {
        question: 'Is OMRWallah associated with the Staff Selection Commission (SSC)?',
        answer:
          'No. OMRWallah is an independent educational tool for student preparation and has no affiliation with SSC or government recruitment boards.',
      },
    ],
  },

  'cuet-omr-sheet': {
    title: 'CUET 50-Question OMR Practice Sheet PDF & Mock Guide - OMRWallah',
    description:
      'Download 50-question mock OMR answer sheets for CUET UG domain subjects and general test practice. Two-column print-ready A4 PDF format.',
    canonicalPath: '/cuet-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
      { name: 'CUET 50Q Guide', path: '/cuet-omr-sheet' },
    ],
    faqs: [
      {
        question: 'How many questions are typically in a CUET domain subject mock test?',
        answer:
          'A standard CUET domain subject test comprises 50 questions, where students are generally expected to attempt 40 questions within the stipulated time limit.',
      },
      {
        question: 'Can I generate a 50-question OMR sheet for CUET practice?',
        answer:
          'Yes, OMRWallah has a dedicated 50-question template with double-column layout, perfect for CUET domain mock evaluations.',
      },
      {
        question: 'Is OMRWallah officially affiliated with CUET or NTA?',
        answer:
          'No, OMRWallah is an independent educational tool designed solely for candidate practice and self-study.',
      },
    ],
  },

  'ctet-omr-sheet': {
    title: 'CTET 150-Question OMR Practice Sheet PDF & Mock Guide - OMRWallah',
    description:
      'Download 150-question A4 OMR practice answer sheets for CTET Paper 1 and Paper 2 and State TET teacher eligibility tests.',
    canonicalPath: '/ctet-omr-sheet',
    type: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Competitive Exam Guides', path: '/omr-exams' },
      { name: 'CTET 150Q Guide', path: '/ctet-omr-sheet' },
    ],
    faqs: [
      {
        question: 'How many questions are on the CTET examination sheet?',
        answer:
          'CTET Paper 1 and Paper 2 both comprise 150 multiple choice questions with no negative marking under standard CBSE guidelines.',
      },
      {
        question: 'Can I generate a 150-question OMR sheet for CTET practice?',
        answer:
          'Yes, OMRWallah allows you to create or download 150-question layouts with Child Development & Pedagogy, Language I, Language II, Mathematics, and EVS/Social Studies sections.',
      },
      {
        question: 'Is OMRWallah associated with the Central Board of Secondary Education (CBSE)?',
        answer:
          'No, OMRWallah is an independent educational tool designed to help candidates prepare and practice. We have no affiliation with CBSE or CTET.',
      },
    ],
  },
};

/**
 * Returns SEO configuration for a given route.
 * Private and authenticated routes are automatically configured with noindex: true.
 */
export function getRouteSEO(route: string): SEOProps {
  if (SEO_CONFIG[route]) {
    return SEO_CONFIG[route];
  }

  // Private / Authenticated routes
  const privateRoutes = ['dashboard', 'profile', 'settings', 'saved', 'tests', 'results', 'scan'];
  if (privateRoutes.includes(route)) {
    return {
      title: `${route.charAt(0).toUpperCase() + route.slice(1)} | OMRWallah`,
      description: 'Private student and teacher portal on OMRWallah.',
      canonicalPath: '/',
      noindex: true,
      type: 'website',
    };
  }

  // Fallback to home config
  return SEO_CONFIG.home;
}
