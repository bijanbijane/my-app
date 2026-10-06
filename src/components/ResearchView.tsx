import React, { useRef, useState } from 'react';
import { BookOpen, ShieldCheck, Database, RotateCcw, Sparkles, ExternalLink, Download, Upload, CheckCircle2, AlertTriangle, Layers, Target, Brain, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import { UserProfile, FamilyId } from '../types';
import { exportProfileJson, importProfileJson } from '../storage/storage';
import { getDatabaseStatistics } from '../data/databaseEngine';
import { FAMILY_METADATA } from '../data/questionBank';

interface ResearchViewProps {
  profile: UserProfile;
  onRestoreProfile: (newProfile: UserProfile) => void;
  onLoadDemo: () => void;
  onResetData: () => void;
  isDemo: boolean;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  profile,
  onRestoreProfile,
  onLoadDemo,
  onResetData,
  isDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const dbStats = getDatabaseStatistics();

  const handleExport = () => {
    sounds.playSuccess();
    haptics.levelUp();
    const jsonStr = exportProfileJson(profile);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zehnnama_mind_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', text: 'فایل پشتیبان با موفقیت ذخیره و دانلود شد.' });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const restored = importProfileJson(text);
        sounds.playLevelUp();
        haptics.levelUp();
        onRestoreProfile(restored);
        setStatusMsg({ type: 'success', text: '🎉 اطلاعات و دستاوردهای شما با موفقیت بازیابی شد!' });
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'خطا در خواندن فایل: فرمت فایل پشتیبان نامعتبر است.' });
      }
      setTimeout(() => setStatusMsg(null), 4000);
    };
    reader.readAsText(file);
  };

  const references = [
    {
      title: 'Cognitive Reflection and Decision Making',
      authors: 'Frederick, S. (2005)',
      journal: 'Journal of Economic Perspectives, 19(4), 25–42',
      doi: '10.1257/089533005775196732',
      descFa: 'پارادایم سنجش تمایز تفکر سریع و شهودی (سیستم ۱) از تفکر تحلیلی و شکیبا (سیستم ۲).',
    },
    {
      title: 'Judgment under Uncertainty: Heuristics and Biases',
      authors: 'Tversky, A., & Kahneman, D. (1974)',
      journal: 'Science, 185(4157), 1124–1131',
      doi: '10.1126/science.185.4157.1124',
      descFa: 'مبانی سوگیری‌های لنگراندازی، در دسترس بودن و میان‌برهای قضاوت ذهن.',
    },
    {
      title: 'The Framing of Decisions and the Psychology of Choice',
      authors: 'Tversky, A., & Kahneman, D. (1981)',
      journal: 'Science, 211(4481), 453–458',
      doi: '10.1126/science.7455683',
      descFa: 'اثر قاب‌بندی سود و زیان و نامتقارن بودن واکنش روانی انسان به ریسک.',
    },
    {
      title: 'Computational Models of Emotion Inference in Theory of Mind',
      authors: 'Ong, D. C., Zaki, J., & Goodman, N. D. (2019)',
      journal: 'Topics in Cognitive Science, 11(2), 338–357',
      doi: '10.1111/tops.12371',
      descFa: 'مدل‌های محاسباتی استنباط هیجان و نظریه ذهن در موقعیت‌های دارای ابهام.',
    },
    {
      title: 'Insensitivity to Future Consequences Following Damage to Human Prefrontal Cortex',
      authors: 'Bechara, A., Damasio, A. R., et al. (1994)',
      journal: 'Cognition, 50(1-3), 7–15',
      doi: '10.1016/0010-0277(94)90018-3',
      descFa: 'آزمون قمار آیووا (Iowa Gambling Task) و ارزیابی پاداش فوری در برابر عواقب تأخیری.',
    },
    {
      title: 'Calibration of Probabilities: The State of the Art to 1980',
      authors: 'Lichtenstein, S., Fischhoff, B., & Phillips, L. D. (1982)',
      journal: 'Judgment under Uncertainty (pp. 306–334). Cambridge University Press',
      doi: '10.1017/CBO9780511809477.023',
      descFa: 'سنجش فاصله واقع‌بینی و بیش‌اطمینانی (Overconfidence) در قضاوت‌های انسانی.',
    },
  ];

  return (
    <div className="space-y-5 pb-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          جادوی پشت پرده
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          این معماها از کجا آب می‌خورن و چطور خطاهای فکری بشر رو شکار می‌کنن؟
        </p>
      </div>

      {/* In-place Notification Banner */}
      {statusMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-500/40 text-rose-800 dark:text-rose-200'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Ethical & Non-Clinical Disclaimer */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs leading-relaxed shadow-xs">
        <div className="flex items-center gap-2 font-black text-amber-700 dark:text-amber-300 mb-1.5 text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>اینجا مطب روان‌پزشک یا تست کنکور نیست!</span>
        </div>
        <p className="font-medium">
          این اپلیکیشن ادعای تشخیص بیماری یا اندازه گرفتن «هوش و IQ» شما رو نداره. این بازی‌ها از آزمایش‌های واقعی اقتصاد رفتاری و علوم شناختی الهام گرفته شدن و هدفشون اینه که با سرگرمی و خنده، بهت نشون بدن مغز چطور به طور طبیعی در تله‌های تصمیم‌گیری می‌افته.
        </p>
      </div>

      {/* Local Storage & Backup / Restore System */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-slate-100 text-sm">
            <Database className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>پشتیبان‌گیری و ماندگاری همیشگی کارنامه</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ۱۰۰٪ آفلاین و محلی
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          برای اینکه با پاک شدن کش مرورگر مدال‌ها و پیشرفتت از بین نره، می‌تونی در هر لحظه یک نسخه پشتیبان از کارنامه‌ات ذخیره کنی یا اطلاعاتت رو به گوشی دیگری منتقل کنی:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExport}
            className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>دانلود فایل پشتیبان (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span>بازیابی از فایل پشتیبان</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
        />
      </div>

      {/* Demo & Reset Controls */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <span className="text-xs font-black text-slate-900 dark:text-slate-200 block">
          کلیدهای آزمایشگاه (حالت شبیه‌سازی)
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          می‌تونی با یک کلیک ۵۰ بازی فرضی تزریق کنی تا نمودارها و سیستم مچ‌گیری از الگوها زنده بشن، یا همه چیز رو صفر کنی:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              sounds.playLevelUp();
              onLoadDemo();
            }}
            className="py-3 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>بارگذاری ۵۰ بازی نمونه</span>
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              onResetData();
            }}
            className="py-3 px-3 rounded-xl bg-rose-50 dark:bg-rose-600/15 hover:bg-rose-100 dark:hover:bg-rose-600/25 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-black flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاک کردن همه ردپاها</span>
          </button>
        </div>
      </div>

      {/* Question Database Registry & Statistics (تکمیل دیتابیس) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-slate-100 text-sm">
            <Layers className="w-4 h-4 text-amber-500 shrink-0" />
            <span>شناسنامه بانک داده و پرونده‌های شناختی</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-black bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/20 tabular-nums">
            {dbStats.totalQuestions} پرونده استاندارد
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          تمامی پرونده‌های دیتابیس بر پایه پارادایم‌های استاندارد اقتصاد رفتاری، CRT فردریک، لنگراندازی و استدلال استنتاجی کالیبره شده‌اند و فاقد هرگونه تله‌های زبانی و سلیقه‌ای هستند:
        </p>

        {/* Tiers distribution */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">سطح ۱ (پایه‌ای)</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {dbStats.difficultyCounts.level1} معما
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">سطح ۲ (متوسط)</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {dbStats.difficultyCounts.level2} معما
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">سطح ۳ (عمیق)</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400 tabular-nums">
              {dbStats.difficultyCounts.level3} معما
            </span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
            توزیع در اتاق‌های هشت‌گانه ذهن:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {(Object.keys(FAMILY_METADATA) as FamilyId[]).map((famId) => (
              <div
                key={famId}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80"
              >
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                  {FAMILY_METADATA[famId].nameFa}
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {dbStats.familyCounts[famId] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Literature References */}
      <div>
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 mb-3 px-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>ریشه‌های معتبر علمی این بازی‌ها</span>
        </h3>

        <div className="space-y-3">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs shadow-xs"
            >
              <h4 className="font-bold text-slate-900 dark:text-slate-200 text-[13px] leading-snug">
                {ref.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px]">
                {ref.authors} · <span className="italic">{ref.journal}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-xs leading-relaxed">
                {ref.descFa}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">DOI: {ref.doi}</span>
                <a
                  href={`https://doi.org/${ref.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 font-bold"
                >
                  <span>مقاله اصلی</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
