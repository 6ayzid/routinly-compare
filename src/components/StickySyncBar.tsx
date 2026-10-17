'use client';

import React from 'react';
import Link from 'next/link';
import { DoorOpen, Search, BookOpen } from 'lucide-react';
import { SectionMeta, ActiveRoutineTarget, CompareState } from '@/types/schedule';

interface StickySyncBarProps {
  section?: SectionMeta | null;
  subSection?: '1' | '2' | 'all';
  activeTarget?: ActiveRoutineTarget | null;
  compareState?: CompareState;
  hasSavedPreference?: boolean;
  onOpenSectionPicker: () => void;
  onOpenComparePicker?: () => void;
  onOpenRoomFinder?: () => void;
}

export function StickySyncBar({
  section,
  subSection,
  activeTarget,
  compareState,
  hasSavedPreference = true,
  onOpenSectionPicker,
  onOpenComparePicker,
  onOpenRoomFinder,
}: StickySyncBarProps) {
  const isFaculty = activeTarget?.type === 'faculty';
  const faculty = isFaculty ? activeTarget.faculty : null;
  const isComparing = Boolean(compareState?.active);

  return (
    <aside
      aria-label="Quick Section and Subscription Controller"
      className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-lg print:hidden sm:hidden"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
    >
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 px-3 shadow-xl backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/95">
        {/* Left: Active Section / Faculty Trigger (Search Box Style) */}
        <button
          type="button"
          onClick={onOpenSectionPicker}
          aria-label={
            !hasSavedPreference
              ? 'Search section or teacher'
              : isFaculty && faculty
              ? `Search and change routine target, currently Faculty ${faculty.name} (${faculty.code})`
              : `Search and change academic section, currently ${section?.displayName || 'section'}`
          }
          className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-100/90 hover:bg-slate-200/80 hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:bg-slate-800 px-2.5 py-1.5 transition-all cursor-pointer text-left min-h-[38px] min-w-0 flex-1 group shadow-2xs"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 shrink-0 transition-colors" />

          <div className="flex items-center gap-1.5 font-mono truncate min-w-0 flex-1">
            {!hasSavedPreference ? (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-sans truncate">
                Search Section / Teacher...
              </span>
            ) : isFaculty && faculty ? (
              <div className="flex items-center gap-1 font-mono truncate">
                <span className="rounded bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 text-xs font-bold text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-600/50 dark:text-emerald-300">
                  {faculty.code}
                </span>
                <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 hidden xs:inline">
                  Faculty
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 font-mono truncate">
                <span className="rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 text-xs font-bold text-slate-900 dark:text-white shadow-2xs">
                  {section?.id || '—'}
                </span>
                {subSection !== 'all' && (
                  <span className="rounded bg-emerald-100 border border-emerald-300 px-1 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300">
                    Lab {subSection}
                  </span>
                )}
              </div>
            )}
          </div>

          <span className="text-[11px] font-sans font-medium text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-colors">
            Change
          </span>
        </button>

        {/* Right: Rooms, Compare & Sync Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Room Finder */}
          {onOpenRoomFinder && (
            <button
              type="button"
              onClick={onOpenRoomFinder}
              aria-label="Find empty rooms"
              className="flex items-center justify-center h-[38px] w-[38px] rounded-xl border border-slate-200 bg-slate-100/80 text-slate-600 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              title="Find empty rooms"
            >
              <DoorOpen className="h-4 w-4" />
            </button>
          )}

          {/* Optimization Report & Benchmark Link */}
          <Link
            href="/docs"
            aria-label="View Routinly Optimization Report and Benchmarks"
            className="flex items-center gap-1.5 h-[38px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400 dark:text-blue-600" />
            <span>Report</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
