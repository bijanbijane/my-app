import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  Gauge,
  Clock,
  Zap,
  Volume2,
  VolumeX,
  Users,
  Search,
  Shield,
  Flame,
} from 'lucide-react';
import { ScenarioQuestion, TrialResult, UserProfile } from '../types';
import { evaluateTrial } from '../scoring/scoringEngine';
import { CONSTRUCT_METADATA } from '../data/scoringConfig';
import { COGNITIVE_ROLES } from '../data/cognitiveRoles';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import {
  getConfidenceHumor,
  getRandomTrapRoast,
  getRandomSuccessPraise,
} from '../utils/cognitiveHumor';
import {
  getQuestionVisual,
  formatConcisePrompt,
  formatConciseExplanation,
} from '../utils/questionVisuals';
import { getCommunityStats } from '../utils/socialMirror';

interface GamePlayerProps {
  question: ScenarioQuestion;
  profile: UserProfile;
  onFinishGame: (result: TrialResult) => void;
  onExit: () => void;
  onNextGame: () => void;
}

type GamePhase = 'decision' | 'confidence' | 'second_stage' | 'result';

export const GamePlayer: React.FC<GamePlayerProps> = ({
  question,
  profile,
  onFinishGame,
  onExit,
  onNextGame,
}) => {
  const [phase, setPhase] = useState<GamePhase>('decision');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [revisedOptionId, setRevisedOptionId] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(70);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [wittyComment, setWittyComment] = useState<string>('');
  const [isEntering, setIsEntering] = useState<boolean>(true);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [isAmbienceMuted, setIsAmbienceMuted] = useState<boolean>(() => sounds.ambienceMuted);

  // Role Special Powers State
  const [isPowerUsed, setIsPowerUsed] = useState<boolean>(false);
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState<string[]>([]);
  const [highlightedOptionIds, setHighlightedOptionIds] = useState<string[]>([]);
  const [roleClue, setRoleClue] = useState<string | null>(null);
  const [isSpeedBoosted, setIsSpeedBoosted] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const responseTimeMsRef = useRef<number>(0);

  // Role Ambient Soundscape lifecycle
  useEffect(() => {
    if (profile.activeRoleId) {
      sounds.startRoleAmbience(profile.activeRoleId);
    }
    return () => {
      sounds.stopRoleAmbience();
    };
  }, [profile.activeRoleId]);

  useEffect(() => {
    setPhase('decision');
    setSelectedOptionId(null);
    setRevisedOptionId(null);
    setConfidence(70);
    setResult(null);
    setWittyComment('');
    setIsEntering(true);
    setShowExitConfirm(false);
    setIsPowerUsed(false);
    setEliminatedOptionIds([]);
    setHighlightedOptionIds([]);
    setRoleClue(null);
    setIsSpeedBoosted(false);
    startTimeRef.current = Date.now();

    // Mysterious door whisper entrance sound
    sounds.playDoorOpen();
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [question.id]);

  const handleActivateRolePower = () => {
    if (isPowerUsed || !profile.activeRoleId) return;
    const roleConfig = COGNITIVE_ROLES[profile.activeRoleId];
    if (!roleConfig) return;

    sounds.playLevelUp();
    haptics.levelUp();
    setIsPowerUsed(true);

    if (profile.activeRoleId === 'detective') {
      const lureId = question.intuitiveAnswerId;
      const incorrectOpts = question.options.filter((o) => o.id !== question.correctAnswerId);
      const toEliminate = lureId || incorrectOpts[0]?.id;
      if (toEliminate) {
        setEliminatedOptionIds([toEliminate]);
      }
    } else if (profile.activeRoleId === 'judge') {
      const lureId = question.intuitiveAnswerId || question.options.find((o) => o.id !== question.correctAnswerId)?.id;
      if (lureId) {
        setHighlightedOptionIds([lureId]);
      }
    } else if (profile.activeRoleId === 'sage') {
      setRoleClue('راز فرزانگی: نخستین پاسخی که به ذهنت می‌رسد حاصل میان‌برهای هیجانی است؛ به عددها و شواهد خلاف آن دقت کن.');
    } else if (profile.activeRoleId === 'police') {
      setIsSpeedBoosted(true);
    } else if (profile.activeRoleId === 'herbalist') {
      setRoleClue('اکسیر عطار: ذهن خود را بر شواهد عینی متمرکز کن؛ روایت‌های پرهیاهو معمولاً دارونما هستند.');
    } else if (profile.activeRoleId === 'chef') {
      const incorrectOpts = question.options.filter((o) => o.id !== question.correctAnswerId);
      if (incorrectOpts.length > 0) {
        setEliminatedOptionIds([incorrectOpts[0].id]);
      }
    }
  };

  const handleSelectFirstOption = (optId: string) => {
    sounds.playTap();
    haptics.tap();
    const elapsed = Date.now() - startTimeRef.current;
    responseTimeMsRef.current = elapsed;
    setSelectedOptionId(optId);

    // Ensure game never abruptly skips or jumps out on first tap
    if (question.hasSecondStage && question.confidenceRequired === false) {
      setPhase('second_stage');
    } else {
      setPhase('confidence');
    }
  };

  const handleQuickConfidence = (val: number) => {
    sounds.playTap();
    haptics.tap();
    setConfidence(val);
    const firstOpt = selectedOptionId || question.options[0]?.id;
    if (question.hasSecondStage) {
      setPhase('second_stage');
    } else {
      finalizeGame(firstOpt, undefined, val);
    }
  };

  const handleConfirmConfidence = () => {
    sounds.playTap();
    haptics.tap();
    const firstOpt = selectedOptionId || question.options[0]?.id;
    if (question.hasSecondStage) {
      setPhase('second_stage');
    } else {
      finalizeGame(firstOpt, undefined, confidence);
    }
  };

  const handleSelectSecondOption = (optId: string) => {
    sounds.playTap();
    haptics.tap();
    setRevisedOptionId(optId);
    const firstOpt = selectedOptionId || question.options[0]?.id;
    finalizeGame(firstOpt, optId, confidence);
  };

  const finalizeGame = (
    firstChoice: string,
    secondChoice: string | undefined,
    finalConfidence: number
  ) => {
    const effectiveAnswer = secondChoice || firstChoice;
    const trial = evaluateTrial({
      question,
      selectedAnswerId: effectiveAnswer,
      responseTimeMs: responseTimeMsRef.current,
      confidence: finalConfidence,
      firstChoiceId: firstChoice,
      revisedChoiceId: secondChoice,
    });

    if (isSpeedBoosted && trial.isCorrect) {
      trial.score = Math.min(100, Math.round(trial.score * 1.3));
    }

    if (trial.isCorrect) {
      sounds.playSuccess();
      haptics.success();
      setWittyComment(getRandomSuccessPraise(profile.tonePreference));
    } else if (trial.isIntuitiveLureSelected) {
      sounds.playTrap();
      haptics.trap();
      setWittyComment(getRandomTrapRoast(profile.tonePreference));
    } else {
      sounds.playTap();
      haptics.tap();
      setWittyComment(
        profile.tonePreference === 'academic'
          ? 'پیچیدگی چندمتغیره گزاره‌ها نیاز به وارسی دقیق‌تر مفروضات دارد.'
          : 'تاریکی معما عمیق‌تر از این حرف‌ها بود؛ اینجا مغزت نیاز به بازنگری داشت!'
      );
    }

    setResult(trial);
    setPhase('result');
    onFinishGame(trial);
  };

  const confidenceHumor = getConfidenceHumor(confidence);
  const primaryMeta = CONSTRUCT_METADATA[question.primaryConstruct];
  const visual = getQuestionVisual(question, profile.activeRoleId);
  const concisePrompt = formatConcisePrompt(question.prompt);
  const conciseExpl = formatConciseExplanation(question.explanation, question.reflectiveInsight);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-20 transition-colors">
      {/* Top Bar during Game */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            haptics.tap();
            setShowExitConfirm(true);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>فرار از معما</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Toggle for Active Role */}
          {profile.activeRoleId && (
            <button
              onClick={() => {
                haptics.tap();
                const muted = sounds.toggleAmbienceMute();
                setIsAmbienceMuted(muted);
              }}
              className="px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-750 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-500 text-xs flex items-center gap-1.5 transition-colors min-h-[36px]"
              title={isAmbienceMuted ? 'روشن کردن صدای محیطی نقش' : 'خاموش کردن صدای محیطی نقش'}
            >
              {isAmbienceMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              )}
              <span className="text-[10px] font-bold hidden sm:inline">
                {isAmbienceMuted ? 'صدا قطع' : 'محیط صوتی'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{primaryMeta.categoryFa}</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{primaryMeta.nameFa}</span>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl text-center">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
              انصراف از این معما؟
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              اگر اکنون خارج شوی، این معما ناتمام می‌ماند و امتیازی ثبت نخواهد شد.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  haptics.tap();
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors min-h-[44px]"
              >
                ادامه معما
              </button>
              <button
                onClick={() => {
                  haptics.tap();
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors min-h-[44px]"
              >
                خروج به تالار
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={`max-w-xl mx-auto w-full px-4 pt-4 flex-1 flex flex-col transition-all duration-500 ease-out ${
          isEntering ? 'opacity-0 scale-95 -rotate-1 blur-xs' : 'opacity-100 scale-100 rotate-0 blur-none'
        }`}
      >
        {/* PHASE 1: INITIAL DECISION */}
        {phase === 'decision' && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            <div>
              {/* Active Role Persona Badge */}
              {profile.activeRoleId && COGNITIVE_ROLES[profile.activeRoleId] && (
                <div className="mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold shadow-xs">
                  <span>{COGNITIVE_ROLES[profile.activeRoleId].avatarEmoji}</span>
                  <span className="text-amber-400">
                    در نقش {COGNITIVE_ROLES[profile.activeRoleId].nameFa}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 text-[11px] font-normal">
                    {COGNITIVE_ROLES[profile.activeRoleId].badgeTitleFa}
                  </span>
                </div>
              )}

              {/* Visual Scene Card for EVERY question */}
              <div className="relative rounded-2xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src={visual.imageUrl}
                  alt={visual.altText}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs border border-white/20 text-xs font-bold text-slate-100 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{visual.badgeLabelFa}</span>
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {question.context || primaryMeta.nameFa}
                  </span>
                </div>
              </div>

              <div className="mb-2.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {question.title}
                </h2>
              </div>

              {/* Scenario Prompt - Crisp and Scannable */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {concisePrompt}
                </p>
              </div>

              {/* Role Power Trigger Bar */}
              {profile.activeRoleId && COGNITIVE_ROLES[profile.activeRoleId] && (
                <div className="mb-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <span>{COGNITIVE_ROLES[profile.activeRoleId].avatarEmoji}</span>
                    <span>{COGNITIVE_ROLES[profile.activeRoleId].nameFa}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isPowerUsed}
                    onClick={handleActivateRolePower}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shadow-xs min-h-[36px] ${
                      isPowerUsed
                        ? 'bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/25 active:scale-95 animate-pulse'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isPowerUsed
                        ? 'قدرت مصرف شد'
                        : `مهارت: ${COGNITIVE_ROLES[profile.activeRoleId].powerNameFa}`}
                    </span>
                  </button>
                </div>
              )}

              {/* Role Clue Banner */}
              {roleClue && (
                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-300 dark:border-cyan-500/30 text-xs text-cyan-900 dark:text-cyan-200 mb-3 flex items-start gap-2 shadow-xs animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{roleClue}</span>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                <span className="text-xs text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                  دستت روی کدوم دکمه می‌لرزه؟ وسوسه نشو!
                </span>
                {question.options.map((option, idx) => {
                  const isEliminated = eliminatedOptionIds.includes(option.id);
                  const isHighlighted = highlightedOptionIds.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      disabled={isEliminated}
                      onClick={() => handleSelectFirstOption(option.id)}
                      className={`w-full text-right p-4 rounded-xl border transition-all text-sm font-medium flex items-start gap-3 group shadow-xs min-h-[48px] ${
                        isEliminated
                          ? 'opacity-35 line-through bg-slate-100 dark:bg-slate-900/40 border-rose-300 dark:border-rose-900/40 text-slate-400 cursor-not-allowed'
                          : isHighlighted
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 ring-1 ring-amber-500/50'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-amber-50/50 dark:hover:bg-slate-800/80 hover:border-amber-500/50 active:scale-[0.99] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 group-hover:text-amber-500 shrink-0 mt-0.5 tabular-nums font-bold">
                        {idx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{option.text}</span>
                      {isEliminated && (
                        <span className="text-[10px] text-rose-500 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 shrink-0 self-center">
                          مردود توسط مهارت نقش
                        </span>
                      )}
                      {isHighlighted && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 shrink-0 self-center">
                          تله لنگر مشکوک
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>نبض سرعت و مکث ذهنت در حال ثبت است</span>
            </div>
          </div>
        )}

        {/* PHASE 2: CONFIDENCE RATING (PLAYFUL & ENIGMATIC) */}
        {phase === 'confidence' && (
          <div className="flex-1 flex flex-col justify-center animate-fadeIn py-2">
            {/* Visual Continuity Header */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3 shadow-xs">
              <img
                src={visual.imageUrl}
                alt={visual.altText}
                referrerPolicy="no-referrer"
                className="w-14 h-11 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-500 font-bold block">{visual.badgeLabelFa}</span>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{question.title}</h3>
              </div>
            </div>

            {/* Selected Choice Reminder (حل قطعی گپ شناختی حافظه) */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 text-xs space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-600 dark:text-amber-400">پاسخ ثبت‌شده شما:</span>
                <span className="text-slate-400 text-[10px] line-clamp-1 max-w-[180px]">{formatConcisePrompt(question.prompt)}</span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                «{question.options.find((o) => o.id === selectedOptionId)?.text || 'گزینه اول'}»
              </p>
            </div>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center mb-2">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                راستش رو بگو؛ چقدر پاش وامیستی؟
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                اینجا پای غرور در میانه است! آیا واقعاً مطمئنی یا فقط داری با اعتماد‌به‌نفس بلوف می‌زنی؟
              </p>
            </div>

            {/* Quick 1-Tap Presets - High-Velocity Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {[
                { val: 25, title: '۲۵٪', icon: '🎲', label: 'شانسی زدم' },
                { val: 50, title: '۵۰٪', icon: '⚖️', label: 'دودلم' },
                { val: 75, title: '۷۵٪', icon: '🎯', label: 'مطمئنم' },
                { val: 100, title: '۱۰۰٪', icon: '🔥', label: 'قسم می‌خورم' },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => handleQuickConfidence(p.val)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-center active:scale-95 transition-all shadow-xs group"
                >
                  <span className="text-base block mb-0.5">{p.icon}</span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400 block tabular-nums group-hover:scale-105 transition-transform">
                    {p.title}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mt-0.5">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Fine Slider Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-5 shadow-sm">
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  {confidence}٪
                </span>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  «{confidenceHumor.label}»
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block italic">
                  {confidenceHumor.sub}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={confidence}
                onChange={(e) => {
                  setConfidence(Number(e.target.value));
                  haptics.slider();
                }}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
                <span>تیر در تاریکی (۰٪)</span>
                <span>تردید محض (۵۰٪)</span>
                <span>سند شش‌دانگ (۱۰۰٪)</span>
              </div>
            </div>

            <button
              onClick={handleConfirmConfidence}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all min-h-[48px]"
            >
              ثبت ادعا و رمزگشایی نتیجه!
            </button>
          </div>
        )}

        {/* PHASE 3: SECOND STAGE (EVIDENCE UPDATING) */}
        {phase === 'second_stage' && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn py-2">
            <div>
              {/* Visual Continuity Header */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3 shadow-xs">
                <img
                  src={visual.imageUrl}
                  alt={visual.altText}
                  referrerPolicy="no-referrer"
                  className="w-14 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-amber-500 font-bold block">{visual.badgeLabelFa}</span>
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{question.title}</h3>
                </div>
              </div>

              {/* Previous Choice Recap Card */}
              {selectedOptionId && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-3 text-xs flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">تصمیم اولیه شما:</span>
                  <span className="font-black text-amber-600 dark:text-amber-400">
                    «{question.options.find((o) => o.id === selectedOptionId)?.text || 'گزینه اول'}»
                  </span>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>مدرک پنهان رو شد؛ آزمون چرخش باور!</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 shadow-xs">
                <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">
                  شواهد تازه صحنه:
                </p>
                <p>{question.stageTwoPrompt || question.stageTwoEvidence}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">
                حالا با این مدرک رو شده، سر حرف اولت می‌مونی (یک‌دندگی) یا موضع جدید می‌گیری؟
              </p>

              <div className="space-y-2.5">
                {question.stageTwoOptions?.map((opt, idx) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectSecondOption(opt.id)}
                    className="w-full text-right p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:bg-amber-50/50 dark:hover:bg-slate-800 hover:border-amber-500/40 text-sm text-slate-800 dark:text-slate-200 transition-all flex items-start gap-3 group min-h-[48px]"
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 group-hover:text-amber-500 shrink-0 mt-0.5 tabular-nums font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: RESULT & COGNITIVE ANALYSIS */}
        {phase === 'result' && result && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn py-2">
            <div>
              {/* Visual Continuity Header */}
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3 shadow-xs">
                <img
                  src={visual.imageUrl}
                  alt={visual.altText}
                  referrerPolicy="no-referrer"
                  className="w-12 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-amber-500 font-bold block">{visual.badgeLabelFa}</span>
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{question.title}</h3>
                </div>
              </div>

              {/* Humorous Banner */}
              <div
                className={`p-4 rounded-2xl border mb-4 flex items-start gap-3.5 shadow-sm ${
                  result.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    : result.isIntuitiveLureSelected
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
                }`}
              >
                {result.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : result.isIntuitiveLureSelected ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {result.isCorrect
                      ? 'دست تله رو خواندی! پیروزی تحلیلی'
                      : result.isIntuitiveLureSelected
                      ? 'درست افتادی تو دهان تله شهود!'
                      : 'تاریکی معما عمیق‌تر از این حرف‌ها بود'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed font-semibold">
                    {wittyComment}
                  </p>
                  <p className="text-[11px] mt-1.5 opacity-80 leading-relaxed">
                    {question.reflectiveInsight}
                  </p>
                </div>
              </div>

              {/* Secret Explanation - Crisp, Fast & Scannable */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 shadow-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold text-xs shrink-0">💡 چرا؟</span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {conciseExpl.rule}
                  </p>
                </div>
                {conciseExpl.takeaway && (
                  <div className="flex items-start gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-cyan-500 font-bold text-xs shrink-0">🎯 نکته:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {conciseExpl.takeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Behavioral Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">مکث قبل از تصمیم</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 tabular-nums">
                    {(result.responseTimeMs / 1000).toFixed(1)} ثانیه
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">ادعای اطمینان</span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {result.confidence}٪
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">امتیاز کسب‌شده</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                    +{result.score}
                  </span>
                </div>
              </div>

              {/* Social Mirror - Community Statistical Comparison */}
              {(() => {
                const communityStats = getCommunityStats(question, result.isCorrect, result.isIntuitiveLureSelected);
                return (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 dark:from-slate-900 via-white dark:via-slate-900 to-indigo-100/30 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-500/25 mb-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>آینه آماری جامعه (توزیع پاسخ‌ها)</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
                        {communityStats.badgeLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-bold mb-2.5 leading-relaxed">
                      {communityStats.headline}
                    </p>

                    {/* Distribution Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${communityStats.correctPercent}%` }}
                          className="bg-emerald-500 h-full transition-all duration-700"
                          title="پاسخ تحلیلی"
                        />
                        <div
                          style={{ width: `${communityStats.lurePercent}%` }}
                          className="bg-amber-500 h-full transition-all duration-700"
                          title="تله شهودی"
                        />
                        <div
                          style={{ width: `${communityStats.otherPercent}%` }}
                          className="bg-slate-400 h-full transition-all duration-700"
                          title="سایر گزینه‌ها"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5 font-medium">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          تحلیلی: {communityStats.correctPercent}٪
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          تله شهودی: {communityStats.lurePercent}٪
                        </span>
                        <span>سایر: {communityStats.otherPercent}٪</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cliffhanger Next Puzzle Teaser */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 mb-2 text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block text-xs">
                      چالش بعدی در کمین است:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                      پرونده بعدی آماده است؛ آیا این بار مچ تله را می‌خوانی؟
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shrink-0">
                  داغ 🔥
                </span>
              </div>

              {/* Footnote */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>سازه محک‌خورده: {primaryMeta.nameFa}</span>
                <span>ریشه معما: {question.sourceBasis}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  haptics.tap();
                  onExit();
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors min-h-[48px]"
              >
                خروج به تالار اصلی
              </button>
              <button
                onClick={() => {
                  haptics.tap();
                  onNextGame();
                }}
                className="flex-[2] py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all min-h-[48px]"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>معمای بعدی (انتقام فوری!)</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
