import { RoutineClass, SectionMeta, FacultyMeta } from '@/types/schedule';
import { ALL_SECTIONS, getSectionById } from '@/data/sections';
import { CURATED_ROUTINES } from '@/data/routines';
import { fetchLiveScheduleFromUpstream, fetchLiveTeacherScheduleFromUpstream } from './routine-gateway';
import { getFacultyByCode } from '@/data/faculty';
import { getCourseName } from '@/lib/courses';
import newRoutine from '@/data/new-routine.json';
import previousRoutine from '@/data/previous-routine.json';

/**
 * Retrieves all registered university sections (170+ sections across Batches 63-73)
 */
export function getAllSections(): SectionMeta[] {
  return ALL_SECTIONS;
}

/**
 * Retrieves section metadata by ID (e.g., '68_D' or '70_Q')
 */
export function getSection(id: string): SectionMeta | undefined {
  return getSectionById(id);
}

/**
 * Retrieves schedule entries for a section with subsection filtering for both:
 * 1. New Routine (Fall 2026 Routinly Optimized)
 * 2. Previous Routine (Fall 2026 Published V4.1)
 * 
 * @param sectionId e.g. "68_D"
 * @param subSection '1' | '2' | 'all' | null
 */
export async function getScheduleWithMeta(
  sectionId: string,
  subSection?: '1' | '2' | 'all' | null
): Promise<{
  classes: RoutineClass[];
  previousClasses: RoutineClass[];
  version: string;
  previousVersion: string;
}> {
  const normalizedId = sectionId.replace('-', '_').toUpperCase();

  // 1. New Routine (Routinly Optimized)
  const rawNew = (newRoutine.sections as Record<string, RoutineClass[]>)[normalizedId] || [];
  const enrichedNew: RoutineClass[] = rawNew.map((c) => ({
    ...c,
    courseTitle: getCourseName(c.courseCode) || c.courseTitle,
    teacherName: getFacultyByCode(c.teacherCode)?.name || c.teacherCode,
    versionType: 'new',
  }));

  // 2. Previous Routine (Fall 2026 Published V4.1)
  const rawPrev = (previousRoutine.sections as Record<string, RoutineClass[]>)[normalizedId] || [];
  const enrichedPrev: RoutineClass[] = rawPrev.map((c) => ({
    ...c,
    courseTitle: getCourseName(c.courseCode) || c.courseTitle,
    teacherName: getFacultyByCode(c.teacherCode)?.name || c.teacherCode,
    versionType: 'previous',
  }));

  return {
    classes: filterBySubSection(enrichedNew, subSection),
    previousClasses: filterBySubSection(enrichedPrev, subSection),
    version: newRoutine.version || 'Routinly (Optimized)',
    previousVersion: previousRoutine.version || 'Published (v4.1)',
  };
}

export async function getScheduleForSection(
  sectionId: string,
  subSection?: '1' | '2' | 'all' | null
): Promise<RoutineClass[]> {
  const res = await getScheduleWithMeta(sectionId, subSection);
  return res.classes;
}

const DAY_ORDER: Record<string, number> = {
  SATURDAY: 0,
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
};

function deduplicateAndSortClasses(classes: RoutineClass[]): RoutineClass[] {
  const map = new Map<string, RoutineClass>();

  for (const c of classes) {
    const cleanCourse = c.courseCode.split('(')[0].trim();
    // Key based on day, start time, end time, clean course code, and room
    const key = `${c.dayOfWeek}_${c.startTime}_${c.endTime}_${cleanCourse}_${c.room}`;

    if (map.has(key)) {
      const existing = map.get(key)!;
      // If sections differ, combine section label e.g. "66_A, 66_B"
      if (c.sectionId && !existing.sectionId.includes(c.sectionId)) {
        existing.sectionId = `${existing.sectionId}, ${c.sectionId}`;
      }
    } else {
      map.set(key, { ...c });
    }
  }

  const results = Array.from(map.values());
  results.sort((a, b) => {
    const dayDiff = (DAY_ORDER[a.dayOfWeek] ?? 0) - (DAY_ORDER[b.dayOfWeek] ?? 0);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  return results;
}

/**
 * Retrieves genuine routine classes for a faculty member directly from the live university system.
 * If the faculty member has no classes scheduled this semester or is no longer teaching,
 * this accurately returns an empty array with 0 classes (no fake mock classes are generated).
 */
export async function getScheduleForFacultyWithMeta(
  teacherCode: string
): Promise<{
  classes: RoutineClass[];
  previousClasses: RoutineClass[];
  version: string;
  previousVersion: string;
  faculty: FacultyMeta;
}> {
  const cleanCode = teacherCode.trim().toUpperCase();
  const faculty = getFacultyByCode(cleanCode) || {
    code: cleanCode,
    name: cleanCode,
    department: 'CSE',
  };

  const allCodes = new Set<string>([
    cleanCode,
    ...(faculty.aliases || []).map((a) => a.toUpperCase()),
  ]);

  // 1. New Routine (Routinly Optimized)
  const newTeacherClasses: RoutineClass[] = [];
  const newTeachersMap = (newRoutine.teachers || {}) as Record<string, RoutineClass[]>;
  for (const code of allCodes) {
    if (newTeachersMap[code]) {
      newTeacherClasses.push(...newTeachersMap[code]);
    }
  }

  // 2. Previous Routine (Fall 2026 Published V4.1)
  const prevTeacherClasses: RoutineClass[] = [];
  const prevTeachersMap = (previousRoutine.teachers || {}) as Record<string, RoutineClass[]>;
  for (const code of allCodes) {
    if (prevTeachersMap[code]) {
      prevTeacherClasses.push(...prevTeachersMap[code]);
    }
  }

  const enrichedNew = newTeacherClasses.map((c) => ({
    ...c,
    courseTitle: getCourseName(c.courseCode) || c.courseTitle,
    teacherName: faculty.name,
    versionType: 'new' as const,
  }));

  const enrichedPrev = prevTeacherClasses.map((c) => ({
    ...c,
    courseTitle: getCourseName(c.courseCode) || c.courseTitle,
    teacherName: faculty.name,
    versionType: 'previous' as const,
  }));

  return {
    classes: deduplicateAndSortClasses(enrichedNew),
    previousClasses: deduplicateAndSortClasses(enrichedPrev),
    version: newRoutine.version || 'Routinly (Optimized)',
    previousVersion: previousRoutine.version || 'Published (v4.1)',
    faculty,
  };
}

export async function getScheduleForFaculty(teacherCode: string): Promise<RoutineClass[]> {
  const res = await getScheduleForFacultyWithMeta(teacherCode);
  return res.classes;
}

function filterBySubSection(
  classes: RoutineClass[],
  subSection?: '1' | '2' | 'all' | null
): RoutineClass[] {
  if (!subSection || subSection === 'all') {
    return classes;
  }
  return classes.filter((c) => {
    // Keep all common theory classes
    if (c.subSection === null || c.subSection === undefined) {
      return true;
    }
    // Keep only the selected lab subsection (e.g. D1 or D2)
    return c.subSection === subSection;
  });
}

/**
 * Google Sheet CSV Live Data Adapter
 */
export async function fetchScheduleFromGoogleSheet(
  csvUrl: string,
  targetSectionId: string
): Promise<RoutineClass[]> {
  const response = await fetch(csvUrl, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet CSV: ${response.statusText}`);
  }
  const csvText = await response.text();
  const rows = csvText.split(/\r?\n/).filter((r) => r.trim().length > 0);
  if (rows.length <= 1) return [];

  const headers = rows[0].split(',').map((h) => h.trim().toLowerCase());
  const results: RoutineClass[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(',').map((c) => c.trim());
    if (cols.length < headers.length) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = cols[idx];
    });

    if (rowObj.sectionid?.toUpperCase() === targetSectionId.toUpperCase()) {
      results.push({
        id: `${targetSectionId}-${rowObj.coursecode}-${rowObj.dayofweek}-${rowObj.starttime?.replace(':', '')}`,
        batch: targetSectionId.split('_')[0],
        section: targetSectionId.split('_')[1],
        sectionId: targetSectionId,
        subSection: (rowObj.subsection as '1' | '2') || null,
        courseCode: rowObj.coursecode || '',
        courseTitle: rowObj.coursetitle || '',
        teacherCode: rowObj.teachercode || '',
        teacherName: rowObj.teachername || '',
        room: rowObj.room || '',
        dayOfWeek: (rowObj.dayofweek?.toUpperCase() as RoutineClass['dayOfWeek']) || 'SATURDAY',
        startTime: rowObj.starttime || '08:30',
        endTime: rowObj.endtime || '10:00',
        type: (rowObj.type as 'Theory' | 'Lab') || 'Theory',
      });
    }
  }

  return results;
}
