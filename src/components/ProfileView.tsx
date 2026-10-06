import React, { useState } from 'react';
import { UserProfile, ConstructId } from '../types';
import { CONSTRUCT_METADATA } from '../data/scoringConfig';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Shield,
  Brain,
  Target,
  Shuffle,
  Gauge,
  Users,
  HeartHandshake,
  Timer,
  Eye,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { CognitiveRadarChart } from './CognitiveRadarChart';
import { CognitiveProphecyCard } from './CognitiveProphecyCard';

interface ProfileViewProps {
  profile: UserProfile;
  onOpenShareCard?: () => void;
  onUpdateTone?: (tone: 'witty' | 'academic') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onOpenShareCard,
  onUpdateTone,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const constructIcons: Record<ConstructId, React.ElementType> = {
    cognitive_reflection: Brain,
    reasoning_accuracy: Target,
    decision_quality: Target,
    cognitive_flexibility: Shuffle,
    metacognitive_calibration: Gauge,
    bias_resistance: Shield,
    social_inference: Users,
    emotion_inference: HeartHandshake,
    ambiguity_tolerance: HelpCircle,
    speed_accuracy_balance: Timer,
    self_awareness: Eye,
    evidence_updating: RefreshCw,
  };

  const getReliabilityText = (rel: string) => {
    switch (rel) {
      case 'insufficient':
        return 'هنوز در سایه (داده ناکافی)';
      case 'low':
        return 'سرنخ‌های اولیه';
      case 'medium':
        return 'تصویر نسبتاً واضح';
      case 'high':
        return 'شفاف مثل آینه';
      default:
        return 'هنوز در سایه';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return (
          <span title="در حال اوج گرفتن">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </span>
        );
      case 'declining':
        return (
          <span title="دست‌خوش نوسان">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          </span>
        );
      case 'stable':
        return (
          <span title="آرام و پایدار">
            <Minus className="w-3.5 h-3.5 text-amber-500" />
          </span>
        );
      default:
        return null;
    }
  };

  const allConstructs = Object.values(profile.constructs);
  const categories = ['all', 'کنترل شتاب‌زدگی', 'تصمیم‌گیری مالی', 'خودشناسی', 'هوش اجتماعی', 'انعطاف فکری'];

  const filteredConstructs = allConstructs.filter((c) => {
    if (filterCategory === 'all') return true;
    return CONSTRUCT_METADATA[c.constructId]?.categoryFa === filterCategory;
  });

  return (
    <div className="space-y-5 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            دفترچه اسرار ذهن تو
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            اینجا آینه‌ایه که باهات تعارف نداره؛ هر توانایی و لغزش ذهنت مستقلاً ثبت می‌شه، بدون نمره‌دهی کلیشه‌ای.
          </p>
        </div>

        {onOpenShareCard && (
          <button
            onClick={() => {
              sounds.playTap();
              onOpenShareCard();
            }}
            className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors min-h-[44px]"
            title="اشتراک کارنامه"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">کارت لقب من</span>
          </button>
        )}
      </div>

      {/* Tone Preference Switcher */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            سبک گزارش و نقد معماها:
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {profile.tonePreference === 'academic'
              ? 'تحلیل رسمی عصب‌شناختی و علمی'
              : 'طنز رندانه و شوخی با خطاهای مغز'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onUpdateTone?.('witty');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              profile.tonePreference !== 'academic'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🎭 طنز
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onUpdateTone?.('academic');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              profile.tonePreference === 'academic'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🎓 رسمی
          </button>
        </div>
      </div>

      {/* Feature 1: Cognitive Prophecy / Divination (غیب‌گویی سوگیری بعدی) */}
      <CognitiveProphecyCard profile={profile} />

      {/* Feature 2: D3.js Mystical Spiderweb Radar Chart (تار عنکبوت شناختی) */}
      <CognitiveRadarChart profile={profile} />

      {/* Construct Detail Exploration Header */}
      <div className="pt-2">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-2 px-1">
          کالبدشکافی ۱۲ سازه شناختی
        </h3>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playTap();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors min-h-[36px] ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'همه گوشه‌ها' : cat}
            </button>
          ))}
        </div>

        {/* 12 Constructs Cards */}
        <div className="space-y-3">
          {filteredConstructs.map((construct) => {
            const meta = CONSTRUCT_METADATA[construct.constructId];
            const Icon = constructIcons[construct.constructId] || Brain;
            const hasSufficientData = construct.trialsCount >= 3;

            return (
              <div
                key={construct.constructId}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs transition-all hover:border-amber-500/40"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-500 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                        {construct.nameFa}
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {meta.categoryFa}
                      </span>
                    </div>
                  </div>

                  {/* Score or "هنوز در سایه" */}
                  <div className="text-left shrink-0">
                    {hasSufficientData ? (
                      <div className="flex items-center gap-1.5 justify-end">
                        {getTrendIcon(construct.trend)}
                        <span className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
                          {construct.score}
                        </span>
                        <span className="text-[10px] text-slate-400">/ ۱۰۰</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                        هنوز دستت رو نخوندیم!
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {construct.descriptionFa}
                </p>

                {/* Progress bar if data sufficient */}
                {hasSufficientData ? (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2.5">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${construct.score}%` }}
                    />
                  </div>
                ) : null}

                {/* Footer Evidence & Reliability */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/70">
                  <span>
                    {construct.trialsCount > 0
                      ? `بر اساس ${construct.trialsCount} رویارویی با معما`
                      : 'هنوز گذرت به این اتاق نیفتاده'}
                  </span>
                  <span className={construct.reliability === 'insufficient' ? 'text-amber-600 dark:text-amber-400/80 font-medium' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                    {getReliabilityText(construct.reliability)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
