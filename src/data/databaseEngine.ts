import { ScenarioQuestion, FamilyId, ConstructId, CognitiveRoleId, GameMechanic } from '../types';
import { ALL_QUESTIONS, QUESTION_MAP, QUESTIONS_BY_FAMILY, FAMILY_METADATA } from './questionBank';

const BOOKMARKS_KEY = 'zehnnama_bookmarked_questions';

export interface QuestionFilter {
  familyId?: FamilyId;
  difficulty?: 1 | 2 | 3;
  roleId?: CognitiveRoleId;
  construct?: ConstructId;
  gameMechanic?: GameMechanic;
  searchQuery?: string;
}

export interface DatabaseStatistics {
  totalQuestions: number;
  familyCounts: Record<FamilyId, number>;
  difficultyCounts: {
    level1: number;
    level2: number;
    level3: number;
  };
  constructCoverage: Partial<Record<ConstructId, number>>;
  uniqueMechanicsCount: number;
  totalUniqueBiasesCount: number;
}

/**
 * جستجوی پیشرفته متنی در دیتابیس معماها
 */
export function searchQuestions(query: string): ScenarioQuestion[] {
  if (!query || !query.trim()) return ALL_QUESTIONS;
  const normalized = query.trim().toLowerCase();

  return ALL_QUESTIONS.filter((q) => {
    return (
      q.title.toLowerCase().includes(normalized) ||
      q.prompt.toLowerCase().includes(normalized) ||
      (q.context && q.context.toLowerCase().includes(normalized)) ||
      q.explanation.toLowerCase().includes(normalized) ||
      q.reflectiveInsight.toLowerCase().includes(normalized) ||
      (q.sourceBasis && q.sourceBasis.toLowerCase().includes(normalized))
    );
  });
}

/**
 * فیلتر کردن چندبُعدی سوالات دیتابیس
 */
export function filterQuestions(filter: QuestionFilter): ScenarioQuestion[] {
  let results = ALL_QUESTIONS;

  if (filter.familyId) {
    results = results.filter((q) => q.familyId === filter.familyId);
  }

  if (filter.difficulty) {
    results = results.filter((q) => q.difficulty === filter.difficulty);
  }

  if (filter.roleId) {
    results = results.filter((q) => q.roleId === filter.roleId);
  }

  if (filter.construct) {
    results = results.filter((q) => q.constructs.includes(filter.construct!));
  }

  if (filter.gameMechanic) {
    results = results.filter((q) => q.gameMechanic === filter.gameMechanic);
  }

  if (filter.searchQuery && filter.searchQuery.trim()) {
    const q = filter.searchQuery.trim().toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        (item.context && item.context.toLowerCase().includes(q))
    );
  }

  return results;
}

/**
 * استخراج آمار کامل دیتابیس برای گزارش‌های روان‌سنجی
 */
export function getDatabaseStatistics(): DatabaseStatistics {
  const familyCounts = {} as Record<FamilyId, number>;
  (Object.keys(FAMILY_METADATA) as FamilyId[]).forEach((fam) => {
    familyCounts[fam] = QUESTIONS_BY_FAMILY[fam]?.length || 0;
  });

  const difficultyCounts = {
    level1: ALL_QUESTIONS.filter((q) => q.difficulty === 1).length,
    level2: ALL_QUESTIONS.filter((q) => q.difficulty === 2).length,
    level3: ALL_QUESTIONS.filter((q) => q.difficulty === 3).length,
  };

  const constructCoverage: Partial<Record<ConstructId, number>> = {};
  ALL_QUESTIONS.forEach((q) => {
    q.constructs.forEach((c) => {
      constructCoverage[c] = (constructCoverage[c] || 0) + 1;
    });
  });

  const mechanicsSet = new Set(ALL_QUESTIONS.map((q) => q.gameMechanic));
  const biasesSet = new Set(ALL_QUESTIONS.filter((q) => q.biasExamined).map((q) => q.biasExamined));

  return {
    totalQuestions: ALL_QUESTIONS.length,
    familyCounts,
    difficultyCounts,
    constructCoverage,
    uniqueMechanicsCount: mechanicsSet.size,
    totalUniqueBiasesCount: biasesSet.size,
  };
}

/**
 * سیستم بوک‌مارک و ستاره‌گذاری سوالات برگزیده در دیتابیس محلی
 */
export function getBookmarkedQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleQuestionBookmark(questionId: string): boolean {
  try {
    const current = getBookmarkedQuestionIds();
    let updated: string[];
    let isBookmarked: boolean;

    if (current.includes(questionId)) {
      updated = current.filter((id) => id !== questionId);
      isBookmarked = false;
    } else {
      updated = [...current, questionId];
      isBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return isBookmarked;
  } catch {
    return false;
  }
}

export interface GameStyleStatistics {
  adaptivePuzzles: number;
  survivalChambers: number;
  duelScenarios: number;
  roleMissions: number;
  thematicRooms: number;
}

export interface DetailedDatabaseBreakdown extends DatabaseStatistics {
  gameStyles: GameStyleStatistics;
}

/**
 * دریافت آمار جامع دیتابیس با تفکیک سبک‌های بازی و اتاق‌های شناختی
 */
export function getDetailedDatabaseBreakdown(): DetailedDatabaseBreakdown {
  const baseStats = getDatabaseStatistics();
  const gameStyles: GameStyleStatistics = {
    adaptivePuzzles: ALL_QUESTIONS.length,
    survivalChambers: ALL_QUESTIONS.length,
    duelScenarios: ALL_QUESTIONS.filter((q) => q.difficulty <= 2).length,
    roleMissions: ALL_QUESTIONS.filter((q) => q.roleId || q.roleMissionTitleFa).length || 8,
    thematicRooms: 8,
  };

  return {
    ...baseStats,
    gameStyles,
  };
}

export function isQuestionBookmarked(questionId: string): boolean {
  return getBookmarkedQuestionIds().includes(questionId);
}

export function getBookmarkedQuestions(): ScenarioQuestion[] {
  const ids = new Set(getBookmarkedQuestionIds());
  return ALL_QUESTIONS.filter((q) => ids.has(q.id));
}
