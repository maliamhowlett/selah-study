// Generates supabase/seed-malia.sql from the class data in src/lib/classes.ts.
// Usage: node scripts/generate-seed.mjs <USER_UUID>

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Imported, not copied. This file used to keep its own duplicate of the class
// data, which meant a room number could be fixed in one place and stay wrong in
// the other. Node strips the TypeScript types on the way in.
import { CLASSES } from "../src/lib/classes.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const userId = process.argv[2];
if (!userId) {
  console.error("Usage: node scripts/generate-seed.mjs <USER_UUID>");
  process.exit(1);
}


const esc = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const jsonb = (v) =>
  v == null ? "NULL" : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const rows = CLASSES.map(
  (c) => `(
  '${userId}',
  ${esc(c.slug)},
  ${esc(c.courseCode)},
  ${esc(c.title)},
  ${esc(c.department)},
  ${c.credits ?? "NULL"},
  ${esc(c.color)},
  ${jsonb(c.instructor)},
  ${jsonb(c.additionalStaff ?? null)},
  ${jsonb(c.meetingTimes)},
  ${esc(c.overview)},
  ${jsonb(c.learningOutcomes)},
  ${jsonb(c.textbooks)},
  ${jsonb(c.grading)},
  ${esc(c.gradingScale ?? null)},
  ${jsonb(c.keyDates)},
  ${esc(c.attendance)},
  ${esc(c.latePolicy)},
  ${esc(c.aiPolicy)},
  ${esc(c.gradeInquiryPolicy ?? null)},
  ${jsonb(c.notes ?? null)}
)`,
).join(",\n");

const sql = `-- Seed Malia's Fall 2026 classes into her Supabase account.
-- Generated on ${new Date().toISOString()} for user_id ${userId}.
-- Safe to re-run: uses ON CONFLICT (user_id, slug) DO UPDATE.

insert into public.classes (
  user_id, slug, course_code, title, department, credits, color,
  instructor, additional_staff, meeting_times, overview,
  learning_outcomes, textbooks, grading, grading_scale,
  key_dates, attendance, late_policy, ai_policy,
  grade_inquiry_policy, notes
) values
${rows}
on conflict (user_id, slug) do update set
  course_code = excluded.course_code,
  title = excluded.title,
  department = excluded.department,
  credits = excluded.credits,
  color = excluded.color,
  instructor = excluded.instructor,
  additional_staff = excluded.additional_staff,
  meeting_times = excluded.meeting_times,
  overview = excluded.overview,
  learning_outcomes = excluded.learning_outcomes,
  textbooks = excluded.textbooks,
  grading = excluded.grading,
  grading_scale = excluded.grading_scale,
  key_dates = excluded.key_dates,
  attendance = excluded.attendance,
  late_policy = excluded.late_policy,
  ai_policy = excluded.ai_policy,
  grade_inquiry_policy = excluded.grade_inquiry_policy,
  notes = excluded.notes,
  updated_at = now();
`;

const outPath = resolve(__dirname, "../supabase/seed-malia.sql");
writeFileSync(outPath, sql);
console.log(`Wrote ${outPath} (${sql.length} bytes, ${CLASSES.length} classes)`);
