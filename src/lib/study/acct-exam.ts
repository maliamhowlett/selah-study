// The practice exam, transcribed with the answers pulled out of the paper and
// into `answer`, so it can be sat properly before it is marked.
//
// Nothing is here yet — drop the PDF in course-materials/acct-20000/ and it
// gets transcribed into this shape.

export interface ExamQuestion {
  id: string;
  number: number;
  topic: string;
  prompt: string;
  /** Present for multiple choice; omitted for worked problems. */
  choices?: string[];
  /** Index into `choices`, for multiple choice. */
  correct?: number;
  /** Worked solution, or the reasoning behind the correct choice. */
  answer: string;
}

export interface MockExam {
  title: string;
  /** Where it came from, so it's clear this isn't invented. */
  source: string;
  minutes: number;
  questions: ExamQuestion[];
}

export const ACCT_MOCK_EXAM: MockExam | null = null;
