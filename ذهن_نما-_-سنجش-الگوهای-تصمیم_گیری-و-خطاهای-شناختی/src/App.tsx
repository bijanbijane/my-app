import React, { useState, useEffect } from 'react';
import { UserProfile, ScenarioQuestion, TrialResult, FamilyId, CognitiveRoleId } from './types';
import {
  loadUserProfile,
  saveUserProfile,
  resetUserProfile,
  generateDemoProfile,
  isDemoModeActive,
  setDemoModeFlag,
} from './storage/storage';
import { updateUserProfile } from './analytics/profileEngine';
import { selectNextGame, selectDailyChallenge } from './adaptive/adaptiveEngine';
import { ALL_QUESTIONS } from './data/questionBank';
import { COGNITIVE_ROLES } from './data/cognitiveRoles';
import { ROLE_SPECIFIC_QUESTIONS } from './data/roleQuestions';
import { getDailyRoleBounty } from './utils/dailyRoleBounty';

import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { PatternsView } from './components/PatternsView';
import { HistoryView } from './components/HistoryView';
import { ResearchView } from './components/ResearchView';
import { GamePlayer } from './components/GamePlayer';
import { SurvivalPlayer } from './components/SurvivalPlayer';
import { DuelModal } from './components/DuelModal';
import { ShareableMindCard } from './components/ShareableMindCard';
import { LevelProgressionModal } from './components/LevelProgressionModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { sounds } from './utils/soundEffects';
import { haptics } from './utils/haptics';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeQuestion, setActiveQuestion] = useState<ScenarioQuestion | null>(null);
  const [gameSessionKey, setGameSessionKey] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(() => isDemoModeActive());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareCardOpen, setIsShareCardOpen] = useState<boolean>(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isSurvivalMode, setIsSurvivalMode] = useState<boolean>(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState<boolean>(false);

  // Sync profile to storage whenever it changes
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
    }
  }, [darkMode]);

  // Handle hardware / browser back button on mobile
  useEffect(() => {
    const handlePopState = () => {
      if (isSurvivalMode) {
        setIsSurvivalMode(false);
      } else if (isDuelModalOpen) {
        setIsDuelModalOpen(false);
      } else if (isDownloadModalOpen) {
        setIsDownloadModalOpen(false);
      } else if (isShareCardOpen) {
        setIsShareCardOpen(false);
      } else if (isLevelModalOpen) {
        setIsLevelModalOpen(false);
      } else if (activeQuestion) {
        sounds.stopRoleAmbience();
        setActiveQuestion(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeQuestion, isSurvivalMode, isDuelModalOpen, isDownloadModalOpen, isShareCardOpen, isLevelModalOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const launchGame = (question: ScenarioQuestion) => {
    try {
      window.history.pushState({ inGame: true }, '');
    } catch {}
    setGameSessionKey((k) => k + 1);
    setActiveQuestion(question);
  };

  const handleStartAdaptiveGame = () => {
    const nextQ = selectNextGame(profile, ALL_QUESTIONS) || ALL_QUESTIONS[0];
    launchGame(nextQ);
  };

  const handleStartFamilyGame = (familyId: FamilyId) => {
    const familyQuestions = ALL_QUESTIONS.filter((q) => q.familyId === familyId);
    const playedIds = new Set(profile.history.map((t) => t.questionId));
    const unplayed = familyQuestions.filter((q) => !playedIds.has(q.id));
    const chosen = (unplayed.length > 0 ? unplayed[0] : familyQuestions[0]) || ALL_QUESTIONS[0];
    launchGame(chosen);
  };

  const handleStartDailyChallenge = () => {
    const dailyQ = selectDailyChallenge(ALL_QUESTIONS) || ALL_QUESTIONS[0];
    launchGame(dailyQ);
  };

  const handleSelectRole = (roleId: CognitiveRoleId) => {
    const roleConfig = COGNITIVE_ROLES[roleId];
    setProfile((prev) => ({
      ...prev,
      activeRoleId: roleId,
    }));
    showToast(`نقش فعال شما به «${roleConfig.nameFa}» تغییر یافت.`);
  };

  const handleClearRole = () => {
    setProfile((prev) => ({
      ...prev,
      activeRoleId: undefined,
    }));
    showToast('به حالت کاوش آزاد (بدون نقش) بازگشتید.');
  };

  const handleLaunchRoleMission = (roleId: CognitiveRoleId) => {
    const roleConfig = COGNITIVE_ROLES[roleId];
    setProfile((prev) => ({
      ...prev,
      activeRoleId: roleId,
    }));

    // Find dedicated role questions first for strict role fidelity
    const dedicated = ROLE_SPECIFIC_QUESTIONS.filter((q) => q.roleId === roleId);
    const playedIds = new Set(profile.history.map((t) => t.questionId));
    const unplayedDedicated = dedicated.filter((q) => !playedIds.has(q.id));

    let chosenQ: ScenarioQuestion;
    if (unplayedDedicated.length > 0) {
      chosenQ = unplayedDedicated[0];
    } else if (dedicated.length > 0) {
      chosenQ = dedicated[Math.floor(Math.random() * dedicated.length)];
    } else {
      const familyQuestions = ALL_QUESTIONS.filter((q) => q.familyId === roleConfig.primaryFamily);
      chosenQ = familyQuestions[0] || ALL_QUESTIONS[0];
    }

    launchGame(chosenQ);
  };

  const handleAcceptDailyBounty = () => {
    const bounty = getDailyRoleBounty(profile);
    setProfile((prev) => ({
      ...prev,
      activeRoleId: bounty.roleId,
    }));
    showToast(`مأموریت روزانه «${bounty.roleNameFa}» آغاز شد.`);
    launchGame(bounty.targetQuestion);
  };

  const handleFinishGame = (trial: TrialResult) => {
    let updated = updateUserProfile(profile, trial);
    const todayStr = new Date().toISOString().slice(0, 10);
    const bounty = getDailyRoleBounty(profile);

    // Check if user completed today's role bounty
    if (
      bounty.targetQuestion.id === trial.questionId &&
      profile.dailyRoleCompletedDate !== todayStr
    ) {
      updated = {
        ...updated,
        xp: updated.xp + bounty.xpReward,
        dailyRoleCompletedDate: todayStr,
        roleMedals: Array.from(new Set([...(updated.roleMedals || []), bounty.medalId])),
      };
      sounds.playLevelUp();
      haptics.levelUp();
      showToast(`🎉 تبریک! مأموریت روزانه تکمیل شد: ۵۰+ XP و «${bounty.medalTitleFa}» به افتخاراتت افزوده شد!`);
    } else if (updated.level > profile.level) {
      sounds.playLevelUp();
      haptics.levelUp();
      showToast(`🎉 تبریک! صعود به سطح ${updated.level}: «${updated.levelTitleFa}»`);
    }

    setProfile(updated);
    setIsDemo(false);
    setDemoModeFlag(false);
  };

  const handleNextGameFromPlayer = () => {
    let nextQ: ScenarioQuestion;

    // If playing in a role, keep serving role-thematic missions
    if (profile.activeRoleId) {
      const roleId = profile.activeRoleId;
      const roleDedicated = ROLE_SPECIFIC_QUESTIONS.filter((q) => q.roleId === roleId);
      const playedIds = new Set(profile.history.map((t) => t.questionId));
      const unplayedDedicated = roleDedicated.filter((q) => !playedIds.has(q.id));

      if (unplayedDedicated.length > 0) {
        nextQ = unplayedDedicated[0];
      } else {
        const roleConfig = COGNITIVE_ROLES[roleId];
        const rolePool = ALL_QUESTIONS.filter((q) => q.familyId === roleConfig.primaryFamily);
        const unplayedPool = rolePool.filter((q) => !playedIds.has(q.id));
        nextQ = (unplayedPool.length > 0 ? unplayedPool[0] : roleDedicated[0]) || selectNextGame(profile, ALL_QUESTIONS);
      }
    } else {
      nextQ = selectNextGame(profile, ALL_QUESTIONS) || ALL_QUESTIONS[0];
    }

    launchGame(nextQ);
  };

  const handleExitPlayer = () => {
    sounds.stopRoleAmbience();
    setActiveQuestion(null);
  };

  const handleLoadDemo = () => {
    const demoProf = generateDemoProfile();
    setProfile(demoProf);
    setIsDemo(true);
    showToast('۵۰ بازی نمونه و الگوهای شناختی بارگذاری شدند.');
    setActiveTab('profile');
  };

  const handleResetData = () => {
    const cleanProf = resetUserProfile();
    setProfile(cleanProf);
    setIsDemo(false);
    showToast('تمام داده‌ها پاکسازی شدند.');
  };

  const handleTabChange = (tab: NavTab) => {
    sounds.playTap();
    haptics.tap();
    setActiveTab(tab);
  };

  // If in an active game, show the game view with a fresh guaranteed key
  if (activeQuestion) {
    return (
      <GamePlayer
        key={`${activeQuestion.id}_${gameSessionKey}`}
        question={activeQuestion}
        profile={profile}
        onFinishGame={handleFinishGame}
        onExit={handleExitPlayer}
        onNextGame={handleNextGameFromPlayer}
      />
    );
  }

  // If in Survival Blitz Mode
  if (isSurvivalMode) {
    return (
      <SurvivalPlayer
        profile={profile}
        onFinishSurvival={({ finalScore, streak, trials }) => {
          let updated = { ...profile };
          trials.forEach((t) => {
            updated = updateUserProfile(updated, t);
          });
          if (streak > (updated.bestSurvivalStreak || 0)) {
            updated.bestSurvivalStreak = streak;
          }
          setProfile(updated);
          saveUserProfile(updated);
          setIsSurvivalMode(false);
          showToast(`ماراتن بقا پایان یافت! امتیاز کسب‌شده: +${finalScore}`);
        }}
        onExit={() => setIsSurvivalMode(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 text-slate-100 border border-amber-500/40 shadow-xl text-xs font-semibold animate-fadeIn max-w-sm text-center">
          {toastMessage}
        </div>
      )}

      {/* Shareable Mind Card Modal */}
      {isShareCardOpen && (
        <ShareableMindCard
          profile={profile}
          onClose={() => setIsShareCardOpen(false)}
        />
      )}

      {/* Level Progression & Mystical XP Modal */}
      {isLevelModalOpen && (
        <LevelProgressionModal
          profile={profile}
          onClose={() => setIsLevelModalOpen(false)}
        />
      )}

      {/* 2-Player Local Cognitive Duel Modal */}
      {isDuelModalOpen && (
        <DuelModal onClose={() => setIsDuelModalOpen(false)} />
      )}

      {/* Download Native App Cross-Platform Modal */}
      {isDownloadModalOpen && (
        <DownloadAppModal onClose={() => setIsDownloadModalOpen(false)} />
      )}

      {/* Main Top Header */}
      <Header
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isDemo={isDemo}
        onResetData={handleResetData}
        onOpenShareCard={() => setIsShareCardOpen(true)}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
        onOpenDuelModal={() => setIsDuelModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Primary Scrollable Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-24">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            onStartAdaptiveGame={handleStartAdaptiveGame}
            onStartFamilyGame={handleStartFamilyGame}
            onStartDailyChallenge={handleStartDailyChallenge}
            onOpenShareCard={() => setIsShareCardOpen(true)}
            onOpenLevelModal={() => setIsLevelModalOpen(true)}
            onSelectRole={handleSelectRole}
            onLaunchRoleMission={handleLaunchRoleMission}
            onAcceptDailyBounty={handleAcceptDailyBounty}
            onClearRole={handleClearRole}
            onStartSurvival={() => setIsSurvivalMode(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onOpenShareCard={() => setIsShareCardOpen(true)}
            onUpdateTone={(tone) => {
              sounds.playTap();
              haptics.tap();
              setProfile((prev) => ({
                ...prev,
                tonePreference: tone,
              }));
              showToast(`لحن تحلیل‌گر به «${tone === 'academic' ? 'دانشگاهی و رسمی' : 'شوخ‌طبع و رندانه'}» تغییر یافت.`);
            }}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternsView
            profile={profile}
            onStartGame={handleStartAdaptiveGame}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            profile={profile}
            onStartGame={handleStartAdaptiveGame}
          />
        )}

        {activeTab === 'research' && (
          <ResearchView
            profile={profile}
            onRestoreProfile={(newProf) => {
              setProfile(newProf);
              showToast('🎉 کارنامه با موفقیت بازیابی شد.');
            }}
            onLoadDemo={handleLoadDemo}
            onResetData={handleResetData}
            isDemo={isDemo}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        patternsCount={profile.patterns.length}
      />
    </div>
  );
}
