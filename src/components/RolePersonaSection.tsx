import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CognitiveRoleId, CognitiveRoleConfig, UserProfile } from '../types';
import { COGNITIVE_ROLES, ROLE_LIST } from '../data/cognitiveRoles';
import { Shield, Sparkles, Check, ArrowRight, Compass, Zap, UserCheck, Flame, X, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface RolePersonaSectionProps {
  profile: UserProfile;
  onSelectRole: (roleId: CognitiveRoleId) => void;
  onLaunchRoleMission: (roleId: CognitiveRoleId) => void;
  onClearRole: () => void;
}

export const RolePersonaSection: React.FC<RolePersonaSectionProps> = ({
  profile,
  onSelectRole,
  onLaunchRoleMission,
  onClearRole,
}) => {
  const currentRoleId = profile.activeRoleId || 'detective';
  const activeRole = COGNITIVE_ROLES[currentRoleId];
  const [selectedForView, setSelectedForView] = useState<CognitiveRoleId>(currentRoleId);

  const viewRole = COGNITIVE_ROLES[selectedForView];

  const handleChoose = (rId: CognitiveRoleId) => {
    sounds.playTap();
    haptics.tap();
    setSelectedForView(rId);
    onSelectRole(rId);
  };

  const handleStartMission = (rId: CognitiveRoleId) => {
    sounds.playLevelUp();
    haptics.levelUp();
    onLaunchRoleMission(rId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl text-slate-100 space-y-4 relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: viewRole.color }}
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
        <div>
          <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>تالار هویت‌های شناختی (انتخاب نقش)</span>
          </span>
          <h3 className="text-base font-black text-slate-100 mt-0.5">
            امروز در چه نقشی با جهان روبه‌رو می‌شوی؟
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {profile.activeRoleId && (
            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                onClearRole();
              }}
              className="text-[11px] text-slate-400 hover:text-amber-400 px-2.5 py-1 rounded-full border border-slate-850 bg-slate-950/80 flex items-center gap-1 transition-colors min-h-[32px]"
              title="خروج از نقش و بازگشت به حالت عمومی"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>حالت آزاد</span>
            </button>
          )}

          <motion.div
            key={activeRole.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-300"
          >
            <span className="text-slate-400 text-[11px]">نقش فعال:</span>
            <span className="text-amber-400 flex items-center gap-1">
              <span>{activeRole.avatarEmoji}</span>
              <span>{activeRole.nameFa}</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Role Picker Thumbnails Row with Spring Physics */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 relative z-10">
        {ROLE_LIST.map((role) => {
          const isSelected = selectedForView === role.id;
          const isActive = currentRoleId === role.id;

          return (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoose(role.id)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all min-h-[72px] border relative ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-400'
              }`}
            >
              <span className="text-2xl block mb-1">{role.avatarEmoji}</span>
              <span
                className={`text-[11px] font-bold truncate max-w-full ${
                  isSelected ? 'text-amber-300' : 'text-slate-400'
                }`}
              >
                {role.nameFa.split(' ')[0]}
              </span>

              {isActive && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active Role Feature Showcase Card (Animated with AnimatePresence) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewRole.id}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${viewRole.accentBg} border border-slate-700/80 shadow-inner relative z-10`}
        >
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 shadow-md">
                {viewRole.avatarEmoji}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-slate-100">
                    {viewRole.nameFa}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {viewRole.badgeTitleFa}
                  </span>
                </div>
                <p className="text-xs text-slate-300/90 italic mt-0.5 leading-snug">
                  {viewRole.taglineFa}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {viewRole.descriptionFa}
          </p>

          {/* Mission Launch Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStartMission(viewRole.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all min-h-[46px]"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>ورود به مأموریت اختصاصی در نقش {viewRole.nameFa}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
