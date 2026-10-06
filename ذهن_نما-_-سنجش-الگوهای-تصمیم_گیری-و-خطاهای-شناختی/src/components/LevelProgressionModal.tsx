import React from 'react';
import { UserProfile } from '../types';
import { LEVEL_DEFINITIONS } from '../data/scoringConfig';
import { X, Sparkles, Trophy, Lock, CheckCircle2, Shield, Brain, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface LevelProgressionModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export const LevelProgressionModal: React.FC<LevelProgressionModalProps> = ({
  profile,
  onClose,
}) => {
  const currentLevelDef =
    LEVEL_DEFINITIONS.find((l) => l.level === profile.level) || LEVEL_DEFINITIONS[0];

  const nextLevelDef = LEVEL_DEFINITIONS.find((l) => l.level === profile.level + 1);

  // Progress math
  const currentBaseXp = currentLevelDef.minXp;
  const targetXp = nextLevelDef ? nextLevelDef.minXp : currentLevelDef.minXp;
  const xpInCurrentTier = Math.max(0, profile.xp - currentBaseXp);
  const xpNeededForNext = nextLevelDef ? Math.max(1, targetXp - currentBaseXp) : 1;
  const progressPercent = nextLevelDef
    ? Math.min(100, Math.round((xpInCurrentTier / xpNeededForNext) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl overflow-hidden text-slate-100">
        {/* Mysterious Ambient Glow */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            haptics.tap();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-3 shadow-inner shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="text-[11px] text-amber-400 font-bold tracking-widest uppercase block mb-1">
            تالار مدارج و بصیرت
          </span>
          <h3 className="text-2xl font-black text-slate-100 tracking-tight">
            سطح {profile.level}: {profile.levelTitleFa}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            هر تصمیم هوشمندانه، انرژی شناختی (XP) تو را در این تاریکی بارورتر می‌کند.
          </p>
        </div>

        {/* XP Progress Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>مجموع تجربه:</span>
              <strong className="text-slate-200 tabular-nums">{profile.xp} XP</strong>
            </span>
            <span className="text-amber-400 font-bold tabular-nums">
              {nextLevelDef
                ? `${profile.xp} / ${nextLevelDef.minXp} XP`
                : 'نهایت ادراک'}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>سطح فعلی: {currentLevelDef.titleFa}</span>
            <span>
              {nextLevelDef
                ? `${nextLevelDef.minXp - profile.xp} XP تا «${nextLevelDef.titleFa}»`
                : 'تمامی درگاه‌ها گشوده شدند'}
            </span>
          </div>
        </div>

        {/* 6 Mystical Tier Levels */}
        <div className="space-y-2 mb-6 max-h-52 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            مدارج شش‌گانه ادراک:
          </span>
          {LEVEL_DEFINITIONS.map((tier) => {
            const isUnlocked = profile.level >= tier.level;
            const isCurrent = profile.level === tier.level;

            return (
              <div
                key={tier.level}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                    : isUnlocked
                    ? 'bg-slate-950/50 border-slate-800 text-slate-300'
                    : 'bg-slate-950/20 border-slate-850 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isUnlocked
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tier.level}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-none ${
                        isCurrent ? 'text-amber-400' : isUnlocked ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {tier.titleFa}
                    </h4>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      نیاز: {tier.minXp} XP · {tier.requiredTrials} بازی
                    </span>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            haptics.tap();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all min-h-[44px]"
        >
          بازگشت به هزارتو
        </button>
      </div>
    </div>
  );
};
