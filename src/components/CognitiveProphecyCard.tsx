import React from 'react';
import { UserProfile } from '../types';
import { generateCognitiveProphecy } from '../utils/cognitiveProphecy';
import { Sparkles, Compass, ShieldAlert, Zap, Flame, ShieldCheck } from 'lucide-react';

interface CognitiveProphecyCardProps {
  profile: UserProfile;
}

export const CognitiveProphecyCard: React.FC<CognitiveProphecyCardProps> = ({ profile }) => {
  const prophecy = generateCognitiveProphecy(profile);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 shadow-lg relative overflow-hidden text-slate-100 animate-fadeIn">
      {/* Mystical Crystal Ball Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>پیش‌گویی تله‌ی بعدی شما</span>
          </div>
          <span className="text-[10px] text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            {prophecy.omenSignFa}
          </span>
        </div>

        {/* Oracle Title */}
        <h3 className="text-sm font-black text-slate-100 mb-1 leading-snug">
          {prophecy.oracleTitleFa}
        </h3>
        <span className="text-[11px] text-slate-400 block mb-3 font-medium">
          احتمال وقوع: <strong className="text-amber-400">{prophecy.dangerLevelFa}</strong>
        </span>

        {/* Oracle Whisper Text */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-3.5 shadow-inner">
          <p className="text-xs text-slate-200 leading-relaxed italic">
            «{prophecy.oracleWhisperFa}»
          </p>
        </div>

        {/* Protective Charm (The Antidote) */}
        <div className="flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-300 block text-[11px] mb-0.5">
              طلسم شکن (پادزهر شناختی):
            </strong>
            <span>{prophecy.protectiveCharmFa}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
