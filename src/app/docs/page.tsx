import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Building2,
  Users,
  Footprints,
  Calendar,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Check,
  Scale,
  ArrowRight,
  TrendingDown,
  Compass,
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Routinly vs Manual v4.1 | Architectural Benchmark & Impact Report',
  description:
    'A side-by-side performance audit between the manual committee routine v4.1 and the Routinly automated solver across 1,637 scheduled university events.',
};

const STATS = [
  {
    hero: '0',
    unit: 'sections',
    metric: '5-Day Weeks',
    previous: '35 in v4.1',
    description: '100% of student sections now attend in 4 days or fewer. Zero 5-day stretches.',
    highlight: '100% <= 4 days',
    accent: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    hero: '0',
    unit: 'clashes',
    metric: 'KT ↔ ANX1 0-Min Sprints',
    previous: '51 in v4.1',
    description: 'Completely eliminated the hazardous 0-minute cross-campus sprint. Every transit is guaranteed buffer time.',
    highlight: '100% resolved',
    accent: 'from-blue-500 to-indigo-500',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    hero: '30%',
    unit: 'fewer',
    metric: 'Student Idle Gaps',
    previous: '369 slots in v4.1',
    description: 'Reduced from 369 to 259 slots. Over 110 wasted campus hours returned to student life.',
    highlight: '-110 idle slots',
    accent: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  {
    hero: '3x',
    unit: 'less',
    metric: 'Vertical Floor Jumping',
    previous: '1.85 floors in v4.1',
    description: 'Average floor displacement in Knowledge Tower drops from 1.85 to 0.63 floors. Human-centric elevator clustering.',
    highlight: '0.63 floor avg',
    accent: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    hero: '100%',
    unit: 'honored',
    metric: 'Faculty Day-Off Requests',
    previous: '18 violations in v4.1',
    description: 'Zero day-off violations. Every single faculty preference and research day respected without exception.',
    highlight: '0 violations',
    accent: 'from-emerald-500 to-green-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    hero: '77%',
    unit: 'relief',
    metric: 'Weekend Split Duty (Sat+Thu)',
    previous: '22 teachers in v4.1',
    description: 'Faculty required to teach on both Thursday and Saturday plummeted from 22 to just 5. Restoring work-life balance.',
    highlight: 'Only 5 teachers',
    accent: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
];

const COMPARISON_ROWS = [
  {
    metric: 'Regular Classes Scheduled',
    subtitle: 'Full curriculum coverage with 0 dropped sessions',
    v41: '1,438 classes',
    routinly: '1,452 classes',
    impact: '100% Complete',
    note: 'Restored 14 dropped/mislabeled classes (69_A CSE215, 72_C CSE114, CSE222, CSE317)',
    winner: 'routinly',
  },
  {
    metric: '5-Day Sections',
    subtitle: 'Sections burdened with 5 active university days per week',
    v41: '35 sections',
    routinly: '0 sections',
    impact: '100% sections <= 4 days',
    note: 'Every single student section has a 3-day weekend or dedicated research day',
    winner: 'routinly',
  },
  {
    metric: 'KT ↔ ANX1 Zero-Minute Rush',
    subtitle: 'Back-to-back classes across campus with 0-minute travel buffer',
    v41: '51 clashes',
    routinly: '0 clashes',
    impact: '100% eliminated',
    note: 'Mandatory 1-slot travel buffer enforced for cross-campus transitions',
    winner: 'routinly',
  },
  {
    metric: 'Student Idle Gap Slots',
    subtitle: 'Empty 1.5h windows where students are stranded waiting on campus',
    v41: '369 slots',
    routinly: '259 slots',
    impact: '30% fewer gaps (-110)',
    note: 'Compact daily schedule; students attend continuous learning blocks',
    winner: 'routinly',
  },
  {
    metric: 'Teacher Idle Gap Slots',
    subtitle: 'Unusable free windows between lectures for faculty',
    v41: '509 slots',
    routinly: '396 slots',
    impact: '22% fewer gaps (-113)',
    note: 'Faculty time consolidated, enabling uninterrupted research blocks',
    winner: 'routinly',
  },
  {
    metric: 'Faculty Day-Off Violations',
    subtitle: 'Classes scheduled on a professor designated official day off',
    v41: '18 violations',
    routinly: '0 violations',
    impact: '100% requests respected',
    note: 'Hard constraint enforced with zero overrides',
    winner: 'routinly',
  },
  {
    metric: 'Saturday + Thursday Split Duty',
    subtitle: 'Teachers forced to work both ends of the academic week',
    v41: '22 teachers',
    routinly: '5 teachers',
    impact: '77% fewer weekend duties',
    note: 'Only 5 teachers assigned both days, down from 22',
    winner: 'routinly',
  },
  {
    metric: 'Knowledge Tower Floor Displacement',
    subtitle: 'Average floor jumps between consecutive classes in KT',
    v41: '1.85 floors',
    routinly: '0.63 floors',
    impact: '3x less elevator travel',
    note: 'Classes clustered by floor; massive reduction in elevator queue congestion',
    winner: 'routinly',
  },
  {
    metric: 'Lab & Policy Violations',
    subtitle: 'Physics, Hardware, Embedded, CSE112 split & Annex-1 rules',
    v41: '8 policy errors',
    routinly: '0 errors',
    impact: '100% compliant',
    note: 'Every departmental and specialized lab rule strictly satisfied',
    winner: 'routinly',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060a14] dark:text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200">
      {/* Background Ambience */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.1),rgba(16,185,129,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(59,130,246,0.14),rgba(16,185,129,0.08),transparent_75%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Interactive Timetable</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Fall 2026 Audit</span>
            </span>
          </div>
        </header>

        {/* Hero Section — Apple Keynote Style */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>The Routinly Architectural Report</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Engineered to perfection.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Zero compromises.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            A side-by-side performance audit between the manual Routine Committee <strong className="font-semibold text-slate-900 dark:text-white">v4.1</strong> and the <strong className="font-semibold text-blue-600 dark:text-blue-400">Routinly Automated Solver</strong> across all 1,637 university events.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/?version_view=both"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Explore Comparison Grid</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/?version_view=new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <span>View New Routine Only</span>
            </Link>
          </div>
        </section>

        {/* Big Apple-Style Bento Number Cards */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Keynote Benchmarks
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              By the numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c1220]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle Gradient Accent */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.accent} opacity-5 group-hover:opacity-15 blur-2xl transition-opacity pointer-events-none`}
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                      {stat.metric}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${stat.badgeBg}`}
                    >
                      {stat.highlight}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                        {stat.hero}
                      </span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {stat.unit}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      was <span className="line-through">{stat.previous}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Comparative Pro Audit Table */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Side-by-Side Audit
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Every detail examined.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Direct metric comparison between Published Committee Routine (v4.1) and Routinly Solver.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0c1220]/80 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-[#080d1a]/80 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th scope="col" className="p-4 sm:p-5 font-semibold">Constraint / Metric</th>
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400">
                      v4.1 Committee
                    </th>
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-blue-600 dark:text-blue-400">
                      Routinly Solver
                    </th>
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-slate-700 dark:text-slate-200">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {row.metric}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs sm:max-w-md">
                          {row.subtitle}
                        </div>
                      </td>

                      <td className="p-4 sm:p-5 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                          {row.v41}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5 font-mono text-xs font-bold whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Check className="w-3 h-3 text-blue-500 shrink-0" />
                          <span>{row.routinly}</span>
                        </span>
                      </td>

                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                          {row.impact}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          {row.note}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4 Apple-Style Deep Dive Feature Columns */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Architectural Pillars
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why this routine changes everything.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1220]/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                100% of Sections in 4 Days or Less
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                In v4.1, 35 sections were stretched across 5 days, forcing students to commute every single day often for a single 1.5-hour class. Routinly mathematically eliminates this: every batch, section, and subsection completes their coursework in 4 days or less, unlocking guaranteed 3-day weekends or dedicated research/study days.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1220]/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero KT ↔ ANX1 Zero-Minute Campus Sprints
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Knowledge Tower and Annex-1 are separated by considerable campus distance. v4.1 contained 51 severe zero-minute clashes where students and teachers were expected to teleport across campus instantly. Routinly enforces a strict minimum 1-slot travel buffer for every building change.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1220]/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Floor Clustering: 3x Less Elevator Strain
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Elevator bottlenecks in the Knowledge Tower create massive hallway congestion between classes. In Routinly, transition floor jumps average just 0.63 floors per class (down from 1.85 floors), clustering consecutive sessions on the same or adjacent floors so stairs are effortless.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1220]/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Automated Solver: New Routines in 5 Minutes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Rather than spending weeks manually tweaking cells in Excel and inevitably introducing human error, the entire university schedule of 1,637 classes can be regenerated under any arbitrary departmental rules or constraints in under 5 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Executive Summary in Bengali (সারসংক্ষেপ) */}
        <section className="rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-[#0a1226]/60 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Executive Summary (সারসংক্ষেপ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আমাদের অটোমেটেড সলভার দিয়ে Fall 2026-এর সম্পূর্ণ রুটিন (1,637 ইভেন্ট) প্রস্তুত করা হয়েছে।
              </p>
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-2 sm:pl-3 border-l-2 border-blue-500/40">
            <p>
              <strong className="text-slate-900 dark:text-white font-semibold">১. ১০০% রুল পরিপালন:</strong> কমিটির দেওয়া সব নীতিমালা (Physics/Hardware/Embedded Lab, CSE112 split, ANX1 transit rule, Teacher Day-off) শতভাগ মানা হয়েছে এবং পাবলিশড রিটেক ক্লাসগুলো পূর্বনির্ধারিত স্লটেই অবিকৃতভাবে লক রাখা হয়েছে।
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white font-semibold">২. সব বাদ পড়া ক্লাস উদ্ধার:</strong> v4.1-এ যে ক্লাসগুলো অসাবধানতাবশত বাদ পড়েছিল বা মিস-লেবেল হয়েছিল (যেমন 69_A-তে CSE215, 72_C-তে CSE114 lab, CSE222, CSE317 ইত্যাদি), সেগুলো কোনোপ্রকার ব্যতিক্রম (exceptions) যোগ না করেই সঠিকভাবে অন্তর্ভুক্ত করা হয়েছে।
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white font-semibold">৩. ৫ মিনিটে সম্পূর্ণ পরিবর্তনযোগ্য:</strong> পুরো ইঞ্জিনটি ১০০% কাস্টমাইজযোগ্য—ভবিষ্যতে যেকোনো নতুন শর্ত বা সীমাবদ্ধতা প্রদান করলে মাত্র ৫ মিনিটের মধ্যে নতুন সুবিন্যস্ত রুটিন স্বয়ংক্রিয়ভাবে জেনারেট করা সম্ভব।
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center pt-8 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Experience the difference live.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Switch between the Previous (v4.1) and New (Routinly) routines right inside the interactive timetable grid.
          </p>
          <div className="pt-2">
            <Link
              href="/?version_view=both"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Open Timetable Comparison View</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
