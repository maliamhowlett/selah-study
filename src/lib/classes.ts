export type MeetingTime = {
  days: string;
  time: string;
  location: string;
  note?: string;
};

export type GradingItem = {
  item: string;
  weight: string;
};

export type KeyDate = {
  label: string;
  date: string;
  detail?: string;
};

export type ClassInfo = {
  slug: string;
  courseCode: string;
  title: string;
  department: string;
  credits: number;
  color: string;
  instructor: {
    name: string;
    email: string;
    officeHours?: string;
    /** Room, where the syllabus names one. Several don't. */
    office?: string;
    phone?: string;
  };
  additionalStaff?: {
    role: string;
    name: string;
    email?: string;
  }[];
  meetingTimes: MeetingTime[];
  overview: string;
  learningOutcomes: string[];
  textbooks: string[];
  grading: GradingItem[];
  gradingScale?: string;
  keyDates: KeyDate[];
  attendance: string;
  latePolicy: string;
  aiPolicy: string;
  gradeInquiryPolicy?: string;
  notes?: string[];
};

export const CLASSES: ClassInfo[] = [
  {
    slug: "acct-20000",
    courseCode: "ACCT 20000",
    title: "Intro Accounting",
    department: "Department of Accounting",
    credits: 3,
    color: "bg-[#EFE6DC] text-[#7A6E64]",
    instructor: {
      name: "Dr. Becky (Rebekha) Bokrand",
      email: "rbokrand@purdue.edu",
      office: "KRAN 428 (in-person hours only)",
      officeHours:
        "Wednesdays 11:00 AM–12:30 PM (in-person KRAN 428 or virtual); Thursdays 2:00–4:00 PM (virtual only). Schedule via Calendly.",
    },
    additionalStaff: [
      { role: "TA", name: "Brayden YoungWon Cho", email: "cho576@purdue.edu" },
      { role: "SI Leader", name: "Nyree Ruiz", email: "ruiz165@purdue.edu" },
    ],
    meetingTimes: [
      { days: "MWF", time: "8:30–9:20 AM", location: "FRNY G140", note: "Section 001" },
    ],
    overview:
      "Understand what's in financial statements, identify the business activities behind the amounts, and understand how manager/employee actions appear in the statements. 12 chapters + appendix across 3 modules.",
    learningOutcomes: [
      "Understand accounting terminology, principles, and concepts",
      "Learn how business events are reported in financial statements",
      "Prepare basic financial statements",
      "Analyze financial statements for performance and risk",
      "Use financial info in decision-making",
    ],
    textbooks: [
      "Financial Accounting: 2025 Release (Spiceland/Thomas/Herrmann, 6th ed.) — access via McGraw Hill Connect (REQUIRED; e-book included)",
    ],
    grading: [
      { item: "SmartBook Reviews + Syllabus Quiz (lowest dropped)", weight: "15%" },
      { item: "Online Homework via Connect (lowest dropped)", weight: "20%" },
      { item: "In-class attendance (iClicker, capped at 64 pts)", weight: "5%" },
      { item: "Exam 1 — Module 1 (Ch. 1–3)", weight: "15%" },
      { item: "Exam 2 — Module 2 (Ch. 4–7)", weight: "20%" },
      { item: "Exam 3 — Module 3 (Ch. 8–12), reviews Ch. 1–12", weight: "25%" },
    ],
    gradingScale: "A 90–92, A>92 | B 83–86, B+ 87–89 | C 73–76, C+ 77–79 | D 63–66, D+ 67–69 | F <60. Curve considered only if class avg < 75%.",
    keyDates: [
      { label: "Syllabus Quiz due", date: "Tue Sep 1" },
      { label: "Exam 1", date: "Wed Sep 17, 8:00–9:00 PM", detail: "WTHR 200" },
      { label: "Exam 2", date: "Tue Oct 27, 8:00–9:00 PM", detail: "WTHR 200" },
      { label: "Exam 3 (Ch. 8–12, comprehensive review)", date: "Finals week (TBD)" },
    ],
    attendance:
      "iClicker check-in worth 2 pts/class, max 64 pts. YOU must remember to open iClicker and hit 'Join' — no reminders. If iClicker fails, sign the sheet before leaving class or attendance can't be updated.",
    latePolicy: "Late assignments are NOT accepted. No extensions for expired Connect trials/inactive licenses.",
    aiPolicy: "AI permitted for non-exam assignments as a study tool. NOT allowed on the 3 exams. Do not upload instructor materials or student data.",
    gradeInquiryPolicy:
      "Grade concerns must be raised within 3 business days of posting. Discussed in-person only (FERPA) — not via email or in class. TAs cannot address grade issues.",
    notes: [
      "Chapter notes packets required at every class — print or fill in on tablet. No photos allowed of filled-in packets.",
      "Supplemental Instruction: Tues/Thurs 4:30–5:20 PM in SCHM 116.",
      "Piazza is the fastest way to get homework help.",
    ],
  },
  {
    slug: "scla-10100",
    courseCode: "SCLA 10100",
    title: "Critical Thinking & Communication I",
    department: "College of Liberal Arts",
    credits: 3,
    color: "bg-[#FBEEF1] text-[#B0748B]",
    instructor: {
      name: "Raleigh Heth",
      email: "rheth@purdue.edu",
      office: "Beering 6165",
      officeHours: "Tues/Thurs 2–4 PM (email response 8 AM–5 PM Mon–Fri)",
    },
    meetingTimes: [{ days: "MWF", time: "10:30–11:20 AM", location: "BRNG 1242" }],
    overview:
      "Foundational reading, writing, speaking, and analytical skills through transformative texts from antiquity to the birth of the modern era. Writing-intensive: at least 8,000 words of polished writing.",
    learningOutcomes: [
      "Write with clarity, coherence, concision across genres",
      "Understand rhetorical situations and choices",
      "Critical thinking through reading, analysis, discussion",
      "Master the writing process (draft, revise, edit, peer review)",
      "Analyze and evaluate sources across media",
      "Engage critically with transformative texts",
    ],
    textbooks: [
      "Othello — Shakespeare (Folger, ISBN 9781476788524)",
      "Prometheus Bound — Aeschylus (ISBN 9781590178614)",
      "The Epic of Gilgamesh — trans. Andrew George (Penguin, ISBN 9780140449198)",
      "The Odyssey — Homer, trans. Emily Wilson (ISBN 9780393356250)",
      "The New Oxford Annotated Bible NRSV w/ Apocrypha (DO NOT PURCHASE — provided)",
    ],
    grading: [
      { item: "Contribution (participation)", weight: "20%" },
      { item: "Weekly Response Papers (300–325 words)", weight: "15%" },
      { item: "Quizzes (Syllabus + Research Process)", weight: "5%" },
      { item: "Creative Writing Project (750–1,000 words)", weight: "10%" },
      { item: "Oral Thesis Presentation", weight: "10%" },
      { item: "Annotated Bibliography", weight: "10%" },
      { item: "Research Paper Draft 1", weight: "5%" },
      { item: "Peer-Review Session", weight: "5%" },
      { item: "Final Research Paper (1,700–2,000 words)", weight: "20%" },
    ],
    gradingScale: "A 93.5–100 | A- 90–93.49 | B+ 88–89.99 | B 84–87.99 | B- 81–83.99 | C+ 78–80.99 | C 76–77.99 | C- 70–75.99 | D 60–69.99 | F 0–59.99",
    keyDates: [
      { label: "Course Units", date: "Gilgamesh → Hebrew Bible → Odyssey → Prometheus Bound → Othello → Research Paper" },
    ],
    attendance:
      "4 free 'sick days' allowed. 5th absence drops contribution grade to 85%; 5+ absences drop final grade by ½ letter each. Excessive absences can fail you.",
    latePolicy: "Not explicitly stated; assumed strict given discussion-based format.",
    aiPolicy:
      "STRICT — Zero AI use permitted, including brainstorming, outlining, or rephrasing. Violations reported to OSRR and can result in F for course. Do not use ChatGPT etc. for anything.",
    notes: [
      "Discussion-based; class participation is 20% of your grade.",
      "Use proper email etiquette (Dear Professor X / Sincerely).",
    ],
  },
  {
    slug: "ma-16100",
    courseCode: "MA 16100",
    title: "Plane Analytic Geometry & Calculus I",
    department: "Department of Mathematics",
    credits: 5,
    color: "bg-[#EEF1E7] text-[#6B7A5C]",
    instructor: {
      name: "Dr. Mahesh Sunkula (lecture section 100)",
      email: "msunkula@purdue.edu",
      officeHours: "MWF 1:30–2:30 PM",
    },
    additionalStaff: [
      { role: "Alt. Lecturer (Sec. 200)", name: "Dr. Allan Bickle", email: "aebickle@purdue.edu" },
    ],
    meetingTimes: [
      { days: "MWF", time: "3:30–4:20 PM", location: "CL50 224", note: "Lecture — Section 100" },
      {
        days: "T/R",
        time: "7:30–8:20 AM",
        location: "HAMP 2123",
        note: "Recitation with K. P. Ashmallah (quizzes here!)",
      },
    ],
    overview:
      "Introduction to differential and integral calculus of one variable, with applications. 5 credits.",
    learningOutcomes: [
      "Compute limits and apply limit laws",
      "Apply differentiation rules to elementary functions",
      "Sketch graphs using differentiation techniques",
      "Find maxima/minima; solve optimization problems",
      "Compute integrals; apply the Fundamental Theorem of Calculus",
    ],
    textbooks: [
      "Calculus: Early Transcendentals — Briggs/Cochran/Gillett/Schulz, 3rd ed. (ISBN 9780134763644)",
      "MyLab Math (Pearson) required — accessed through Brightspace",
    ],
    grading: [
      { item: "Homework (MyLab Math, 36 assignments)", weight: "10%" },
      { item: "Quizzes (during recitation)", weight: "12%" },
      { item: "Midterm Exam 1", weight: "18%" },
      { item: "Midterm Exam 2", weight: "18%" },
      { item: "Midterm Exam 3", weight: "18%" },
      { item: "Final Exam (cumulative)", weight: "24%" },
    ],
    gradingScale: "A+ ≥97 | A ≥93 | A- ≥90 | B+ ≥87 | B ≥83 | B- ≥80 | C+ ≥77 | C ≥73 | C- ≥70 | D+ ≥67 | D ≥60. Cutoffs may drop but never rise.",
    keyDates: [
      { label: "Exam 1", date: "Wed Sep 23, 8:00–9:00 PM" },
      { label: "Exam 2", date: "Mon Oct 19, 8:00–9:00 PM" },
      { label: "Exam 3", date: "Wed Nov 18, 8:00–9:00 PM" },
      { label: "Last day to drop (no record)", date: "Fri Sep 4" },
      { label: "Last day to drop with W", date: "Tue Nov 24" },
      { label: "Final Exam", date: "Finals week (registrar sets time)" },
    ],
    attendance:
      "Attendance expected at every lecture AND recitation. 3 lowest HW and 3 lowest quiz scores dropped automatically. Arrive on time to recitation — late = no quiz.",
    latePolicy: "Late HW not accepted; no makeup quizzes. Missed exam requires notifying lecturer within 24 hours.",
    aiPolicy: "AI OK for learning/understanding topics. Cannot use AI answers as your own. No AI on exams (no electronics allowed).",
    gradeInquiryPolicy: "Contact your TA first for most questions (deadlines, grading, technical). TA escalates to instructor if needed.",
    notes: [
      "MC + machine-graded exams. No partial credit. No calculators/notes/devices.",
      "HW: Fri+Mon lectures → due Tue 11:59 PM. Wed lecture → due Thu 11:59 PM.",
      "Quiz nearly every Tue/Thu recitation (except a few).",
      "If you switch recitation sections, tell your TA so scores transfer.",
      "SI with Shin S.: Sun 5:30–6:20 PM (BRNG 1222), Wed & Thu 5:30–6:20 PM (SCHM 108). Office hours Thu 1:30–2:30 PM.",
      "SI with Josh K.: Mon, Tue & Thu 7:30–8:20 PM (WALC 2121).",
    ],
  },
  {
    slug: "expl-10100",
    courseCode: "EXPL 10100",
    title: "Academic and Career Planning",
    department: "Department of Exploratory Studies",
    credits: 3,
    color: "bg-[#FBEEF1] text-[#B0748B]",
    instructor: {
      name: "Cara Wetzel",
      email: "wetzelc@purdue.edu",
      office: "Young Hall, 6th floor",
      phone: "765-494-0843",
      officeHours: "By appointment — office on 6th floor of Young Hall",
    },
    meetingTimes: [{ days: "T/R", time: "10:30–11:20 AM", location: "UNIV 201" }],
    overview:
      "Builds understanding of career interests and personality traits related to academic/career decisions. Introduces Purdue programs, the world of work, and decision-making strategies.",
    learningOutcomes: [
      "Describe multiple facets of your identity",
      "Identify and analyze potential academic majors",
      "Identify and analyze potential careers",
      "Evaluate majors/careers in relation to yourself",
    ],
    textbooks: [
      "EXPL 10100 Student Course Pack — buy at University Bookstore only (360 W. State St.). Includes career inventory access.",
    ],
    grading: [
      { item: "Prepare + Attend + Participate (15 pts/day × 26 classes)", weight: "390 pts" },
      { item: "5 Quizzes (10 pts each)", weight: "50 pts" },
      { item: "2 Exploration Activities (50 pts each)", weight: "100 pts" },
      { item: "Student Interview + Career Interview (50 pts each)", weight: "100 pts" },
      { item: "2 Reflection Papers (Midterm + Final, 50 pts each)", weight: "100 pts" },
      { item: "5 Assignments & Instructor Choice (25/50/75 pts each)", weight: "260 pts" },
    ],
    keyDates: [
      { label: "Past vs. Future Reflection", date: "Tue Sep 1" },
      { label: "Plan of Study Worksheet", date: "Mon Sep 15" },
      { label: "Exploration Activity #1", date: "Wed Sep 24" },
      { label: "Exploration Activity #2", date: "Wed Oct 15" },
      { label: "Student Interview", date: "Wed Oct 22" },
      { label: "Midterm Reflection Paper", date: "Wed Oct 29" },
      { label: "My Future Vision Board", date: "Wed Nov 5" },
      { label: "Career Interview", date: "Wed Nov 12" },
      { label: "Final Reflection Paper", date: "Wed Nov 19" },
      { label: "Interview Introduction", date: "Mon Dec 1" },
      { label: "Last day of class (no final)", date: "Wed Dec 10" },
    ],
    attendance:
      "Formula: Prepare (5 pts) + Attend (5 pts) + Participate (5 pts) = 15 pts/class. Complete class prep BEFORE class. 2 lowest attendance grades dropped.",
    latePolicy: "Late assignments accepted up to 24 hrs late with a 20% point penalty. Submit as PDF only.",
    aiPolicy: "AI is NOT an appropriate tool for assignments in this class. Use your own voice/perspective.",
    notes: [
      "No final exam — last class is Dec 10.",
      "Two required 15-min virtual 1:1 meetings with instructor (Aug/Sept and Nov/Dec).",
      "Focus on personal reflection — recycling past work = academic dishonesty.",
    ],
  },
  {
    slug: "ma-17000",
    courseCode: "MA 17000 / STAT 17000",
    title: "Introduction to Actuarial Science",
    department: "Department of Mathematics",
    credits: 2,
    color: "bg-[#EEF1E7] text-[#6B7A5C]",
    instructor: {
      name: "Daniel Rubin",
      email: "rubin6@purdue.edu",
      phone: "614-309-6576",
      officeHours: "Wednesdays 10:00 AM–12:00 PM or by appointment",
    },
    meetingTimes: [
      { days: "Tue", time: "3:30–4:20 PM", location: "WALC 1055", note: "Main lecture" },
      {
        days: "Thu",
        time: "3:30–4:20 PM",
        location: "MATH 175 (lecture) / assigned lab room (lab)",
        note: "Lecture some weeks, lab others — check which before you go",
      },
    ],
    overview:
      "Introduction to actuarial science from practicing actuaries (life, casualty, consulting). Covers insurance, mathematical theory of interest, and Excel applications. Guest speakers throughout.",
    learningOutcomes: [
      "Describe/calculate interest rates and equivalent rates",
      "Calculate present value of cash flows",
      "Apply probability principles used by actuaries",
      "Describe types of insurance and basic components (premium, claim, deductible, etc.)",
      "Describe ratemaking, pricing, accounting regimes",
      "Calculate policy and loss reserves",
      "Apply Excel to solve actuarial problems",
    ],
    textbooks: ["No required textbook. Readings posted to Brightspace as needed."],
    grading: [
      { item: "Attendance: Lecture", weight: "6%" },
      { item: "Attendance: 1:1 meetings", weight: "5%" },
      { item: "Attendance: Insurance Company Presentations (2 required)", weight: "3%" },
      { item: "Homework", weight: "6%" },
      { item: "Excel Labs / Journals", weight: "25%" },
      { item: "Mid-Term (tentatively Oct 8)", weight: "25%" },
      { item: "Final Exam (cumulative, finals week)", weight: "30%" },
    ],
    gradingScale: "A+ ≥97 | A ≥93 | A- ≥90 | B+ ≥87 | B ≥83 | B- ≥80 | C+ ≥77 | C ≥73 | C- ≥70 | D+ ≥67 | D ≥63 | D- ≥60 | F <60",
    keyDates: [
      { label: "Mid-Term (tentative)", date: "Thu Oct 8, 3:30–4:20 PM", detail: "MATH 175" },
      { label: "1:1 Meeting #1", date: "Aug/Sept (you schedule)" },
      { label: "1:1 Meeting #2", date: "Nov/Dec (you schedule)" },
      { label: "Final Exam", date: "Finals week — do NOT book winter break travel before knowing date" },
    ],
    attendance:
      "Regular attendance taken. Notify instructor via email BEFORE class if absent. Must attend 2 insurance company presentations for attendance credit.",
    latePolicy: "No HW or labs accepted past the due date. Zero tolerance.",
    aiPolicy:
      "Instructor cautions against AI use — may give inaccurate answers or use concepts subtly different from class. Cheating (including AI-submitted work) = 0 on assignment + 5% reduction on final grade. Cheating on exam = F for course.",
    notes: [
      "Excel is a big part of this course.",
      "2 required virtual 1:1 meetings with instructor via Zoom (you schedule them).",
      "Guest speakers from actuarial practice throughout the semester.",
    ],
  },
];

export function getClassBySlug(slug: string): ClassInfo | undefined {
  return CLASSES.find((c) => c.slug === slug);
}
