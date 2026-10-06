import {
  ConstructId,
  ConstructScore,
  ConfidenceReliability,
  TrialResult,
  UserProfile,
  WeeklySummary,
} from '../types';
import { CONSTRUCT_METADATA, LEVEL_DEFINITIONS } from '../data/scoringConfig';
import { ALL_QUESTIONS, QUESTION_MAP } from '../data/questionBank';

export interface CategoryProfileStat {
  id: string;
  nameFa: string;
  tagFa: string;
  iconType: 'biases' | 'memory' | 'logic' | 'social' | 'risk';
  playedCount: number;
  correctCount: number;
  accuracyRate: number;
  uniqueAnsweredCount: number;
  totalAvailableCount: number;
  coveragePercent: number;
  avgConfidence: number;
  descriptionFa: string;
}

export interface DetailedProfileDashboardStats {
  totalGames: number;
  uniqueQuestionsAnswered: number;
  correctCount: number;
  accuracyRate: number;
  completedMissions: number;
  totalXp: number;
  streak: number;
  bestSurvivalStreak: number;
  totalPuzzlesAvailable: number;
  overallCoveragePercent: number;
  categories: {
    cognitiveBiases: CategoryProfileStat;
    memoryGames: CategoryProfileStat;
    logicalAnalysis: CategoryProfileStat;
    socialInference: CategoryProfileStat;
    riskAmbiguity: CategoryProfileStat;
  };
  categoryList: CategoryProfileStat[];
}

export const INITIAL_CONSTRUCT_IDS: ConstructId[] = [
  'cognitive_reflection',
  'reasoning_accuracy',
  'decision_quality',
  'cognitive_flexibility',
  'metacognitive_calibration',
  'bias_resistance',
  'social_inference',
  'emotion_inference',
  'ambiguity_tolerance',
  'speed_accuracy_balance',
  'self_awareness',
  'evidence_updating',
];

export function createInitialProfile(): UserProfile {
  const constructs: Record<ConstructId, ConstructScore> = {} as Record<ConstructId, ConstructScore>;

  for (const cId of INITIAL_CONSTRUCT_IDS) {
    const meta = CONSTRUCT_METADATA[cId];
    constructs[cId] = {
      constructId: cId,
      nameFa: meta.nameFa,
      descriptionFa: meta.descriptionFa,
      score: 50,
      trialsCount: 0,
      reliability: 'insufficient',
      trend: 'unknown',
      averageConfidence: 50,
      accuracyRate: 50,
    };
  }

  return {
    level: 1,
    levelTitleFa: LEVEL_DEFINITIONS[0].titleFa,
    xp: 0,
    streak: 1,
    lastPlayedDate: new Date().toISOString().slice(0, 10),
    history: [],
    constructs,
    patterns: [],
  };
}

export function calculateReliability(count: number): ConfidenceReliability {
  if (count < 3) return 'insufficient';
  if (count <= 5) return 'low';
  if (count <= 11) return 'medium';
  return 'high';
}

export function computeConstructTrend(trials: TrialResult[]): 'improving' | 'stable' | 'fluctuating' | 'declining' | 'unknown' {
  if (trials.length < 4) return 'unknown';
  const mid = Math.floor(trials.length / 2);
  const firstHalf = trials.slice(0, mid);
  const secondHalf = trials.slice(mid);

  const avgFirst = firstHalf.reduce((sum, t) => sum + t.score, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, t) => sum + t.score, 0) / secondHalf.length;
  const diff = avgSecond - avgFirst;

  if (diff > 8) return 'improving';
  if (diff < -8) return 'declining';
  return 'stable';
}

export function updateUserProfile(currentProfile: UserProfile, newTrial: TrialResult): UserProfile {
  const updatedHistory = [newTrial, ...currentProfile.history];

  // Calculate Streak
  const todayStr = new Date().toISOString().slice(0, 10);
  let streak = currentProfile.streak;
  if (currentProfile.lastPlayedDate !== todayStr) {
    const lastDate = new Date(currentProfile.lastPlayedDate);
    const currentDate = new Date(todayStr);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  // Calculate XP
  const xpGained = Math.round(
    25 + (newTrial.isCorrect ? 15 : 5) + (newTrial.score >= 80 ? 10 : 0)
  );
  const totalXp = currentProfile.xp + xpGained;

  // Determine Level
  let currentLevel = 1;
  let levelTitleFa = LEVEL_DEFINITIONS[0].titleFa;
  for (const def of LEVEL_DEFINITIONS) {
    if (totalXp >= def.minXp && updatedHistory.length >= def.requiredTrials) {
      currentLevel = def.level;
      levelTitleFa = def.titleFa;
    }
  }

  // Recalculate constructs
  const updatedConstructs = { ...currentProfile.constructs };

  for (const cId of INITIAL_CONSTRUCT_IDS) {
    const relevantTrials = updatedHistory.filter((t) => t.constructs.includes(cId));
    const count = relevantTrials.length;
    const reliability = calculateReliability(count);

    if (count === 0) {
      continue;
    }

    const avgScore = Math.round(
      relevantTrials.reduce((sum, t) => sum + t.score, 0) / count
    );
    const avgConfidence = Math.round(
      relevantTrials.reduce((sum, t) => sum + t.confidence, 0) / count
    );
    const accuracyCount = relevantTrials.filter((t) => t.isCorrect).length;
    const accuracyRate = Math.round((accuracyCount / count) * 100);
    const trend = computeConstructTrend(relevantTrials);

    updatedConstructs[cId] = {
      ...updatedConstructs[cId],
      score: avgScore,
      trialsCount: count,
      reliability,
      trend,
      averageConfidence: avgConfidence,
      accuracyRate,
    };
  }

  return {
    ...currentProfile,
    level: currentLevel,
    levelTitleFa,
    xp: totalXp,
    streak,
    lastPlayedDate: todayStr,
    history: updatedHistory,
    constructs: updatedConstructs,
  };
}

export function computeWeeklySummary(history: TrialResult[]): WeeklySummary {
  const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const weeklyTrials = history.filter((t) => t.timestamp >= oneWeekAgo);

  if (weeklyTrials.length === 0) {
    return {
      trialsCount: 0,
      averageAccuracy: 0,
      averageConfidence: 0,
      calibrationGap: 0,
      calibrationChange: 0,
      accuracyChange: 0,
      strongestConstructFa: 'داده کافی نیست',
      growingConstructFa: 'داده کافی نیست',
      keyPatternSummaryFa: 'برای مشاهده تحلیل عملکرد هفتگی، به بازی ادامه دهید.',
    };
  }

  const avgAcc = Math.round(
    (weeklyTrials.filter((t) => t.isCorrect).length / weeklyTrials.length) * 100
  );
  const avgConf = Math.round(
    weeklyTrials.reduce((sum, t) => sum + t.confidence, 0) / weeklyTrials.length
  );
  const calibrationGap = Math.abs(avgConf - avgAcc);

  return {
    trialsCount: weeklyTrials.length,
    averageAccuracy: avgAcc,
    averageConfidence: avgConf,
    calibrationGap,
    calibrationChange: -3,
    accuracyChange: 7,
    strongestConstructFa: 'استنباط اجتماعی',
    growingConstructFa: 'بازتاب شناختی',
    keyPatternSummaryFa:
      calibrationGap < 15
        ? 'کالیبراسیون اطمینان شما با دقت واقعیتان در سطحی بسیار متعادل و هماهنگ قرار دارد.'
        : 'در سناریوهای دارای هیجان و ریسک، تمایل به اطمینان بالاتر از درستی عینی مشاهده می‌شود.',
  };
}

/**
 * محاسبه آمار جامع داشبورد از روی پروفایل کاربر با تفکیک دقیق در دسته‌های:
 * «خطاهای شناختی»، «بازی‌های حافظه»، «تحلیل منطقی»، «استنباط اجتماعی» و «ریسک»
 */
export function computeProfileDashboardStats(profile: UserProfile): DetailedProfileDashboardStats {
  const history = profile.history || [];
  const totalGames = history.length;
  const uniqueQuestionsAnswered = new Set(history.map((t) => t.questionId)).size;
  const correctCount = history.filter((t) => t.isCorrect).length;
  const accuracyRate = totalGames > 0 ? Math.round((correctCount / totalGames) * 100) : 0;
  const completedMissions =
    history.filter((t) => t.isDailyRoleMission).length + (profile.roleMedals?.length || 0);
  const totalPuzzlesAvailable = ALL_QUESTIONS.length;
  const overallCoveragePercent =
    totalPuzzlesAvailable > 0
      ? Math.round((uniqueQuestionsAnswered / totalPuzzlesAvailable) * 100)
      : 0;

  // Helper to categorize a trial
  const isBiasesTrial = (t: TrialResult) => {
    const q = QUESTION_MAP.get(t.questionId);
    return q?.familyId === 'cognitive_biases' || t.constructs.includes('bias_resistance');
  };

  const isMemoryTrial = (t: TrialResult) => {
    const q = QUESTION_MAP.get(t.questionId);
    return (
      q?.familyId === 'cognitive_flexibility' ||
      t.constructs.includes('cognitive_flexibility') ||
      t.constructs.includes('speed_accuracy_balance')
    );
  };

  const isLogicTrial = (t: TrialResult) => {
    const q = QUESTION_MAP.get(t.questionId);
    return (
      q?.familyId === 'cognitive_reflection' ||
      q?.familyId === 'reasoning_patterns' ||
      q?.familyId === 'metacognition' ||
      t.constructs.includes('reasoning_accuracy') ||
      t.constructs.includes('cognitive_reflection')
    );
  };

  const isSocialTrial = (t: TrialResult) => {
    const q = QUESTION_MAP.get(t.questionId);
    return (
      q?.familyId === 'social_inference' ||
      q?.familyId === 'emotion_inference' ||
      t.constructs.includes('social_inference') ||
      t.constructs.includes('emotion_inference')
    );
  };

  const isRiskTrial = (t: TrialResult) => {
    const q = QUESTION_MAP.get(t.questionId);
    return (
      q?.familyId === 'risk_ambiguity' ||
      t.constructs.includes('ambiguity_tolerance') ||
      t.constructs.includes('decision_quality')
    );
  };

  // Helper to build CategoryProfileStat
  const buildStat = (
    id: string,
    nameFa: string,
    tagFa: string,
    iconType: 'biases' | 'memory' | 'logic' | 'social' | 'risk',
    descriptionFa: string,
    matcher: (t: TrialResult) => boolean,
    dbMatcher: (q: typeof ALL_QUESTIONS[number]) => boolean
  ): CategoryProfileStat => {
    const matching = history.filter(matcher);
    const played = matching.length;
    const correct = matching.filter((t) => t.isCorrect).length;
    const acc = played > 0 ? Math.round((correct / played) * 100) : 0;
    const uniqueSolved = new Set(matching.map((t) => t.questionId)).size;
    const totalAvail = ALL_QUESTIONS.filter(dbMatcher).length;
    const cov = totalAvail > 0 ? Math.round((uniqueSolved / totalAvail) * 100) : 0;
    const avgConf = played > 0 ? Math.round(matching.reduce((s, t) => s + t.confidence, 0) / played) : 0;

    return {
      id,
      nameFa,
      tagFa,
      iconType,
      playedCount: played,
      correctCount: correct,
      accuracyRate: acc,
      uniqueAnsweredCount: uniqueSolved,
      totalAvailableCount: totalAvail,
      coveragePercent: cov,
      avgConfidence: avgConf,
      descriptionFa,
    };
  };

  const cognitiveBiases = buildStat(
    'cognitive_biases',
    'خطاهای شناختی',
    'تله‌های شهود و لنگر',
    'biases',
    'سنجش مقاومت در برابر لنگراندازی، هزینه غرق‌شده، زیان‌گریزی و قاب‌بندی‌های تجاری',
    isBiasesTrial,
    (q) => q.familyId === 'cognitive_biases' || q.constructs.includes('bias_resistance')
  );

  const memoryGames = buildStat(
    'memory_games',
    'بازی‌های حافظه و انعطاف',
    'حافظه فعال کاری',
    'memory',
    'سنجش تغییر جهت ذهنی، به‌روزرسانی مدل بر پایه شواهد و انعطاف در بازیابی اطلاعات',
    isMemoryTrial,
    (q) =>
      q.familyId === 'cognitive_flexibility' ||
      q.constructs.includes('cognitive_flexibility') ||
      q.constructs.includes('speed_accuracy_balance')
  );

  const logicalAnalysis = buildStat(
    'logical_analysis',
    'تحلیل منطقی و بازتاب تفکر',
    'منطق تحلیلی سیستم ۲',
    'logic',
    'سنجش غلبه بر پاسخ‌های وسوسه‌انگیز اول (CRT)، استنتاج شرطی و الگوهای استدلال ریاضی',
    isLogicTrial,
    (q) =>
      q.familyId === 'cognitive_reflection' ||
      q.familyId === 'reasoning_patterns' ||
      q.familyId === 'metacognition' ||
      q.constructs.includes('reasoning_accuracy') ||
      q.constructs.includes('cognitive_reflection')
  );

  const socialInference = buildStat(
    'social_inference',
    'استنباط اجتماعی و عاطفی',
    'نظریه ذهن و همدلی',
    'social',
    'سنجش کشف نیت‌های پنهان، ارتباطات استراتژیک و تشخیص وضعیت‌های عاطفی مبهم',
    isSocialTrial,
    (q) =>
      q.familyId === 'social_inference' ||
      q.familyId === 'emotion_inference' ||
      q.constructs.includes('social_inference') ||
      q.constructs.includes('emotion_inference')
  );

  const riskAmbiguity = buildStat(
    'risk_ambiguity',
    'ریسک و تاب‌آوری در ابهام',
    'تصمیم‌گیری تحت ابهام',
    'risk',
    'سنجش امید ریاضی، محاسبه نسبت ریسک به سود و تاب‌آوری در تاریکی‌های آماری',
    isRiskTrial,
    (q) =>
      q.familyId === 'risk_ambiguity' ||
      q.constructs.includes('ambiguity_tolerance') ||
      q.constructs.includes('decision_quality')
  );

  return {
    totalGames,
    uniqueQuestionsAnswered,
    correctCount,
    accuracyRate,
    completedMissions,
    totalXp: profile.xp,
    streak: profile.streak || 0,
    bestSurvivalStreak: profile.bestSurvivalStreak || 0,
    totalPuzzlesAvailable,
    overallCoveragePercent,
    categories: {
      cognitiveBiases,
      memoryGames,
      logicalAnalysis,
      socialInference,
      riskAmbiguity,
    },
    categoryList: [cognitiveBiases, memoryGames, logicalAnalysis, socialInference, riskAmbiguity],
  };
}

export const calculateProfileDashboardStats = computeProfileDashboardStats;
