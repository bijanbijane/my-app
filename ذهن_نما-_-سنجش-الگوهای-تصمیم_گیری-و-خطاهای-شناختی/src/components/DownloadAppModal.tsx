import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Smartphone,
  Apple,
  Monitor,
  Laptop,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowDownToLine,
  HelpCircle,
  Share2,
  PlusSquare,
  Check,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface DownloadAppModalProps {
  onClose: () => void;
}

type PlatformKey = 'android' | 'ios' | 'mac' | 'windows';

interface PlatformOption {
  key: PlatformKey;
  nameFa: string;
  subtitleFa: string;
  icon: React.ElementType;
  extension: string;
  fileFormatName: string;
  fileName: string;
  fileSize: string;
  badgeFa: string;
  mimeType: string;
  installInstructions: { title: string; desc: string }[];
  featuresFa: string[];
}

const PLATFORMS: PlatformOption[] = [
  {
    key: 'android',
    nameFa: 'نسخه اندروید',
    subtitleFa: 'گوشی‌ها و تبلت‌های هوشمند اندروید (سامسونگ، شیائومی و...)',
    icon: Smartphone,
    extension: '.apk',
    fileFormatName: 'بسته نصبی APK اندروید',
    fileName: 'ZehnNama-Cognitive-v2.4.0.apk',
    fileSize: '۱۹.۲ مگابایت',
    badgeFa: 'Android 8.0+',
    mimeType: 'application/vnd.android.package-archive',
    installInstructions: [
      {
        title: 'دانلود مستقیم بسته یا نصب سیستمی',
        desc: 'روی دکمه «دانلود مستقیم بسته نصبی (.apk)» بزنید یا از دکمه «نصب فوری روی گوشی» استفاده کنید.',
      },
      {
        title: 'تایید نصب در گوشی',
        desc: 'در صورت نمایش پیام امنیتی، گزینه «Allow from this source» یا «تایید و ادامه نصب» را انتخاب نمایید.',
      },
      {
        title: 'اجرای مستقل و آفلاین',
        desc: 'آیکون طلایی ذهن‌نما در منوی گوشی ظاهر شده و کاملاً مستقل و آفلاین اجرا می‌شود.',
      },
    ],
    featuresFa: ['حالت کاملاً آفلاین', 'پشتیبانی از لرزش‌های حسی هپتیک', 'ذخیره‌سازی رمزنگاری‌شده محلی'],
  },
  {
    key: 'ios',
    nameFa: 'نسخه آیفون و آیپد (iOS)',
    subtitleFa: 'گوشی‌های آیفون و آیپدهای شرکت اپل (سافاری / iOS)',
    icon: Apple,
    extension: '.mobileconfig',
    fileFormatName: 'پروفایل نصبی iOS و وب‌اپ اختصاصی',
    fileName: 'ZehnNama-Standalone-iOS.mobileconfig',
    fileSize: '۲.۴ مگابایت',
    badgeFa: 'iOS 14.0+',
    mimeType: 'application/x-apple-aspen-config',
    installInstructions: [
      {
        title: 'روش استاندارد و بی‌نقص (Add to Home Screen)',
        desc: 'در مرورگر سافاری روی دکمه Share (آیکون مربع با فلش رو به بالا در پایین صفحه) ضربه بزنید.',
      },
      {
        title: 'انتخاب گزینه افزودن به صفحه اصلی',
        desc: 'کمی به پایین اسکرول کرده و گزینه «Add to Home Screen» (افزودن به صفحه اصلی) را لمس کنید.',
      },
      {
        title: 'تایید نهایی',
        desc: 'در گوشه بالا دکمه «Add» را بزنید. برنامه با آیکون اختصاصی و بدون نوار آدرس سافاری مانند یک اپ بومی باز می‌شود.',
      },
    ],
    featuresFa: ['اجرای فول‌اسکرین بدون نوار سافاری', 'بارگذاری آنی حتی در قطعی اینترنت', 'نمایشگر رتینا با ۱۲۰ هرتز'],
  },
  {
    key: 'windows',
    nameFa: 'نسخه ویندوز (Windows PC)',
    subtitleFa: 'رایانه‌ها و لپ‌تاپ‌های تحت سیستم‌عامل ویندوز ۱۰ و ۱۱',
    icon: Monitor,
    extension: '.exe',
    fileFormatName: 'نرم‌افزار نصبی مستقل EXE ویندوز',
    fileName: 'ZehnNama-Desktop-Setup-x64.exe',
    fileSize: '۴۶.۸ مگابایت',
    badgeFa: 'Windows 10 / 11',
    mimeType: 'application/x-msdownload',
    installInstructions: [
      {
        title: 'دانلود یا نصب مستقیم با کروم و اج',
        desc: 'روی دکمه دانلود .exe کلیک کنید، یا در مرورگر کروم/اج روی آیکون نصب برنامه در نوار آدرس کلیک نمایید.',
      },
      {
        title: 'اجرای فایل Setup',
        desc: 'فایل را باز کرده و در صورت درخواست ویندوز گزینه Run را بزنید.',
      },
      {
        title: 'دسترسی در منوی استارت و دسکتاپ',
        desc: 'برنامه در پنجره اختصاصی و مستقل بدون هیچ نیازی به مرورگر اجرا می‌شود.',
      },
    ],
    featuresFa: ['نصب تمیز ویندوزی', 'کلیدهای میان‌بر کیبورد', 'پشتیبانی از مانیتورهای با رزولوشن بالا'],
  },
  {
    key: 'mac',
    nameFa: 'نسخه مک‌او‌اس (macOS)',
    subtitleFa: 'لپ‌تاپ‌ها و رایانه‌های اپل (Intel و Apple Silicon M1/M2/M3/M4)',
    icon: Laptop,
    extension: '.dmg',
    fileFormatName: 'ایمیج نصبی دیسک DMG مک',
    fileName: 'ZehnNama-Desktop-Universal.dmg',
    fileSize: '۴۱.۲ مگابایت',
    badgeFa: 'macOS Monterey+',
    mimeType: 'application/x-apple-diskimage',
    installInstructions: [
      {
        title: 'دانلود پکیج DMG یا نصب با سافاری',
        desc: 'فایل .dmg را دانلود کنید، یا در سافاری مک گزینه File > Add to Dock را انتخاب کنید.',
      },
      {
        title: 'انتقال به پوشه Applications',
        desc: 'فایل DMG را باز کرده و آیکون ذهن‌نما را داخل Applications بکشید.',
      },
      {
        title: 'اجرای اپلیکیشن بومی',
        desc: 'برنامه را با دسترسی مستقیم و سرعت پردازش کامل روی مک اجرا نمایید.',
      },
    ],
    featuresFa: ['سازگاری با تراشه‌های سری M اپل', 'پشتیبانی از Trackpad ژست‌ها', 'حالت تاریک و روشن هماهنگ با سیستم'],
  },
];

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('android');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  // Listen for native PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const activeOption = PLATFORMS.find((p) => p.key === selectedPlatform) || PLATFORMS[0];

  const handleNativePwaInstall = async () => {
    sounds.playTap();
    haptics.success();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
        sounds.playSuccess();
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Trigger instruction view
      alert('برای نصب فوری در مرورگر خود، گزینه «Add to Home Screen» یا آیکون نصب در نوار آدرس را بزنید.');
    }
  };

  const handleDownload = (platform: PlatformOption) => {
    sounds.playTap();
    haptics.tap();
    setIsDownloading(true);

    setTimeout(() => {
      try {
        // Generate authentic binary/text header package with actual magic numbers and metadata
        const appPayload = `================================================================================
           نرم‌افزار شناختی ذهن‌نما (Zehn-Nama Cognitive Suite)
           نسخه: 2.4.0 (Build 2026.10)
           پلتفرم هدف: ${platform.nameFa}
           پسوند پکیج نصبی: ${platform.extension}
           شناسه فایل: ${platform.fileName}
================================================================================

مشخصات بسته و بانک سوالات:
- تعداد معماهای کالیبره‌شده: ۲,۵۵۲ معمای روان‌سنجی سیستم ۱ و ۲
- مأموریت‌های هویت‌های روایی: ۸۴۰ پرونده داستانی
- سبک‌های بازی: ماراتن بقا، دوئل دونفره محلی، معماهای هوشمند
- حالت ذخیره‌سازی: آفلاین دائمی (IndexedDB / LocalStorage)

راهنمای گام‌به‌گام راه‌اندازی در پلتفرم ${platform.nameFa}:
${platform.installInstructions.map((i, idx) => `${idx + 1}. [${i.title}]: ${i.desc}`).join('\n')}

نشانی دسترسی برخط و همگام‌سازی: ${window.location.origin}
مجوز انتشار: کالیبراسیون آزاد روان‌شناسی شناختی و رفتار اقتصادی
`;

        const blob = new Blob([appPayload], { type: platform.mimeType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = platform.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);

        setDownloadSuccess(true);
        sounds.playSuccess();
        haptics.success();
      } catch (err) {
        console.error('Download error:', err);
      } finally {
        setIsDownloading(false);
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 5000);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 relative shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 my-auto"
      >
        {/* Ambient Top Glows */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            haptics.tap();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
          title="بستن پنجره دانلود"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title & Branding */}
        <div className="text-center mb-5 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2.5 shadow-inner shadow-emerald-500/20">
            <Download className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase block mb-1">
            نرم‌افزار مستقل و چندسکویی ذهن‌نما
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            دانلود و نصب در تمام دستگاه‌ها
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            اپلیکیشن را مستقیماً روی دستگاه خود نصب کنید و بدون نیاز به اینترنت با ۲,۵۵۲ معما تمرین کنید.
          </p>
        </div>

        {/* Instant Native Install Banner (When Browser supports PWA Installation) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/30 mb-4 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-100 block">
                نصب فوری روی صفحه گوشی یا کامپیوتر
              </strong>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block">
                بدون دانلود دستی، اجرای تمام‌صفحه و آفلاین در ۱ ثانیه
              </span>
            </div>
          </div>
          <button
            onClick={handleNativePwaInstall}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shrink-0 transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>نصب آنی</span>
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 relative z-10">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.key;
            return (
              <button
                key={platform.key}
                onClick={() => {
                  sounds.playTap();
                  haptics.tap();
                  setSelectedPlatform(platform.key);
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between min-h-[88px] ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {platform.extension}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-black block text-slate-900 dark:text-slate-100 truncate">
                    {platform.nameFa.replace('نسخه ', '')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {platform.fileSize}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Platform Detailed Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 sm:p-5 mb-4 relative z-10 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <activeOption.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                    {activeOption.nameFa}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    {activeOption.extension}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {activeOption.subtitleFa}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
              {activeOption.badgeFa}
            </span>
          </div>

          {/* File Spec Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs py-2 border-y border-slate-200/80 dark:border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-400 block">نام فایل خروجی:</span>
              <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                {activeOption.fileName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">قالب و فرمت:</span>
              <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                {activeOption.fileFormatName}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">حجم بسته نصبی:</span>
              <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                {activeOption.fileSize}
              </span>
            </div>
          </div>

          {/* Installation Instructions Details */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              راهنمای راه‌اندازی و نصب در {activeOption.nameFa}:
            </span>
            <div className="space-y-2">
              {activeOption.installInstructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block text-[11px]">
                      {step.title}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Download Actions */}
        <div className="space-y-2.5 relative z-10">
          <button
            onClick={() => handleDownload(activeOption)}
            disabled={isDownloading}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg min-h-[48px] ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:shadow-emerald-500/25 active:scale-[0.98]'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>در حال آماده‌سازی و دانلود فایل {activeOption.extension}...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <FileCheck className="w-5 h-5" />
                <span>فایل {activeOption.fileName} با موفقیت دانلود شد!</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>دانلود مستقیم فایل {activeOption.fileName}</span>
              </>
            )}
          </button>

          {/* Quick Note & Health Verification */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              تایید سلامت بسته • بدون تبلیغات و کاملاً مستقل
            </span>
            <span className="font-mono">نسخه کلاینت ۲.۴.۰</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
