import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Minus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Routinly vs. Official V5.1 | Schedule Verification Report',
  description:
    'A verified constraint-by-constraint comparison between the Department of CSE Official Routine V5.1 (8 Nov 2026) and the Routinly CP-SAT solver.',
};

const HEADLINE_METRICS = [
  {
    value: '0',
    label: 'Hard Constraint Violations',
    baseline: '93 errors in Official V5.1',
    detail: 'All 15 hard checks pass cleanly in verify_schedule.py across 1,637 scheduled events.',
  },
  {
    value: '0',
    label: 'Student Overload Days',
    baseline: '6 subsection-days ≥ 5 slots in V5.1',
    detail: 'No individual subsection (e.g. 66_O1, 66_O2) attends more than 4 slots (6 hours) in a single day.',
  },
  {
    value: '100%',
    label: 'Subsections on ≤ 4-Day Weeks',
    baseline: '80.2% (219 / 273) in Official V5.1',
    detail: 'All 275 subsections attend ≤ 4 days/week (54 subsections attend 5 days in V5.1).',
  },
  {
    value: '-28.4%',
    label: 'Regular Teacher Idle Gaps',
    baseline: '429 regular (505 all) units in V5.1',
    detail: 'Drops to 307 regular (391 all) gap units while honoring 100% of regular off-days.',
  },
  {
    value: '-58.3%',
    label: '3+ Floor Jumps (KT)',
    baseline: '175 jumps (1.42 avg) in V5.1',
    detail: 'Reduced to 73 jumps (0.57 avg), with 662 same-floor back-to-back transitions.',
  },
  {
    value: '0',
    label: '6-Day Faculty Schedules',
    baseline: '1 teacher on all 6 days in V5.1',
    detail: 'Every faculty member gets at least one full day off, with Sat+Thu splits cut 22 → 8.',
  },
];

const COMPARISON_ROWS = [
  { metric: 'Scheduled Events', v51: '1,629', routinly: '1,637', status: 'neutral' },
  { metric: 'Room Double-Bookings', v51: '0', routinly: '0', status: 'neutral' },
  { metric: 'Teacher Double-Bookings', v51: '0', routinly: '0', status: 'neutral' },
  { metric: 'Section / Group Overlaps', v51: '0', routinly: '0', status: 'neutral' },
  { metric: 'KT ↔ ANX1 Transit Violations (verify_schedule)', v51: '82', routinly: '0', status: 'improved' },
  { metric: 'Teacher Explicit Off-Day Violations', v51: '22', routinly: '0', status: 'improved' },
  { metric: 'ANX1 Exclusivity Violations', v51: '6', routinly: '0', status: 'improved' },
  { metric: 'Theory in Basement Labs (G1-001..022 / CTBA-01)', v51: '4', routinly: '0', status: 'improved' },
  { metric: 'CSE112 Meeting Rule Violations', v51: '4', routinly: '0', status: 'improved' },
  { metric: 'Room Capacity vs. Group Size Violations', v51: '3', routinly: '0', status: 'improved' },
  { metric: 'Same Course Twice in One Day', v51: '2', routinly: '0', status: 'improved' },
  { metric: 'Required Weekly Meetings Mismatches', v51: '8', routinly: '0', status: 'improved' },
  { metric: 'Subsection Student Gap Units (Lab 1 + Lab 2, metrics.py)', v51: '651', routinly: '618', status: 'improved' },
  { metric: 'Parent Section Union Gaps (metrics.py)', v51: '375', routinly: '322', status: 'improved' },
  { metric: 'Teacher Idle Gap Units (All / Regular)', v51: '505 / 429', routinly: '391 / 307', status: 'improved' },
  { metric: 'Subsections Attending ≤ 4 Days / Week', v51: '219 / 273 (80.2%)', routinly: '275 / 275 (100.0%)', status: 'improved' },
  { metric: 'Subsections Attending 5 Days / Week', v51: '54', routinly: '0', status: 'improved' },
  { metric: 'Subsection-Days ≥ 5 Slots', v51: '6', routinly: '0', status: 'improved' },
  { metric: 'Teachers Active Both Sat & Thu', v51: '22 / 195', routinly: '8 / 194', status: 'improved' },
  { metric: 'Teachers With No Day Off (6 Days)', v51: '1 / 195', routinly: '0 / 194', status: 'improved' },
  { metric: 'KT 3+ Floor Jumps (metrics.py)', v51: '175 (1.42 avg)', routinly: '73 (0.57 avg)', status: 'improved' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Timetable</span>
          </Link>
          <span className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Fall 2026 · Dept. of CSE
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            Schedule Verification Report
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-6xl sm:leading-[1.05]">
            Zero hard errors.
            <br />
            Zero overload days.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            An independent, constraint-by-constraint evaluation comparing the{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-200">
              Official Routine V5.1
            </span>{' '}
            (8 November 2026, 1,629 events) against the{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-200">
              Routinly v1.5
            </span>{' '}
            CP-SAT schedule (seed 2026, 1,637 events).
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              <span>Compare in Timetable</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Audited by <code className="font-mono text-xs">verify_schedule.py</code> &amp;{' '}
              <code className="font-mono text-xs">metrics.py</code>
            </span>
          </div>
        </section>

        {/* Headline Metrics Grid */}
        <section className="mt-24">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {HEADLINE_METRICS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between bg-white p-8 dark:bg-zinc-950"
              >
                <div>
                  <div className="text-4xl font-semibold tracking-tight tabular-nums text-zinc-950 dark:text-white sm:text-5xl">
                    {item.value}
                  </div>
                  <div className="mt-3 text-base font-medium text-zinc-950 dark:text-zinc-100">
                    {item.label}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {item.detail}
                  </p>
                </div>
                <div className="mt-6 border-t border-black/5 pt-4 text-xs font-medium text-zinc-400 dark:border-white/5 dark:text-zinc-500">
                  {item.baseline}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Comparison Table */}
        <section className="mt-24">
          <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                Constraint &amp; Quality Audit
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Measured identically against the Fall 2026 departmental specification.
              </p>
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              0 violations required on all hard constraints
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Constraint / Metric
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Official V5.1
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-zinc-950 dark:text-white">
                    Routinly v1.5
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.metric}
                    className="bg-white transition-colors hover:bg-zinc-50/70 dark:bg-black dark:hover:bg-zinc-950"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                      {row.v51}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums font-semibold text-zinc-950 dark:text-white">
                      <span className="inline-flex items-center justify-end gap-1.5">
                        {row.routinly}
                        {row.status === 'improved' ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Architecture Note */}
        <section className="mt-24 border-t border-black/10 pt-12 dark:border-white/10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                Two-Phase Optimization
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Instead of placing courses greedily, Routinly compiles rooms,
                faculty off-days, retake merges, subsection lab splits, and KT ↔ ANX1
                transit buffers into a two-phase CP-SAT model—proving global
                feasibility across all 1,637 classes before minimizing student gaps,
                teacher idle time, and elevator transitions.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                Room Classification
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Basement rooms <code className="font-mono text-xs">G1-026</code>{' '}
                and <code className="font-mono text-xs">G1-027</code> are modeled
                as basement theory classrooms, while{' '}
                <code className="font-mono text-xs">G1-001..022</code> and{' '}
                <code className="font-mono text-xs">CTBA-01</code> remain
                strictly reserved for laboratory sessions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
