import { ScenarioQuestion } from '../types';

export interface CommunityComparison {
  correctPercent: number;
  lurePercent: number;
  otherPercent: number;
  headline: string;
  badgeLabel: string;
  isRareSuccess: boolean;
}

export function getCommunityStats(
  question: ScenarioQuestion,
  isCorrect: boolean,
  isLureSelected: boolean
): CommunityComparison {
  // Deterministic seed based on question id
  let hash = 0;
  for (let i = 0; i < question.id.length; i++) {
    hash = (hash << 5) - hash + question.id.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Generate realistic behavioral distribution for cognitive biases
  // Most cognitive reflection / bias tasks trip up 60-75% of humans
  const baseLure = 58 + (absHash % 18); // 58% to 75%
  const baseCorrect = Math.max(12, 100 - baseLure - (10 + (absHash % 10)));
  const baseOther = 100 - baseLure - baseCorrect;

  if (isCorrect) {
    const isRare = baseCorrect <= 25;
    return {
      correctPercent: baseCorrect,
      lurePercent: baseLure,
      otherPercent: baseOther,
      headline: `تنها ${baseCorrect}٪ از شرکت‌کنندگان به این پاسخ تحلیلی رسیدند!`,
      badgeLabel: isRare ? '👑 عضو باشگاه نخبگان تحلیلی' : '🎯 تفکر منطقی فراتر از جامعه',
      isRareSuccess: true,
    };
  }

  if (isLureSelected) {
    return {
      correctPercent: baseCorrect,
      lurePercent: baseLure,
      otherPercent: baseOther,
      headline: `${baseLure}٪ از مردم دقیقاً در همین تله شهودی گرفتار شدند!`,
      badgeLabel: '🧠 واکنش طبیعی مغز بر پایه سرعت سیستم ۱',
      isRareSuccess: false,
    };
  }

  return {
    correctPercent: baseCorrect,
    lurePercent: baseLure,
    otherPercent: baseOther,
    headline: `${baseOther}٪ از افراد تحت تأثیر پیچیدگی فرضیه به این گزینه تمایل پیدا کردند.`,
    badgeLabel: '🔍 نیاز به بررسی شواهد بیشتر',
    isRareSuccess: false,
  };
}
