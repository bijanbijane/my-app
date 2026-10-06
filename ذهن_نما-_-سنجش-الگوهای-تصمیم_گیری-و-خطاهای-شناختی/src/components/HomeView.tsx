import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Brain, ShieldCheck, RefreshCw, Target, Users, HeartHandshake, Gauge, Compass, Trophy, Award, Zap, Layers, Flame } from 'lucide-react';
import { UserProfile, FamilyId, CognitiveRoleId } from '../types';
import { FAMILY_METADATA, ALL_QUESTIONS } from '../data/questionBank';
import { DAILY_COGNITIVE_QUIPS } from '../utils/cognitiveHumor';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import { StoryFragmentCard } from './StoryFragmentCard';
import { RolePersonaSection } from './RolePersonaSection';
import { DailyRoleBountyCard } from './DailyRoleBountyCard';
import { DashboardStats } from './DashboardStats';

interface HomeViewProps {
  profile: UserProfile;
  onStartAdaptiveGame: () => void;
  onStartFamilyGame: (familyId: FamilyId) => void;
  onStartDailyChallenge: () => void;
  onOpenShareCard: () => void;
  onOpenLevelModal: () => void;
  onSelectRole: (roleId: CognitiveRoleId) => void;
  onLaunchRoleMission: (roleId: CognitiveRoleId) => void;
  onAcceptDailyBounty: () => void;
  onClearRole: () => void;
  onStartSurvival: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onStartAdaptiveGame,
  onStartFamilyGame,
  onOpenLevelModal,
  onSelectRole,
  onLaunchRoleMission,
  onAcceptDailyBounty,
  onClearRole,
  onStartSurvival,
}) => {
  const [filterCluster, setFilterCluster] = useState<'all' | 'logic' | 'bias' | 'social'>('all');

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

  const totalGames = profile.history.length;
  const uniqueQuestionsSolved = new Set(profile.history.map((t) => t.questionId)).size;
  const correctCount = profile.history.filter((t) => t.isCorrect).length;
  const accuracyRate = totalGames > 0 ? Math.round((correctCount / totalGames) * 100) : 0;
  const completedMissions =
    profile.history.filter((t) => t.isDailyRoleMission).length + (profile.roleMedals?.length || 0);
  const discoveredPatterns = profile.patterns.length;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyQuip = DAILY_COGNITIVE_QUIPS[dayOfYear % DAILY_COGNITIVE_QUIPS.length];

  return (
    <div className="space-y-4 pb-6">
      {/* Daily Witty Thought */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-0.5 px-3"
      >
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          {dailyQuip}
        </p>
      </motion.div>

      {/* Premier DashboardStats Glassmorphic Card (ابتدای صفحه) */}
      <DashboardStats
        profile={profile}
        onOpenLevelModal={onOpenLevelModal}
      />

      {/* Primary Hero - Modern Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 shadow-xl text-center relative overflow-hidden text-slate-100"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {totalGames === 0 ? (
          <div>
            <span className="text-[11px] text-amber-400 font-black tracking-widest uppercase block mb-1">
              ⚡ آزمون ۳۰ ثانیه‌ای ورود به دنیای ذهن
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mb-2">
              آیا عقلت زودتر تصمیم می‌گیرد یا شهود؟
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed mb-5 font-medium">
              بیشتر افراد در ثانیه‌های اول فریب ساده‌ترین تله‌ها را می‌خورند. یک معمای سریع حل کن تا مشخص شود در کجای طیف عقل و شهود ایستاده‌ای!
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playLevelUp();
                haptics.levelUp();
                onStartAdaptiveGame();
              }}
              className="w-full max-w-xs mx-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all min-h-[52px] animate-pulse"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>شروع فوری محک ۳۰ ثانیه‌ای</span>
            </motion.button>
          </div>
        ) : (
          <>
            <span className="text-[11px] text-amber-400 font-black tracking-widest uppercase block mb-1">
              چالش ۲ دقیقه‌ای ذهن
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mb-2">
              امروز چقدر مچ مغزت رو می‌گیری؟
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mb-6 font-medium">
              یک دوراهی کوتاه دریافت می‌کنی. تله‌های شهودی را رد کن، نظرت را با شواهد بسنج و کالیبراسیون ادعایت را آزمایش کن.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playTap();
                  haptics.tap();
                  onStartAdaptiveGame();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>معماهای هوشمند</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playLevelUp();
                  haptics.levelUp();
                  onStartSurvival();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all min-h-[48px] border border-rose-400/30"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>ماراتن بقا (۳ جان)</span>
                {profile.bestSurvivalStreak ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-300">
                    {profile.bestSurvivalStreak}🔥
                  </span>
                ) : null}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Meta Features for Activated Players */}
      {totalGames > 0 ? (
        <>
          {/* Daily Role Bounty Quest Card (سیستم مأموریت روزانه و مدال‌های افتخار) */}
          <DailyRoleBountyCard
            profile={profile}
            onAcceptBounty={onAcceptDailyBounty}
          />

          {/* Role Persona Matrix (تالار هویت‌های شناختی با موشن کارت) */}
          <RolePersonaSection
            profile={profile}
            onSelectRole={onSelectRole}
            onLaunchRoleMission={onLaunchRoleMission}
            onClearRole={onClearRole}
          />

          {/* Story Fragments Card (زمزمه‌های ناظر تالار) */}
          <StoryFragmentCard profile={profile} />
        </>
      ) : (
        /* Focused Teaser for First-Time Users */
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-xs space-y-1.5 shadow-sm">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-200 text-xs">
            تالار پرسوناهای شناختی، مأموریت‌های روزانه و اتاق‌های ذهن
          </h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            با حل اولین معما و دریافت نخستین کارنامه، امکانات پیشرفته و هویت‌های اختصاصی قفل‌گشایی می‌شوند.
          </p>
        </div>
      )}

      {/* 8 Cognitive Categories Grid with Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>اتاق‌های هشت‌گانه هزارتوی ذهن</span>
          </h3>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold tabular-nums">
            {ALL_QUESTIONS.length} پرونده کالیبره‌شده
          </span>
        </div>

        {/* Quick Cluster Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-none">
          {[
            { id: 'all', title: 'همه (۸)' },
            { id: 'logic', title: 'منطق و تأمل (۳)' },
            { id: 'bias', title: 'سوگیری و ریسک (۲)' },
            { id: 'social', title: 'روانشناسی و چرخش باور (۳)' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                setFilterCluster(pill.id as 'all' | 'logic' | 'bias' | 'social');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                filterCluster === pill.id
                  ? 'bg-amber-500 text-slate-950 font-black scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
              }`}
            >
              {pill.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {(Object.keys(FAMILY_METADATA) as FamilyId[])
            .filter((famId) => {
              if (filterCluster === 'all') return true;
              if (filterCluster === 'logic') {
                return famId === 'cognitive_reflection' || famId === 'metacognition' || famId === 'reasoning_patterns';
              }
              if (filterCluster === 'bias') {
                return famId === 'cognitive_biases' || famId === 'risk_ambiguity';
              }
              if (filterCluster === 'social') {
                return famId === 'cognitive_flexibility' || famId === 'social_inference' || famId === 'emotion_inference';
              }
              return true;
            })
            .map((familyId) => {
              const meta = FAMILY_METADATA[familyId];
              const Icon = familyIcons[familyId];
              return (
                <motion.button
                  key={familyId}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.playTap();
                    haptics.tap();
                    onStartFamilyGame(familyId);
                  }}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-850 text-right transition-all flex flex-col justify-between group shadow-xs min-h-[92px]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-400 leading-tight">
                      {meta.nameFa}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {meta.shortDescFa}
                  </p>
                </motion.button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
