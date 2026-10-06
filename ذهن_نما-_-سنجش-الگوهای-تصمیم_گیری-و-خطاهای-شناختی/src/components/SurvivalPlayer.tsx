import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Zap, Clock, Trophy, RotateCcw, ArrowRight, ShieldAlert, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScenarioQuestion, TrialResult, UserProfile } from '../types';
import { ALL_QUESTIONS } from '../data/questionBank';
import { evaluateTrial } from '../scoring/scoringEngine';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import { getQuestionVisual, formatConcisePrompt } from '../utils/questionVisuals';

interface SurvivalPlayerProps {
  profile: UserProfile;
  onFinishSurvival: (stats: { finalScore: number; streak: number; trials: TrialResult[] }) => void;
  onExit: () => void;
}

const QUESTION_TIME_LIMIT = 14; // 14 seconds per question

export const SurvivalPlayer: React.FC<SurvivalPlayerProps> = ({
  profile,
  onFinishSurvival,
  onExit,
}) => {
  const [lives, setLives] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Randomized question queue
  const [shuffledQuestions, setShuffledQuestions] = useState<ScenarioQuestion[]>(() => {
    return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  });

  const recordedTrialsRef = useRef<TrialResult[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const currentQuestion = shuffledQuestions[currentIndex % shuffledQuestions.length];
  const visual = getQuestionVisual(currentQuestion, profile.activeRoleId);
  const concisePrompt = formatConcisePrompt(currentQuestion.prompt);

  // Multiplier based on streak
  const multiplier = streak >= 9 ? 3 : streak >= 6 ? 2.5 : streak >= 3 ? 2 : streak >= 1 ? 1.5 : 1;

  // Countdown timer effect
  useEffect(() => {
    if (isGameOver || isAnswered) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          sounds.playTick();
        }
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isGameOver, isAnswered]);

  const handleTimeOut = () => {
    sounds.playHeartBreak();
    haptics.trap();
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);

    const newLives = lives - 1;
    setLives(newLives);
    setIsAnswered(true);
    setLastAnswerStatus('wrong');
    setFeedbackMessage('زمان به اتمام رسید! تله زمان شلیک کرد.');

    if (newLives <= 0) {
      setTimeout(() => triggerGameOver(), 1000);
    } else {
      setTimeout(() => nextQuestion(), 1200);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswered || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswered(true);
    const responseTime = Date.now() - startTimeRef.current;
    const isCorrect = optionId === currentQuestion.correctAnswerId;
    const isLure = optionId === currentQuestion.intuitiveAnswerId;

    const trial = evaluateTrial({
      question: currentQuestion,
      selectedAnswerId: optionId,
      responseTimeMs: responseTime,
      confidence: 85,
    });
    recordedTrialsRef.current.push(trial);

    if (isCorrect) {
      sounds.playSuccess();
      haptics.success();
      setLastAnswerStatus('correct');
      const earned = Math.round(trial.score * multiplier);
      setTotalScore((prev) => prev + earned);
      setStreak((prev) => prev + 1);
      setFeedbackMessage(`شکار عالی! +${earned} امتیاز (ضریب x${multiplier})`);

      setTimeout(() => nextQuestion(), 800);
    } else {
      sounds.playHeartBreak();
      haptics.trap();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      setLastAnswerStatus('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      if (isLure) {
        setFeedbackMessage('دام شهودی! مغز سریع در تله افتاد.');
      } else {
        setFeedbackMessage('اشتباه در تحلیل شواهد!');
      }

      if (newLives <= 0) {
        setTimeout(() => triggerGameOver(), 1100);
      } else {
        setTimeout(() => nextQuestion(), 1300);
      }
    }
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setLastAnswerStatus(null);
    setFeedbackMessage('');
    setTimeLeft(QUESTION_TIME_LIMIT);
    startTimeRef.current = Date.now();
    setCurrentIndex((prev) => prev + 1);
  };

  const triggerGameOver = () => {
    setIsGameOver(true);
    sounds.playLevelUp();
    haptics.levelUp();
  };

  const handleRestart = () => {
    sounds.playTap();
    haptics.tap();
    setLives(3);
    setStreak(0);
    setTotalScore(0);
    setCurrentIndex(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsGameOver(false);
    setIsAnswered(false);
    setLastAnswerStatus(null);
    setFeedbackMessage('');
    recordedTrialsRef.current = [];
    startTimeRef.current = Date.now();
    setShuffledQuestions([...ALL_QUESTIONS].sort(() => Math.random() - 0.5));
  };

  const handleQuit = () => {
    sounds.playTap();
    onFinishSurvival({
      finalScore: totalScore,
      streak,
      trials: recordedTrialsRef.current,
    });
    onExit();
  };

  const bestRecord = Math.max(profile.bestSurvivalStreak || 0, streak);
  const isNewRecord = streak > (profile.bestSurvivalStreak || 0);

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-300 ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* Top Blitz Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={handleQuit}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title="خروج از ماراتن"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Lives (Hearts) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800">
            {[1, 2, 3].map((heartIndex) => (
              <motion.div
                key={heartIndex}
                animate={heartIndex <= lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    heartIndex <= lives
                      ? 'fill-rose-500 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'text-slate-600 fill-slate-800'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Current Score & Multiplier */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold tabular-nums">
              x{multiplier}
            </span>
            <span className="text-sm font-black text-amber-400 tabular-nums">
              {totalScore}
            </span>
          </div>
        </div>

        {/* Dynamic Countdown Time Bar */}
        <div className="max-w-2xl mx-auto mt-2.5">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-all ${
                timeLeft <= 4
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                  : timeLeft <= 8
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Blitz Play Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 flex flex-col justify-between">
        {!isGameOver ? (
          <div className="space-y-4">
            {/* Streak Counter Banner */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>زنجیره بقا: {streak} معما</span>
              </span>
              <span className="tabular-nums font-mono text-[11px]">
                زمان: {timeLeft} ثانیه
              </span>
            </div>

            {/* Visual Thumbnail */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <img
                src={visual.imageUrl}
                alt={visual.altText}
                referrerPolicy="no-referrer"
                className="w-16 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-400 font-bold block">{visual.badgeLabelFa}</span>
                <h3 className="text-xs font-black text-slate-200 truncate">{currentQuestion.title}</h3>
              </div>
            </div>

            {/* Prompt */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm font-bold leading-relaxed text-slate-100">
              {concisePrompt}
            </div>

            {/* Feedback Alert if Answered */}
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  lastAnswerStatus === 'correct'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                {lastAnswerStatus === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{feedbackMessage}</span>
              </motion.div>
            )}

            {/* Fast 1-Tap Option Buttons */}
            <div className="space-y-2.5 pt-1">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option.id === currentQuestion.correctAnswerId;
                const isSelected = isAnswered && option.id === currentQuestion.intuitiveAnswerId;

                let optStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/40 hover:bg-slate-850';
                if (isAnswered) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  } else {
                    optStyle = 'bg-slate-900/40 border-slate-850 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-right p-4 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 active:scale-[0.98] min-h-[50px] ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* GAME OVER MODAL */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs text-rose-400 font-black tracking-wider uppercase">
                خط پایان ماراتن بقا
              </span>
              <h2 className="text-xl font-black text-slate-100 mt-1">
                تله‌های شناختی جان‌ها را بلعیدند!
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block">زنجیره بقا (رکورد)</span>
                <span className="text-xl font-black text-amber-400 tabular-nums">
                  {streak} معما
                </span>
                {isNewRecord && (
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                    🎉 رکورد جدید شخصی!
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">مجموع امتیاز بقا</span>
                <span className="text-xl font-black text-indigo-400 tabular-nums">
                  {totalScore}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleQuit}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors min-h-[48px]"
              >
                خروج به تالار
              </button>
              <button
                onClick={handleRestart}
                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[48px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>شروع ماراتن جدید (انتقام فوری!)</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
