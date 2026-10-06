import React, { useState } from 'react';
import { UserProfile } from '../types';
import { QUESTION_MAP, FAMILY_METADATA } from '../data/questionBank';
import { CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Play, Footprints } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface HistoryViewProps {
  profile: UserProfile;
  onStartGame?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ profile, onStartGame }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'lure'>('all');

  const history = profile.history;

  const filteredHistory = history.filter((t) => {
    if (filterMode === 'correct') return t.isCorrect;
    if (filterMode === 'lure') return t.isIntuitiveLureSelected;
    return true;
  });

  const toggleExpand = (id: string) => {
    sounds.playTap();
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5 pb-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          ردپای تصمیم‌های گذشته
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          آرشیو رویارویی‌های تو با معماها؛ مرور کن کجاها مکث طلایی کردی و کجاها فریب خوردی.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playTap();
            setFilterMode('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
            filterMode === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          همه ردپاها ({history.length})
        </button>
        <button
          onClick={() => {
            sounds.playTap();
            setFilterMode('correct');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
            filterMode === 'correct'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          شکارهای موفق ({history.filter((t) => t.isCorrect).length})
        </button>
        <button
          onClick={() => {
            sounds.playTap();
            setFilterMode('lure');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
            filterMode === 'lure'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          افتادن در تله ({history.filter((t) => t.isIntuitiveLureSelected).length})
        </button>
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((trial, idx) => {
            const question = QUESTION_MAP.get(trial.questionId);
            const familyMeta = FAMILY_METADATA[trial.familyId];
            const isExpanded = expandedId === `${trial.questionId}_${trial.timestamp}`;

            return (
              <div
                key={`${trial.questionId}_${trial.timestamp}_${idx}`}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                <div
                  onClick={() => toggleExpand(`${trial.questionId}_${trial.timestamp}`)}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {trial.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : trial.isIntuitiveLureSelected ? (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      ) : (
                        <HelpCircle className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-snug">
                        {question?.title || `معمای شماره ${trial.questionId}`}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>{familyMeta?.nameFa || 'چالش فکری'}</span>
                        <span>·</span>
                        <span className="tabular-nums">{formatDate(trial.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-left">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 tabular-nums block">
                        +{trial.score}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {(trial.responseTimeMs / 1000).toFixed(1)} ثانیه
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && question && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-3 animate-fadeIn">
                    <p className="text-slate-800 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-medium">
                      {question.prompt}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ادعای اطمینان:</span>
                        <strong className="text-amber-600 dark:text-amber-400 tabular-nums">{trial.confidence}٪</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5">سرنوشت انتخاب:</span>
                        <strong className={trial.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                          {trial.isCorrect ? 'دست تله رو خوندی' : trial.isIntuitiveLureSelected ? 'طعمه تله اول شدی' : 'نادرست'}
                        </strong>
                      </div>
                    </div>

                    {trial.changedMind !== undefined && (
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">واکنش به مدرک جدید: </span>
                        <strong className="text-slate-900 dark:text-slate-200">
                          {trial.changedMind ? 'انعطاف نشون دادی و نظرت رو اصلاح کردی' : 'یک‌دنده ماندی و پای حرف اول ایستادی'}
                        </strong>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-amber-600 dark:text-amber-400 font-bold block mb-1">
                        رمزگشایی معما:
                      </span>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Footprints className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1 text-sm">
            هنوز ردی در این شاخه به جا نگذاشته‌ای!
          </p>
          <p className="text-slate-400 text-[11px] max-w-xs mx-auto mb-4">
            اولین معما را حل کن تا تاریخچه تصمیم‌ها و مقاومتت در برابر تله‌ها اینجا ثبت شود.
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
              <span>شروع اولین آزمون</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
