import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Trophy, X, ArrowRight, User, CheckCircle2, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import { ALL_QUESTIONS } from '../data/questionBank';
import { ScenarioQuestion } from '../types';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';

interface DuelModalProps {
  onClose: () => void;
}

type DuelStage = 'setup' | 'player1_turn' | 'pass_to_player2' | 'player2_turn' | 'round_result' | 'duel_winner';

export const DuelModal: React.FC<DuelModalProps> = ({ onClose }) => {
  const [stage, setStage] = useState<DuelStage>('setup');
  const [player1Name, setPlayer1Name] = useState<string>('بازیکن ۱');
  const [player2Name, setPlayer2Name] = useState<string>('بازیکن ۲');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  const [duelQuestions, setDuelQuestions] = useState<ScenarioQuestion[]>(() => {
    return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4);
  });

  const [p1Choice, setP1Choice] = useState<string | null>(null);
  const [p2Choice, setP2Choice] = useState<string | null>(null);

  const currentQ = duelQuestions[currentRound] || duelQuestions[0];

  const handleStartDuel = () => {
    sounds.playLevelUp();
    haptics.levelUp();
    setStage('player1_turn');
    setCurrentRound(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setP1Choice(null);
    setP2Choice(null);
  };

  const handlePlayer1Submit = (optionId: string) => {
    sounds.playTap();
    haptics.tap();
    setP1Choice(optionId);
    setStage('pass_to_player2');
  };

  const handlePlayer2Submit = (optionId: string) => {
    sounds.playTap();
    haptics.tap();
    setP2Choice(optionId);

    // Calculate scores for this round
    const p1Correct = p1Choice === currentQ.correctAnswerId;
    const p2Correct = optionId === currentQ.correctAnswerId;

    if (p1Correct) setPlayer1Score((prev) => prev + 100);
    if (p2Correct) setPlayer2Score((prev) => prev + 100);

    setStage('round_result');
  };

  const handleNextRound = () => {
    sounds.playTap();
    haptics.tap();
    if (currentRound + 1 < duelQuestions.length) {
      setCurrentRound((prev) => prev + 1);
      setP1Choice(null);
      setP2Choice(null);
      setStage('player1_turn');
    } else {
      sounds.playSuccess();
      haptics.levelUp();
      setStage('duel_winner');
    }
  };

  const handleRestart = () => {
    setDuelQuestions([...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4));
    handleStartDuel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* SETUP SCREEN */}
        {stage === 'setup' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center">
              <Swords className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                دوئل دونفره مغزها (همین گوشی)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                ۴ معمای وسوسه‌کننده رو به نوبت جواب بدید تا مشخص بشه مغز کدومتون ضدگلوله‌تره و کمتر فریب تله‌ها رو می‌خوره!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-right">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  نام بازیکن اول
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  نام بازیکن دوم
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <button
              onClick={handleStartDuel}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all mt-4 min-h-[48px]"
            >
              <Swords className="w-4 h-4 fill-slate-950" />
              <span>شروع دوئل و کل‌کل دونفره</span>
            </button>
          </div>
        )}

        {/* PLAYER 1 TURN */}
        {stage === 'player1_turn' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-500 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>نوبت {player1Name} (بازیکن دوم نبیند!)</span>
              </span>
              <span className="text-slate-400">راند {currentRound + 1} از {duelQuestions.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
              {currentQ.prompt}
            </div>

            <div className="space-y-2">
              {currentQ.options.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => handlePlayer1Submit(option.id)}
                  className="w-full text-right p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 transition-all font-medium"
                >
                  <span className="font-bold text-amber-500 ml-2">{idx + 1}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASS PHONE TO PLAYER 2 */}
        {stage === 'pass_to_player2' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center animate-bounce">
              <User className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                پاسخ {player1Name} مخفیانه ثبت شد!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                گوشی را به دست <strong>{player2Name}</strong> بدهید تا نوبت خودش را بازی کند.
              </p>
            </div>

            <button
              onClick={() => setStage('player2_turn')}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all min-h-[48px]"
            >
              <span>من {player2Name} هستم، آماده‌ام!</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* PLAYER 2 TURN */}
        {stage === 'player2_turn' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-500 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>نوبت {player2Name}</span>
              </span>
              <span className="text-slate-400">راند {currentRound + 1} از {duelQuestions.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
              {currentQ.prompt}
            </div>

            <div className="space-y-2">
              {currentQ.options.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => handlePlayer2Submit(option.id)}
                  className="w-full text-right p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-white dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 transition-all font-medium"
                >
                  <span className="font-bold text-indigo-500 ml-2">{idx + 1}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ROUND REVEAL */}
        {stage === 'round_result' && (
          <div className="space-y-4 py-1">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold text-amber-500">نتیجه راند {currentRound + 1}</span>
              <div className="flex items-center gap-3 font-mono font-bold text-xs">
                <span className="text-amber-500">{player1Name}: {player1Score}</span>
                <span>-</span>
                <span className="text-indigo-400">{player2Name}: {player2Score}</span>
              </div>
            </div>

            {/* Answer Comparison */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-3 rounded-xl border text-center ${
                p1Choice === currentQ.correctAnswerId
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/40 text-rose-700 dark:text-rose-300'
              }`}>
                <span className="font-bold block mb-1">{player1Name}</span>
                {p1Choice === currentQ.correctAnswerId ? 'پاسخ تحلیلی درست ✅' : 'گرفتار تله شد ❌'}
              </div>

              <div className={`p-3 rounded-xl border text-center ${
                p2Choice === currentQ.correctAnswerId
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/40 text-rose-700 dark:text-rose-300'
              }`}>
                <span className="font-bold block mb-1">{player2Name}</span>
                {p2Choice === currentQ.correctAnswerId ? 'پاسخ تحلیلی درست ✅' : 'گرفتار تله شد ❌'}
              </div>
            </div>

            {/* Explanation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">رمزگشایی معما:</span>
              {currentQ.explanation}
            </div>

            <button
              onClick={handleNextRound}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all min-h-[48px]"
            >
              <span>{currentRound + 1 < duelQuestions.length ? 'راند بعدی' : 'مشاهده برنده نهایی دوئل'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* DUEL WINNER */}
        {stage === 'duel_winner' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-500 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">
                پایان نبرد شناختی
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {player1Score > player2Score
                  ? `👑 پیروز میدان: ${player1Name}!`
                  : player2Score > player1Score
                  ? `👑 پیروز میدان: ${player2Name}!`
                  : '🤝 نبرد بدون برنده: تساوی عقل و شهود!'}
              </h2>
            </div>

            <div className="flex items-center justify-around p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <div>
                <span className="text-slate-400 text-[10px] block">{player1Name}</span>
                <span className="text-base text-amber-500">{player1Score} امتیاز</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">مقابل</span>
              <div>
                <span className="text-slate-400 text-[10px] block">{player2Name}</span>
                <span className="text-base text-indigo-400">{player2Score} امتیاز</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                بستن
              </button>
              <button
                onClick={handleRestart}
                className="flex-[2] py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسابقه انتقامی جدید</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
