export type Reading = {
  slug: string;
  classSlug: string;
  title: string;
  author: string;
  source?: string;
  date?: string;
  url?: string;
  assignedFor?: string;
  thesis: string;
  summary: string;
  keyIdeas: string[];
  keyQuotes: { quote: string; note?: string }[];
  vocabulary: { term: string; definition: string }[];
  discussionQuestions: string[];
  responsePaperPrompts?: string[];
  personalNotes?: string;
};

export const READINGS: Reading[] = [
  {
    slug: "skim-reading-new-normal",
    classSlug: "scla-10100",
    title: "Skim Reading is the New Normal",
    author: "Maryanne Wolf",
    source: "The Guardian",
    date: "August 25, 2018",
    url: "https://www.theguardian.com/commentisfree/2018/aug/25/skim-reading-new-normal-maryanne-wolf",
    assignedFor: "SCLA 10100 — Unit 1 Introduction",
    thesis:
      "Digital reading habits are rewiring the human brain toward skimming, which erodes 'deep reading' processes (critical analysis, empathy, perspective-taking). We need to cultivate a 'bi-literate' brain that can read deeply in both print and digital mediums — the stakes are democratic engagement, empathy, and wisdom itself.",
    summary:
      "Wolf, a cognitive neuroscientist, argues that reading is not an innate ability — it's a neural circuit that must be built and that adapts to whatever medium dominates. Because digital media rewards speed, multi-tasking, and volume, the reading brain is adapting away from slower processes like inference, critical analysis, and empathy. She cites studies showing print readers comprehend better than screen readers, that skimming (in F/Z patterns) is now the norm, and that effects appear as young as 4th–5th grade. The concern is not print-vs-digital as a binary, but what we lose while innovating. Her solution: consciously cultivate a 'bi-literate' brain capable of deep reading in either medium. 'Use it or lose it' is hopeful because it implies choice.",
    keyIdeas: [
      "Reading is a learned circuit, not innate — it adapts to whatever medium the brain uses most.",
      "'Deep reading' processes (inference, critical analysis, empathy, perspective-taking, insight) are slow and time-demanding — the digital medium starves them.",
      "The issue isn't print vs. digital. It's what we ignore or diminish while innovating (Sherry Turkle).",
      "Skimming has become the new normal — readers use F/Z patterns, sampling the first line then word-spotting.",
      "Print has 'spatial thereness' — a physical geometry that supports the 'technology of recurrence' (going back to re-examine).",
      "Screen reading damage shows up early — as young as 4th–5th grade, affecting both comprehension AND empathy.",
      "The political stakes: without deep reading, citizens can't analyze contracts, ballot questions, or spot demagoguery — democracy suffers.",
      "The solution is a 'bi-literate' brain — trained to do deep work in whichever medium it's using.",
      "'Use it or lose it' — the reading brain is plastic, so the story isn't over. We can choose.",
    ],
    keyQuotes: [
      {
        quote:
          "When the reading brain skims texts, we don't have time to grasp complexity, to understand another's feelings, to perceive beauty, and to create thoughts of the reader's own.",
        note: "The thesis in one sentence — what deep reading gives us.",
      },
      {
        quote:
          "We do not err as a society when we innovate, but when we ignore what we disrupt or diminish while innovating.",
        note: "Sherry Turkle (MIT), cited by Wolf. Frames the essay's argument.",
      },
      {
        quote:
          "The negative effects of screen reading can appear as early as fourth and fifth grade.",
        note: "Tami Katzir's research (Haifa University) — used as a pull-quote in the article.",
      },
      {
        quote:
          "We need to cultivate a new kind of brain: a 'bi-literate' reading brain capable of the deepest forms of thought in either digital or traditional mediums.",
        note: "The essay's central prescription.",
      },
      {
        quote:
          "There's an old rule in neuroscience that does not alter with age: use it or lose it.",
        note: "Wolf's closing note of hope — the reading brain is plastic.",
      },
    ],
    vocabulary: [
      {
        term: "Deep reading",
        definition:
          "Slow, time-demanding reading processes: inference, critical analysis, empathy, perspective-taking, generation of insight.",
      },
      {
        term: "Cognitive impatience",
        definition:
          "Mark Edmundson's term for students' unwillingness to engage with longer, denser, more difficult texts.",
      },
      {
        term: "F/Z reading pattern",
        definition:
          "Skimming pattern (per Ziming Liu, SJSU) where a reader samples the first line, then word-spots down the page — spending minimal time on the full text.",
      },
      {
        term: "Bi-literate brain",
        definition:
          "Wolf's proposal — a reading brain trained to do deep, complex thought in BOTH print and digital mediums, not just fast processing.",
      },
      {
        term: "Technology of recurrence",
        definition:
          "Andrew Piper's term for the physical ability to return to a text, re-check, and evaluate one's understanding — supported by the spatial 'thereness' of print.",
      },
    ],
    discussionQuestions: [
      "Wolf argues the medium reshapes the brain. How might reading Gilgamesh on a Kindle differ from reading it in print? Does the medium change the encounter with a 'transformative text'?",
      "Have you personally experienced 'cognitive impatience'? When?",
      "Wolf connects deep reading to democracy — citizens who can't analyze complex texts are 'susceptible to false information and demagoguery.' Is this overstated or accurate?",
      "What does a 'bi-literate' brain look like in practice for a college student in 2026?",
      "Wolf leans on multiple researchers (Turkle, Greenfield, Mangen, Liu, Piper, Katzir). Does the density of citations strengthen or weaken her argument for a general Guardian audience?",
      "How does Wolf's warning connect to why SCLA 101 requires you to read dense classical texts (Gilgamesh, Homer, Shakespeare) slowly and in full?",
    ],
    responsePaperPrompts: [
      "In 300–325 words, describe a moment where you noticed yourself skimming instead of reading deeply. Connect that experience to Wolf's argument about 'cognitive impatience' — do you agree that this represents a real cognitive loss?",
      "Wolf writes that 'we do not err as a society when we innovate, but when we ignore what we disrupt or diminish.' Apply this claim to one specific technology you use daily. What is diminished?",
      "Respond to Wolf's proposed solution — the 'bi-literate' brain. What would it require of you to build one? Is it realistic?",
    ],
    personalNotes: "",
  },
];

export function getReadingBySlug(
  classSlug: string,
  readingSlug: string,
): Reading | undefined {
  return READINGS.find(
    (r) => r.classSlug === classSlug && r.slug === readingSlug,
  );
}

export function getReadingsForClass(classSlug: string): Reading[] {
  return READINGS.filter((r) => r.classSlug === classSlug);
}
