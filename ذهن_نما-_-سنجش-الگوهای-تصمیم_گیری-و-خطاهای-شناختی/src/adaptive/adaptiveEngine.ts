import { ScenarioQuestion, UserProfile, ConstructId } from '../types';
import { ALL_QUESTIONS } from '../data/questionBank';

export function selectNextGame(
  profile: UserProfile,
  allQuestions: ScenarioQuestion[] = ALL_QUESTIONS
): ScenarioQuestion {
  const playedQuestionIds = new Set(profile.history.map((t) => t.questionId));
  const unplayedQuestions = allQuestions.filter((q) => !playedQuestionIds.has(q.id));

  // If all played, recycle questions that were answered incorrectly or haven't been seen recently
  const pool = unplayedQuestions.length > 0 ? unplayedQuestions : allQuestions;

  // 1. Identify target construct:
  // First priority: constructs with 'insufficient' data (<3 trials) to build a multi-dimensional baseline
  const insufficientConstructs = Object.values(profile.constructs)
    .filter((c) => c.reliability === 'insufficient')
    .sort((a, b) => a.trialsCount - b.trialsCount);

  let targetConstructId: ConstructId | null = null;
  if (insufficientConstructs.length > 0 && profile.history.length < 24) {
    // Round-robin building broad cognitive baseline
    targetConstructId = insufficientConstructs[0].constructId;
  } else {
    // Otherwise target construct with lowest score or highest weakness
    const sortedByScore = Object.values(profile.constructs)
      .filter((c) => c.trialsCount > 0)
      .sort((a, b) => a.score - b.score);

    if (sortedByScore.length > 0) {
      targetConstructId = sortedByScore[0].constructId;
    }
  }

  // 2. Determine appropriate difficulty level:
  let targetDifficulty: 1 | 2 | 3 = 1;
  if (targetConstructId && profile.constructs[targetConstructId].trialsCount > 0) {
    const relevantRecentTrials = profile.history
      .filter((t) => t.constructs.includes(targetConstructId!))
      .slice(0, 3);
    const recentAccuracy =
      relevantRecentTrials.filter((t) => t.isCorrect).length /
      (relevantRecentTrials.length || 1);

    if (recentAccuracy >= 0.7) {
      targetDifficulty = 3; // level up difficulty
    } else if (recentAccuracy >= 0.4) {
      targetDifficulty = 2;
    } else {
      targetDifficulty = 1; // gentle adaptation
    }
  }

  // 3. Find matching question in pool:
  let matchingQuestions: ScenarioQuestion[] = [];
  if (targetConstructId) {
    matchingQuestions = pool.filter(
      (q) => q.constructs.includes(targetConstructId!) && q.difficulty === targetDifficulty
    );
    if (matchingQuestions.length === 0) {
      matchingQuestions = pool.filter((q) => q.constructs.includes(targetConstructId!));
    }
  }

  if (matchingQuestions.length === 0) {
    matchingQuestions = pool;
  }

  // Pick a random question among matches for natural gameplay variety
  const randomIndex = Math.floor(Math.random() * matchingQuestions.length);
  return matchingQuestions[randomIndex] || allQuestions[0];
}

export function selectDailyChallenge(allQuestions: ScenarioQuestion[] = ALL_QUESTIONS): ScenarioQuestion {
  // Use today's day of year as deterministic seed
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % allQuestions.length;
  return allQuestions[index];
}
