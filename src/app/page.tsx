'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { SectionSelector } from '@/components/SectionSelector';
import { TimetableGrid } from '@/components/TimetableGrid';
import { TimetableSkeleton } from '@/components/TimetableSkeleton';
import { StickySyncBar } from '@/components/StickySyncBar';
import { RoomFinderModal } from '@/components/RoomFinderModal';
import { FacultyInfoModal } from '@/components/FacultyInfoModal';
import { SectionInfoModal } from '@/components/SectionInfoModal';
import { ALL_SECTIONS, getSectionById } from '@/data/sections';
import { getFacultyByCode } from '@/data/faculty';
import {
  DayOfWeek,
  RoutineClass,
  SectionMeta,
  FacultyMeta,
  ActiveRoutineTarget,
  CompareState,
  FreeTimeSlot,
  VersionViewMode,
} from '@/types/schedule';
import { ClassEventOverride } from '@/types/events';
import { WifiOff, RefreshCw } from 'lucide-react';

const SYNCED_VERSION_KEY = 'diu_synced_routine_version';
const CACHE_PREFIX = 'diu_cached_compare_v4';

function purgeOldVersionCaches(activeVersion: string) {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      // Invalidate and remove routine caches from legacy single-routine format or old versions
      if (k.startsWith('diu_cached_routine_') || k.startsWith('diu_cached_compare_')) {
        if (!k.startsWith(`${CACHE_PREFIX}_${activeVersion}_`)) {
          keysToRemove.push(k);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(SYNCED_VERSION_KEY, activeVersion);
  } catch {
    // Ignore storage quota errors
  }
}

export default function Home() {
  // 1. Initialize Active Target State (Section or Faculty) - null when unselected
  const [activeTarget, setActiveTarget] = useState<ActiveRoutineTarget | null>(null);
  const [eventOverrides, setEventOverrides] = useState<ClassEventOverride[]>([]);

  const [hasSavedPreference, setHasSavedPreference] = useState(false);

  // Derived student helpers
  const selectedSection: SectionMeta | null =
    activeTarget && activeTarget.type === 'section' ? activeTarget.section : null;

  const selectedSubSection: '1' | '2' | 'all' =
    activeTarget && activeTarget.type === 'section' ? activeTarget.subSection : 'all';

  // 2. View Mode (Strictly matrix grid / compare view only - no agenda view)
  const viewMode = 'matrix';
  const [versionView, setVersionView] = useState<VersionViewMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search).get('version_view');
        if (p === 'both' || p === 'new' || p === 'previous') return p;
        const saved = localStorage.getItem('diu_routine_version_view');
        if (saved === 'both' || saved === 'new' || saved === 'previous') return saved;
      } catch {
        // Ignore
      }
    }
    return 'both';
  });

  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'long',
      }).formatToParts(new Date());
      const weekday = parts.find((p) => p.type === 'weekday')?.value?.toUpperCase() || '';
      const dayMap: Record<string, DayOfWeek> = {
        SATURDAY: 'SATURDAY',
        SUNDAY: 'SUNDAY',
        MONDAY: 'MONDAY',
        TUESDAY: 'TUESDAY',
        WEDNESDAY: 'WEDNESDAY',
        THURSDAY: 'THURSDAY',
      };
      return dayMap[weekday] || 'SATURDAY';
    } catch {
      return 'SATURDAY';
    }
  });

  // 3. Modal Dialog Controls
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  const [isRoomFinderOpen, setIsRoomFinderOpen] = useState(false);
  const [roomFinderInitialRoom, setRoomFinderInitialRoom] = useState<string | null>(null);
  const [isFacultyInfoOpen, setIsFacultyInfoOpen] = useState(false);
  const [facultyInfoCode, setFacultyInfoCode] = useState<string | null>(null);
  const [facultyInfoReturnSection, setFacultyInfoReturnSection] = useState<string | null>(null);
  const [facultyInfoInitial, setFacultyInfoInitial] = useState<FacultyMeta | null>(null);
  const [isSectionInfoOpen, setIsSectionInfoOpen] = useState(false);
  const [sectionInfoTargetId, setSectionInfoTargetId] = useState<string | null>(null);

  const handleOpenRoomFinder = (room?: string) => {
    setRoomFinderInitialRoom(room || null);
    setIsRoomFinderOpen(true);
  };

  const handleOpenFacultyInfo = (code: string, returnSection?: string, initial?: FacultyMeta) => {
    setFacultyInfoCode(code);
    setFacultyInfoReturnSection(returnSection || null);
    setFacultyInfoInitial(initial || getFacultyByCode(code) || null);
    setIsFacultyInfoOpen(true);
    setIsSectionInfoOpen(false);
  };

  const handleOpenSectionInfo = (sectionId: string) => {
    setSectionInfoTargetId(sectionId);
    setIsSectionInfoOpen(true);
  };

  // 4. Routine Data State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [liveSchedule, setLiveSchedule] = useState<RoutineClass[] | null>(null);
  const [secondaryLiveSchedule, setSecondaryLiveSchedule] = useState<RoutineClass[] | null>(null);

  const [routineVersion, setRoutineVersion] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SYNCED_VERSION_KEY);
        if (saved && saved.trim()) return saved.trim();
      } catch {
        // Ignore
      }
    }
    return 'v4.1';
  });
  const [isOfflineCached, setIsOfflineCached] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // 5. Dual Version Compare State (Automatically active for loaded section/faculty, no free-gap highlighting)
  const compareState: CompareState = useMemo(
    () => ({
      active: true,
      primaryTarget: activeTarget,
      secondaryTarget: activeTarget,
      priority: 'primary',
      secondaryVisibility: 'block',
      showFreeTimeHighlight: false,
    }),
    [activeTarget]
  );

  // Read saved target from localStorage or URL on mount
  useEffect(() => {
    try {
      let teacherToUse: string | null = null;
      let secToUse: string | null = null;
      let subToUse: string | null = null;

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        teacherToUse = params.get('teacher') || params.get('t');
        secToUse = params.get('section') || params.get('s');
        subToUse = params.get('sub');
      }

      let resolvedTarget: ActiveRoutineTarget | null = null;

      // 1. If explicit teacher in URL, prioritize
      if (teacherToUse) {
        const found = getFacultyByCode(teacherToUse);
        if (found) {
          resolvedTarget = { type: 'faculty', faculty: found };
        }
      }

      // 2. If explicit section in URL, prioritize
      if (!resolvedTarget) {
        const savedSub = (subToUse || localStorage.getItem('diu_routine_selected_subsection')) as
          | '1'
          | '2'
          | 'all'
          | null;
        const validSub: '1' | '2' | 'all' =
          savedSub === '1' || savedSub === '2' || savedSub === 'all' ? savedSub : 'all';

        if (secToUse) {
          const found = getSectionById(secToUse);
          if (found) {
            resolvedTarget = { type: 'section', section: found, subSection: validSub };
          }
        }

        // 3. Fallback to localStorage preferences
        if (!resolvedTarget) {
          const savedType = localStorage.getItem('diu_routine_selected_type');
          if (savedType === 'faculty') {
            const savedFaculty = localStorage.getItem('diu_routine_selected_faculty');
            if (savedFaculty) {
              const found = getFacultyByCode(savedFaculty);
              if (found) {
                resolvedTarget = { type: 'faculty', faculty: found };
              }
            }
          }
        }

        if (!resolvedTarget) {
          const localSec = localStorage.getItem('diu_routine_selected_section');
          if (localSec) {
            const found = getSectionById(localSec);
            if (found) {
              resolvedTarget = { type: 'section', section: found, subSection: validSub };
            }
          }
        }
      }

      if (resolvedTarget) {
        setActiveTarget(resolvedTarget);
        setHasSavedPreference(true);
      } else {
        setHasSavedPreference(false);
        setIsSectionPickerOpen(true);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save selected section to state, localStorage & URL
  const handleSelectSection = (newSec: SectionMeta, subSection?: '1' | '2' | 'all') => {
    const finalSub = subSection || 'all';
    const newTarget: ActiveRoutineTarget = { type: 'section', section: newSec, subSection: finalSub };
    setActiveTarget(newTarget);
    setLiveSchedule(null);
    setSecondaryLiveSchedule(null);
    setHasSavedPreference(true);

    try {
      localStorage.setItem('diu_routine_selected_type', 'section');
      localStorage.setItem('diu_routine_selected_section', newSec.id);
      localStorage.setItem('diu_routine_selected_subsection', finalSub);
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('teacher');
        newUrl.searchParams.delete('t');
        if (finalSub !== 'all') {
          newUrl.searchParams.set('sub', finalSub);
        } else {
          newUrl.searchParams.delete('sub');
        }
        newUrl.searchParams.set('section', newSec.id);
        newUrl.searchParams.delete('compare');
        newUrl.searchParams.delete('c');
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (e) {
      console.warn('LocalStorage / URL write error:', e);
    }
  };

  // Save selected subsection to state, localStorage & URL
  const handleSelectSubSection = (newSub: '1' | '2' | 'all') => {
    setActiveTarget((prev) => {
      if (prev && prev.type === 'section') {
        return { type: 'section', section: prev.section, subSection: newSub };
      }
      return prev;
    });
    setHasSavedPreference(true);
    try {
      localStorage.setItem('diu_routine_selected_subsection', newSub);
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location.href);
        if (newSub !== 'all') {
          newUrl.searchParams.set('sub', newSub);
        } else {
          newUrl.searchParams.delete('sub');
        }
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  };

  // Save selected faculty to state, localStorage & URL
  const handleSelectFaculty = (newFaculty: FacultyMeta) => {
    const newTarget: ActiveRoutineTarget = { type: 'faculty', faculty: newFaculty };
    setActiveTarget(newTarget);
    setLiveSchedule(null);
    setSecondaryLiveSchedule(null);
    setHasSavedPreference(true);

    try {
      localStorage.setItem('diu_routine_selected_type', 'faculty');
      localStorage.setItem('diu_routine_selected_faculty', newFaculty.code);
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('section');
        newUrl.searchParams.delete('s');
        newUrl.searchParams.delete('sub');
        newUrl.searchParams.set('teacher', newFaculty.code);
        newUrl.searchParams.delete('compare');
        newUrl.searchParams.delete('c');
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (e) {
      console.warn('LocalStorage / URL write error:', e);
    }
  };

  // System-wide Routine Version Update handler
  const handleSystemWideVersionUpdate = useCallback((newVer: string) => {
    const formatted = newVer.startsWith('v') ? newVer : `v${newVer}`;
    console.info(`[System Update] Triggering system-wide routine version update to ${formatted}`);
    purgeOldVersionCaches(formatted);
    setRoutineVersion(formatted);
    setReloadTrigger((prev) => prev + 1);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSectionPickerOpen((prev) => !prev);
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSectionPickerOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check routine version on mount
  useEffect(() => {
    let isCancelled = false;

    fetch('/api/routine_version')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to query upstream version');
        return res.json();
      })
      .then((data) => {
        if (isCancelled || !data.success || !data.version) return;

        const serverVersion = String(data.version).trim();
        const storedVersion =
          typeof window !== 'undefined'
            ? localStorage.getItem(SYNCED_VERSION_KEY)
            : null;

        if (storedVersion && serverVersion === storedVersion) {
          return;
        }

        console.info(
          `[Routine Version] Upstream routine version updated to ${serverVersion}. Purging previous cache.`
        );
        purgeOldVersionCaches(serverVersion);
        setRoutineVersion(serverVersion);
        setReloadTrigger((prev) => prev + 1);
      })
      .catch((err) => {
        console.warn('Routine version query fallback:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Cache helpers for offline and instant retrieval namespaced by routine version
  const getCacheKey = useCallback(
    (target: ActiveRoutineTarget, ver?: string) => {
      const v = ver || routineVersion;
      if (target.type === 'faculty') {
        return `${CACHE_PREFIX}_${v}_t_${target.faculty.code.toUpperCase()}`;
      }
      return `${CACHE_PREFIX}_${v}_s_${target.section.id}_sub_${target.subSection}`;
    },
    [routineVersion]
  );

  // Stable string primitive representing what routine needs to be fetched
  const activeScheduleKey = useMemo(() => {
    if (!activeTarget) return null;
    return activeTarget.type === 'faculty'
      ? `faculty:${activeTarget.faculty.code.toUpperCase()}`
      : `section:${activeTarget.section.id.toUpperCase()}:${activeTarget.subSection}`;
  }, [activeTarget]);

  // Keep target and reload triggers tracked across renders
  const activeTargetRef = useRef(activeTarget);
  useEffect(() => {
    activeTargetRef.current = activeTarget;
  }, [activeTarget]);

  // Dedicated effect to fetch active event overrides for the selected section or department
  useEffect(() => {
    let isCancelled = false;
    const secId = activeTarget && activeTarget.type === 'section' ? activeTarget.section.id : 'ALL';

    fetch(`/api/events?section=${secId}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((evData) => {
        if (!isCancelled && evData.success && Array.isArray(evData.events)) {
          setEventOverrides(evData.events);
        }
      })
      .catch((err) => {
        console.warn('Failed to load event overrides:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeTarget, reloadTrigger]);

  const lastReloadTriggerRef = useRef(reloadTrigger);

  // Fetch live schedule (both new and previous versions)
  useEffect(() => {
    if (!isInitialized || !hasSavedPreference || !activeScheduleKey || !activeTargetRef.current) {
      return;
    }

    let isCancelled = false;
    const currentTarget = activeTargetRef.current;
    const currentVersion = routineVersion;
    const cacheKey = getCacheKey(currentTarget, currentVersion);
    const isManualReload = lastReloadTriggerRef.current !== reloadTrigger;
    lastReloadTriggerRef.current = reloadTrigger;

    // 1. Try reading cached schedule from localStorage
    let cachedData: { classes: RoutineClass[]; previousClasses?: RoutineClass[]; version?: string } | null = null;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            Array.isArray(parsed.classes) &&
            parsed.classes.length > 0 &&
            Array.isArray(parsed.previousClasses)
          ) {
            const hasLegacyCommonSection =
              currentTarget.type === 'faculty' &&
              parsed.classes.some((c: RoutineClass) => c.sectionId === 'Common');

            if (!hasLegacyCommonSection) {
              cachedData = {
                classes: parsed.classes,
                previousClasses: parsed.previousClasses,
                version: parsed.version || currentVersion,
              };
            }
          }
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }

    // If cached data exists and not manual reload, use cached data
    if (cachedData && !isManualReload) {
      setLiveSchedule(cachedData.classes);
      setSecondaryLiveSchedule(cachedData.previousClasses || []);
      setIsOfflineCached(false);
      setFetchError(false);
      setIsScheduleLoading(false);
      return;
    }

    if (cachedData && isManualReload) {
      setLiveSchedule(cachedData.classes);
      setSecondaryLiveSchedule(cachedData.previousClasses || []);
      setIsScheduleLoading(true);
    } else {
      setLiveSchedule(null);
      setSecondaryLiveSchedule(null);
      setIsScheduleLoading(true);
      setFetchError(false);
      setIsOfflineCached(false);
    }

    const versionParam = `&v=${encodeURIComponent(currentVersion)}`;
    const cacheBuster = isManualReload ? `&t=${Date.now()}` : '';
    const endpoint =
      currentTarget.type === 'faculty'
        ? `/api/schedule?teacher=${encodeURIComponent(currentTarget.faculty.code)}${versionParam}${cacheBuster}`
        : `/api/schedule?section=${currentTarget.section.id}&sub=${currentTarget.subSection}${versionParam}${cacheBuster}`;

    fetch(endpoint, isManualReload ? { cache: 'no-store' } : undefined)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isCancelled && data.success) {
          if (Array.isArray(data.classes)) {
            setLiveSchedule(data.classes);
            setSecondaryLiveSchedule(Array.isArray(data.previousClasses) ? data.previousClasses : []);
            setIsOfflineCached(false);
            setFetchError(false);
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  cacheKey,
                  JSON.stringify({
                    classes: data.classes,
                    previousClasses: data.previousClasses || [],
                    version: data.version || currentVersion,
                    cachedAt: Date.now(),
                  })
                );
                localStorage.setItem(SYNCED_VERSION_KEY, currentVersion);
              }
            } catch {
              // Ignore storage quota errors
            }
          }
          if (data.version && data.version !== routineVersion) {
            setRoutineVersion(data.version);
            if (typeof window !== 'undefined') {
              localStorage.setItem(SYNCED_VERSION_KEY, data.version);
            }
          }
          if (data.faculty && currentTarget.type === 'faculty') {
            setActiveTarget((prev) => {
              if (!prev || prev.type !== 'faculty') return prev;
              const f = prev.faculty;
              const nf = data.faculty;
              if (
                f.phone === nf.phone &&
                f.room === nf.room &&
                f.name === nf.name &&
                f.designation === nf.designation &&
                f.department === nf.department &&
                f.email === nf.email
              ) {
                return prev;
              }
              return { ...prev, faculty: { ...f, ...nf } };
            });
          }
        } else if (!isCancelled && !data.success) {
          throw new Error(data.error || 'Failed to fetch schedule');
        }
      })
      .catch((err) => {
        console.warn('Live routine fetch failed:', err);
        if (!isCancelled) {
          if (cachedData) {
            setIsOfflineCached(true);
            setFetchError(false);
          } else {
            setFetchError(true);
          }
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsScheduleLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeScheduleKey, isInitialized, hasSavedPreference, reloadTrigger, routineVersion, getCacheKey]);

  // Current real schedule (New version)
  const currentSchedule = useMemo(() => {
    if (!hasSavedPreference || !activeTarget) {
      return [];
    }
    return liveSchedule || [];
  }, [hasSavedPreference, activeTarget, liveSchedule]);

  // Secondary real schedule (Previous version)
  const secondarySchedule = useMemo(() => {
    return secondaryLiveSchedule || [];
  }, [secondaryLiveSchedule]);

  // Common gap visualization is removed as per requirements
  const sharedFreeSlotsMap: Record<DayOfWeek, FreeTimeSlot[]> = useMemo(
    () => ({
      SATURDAY: [],
      SUNDAY: [],
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
    }),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#080d1a] dark:text-slate-100 antialiased pb-28 sm:pb-8 print:pb-0 relative transition-colors duration-150">
      {/* Background Ambience */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.06),rgba(14,165,233,0.03),transparent_60%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(16,185,129,0.08),rgba(14,165,233,0.04),transparent_70%)] print:hidden"
        aria-hidden="true"
      />

      {/* Top HUD Navbar */}
      <Navbar
        selectedSection={selectedSection}
        selectedSubSection={selectedSubSection}
        activeTarget={activeTarget}
        compareState={compareState}
        hasSavedPreference={hasSavedPreference}
        onOpenSectionPicker={() => {
          setIsSectionPickerOpen(true);
        }}
        onOpenRoomFinder={() => handleOpenRoomFinder()}
      />

      {/* Official Academic Print Header */}
      <div className="hidden print:block mx-auto max-w-7xl px-4 pt-4 mb-3 border-b-2 border-slate-900 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Daffodil International University
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              Department of Computer Science &amp; Engineering • Class Schedule
            </p>
          </div>
          <div className="text-right font-mono text-xs text-slate-700">
            {activeTarget?.type === 'faculty' ? (
              <>
                <div><strong className="text-slate-900 font-bold">{activeTarget.faculty.name}</strong></div>
                <div>Department: {activeTarget.faculty.department}</div>
                <div>
                  Semester: Fall 2026 • Timezone: Asia/Dhaka (UTC+6) • Routine:{' '}
                  <strong className="font-bold">
                    {versionView === 'both'
                      ? 'Comparison (v4.1 vs Routinly)'
                      : versionView === 'new'
                      ? 'New Routine (Routinly)'
                      : 'Previous Routine (Published v4.1)'}
                  </strong>
                </div>
              </>
            ) : selectedSection ? (
              <>
                <div>Section: <strong className="text-slate-900 font-bold">{selectedSection.id}</strong> ({selectedSection.batch})</div>
                <div>Subgroup: {selectedSubSection === 'all' ? 'All Classes' : `Sub ${selectedSection.sectionLetter}${selectedSubSection}`}</div>
                <div>
                  Semester: Fall 2026 • Timezone: Asia/Dhaka (UTC+6) • Routine:{' '}
                  <strong className="font-bold">
                    {versionView === 'both'
                      ? 'Comparison (v4.1 vs Routinly)'
                      : versionView === 'new'
                      ? 'New Routine (Routinly)'
                      : 'Previous Routine (Published v4.1)'}
                  </strong>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-7xl px-2 sm:px-6 pt-2 sm:pt-4 space-y-3 sm:space-y-4 print:py-0 print:px-2">
        {/* Semantic H1 matching exact title and brand query */}
        <h1 className="sr-only">DIU Routine Calendar Sync | Daffodil International University</h1>

        {/* Offline cached notification banner */}
        {isOfflineCached && (
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                You are currently offline. Showing saved routine for{' '}
                <strong className="font-semibold">
                  {activeTarget?.type === 'faculty' ? activeTarget.faculty.name : activeTarget?.section.id}
                </strong>
                .
              </span>
            </div>
            <button
              onClick={() => setReloadTrigger((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-100 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Fetch failure when no cached routine is available */}
        {fetchError && currentSchedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs my-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <WifiOff className="w-6 h-6" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
              Unable to Load Routine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-5 leading-relaxed">
              We couldn&apos;t reach the server and no previously cached routine was found for this selection. Check your internet connection and try again.
            </p>
            <button
              onClick={() => {
                setFetchError(false);
                setIsScheduleLoading(true);
                setReloadTrigger((prev) => prev + 1);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : !isInitialized || !hasSavedPreference || (isScheduleLoading && currentSchedule.length === 0) ? (
          <TimetableSkeleton viewMode={viewMode} />
        ) : (
          <TimetableGrid
            section={selectedSection}
            subSection={selectedSubSection}
            activeTarget={activeTarget}
            classes={currentSchedule}
            eventOverrides={eventOverrides}
            compareState={compareState}
            secondaryClasses={secondarySchedule}
            sharedFreeSlotsMap={sharedFreeSlotsMap}
            viewMode={viewMode}
            versionView={versionView}
            onVersionViewChange={setVersionView}
            activeDay={activeDay}
            onActiveDayChange={setActiveDay}
            routineVersion={routineVersion}
            onVersionChange={handleSystemWideVersionUpdate}
            onOpenFacultyInfo={handleOpenFacultyInfo}
            onOpenSectionInfo={handleOpenSectionInfo}
          />
        )}
      </main>

      {/* Persistent Mobile Bottom Bar */}
      <StickySyncBar
        section={selectedSection}
        subSection={selectedSubSection}
        activeTarget={activeTarget}
        compareState={compareState}
        hasSavedPreference={hasSavedPreference}
        onOpenSectionPicker={() => {
          setIsSectionPickerOpen(true);
        }}
        onOpenRoomFinder={() => handleOpenRoomFinder()}
      />

      {/* Unified Search Modal for Sections and Teachers */}
      <SectionSelector
        sections={ALL_SECTIONS}
        selectedSection={selectedSection}
        selectedSubSection={selectedSubSection}
        activeTarget={activeTarget}
        onSelectSection={handleSelectSection}
        onSelectSubSection={handleSelectSubSection}
        onSelectFaculty={handleSelectFaculty}
        onOpenRoomFinder={handleOpenRoomFinder}
        isOpen={isSectionPickerOpen}
        onClose={() => {
          setIsSectionPickerOpen(false);
        }}
      />

      {/* Room Finder Modal */}
      <RoomFinderModal
        isOpen={isRoomFinderOpen}
        initialRoom={roomFinderInitialRoom}
        onClose={() => {
          setIsRoomFinderOpen(false);
          setRoomFinderInitialRoom(null);
        }}
        onNavigateToSection={(sectionId) => {
          const sec = getSectionById(sectionId);
          if (sec) {
            handleSelectSection(sec);
          }
        }}
        onNavigateToFaculty={(facultyCode) => {
          const fac = getFacultyByCode(facultyCode);
          if (fac) {
            handleSelectFaculty(fac);
          } else {
            handleSelectFaculty({
              code: facultyCode,
              name: facultyCode,
              department: 'CSE',
            });
          }
        }}
      />

      {/* Faculty Profile Modal */}
      <FacultyInfoModal
        isOpen={isFacultyInfoOpen}
        facultyCode={facultyInfoCode}
        returnSectionId={facultyInfoReturnSection}
        initialFaculty={facultyInfoInitial}
        onClose={() => {
          setIsFacultyInfoOpen(false);
          setFacultyInfoCode(null);
          setFacultyInfoReturnSection(null);
          setFacultyInfoInitial(null);
        }}
        onBackToSection={(sectionId: string) => {
          const sec = getSectionById(sectionId);
          if (sec) {
            handleSelectSection(sec);
          }
        }}
      />

      {/* Section Information Modal */}
      <SectionInfoModal
        isOpen={isSectionInfoOpen}
        sectionId={sectionInfoTargetId}
        onClose={() => {
          setIsSectionInfoOpen(false);
          setSectionInfoTargetId(null);
        }}
        onNavigateToSection={(sec: SectionMeta) => {
          handleSelectSection(sec);
        }}
        onOpenFacultyInfo={(facultyCode: string, initial?: FacultyMeta) => {
          handleOpenFacultyInfo(facultyCode, undefined, initial);
        }}
      />
    </div>
  );
}
