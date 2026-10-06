import React, { useState } from 'react';
import { Flame, Trophy, Moon, Sun, RotateCcw, Volume2, VolumeX, Share2, Zap, Swords, Download } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface HeaderProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isDemo: boolean;
  onResetData: () => void;
  onOpenShareCard: () => void;
  onOpenLevelModal: () => void;
  onOpenDuelModal: () => void;
  onOpenDownloadModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  darkMode,
  onToggleDarkMode,
  isDemo,
  onResetData,
  onOpenShareCard,
  onOpenLevelModal,
  onOpenDuelModal,
  onOpenDownloadModal,
}) => {
  const [soundActive, setSoundActive] = useState(sounds.enabled);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundActive(sounds.enabled);
    if (sounds.enabled) {
      sounds.playTap();
      haptics.tap();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {isDemo && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 text-center text-xs text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
          <span>حالت شبیه‌سازی (۵۰ بازی نمونه فعال است)</span>
          <button
            onClick={() => {
              sounds.playTap();
              haptics.tap();
              onResetData();
            }}
            className="underline hover:text-amber-900 dark:hover:text-amber-100 font-semibold transition-colors"
          >
            پاک کردن داده‌ها
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 h-13 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
            <span>ذهن</span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ذهن‌نما
          </span>
        </div>

        {/* Clean Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Download App Button */}
          {onOpenDownloadModal && (
            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                onOpenDownloadModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-bold transition-all shadow-2xs group"
              title="دانلود اپلیکیشن (اندروید، آیفون، مک و ویندوز)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline">دانلود</span>
            </button>
          )}

          {/* Level & XP progression button */}
          <button
            onClick={() => {
              sounds.playTap();
              haptics.tap();
              onOpenLevelModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:border-indigo-500/40 transition-colors"
            title="مشاهده سطح و امتیاز تجربه"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="tabular-nums">سطح {profile.level}</span>
          </button>

          {/* Streak indicator */}
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-bold">{profile.streak}</span>
            <span className="text-[10px] text-slate-400">روز</span>
          </div>

          {/* 2-Player Duel Button */}
          <button
            onClick={() => {
              sounds.playTap();
              haptics.tap();
              onOpenDuelModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all"
            title="دوئل دونفره مغزها (همین گوشی)"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دوئل</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center transition-colors"
            title={soundActive ? 'قطع صدا' : 'وصل صدا'}
            aria-label="تنظیم صدا"
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              haptics.tap();
              onToggleDarkMode();
            }}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center transition-colors"
            title="تغییر تم"
            aria-label="تغییر تم"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
