import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getCognitiveArchetype } from '../utils/cognitiveHumor';
import { X, Copy, Check, Share2, Sparkles, Brain } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ShareableMindCardProps {
  profile: UserProfile;
  onClose: () => void;
}

export const ShareableMindCard: React.FC<ShareableMindCardProps> = ({ profile, onClose }) => {
  const [copied, setCopied] = useState(false);

  const history = profile.history;
  const total = history.length || 1;
  const accuracy = Math.round((history.filter((t) => t.isCorrect).length / total) * 100);
  const avgConfidence = Math.round(history.reduce((s, t) => s + t.confidence, 0) / total);
  const lureRate = history.filter((t) => t.isIntuitiveLureSelected).length / total;

  const archetype = getCognitiveArchetype(accuracy, avgConfidence, lureRate);

  const shareText = `🧠 کارنامه شناختی من در «ذهن‌نما»:
لقب ذهنی: ${archetype.title} (${archetype.badge})
🎯 دقت تحلیلی: ${accuracy}٪
⚡ میانگین اعتماد‌به‌نفس: ${avgConfidence}٪
🔍 وضعیت: ${archetype.roast}
چقدر مغزت در برابر تله‌های فکری مقاومت می‌کنه؟ در «ذهن‌نما» امتحان کن!`;

  const handleCopy = () => {
    sounds.playTap();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    sounds.playTap();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'کارنامه شناختی من در ذهن‌نما',
          text: shareText,
        });
        return;
      } catch (e) {
        // User cancelled or unsupported, fallback to copy
      }
    }
    handleCopy();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center mb-2.5">
            <Brain className="w-7 h-7" />
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block mb-1">
            کارنامه خودمانی ذهن‌نما
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {archetype.title}
          </h3>
          <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {archetype.badge}
          </span>
        </div>

        {/* Humor Roast Quote */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs leading-relaxed text-center mb-5 font-medium">
          «{archetype.roast}»
        </div>

        {/* Stat Indicators */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
              دقت تفکر تحلیلی
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {accuracy}٪
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
              اعتمادبه‌نفس اعلامی
            </span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {avgConfidence}٪
            </span>
          </div>
        </div>

        {/* Share & Copy Action Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNativeShare}
            className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all min-h-[48px]"
          >
            <Share2 className="w-4 h-4" />
            <span>اشتراک مستقیم کارت</span>
          </button>
          <button
            onClick={handleCopy}
            className="py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all min-h-[48px]"
            title="کپی متن"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'کپی شد' : 'کپی'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
