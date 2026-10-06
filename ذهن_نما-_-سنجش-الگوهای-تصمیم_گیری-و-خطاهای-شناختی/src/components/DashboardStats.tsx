import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Puzzle,
  Play,
  Target,
  Layers,
  Trophy,
  Flame,
  Brain,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Users,
  HeartHandshake,
  Gauge,
  Compass,
  Swords,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserProfile, FamilyId } from '../types';
import { ALL_QUESTIONS, FAMILY_METADATA } from '../data/questionBank';
import { getDetailedDatabaseBreakdown } from '../data/databaseEngine';
import { computeProfileDashboardStats } from '../analytics/profileEngine';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface DashboardStatsProps {
  profile: UserProfile;
  onOpenLevelModal?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  profile,
  onOpenLevelModal,
}) => {
  // Category breakdown tabs for Total Puzzles
  const [activeCategoryTab, setActiveCategoryTab] = useState<'styles' | 'chambers' | 'difficulty'>('styles');
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState<boolean>(true);

  // Compute stats directly from ProfileEngine
  const stats = computeProfileDashboardStats(profile);
  const dbBreakdown = getDetailedDatabaseBreakdown();

  const familyIcons: Record<FamilyId, React.ElementType> = {
    cognitive_reflection: Brain,
    cognitive_biases: ShieldCheck,
    cognitive_flexibility: RefreshCw,
    risk_ambiguity: Target,
    social_inference: Users,
    emotion_inference: HeartHandshake,
    metacognition: Gauge,
    reasoning_patterns: Compass,
  };

  const { cognitiveBiases, memoryGames, logicalAnalysis } = stats.categories;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="dashboard-stats-card relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 lg:p-8 shadow-xl space-y-6 sm:space-y-7"
    >
      {/* Decorative Ambient Glows */}
      <div className="absolute -top-14 -right-14 w-52 h-52 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-14 -left-14 w-52 h-52 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* ======================================================== */}
      {/* TOP HEADER BAR: Player Identity, Rank, XP & Streaks      */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10">
        <button
          onClick={() => {
            sounds.playTap();
            haptics.tap();
            onOpenLevelModal?.();
          }}
          className="flex items-center gap-3 text-right group hover:opacity-90 transition-all focus:outline-none"
          title="مشاهده تالار مدارج شناختی و پیشرفت سطح"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all shadow-xs">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                {profile.levelTitleFa}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                سطح {profile.level}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono mt-0.5">
              {stats.totalXp} XP اندوخته
            </span>
          </div>
        </button>

        {/* Daily Streak & Survival Best Badge */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold shadow-2xs"
            title="زنجیره روزهای متوالی فعالیت"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="tabular-nums font-black text-sm">{stats.streak}</span>
            <span className="text-[10px] text-orange-500/80">روز</span>
          </div>
          {stats.bestSurvivalStreak ? (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold shadow-2xs"
              title="رکورد ماراتن بقا"
            >
              <Zap className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="tabular-nums font-black text-sm">{stats.bestSurvivalStreak}🔥</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TWO-COLUMN LAYOUT: PLAYED GAMES VS TOTAL PUZZLES         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 lg:gap-8 items-start relative z-10">

        {/* ------------------------------------------------------ */}
        {/* COLUMN 1: PLAYED GAMES & PROFILE CATEGORY BREAKDOWNS   */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-4 sm:space-y-5">
          {/* Column 1 Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0 shadow-2xs">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  کارنامه بازی‌های انجام‌شده
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  آمار عملکرد شخصی شما
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/25 tabular-nums">
              {stats.totalGames > 0 ? `${stats.totalGames} بازی انجام‌شده` : 'آماده نخستین بازی'}
            </span>
          </div>

          {/* Core Player Performance Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Card 1: Total Games */}
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-center transition-all hover:border-amber-500/40 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 font-bold mb-1">
                <Play className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>بازی‌ها</span>
              </div>
              <strong className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums block tracking-tight">
                {stats.totalGames}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
                {stats.totalGames === 0 ? 'شروع کن' : `${stats.correctCount} پیروزی بر تله`}
              </span>
            </div>

            {/* Card 2: Answered Questions */}
            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-center transition-all hover:border-emerald-500/40 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>حل‌شده</span>
              </div>
              <strong className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums block tracking-tight">
                {stats.uniqueQuestionsAnswered}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
                {stats.overallCoveragePercent}٪ پوشش کل
              </span>
            </div>

            {/* Card 3: Analytical Accuracy */}
            <div className="p-3 sm:p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-950/20 border border-sky-500/20 text-center transition-all hover:border-sky-500/40 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[10px] text-sky-700 dark:text-sky-300 font-bold mb-1">
                <Target className="w-3 h-3 text-sky-500" />
                <span>دقت تحلیلی</span>
              </div>
              <strong className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 tabular-nums block tracking-tight">
                {stats.totalGames > 0 ? `${stats.accuracyRate}٪` : '---'}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
                {stats.completedMissions} مأموریت فتح‌شده
              </span>
            </div>
          </div>

          {/* ProfileEngine Category Breakdown Cards */}
          <div className="space-y-3 pt-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block px-1">
              تفکیک عملکرد بر پایه دسته‌های شناختی:
            </span>

            {/* Category 1: خطاهای شناختی */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500/35 transition-all shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {cognitiveBiases.nameFa}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {cognitiveBiases.tagFa}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {cognitiveBiases.playedCount > 0 ? `${cognitiveBiases.accuracyRate}٪ دقت` : 'بدون بازی'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                    {cognitiveBiases.playedCount} اجرا • {cognitiveBiases.uniqueAnsweredCount} حل‌شده
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(cognitiveBiases.coveragePercent, cognitiveBiases.playedCount > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>

            {/* Category 2: بازی‌های حافظه و انعطاف */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-500/35 transition-all shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {memoryGames.nameFa}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {memoryGames.tagFa}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {memoryGames.playedCount > 0 ? `${memoryGames.accuracyRate}٪ دقت` : 'بدون بازی'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                    {memoryGames.playedCount} اجرا • {memoryGames.uniqueAnsweredCount} حل‌شده
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(memoryGames.coveragePercent, memoryGames.playedCount > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>

            {/* Category 3: تحلیل منطقی و بازتاب تفکر */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/35 transition-all shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {logicalAnalysis.nameFa}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {logicalAnalysis.tagFa}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {logicalAnalysis.playedCount > 0 ? `${logicalAnalysis.accuracyRate}٪ دقت` : 'بدون بازی'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                    {logicalAnalysis.playedCount} اجرا • {logicalAnalysis.uniqueAnsweredCount} حل‌شده
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(logicalAnalysis.coveragePercent, logicalAnalysis.playedCount > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* COLUMN 2: TOTAL PUZZLES & DATABASE CATEGORY ATLAS      */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-4 sm:space-y-5">
          {/* Column 2 Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-500 flex items-center justify-center shrink-0 shadow-2xs">
                <Puzzle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  کل معماها و دسته‌بندی‌ها
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  مخزن کالیبره‌شده سوالات بازی
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/25 tabular-nums">
                {stats.totalPuzzlesAvailable} معما در کل
              </span>
              <button
                onClick={() => {
                  sounds.playTap();
                  haptics.tap();
                  setIsBreakdownExpanded((prev) => !prev);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                title={isBreakdownExpanded ? 'بستن تفکیک دسته‌ها' : 'مشاهده تفکیک دسته‌ها'}
              >
                {isBreakdownExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Database Atlas Highlight Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider block">
                مخزن پرونده‌های شناختی (۱۰ برابر گسترش‌یافته)
              </span>
              <strong className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {stats.totalPuzzlesAvailable}{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">معمای کالیبره‌شده</span>
              </strong>
            </div>
            <div className="text-left text-[11px] text-slate-500 dark:text-slate-400 font-medium space-y-0.5">
              <div>۴ سبک بازی</div>
              <div>۸ تالار تخصصی</div>
              <div>۳ سطح دشواری</div>
            </div>
          </div>

          {/* Tab Selector with Generous Padding & Whitespace */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 text-xs font-bold">
            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                setActiveCategoryTab('styles');
                if (!isBreakdownExpanded) setIsBreakdownExpanded(true);
              }}
              className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs ${
                activeCategoryTab === 'styles'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-black shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>سبک‌های بازی (۴)</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                setActiveCategoryTab('chambers');
                if (!isBreakdownExpanded) setIsBreakdownExpanded(true);
              }}
              className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs ${
                activeCategoryTab === 'chambers'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-black shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>اتاق‌های ذهن (۸)</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                setActiveCategoryTab('difficulty');
                if (!isBreakdownExpanded) setIsBreakdownExpanded(true);
              }}
              className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px] sm:text-xs ${
                activeCategoryTab === 'difficulty'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-black shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>سطح دشواری (۳)</span>
            </button>
          </div>

          {/* Dynamic Category Panels */}
          <AnimatePresence mode="wait">
            {isBreakdownExpanded && (
              <motion.div
                key={activeCategoryTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pt-1"
              >
                {/* TAB 1: سبک‌های بازی (Game Styles) */}
                {activeCategoryTab === 'styles' && (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {/* Style 1: Adaptive Puzzles */}
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between group hover:border-amber-500/40 transition-colors shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                          <Brain className="w-3 h-3" />
                        </div>
                        <span className="font-bold truncate">معماهای هوشمند</span>
                      </div>
                      <strong className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
                        {dbBreakdown.gameStyles.adaptivePuzzles}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">معما</span>
                      </strong>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block mt-1 truncate">
                        تطبیقی سیستم ۱ و ۲
                      </span>
                    </div>

                    {/* Style 2: Survival Marathon */}
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between group hover:border-rose-500/40 transition-colors shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <div className="w-5 h-5 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span className="font-bold truncate">ماراتن بقا</span>
                      </div>
                      <strong className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums">
                        {dbBreakdown.gameStyles.survivalChambers}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">معما</span>
                      </strong>
                      <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium block mt-1 truncate">
                        ۱۴ ثانیه / ۳ جان
                      </span>
                    </div>

                    {/* Style 3: 2-Player Duel */}
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between group hover:border-indigo-500/40 transition-colors shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                          <Swords className="w-3 h-3" />
                        </div>
                        <span className="font-bold truncate">دوئل دونفره</span>
                      </div>
                      <strong className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {dbBreakdown.gameStyles.duelScenarios}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">سناریو</span>
                      </strong>
                      <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-medium block mt-1 truncate">
                        رقابت همزمان حضوری
                      </span>
                    </div>

                    {/* Style 4: Role Missions */}
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between group hover:border-emerald-500/40 transition-colors shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <Award className="w-3 h-3" />
                        </div>
                        <span className="font-bold truncate">مأموریت‌های نقش</span>
                      </div>
                      <strong className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {dbBreakdown.gameStyles.roleMissions}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">مأموریت</span>
                      </strong>
                      <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium block mt-1 truncate">
                        چالش‌های ۶ پرسونایی
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 2: اتاق‌های هشت‌گانه ذهن (Thematic Chambers) */}
                {activeCategoryTab === 'chambers' && (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {(Object.keys(FAMILY_METADATA) as FamilyId[]).map((famId) => {
                      const meta = FAMILY_METADATA[famId];
                      const Icon = familyIcons[famId];
                      const count = dbBreakdown.familyCounts[famId] || 0;
                      return (
                        <div
                          key={famId}
                          className="p-3 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between group hover:border-indigo-500/30 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate max-w-[130px]">
                            <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                              <Icon className="w-3 h-3 text-indigo-500 shrink-0" />
                            </div>
                            <span className="truncate text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                              {meta.nameFa}
                            </span>
                          </div>
                          <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 tabular-nums text-xs">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 3: سطوح دشواری علمی (Difficulty Tiers) */}
                {activeCategoryTab === 'difficulty' && (
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center text-xs">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-500/25 flex flex-col justify-between">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">
                        سطح ۱ (پایه‌ای)
                      </span>
                      <strong className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 tabular-nums my-1">
                        {dbBreakdown.difficultyCounts.level1} معما
                      </strong>
                      <span className="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                        تله‌های شهودی سریع
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-500/25 flex flex-col justify-between">
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold">
                        سطح ۲ (متوسط)
                      </span>
                      <strong className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-300 tabular-nums my-1">
                        {dbBreakdown.difficultyCounts.level2} معما
                      </strong>
                      <span className="text-[9px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                        سوگیری‌های چندلایه
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/90 dark:border-rose-500/25 flex flex-col justify-between">
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-bold">
                        سطح ۳ (عمیق)
                      </span>
                      <strong className="text-base sm:text-lg font-black text-rose-800 dark:text-rose-300 tabular-nums my-1">
                        {dbBreakdown.difficultyCounts.level3} معما
                      </strong>
                      <span className="text-[9px] text-rose-600/80 dark:text-rose-400/80 font-medium">
                        پارادوکس و بازتاب عمیق
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};


