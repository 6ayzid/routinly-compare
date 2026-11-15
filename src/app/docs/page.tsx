import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Minus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Routinly vs. Official V5.1 | Schedule Architecture Report',
  description:
    'A verified comparison between the Department of CSE Official Routine V5.1 (8 Nov 2026) and the Routinly CP-SAT solver.',
};

const HEADLINE_METRICS = [
  {
    value: '0',
    label: 'Student Idle Gaps',
    baseline: '297 slot-units in V5.1',
    detail: 'Every section’s daily classes are packed into contiguous blocks.',
  },
  {
    value: '0',
    label: 'Cross-Campus Sprints',
    baseline: '80 violations in V5.1',
    detail: '1-slot transit buffer enforced between KT and ANX1.',
  },
  {
    value: '0',
    label: 'Faculty Off-Day Violations',
    baseline: '27 violations in V5.1',
    detail: 'Every requested faculty off-day is respected.',
  },
  {
    value: '0',
    label: 'Room Capacity Mismatches',
    baseline: '152 violations in V5.1',
    detail: 'Every theory and lab group fits its assigned room.',
  },
  {
    value: '8',
    label: 'Teacher Idle Gaps',
    baseline: '505 slot-units in V5.1',
    detail: '98.4% reduction in faculty waiting time between classes.',
  },
  {
    value: '0',
    label: '3+ Floor Jumps (KT)',
    baseline: '78 jumps in V5.1',
    detail: 'Consecutive classes are clustered on adjacent floors.',
  },
];

const COMPARISON_ROWS = [
  { metric: 'Room Double-Bookings', v51: '0', routinly: '0', status: 'pass' },
  { metric: 'Teacher Double-Bookings', v51: '0', routinly: '0', status: 'pass' },
  { metric: 'Section / Group Overlaps', v51: '0', routinly: '0', status: 'pass' },
  { metric: 'Theory in Basement Labs (G1-001..022 / CTBA-01)', v51: '0', routinly: '0', status: 'pass' },
  { metric: 'Unmerged Retakes Scheduled', v51: '184 / 184', routinly: '184 / 184', status: 'pass' },
  { metric: 'KT ↔ ANX1 Transit Buffer Violations', v51: '80', routinly: '0', status: 'improved' },
  { metric: 'Teacher Explicit Off-Day Violations', v51: '27', routinly: '0', status: 'improved' },
  { metric: 'Room Capacity vs. Group Size Violations', v51: '152', routinly: '0', status: 'improved' },
  { metric: 'Same Course Twice in One Day', v51: '301', routinly: '0', status: 'improved' },
  { metric: 'ANX1 Exclusivity Violations', v51: '7', routinly: '0', status: 'improved' },
  { metric: 'CSE112 Meeting Rule Violations', v51: '17', routinly: '0', status: 'improved' },
  { metric: 'Student Idle Gap Units', v51: '297', routinly: '0', status: 'improved' },
  { metric: 'Teacher Idle Gap Units', v51: '505', routinly: '8', status: 'improved' },
  { metric: 'Teachers Active Both Sat & Thu', v51: '22 / 195', routinly: '0 / 195', status: 'improved' },
  { metric: 'Teachers With No Day Off (6 Days)', v51: '1 / 195', routinly: '0 / 195', status: 'improved' },
  { metric: 'KT Consecutive 3+ Floor Jumps', v51: '78', routinly: '0', status: 'improved' },
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
            Fall 2026 · CSE Department
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
            Zero hard conflicts.
            <br />
            Zero student gaps.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            An independent, constraint-by-constraint audit comparing the published{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-200">
              Official Routine V5.1
            </span>{' '}
            (effective 8 November 2026) against the latest{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-200">
              Routinly
            </span>{' '}
            CP-SAT schedule.
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
              Verified with <code className="font-mono text-xs">verify_schedule.py</code>
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
                Constraint Audit
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Direct evaluation against the Fall 2026 departmental specification.
              </p>
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Lower is better for all violation and gap metrics
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
                    Routinly
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
                How Routinly Solves It
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Instead of placing courses greedily one by one, Routinly compiles
                the entire department’s rooms, faculty availability, retake
                merges, and campus transit rules into a two-stage CP-SAT
                optimization model—guaranteeing hard-constraint feasibility
                before minimizing student and faculty idle gaps.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                Room Classification Note
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Basement rooms <code className="font-mono text-xs">G1-026</code>{' '}
                and <code className="font-mono text-xs">G1-027</code> are
                classified as theory rooms, while{' '}
                <code className="font-mono text-xs">G1-001..022</code> and{' '}
                <code className="font-mono text-xs">CTBA-01</code> remain
                strictly reserved for lab sessions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
