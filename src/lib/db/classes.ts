import { createClient } from "@/lib/supabase/server";
import type { ClassInfo } from "@/lib/classes";

// Database row shape (snake_case) — matches supabase/schema.sql
type ClassRow = {
  id: string;
  user_id: string;
  slug: string;
  course_code: string;
  title: string;
  department: string | null;
  credits: number | null;
  color: string | null;
  instructor: ClassInfo["instructor"] | null;
  additional_staff: ClassInfo["additionalStaff"] | null;
  meeting_times: ClassInfo["meetingTimes"] | null;
  overview: string | null;
  learning_outcomes: ClassInfo["learningOutcomes"] | null;
  textbooks: ClassInfo["textbooks"] | null;
  grading: ClassInfo["grading"] | null;
  grading_scale: string | null;
  key_dates: ClassInfo["keyDates"] | null;
  attendance: string | null;
  late_policy: string | null;
  ai_policy: string | null;
  grade_inquiry_policy: string | null;
  notes: ClassInfo["notes"] | null;
  created_at: string;
  updated_at: string;
};

function rowToClass(row: ClassRow): ClassInfo & { id: string } {
  return {
    id: row.id,
    slug: row.slug,
    courseCode: row.course_code,
    title: row.title,
    department: row.department ?? "",
    credits: row.credits ?? 0,
    color: row.color ?? "bg-[#EFE6DC] text-[#7A6E64]",
    instructor: row.instructor ?? { name: "", email: "" },
    additionalStaff: row.additional_staff ?? undefined,
    meetingTimes: row.meeting_times ?? [],
    overview: row.overview ?? "",
    learningOutcomes: row.learning_outcomes ?? [],
    textbooks: row.textbooks ?? [],
    grading: row.grading ?? [],
    gradingScale: row.grading_scale ?? undefined,
    keyDates: row.key_dates ?? [],
    attendance: row.attendance ?? "",
    latePolicy: row.late_policy ?? "",
    aiPolicy: row.ai_policy ?? "",
    gradeInquiryPolicy: row.grade_inquiry_policy ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export async function fetchUserClasses(): Promise<(ClassInfo & { id: string })[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchUserClasses error:", error);
    return [];
  }
  return (data as ClassRow[]).map(rowToClass);
}

export async function fetchUserClassBySlug(
  slug: string,
): Promise<(ClassInfo & { id: string }) | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("fetchUserClassBySlug error:", error);
    return null;
  }
  if (!data) return null;
  return rowToClass(data as ClassRow);
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}
