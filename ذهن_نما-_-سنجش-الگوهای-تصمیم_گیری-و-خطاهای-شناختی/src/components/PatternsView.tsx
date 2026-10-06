import React from 'react';
import { UserProfile } from '../types';
import { computeWeeklySummary } from '../analytics/profileEngine';
import { Lightbulb, CheckCircle2, TrendingUp, Compass, KeyRound, Play } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface PatternsViewProps {
  profile: UserProfile;
  onStartGame?: () => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({ profile, onStartGame }) => {
  const patterns = profile.patterns;
  const weekly = computeWeeklySummary(profile.history);

  return (
    <div className="space-y-5 pb-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          کدهای لو‌رفته ذهن تو
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          عادت‌ها و میان‌برهای پنهانی که مغزت ناخودآگاه برای فرار از زحمت فکر کردن استفاده می‌کنه!
        </p>
      </div>

      {/* Weekly Executive Summary Card */}
      {profile.history.length >= 3 && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50/70 dark:from-slate-900 via-white dark:via-slate-900 to-indigo-100/30 dark:to-indigo-950/40 border border-indigo-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-2.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>دفتر وقایع ۷ روز اخیر</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">دقت شکار معماها</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-200 tabular-nums">
                {weekly.averageAccuracy}٪
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">میانگین ادعای قاطعیت</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {weekly.averageConfidence}٪
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">شکاف ادعا و حقیقت</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-300 tabular-nums">
                {weekly.calibrationGap}٪
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {weekly.keyPatternSummaryFa}
          </p>
        </div>
      )}

      {/* Pattern Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          {patterns.length > 0
            ? `${patterns.length} کد رفتاری پایدار از لابلای تصمیم‌هات کشف شده`
            : 'هنوز کدی لو نرفته؛ نقاب ذهن سر جاشه!'}
        </span>
        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
          مستند به حداقل ۳ تا ۵ مشاهده
        </span>
      </div>

      {/* Discovered Patterns List */}
      {patterns.length > 0 ? (
        <div className="space-y-3.5">
          {patterns.map((pattern) => {
            const isSolid = pattern.strength === 'solid';
            return (
              <div
                key={pattern.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {pattern.titleFa}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isSolid
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isSolid ? 'الگوی تثبیت‌شده' : 'سرنخ اولیه'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {pattern.descriptionFa}
                </p>

                {/* Evidence Count */}
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    شکارشده در <strong className="text-slate-900 dark:text-slate-200 tabular-nums">{pattern.evidenceCount}</strong> موقعیت تصمیم‌گیری مختلف
                  </span>
                </div>

                {/* Cognitive Recommendation */}
                <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-950/90 border border-amber-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                    پادزهر و راهکار ضدضربه:
                  </span>
                  {pattern.recommendationFa}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            ذهن تو هنوز در سایه‌ها پنهان شده!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed mb-5">
            سیستم ذهن‌نما از حدس‌های شتاب‌زده بیزاره. حداقل ۳ تا ۵ بازی در سناریوهای مشابه انجام بده تا اولین کدهای پنهان رفتارت فاش بشن.
          </p>

          {onStartGame && (
            <button
              onClick={() => {
                sounds.playTap();
                haptics.tap();
                onStartGame();
              }}
              className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 inline-flex items-center gap-2 active:scale-95 transition-all min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>شروع شکار کدهای ذهنی</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
