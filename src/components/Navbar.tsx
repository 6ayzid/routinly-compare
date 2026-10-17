'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Calendar,
  BookOpen,
  Plus,
  X,
  DoorOpen,
  Search,
} from 'lucide-react';
import { SectionMeta, ActiveRoutineTarget, CompareState } from '@/types/schedule';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getTargetLabel } from '@/lib/compare-utils';
import { Tooltip } from '@/components/ui/Tooltip';

interface NavbarProps {
  selectedSection?: SectionMeta | null;
  selectedSubSection?: '1' | '2' | 'all';
  activeTarget?: ActiveRoutineTarget | null;
  compareState?: CompareState;
  hasSavedPreference?: boolean;
  onOpenSectionPicker: () => void;
  onOpenComparePicker?: () => void;
  onRemoveCompare?: () => void;
  onOpenRoomFinder?: () => void;
}

export function Navbar({
  selectedSection,
  selectedSubSection,
  activeTarget,
  hasSavedPreference = true,
  onOpenSectionPicker,
  onOpenRoomFinder,
}: NavbarProps) {
  const isFaculty = activeTarget?.type === 'faculty';
  const faculty = isFaculty ? activeTarget.faculty : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md transition-colors print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 gap-2">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-emerald-50 text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold tracking-tight text-slate-900 dark:text-white text-xs sm:text-base truncate block">
              DIU Routine
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block font-mono">
              CSE Department
            </span>
          </div>
        </Link>

        {/* Center: Section / Faculty Selector HUD Pill */}
        <div className="hidden sm:flex items-center gap-1.5">
          {hasSavedPreference ? (
            <button
              type="button"
              onClick={onOpenSectionPicker}
              aria-label={
                isFaculty && faculty
                  ? `Search and change routine target, currently Faculty ${faculty.name} (${faculty.code})`
                  : `Search and change academic section, currently ${selectedSection?.displayName || 'none'}`
              }
              title="Search & change routine (Click to open)"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200/80 hover:border-emerald-400/60 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 dark:hover:border-emerald-500/50 px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer min-h-[40px] group shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 shrink-0 transition-colors" />

              {isFaculty && faculty ? (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-slate-400 font-sans hidden md:inline">Faculty:</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 border border-emerald-300/80 dark:border-emerald-600/50 px-2 py-0.5 rounded shadow-2xs">
                    {faculty.code}
                  </strong>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-slate-400 font-sans hidden md:inline">Section:</span>
                  <strong className="text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded shadow-2xs">
                    {selectedSection?.id || '—'}
                  </strong>
                  {selectedSubSection !== 'all' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      • Lab {selectedSubSection}
                    </span>
                  )}
                </div>
              )}

              <span className="text-[10px] font-sans font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800/80">
                Change
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSectionPicker}
              aria-label="Search section or teacher"
              className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 px-3 py-1.5 transition-colors cursor-pointer min-h-[40px] text-emerald-800 dark:text-emerald-300 font-semibold text-xs group shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Search Section</span>
            </button>
          )}
        </div>

        {/* Right: Rooms, Docs Link, Theme Toggle & 1-Tap Sync */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Room Finder Button - Hidden on mobile where StickySyncBar dock has it, visible from sm up */}
          {onOpenRoomFinder && (
            <Tooltip content="Find empty rooms & room occupancy" side="bottom">
              <button
                type="button"
                onClick={onOpenRoomFinder}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-xl px-2 lg:px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors min-h-[36px] cursor-pointer"
                aria-label="Find empty rooms"
              >
                <DoorOpen className="h-4 w-4 shrink-0" />
                <span className="hidden lg:inline">Rooms</span>
              </button>
            </Tooltip>
          )}

          {/* Docs / Guide Link */}
          {/* Optimization Report & Benchmark Link */}
          <Link
            href="/docs"
            prefetch={true}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-xl px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 transition-colors min-h-[36px] border border-slate-200 dark:border-slate-700 shadow-2xs"
            aria-label="View Routinly Optimization Report and Benchmarks"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">Stats &amp; Report</span>
          </Link>

          {/* Theme Mode Toggle (Light / System / Dark) */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
