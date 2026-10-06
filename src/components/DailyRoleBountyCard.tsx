import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { getDailyRoleBounty, ROLE_MEDALS_CATALOG } from '../utils/dailyRoleBounty';
import { Award, Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface DailyRoleBountyCardProps {
  profile: UserProfile;
  onAcceptBounty: () => void;
}

export const DailyRoleBountyCard: React.FC<DailyRoleBountyCardProps> = ({
  profile,
  onAcceptBounty,
}) => {
  const bounty = getDailyRoleBounty(profile);
  const earnedMedalsCount = profile.roleMedals?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl relative overflow-hidden text-slate-100"
    >
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Top Tag & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>مأموریت روزانه هویت‌ها</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>
              نشان‌های شما: {earnedMedalsCount} از ۶
            </span>
          </div>
        </div>

        {/* Title & Persona */}
        <div className="flex items-start gap-3 pt-1">
          <span className="text-3xl p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 shrink-0">
            {bounty.avatarEmoji}
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-100 leading-snug">
              {bounty.bountyTitleFa}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {bounty.descriptionFa}
            </p>
          </div>
        </div>

        {/* Reward pill and Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400">
              +{bounty.xpReward} XP پاداش ویژه
            </span>
            <span className="text-slate-400 text-[11px]">
              جایزه: «{bounty.medalTitleFa}»
            </span>
          </div>

          {bounty.isCompletedToday ? (
            <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>مأموریت امروز تکمیل شد</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sounds.playSuccess();
                haptics.levelUp();
                onAcceptBounty();
              }}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>پذیرش مأموریت (+۵۰ XP)</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
