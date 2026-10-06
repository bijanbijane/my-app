import { UserProfile, TrialResult } from '../types';
import { createInitialProfile, updateUserProfile } from '../analytics/profileEngine';
import { detectPatterns } from '../analytics/patternEngine';
import { ALL_QUESTIONS } from '../data/questionBank';
import { evaluateTrial } from '../scoring/scoringEngine';

const STORAGE_KEY = 'zehnnama_user_profile_v1';
const IS_DEMO_KEY = 'zehnnama_is_demo_mode';

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialProfile();
    }
    const parsed = JSON.parse(raw) as UserProfile;
    // ensure patterns are kept fresh
    parsed.patterns = detectPatterns(parsed.history);
    return parsed;
  } catch (e) {
    console.error('Failed to load profile from storage', e);
    return createInitialProfile();
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    profile.patterns = detectPatterns(profile.history);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to storage', e);
  }
}

export function resetUserProfile(): UserProfile {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(IS_DEMO_KEY);
  return createInitialProfile();
}

export function isDemoModeActive(): boolean {
  return localStorage.getItem(IS_DEMO_KEY) === 'true';
}

export function setDemoModeFlag(active: boolean): void {
  localStorage.setItem(IS_DEMO_KEY, active ? 'true' : 'false');
}

/**
 * Generates a realistic 50-trial demo profile with organic patterns:
 * - High confidence with modest accuracy in general knowledge (Overconfidence pattern)
 * - Falls for numerical anchoring in price negotiations
 * - Sensitive to framing in gain/loss dilemmas
 * - Responsive to evidence updating in detective/science scenarios
 */
export function generateDemoProfile(): UserProfile {
  let profile = createInitialProfile();
  const baseTimestamp = Date.now() - 14 * 24 * 3600 * 1000; // 14 days ago

  const questionsCount = ALL_QUESTIONS.length;
  // Pick 50 questions across all families
  for (let i = 0; i < 50; i++) {
    const qIndex = i % questionsCount;
    const question = ALL_QUESTIONS[qIndex];
    const timestamp = baseTimestamp + i * (5.5 * 3600 * 1000) + Math.random() * 1000000;

    let selectedAnswerId = question.correctAnswerId;
    let confidence = 75;
    let responseTimeMs = 4500 + Math.floor(Math.random() * 5000);
    let revisedChoiceId: string | undefined = undefined;

    // Simulate realistic human error patterns:
    if (question.familyId === 'cognitive_reflection' && (i % 3 === 0)) {
      // Fall into intuitive lure
      selectedAnswerId = question.intuitiveAnswerId || question.options[0].id;
      confidence = 85;
      responseTimeMs = 1800; // fast impulsive
    } else if (question.biasExamined === 'anchoring') {
      // Anchor bias
      selectedAnswerId = question.intuitiveAnswerId || question.options[0].id;
      confidence = 80;
    } else if (question.biasExamined === 'sunk_cost' && (i % 2 === 0)) {
      // Sunk-cost trap
      selectedAnswerId = question.intuitiveAnswerId || question.options[0].id;
      confidence = 70;
    } else if (question.biasExamined === 'framing' && (i % 2 === 0)) {
      // Framing effect
      selectedAnswerId = question.intuitiveAnswerId || question.options[0].id;
      confidence = 75;
    } else if (question.familyId === 'metacognition') {
      // High confidence even when occasionally incorrect
      const isRight = i % 2 === 0;
      selectedAnswerId = isRight ? question.correctAnswerId : (question.intuitiveAnswerId || question.options[1].id);
      confidence = 90; // Overconfident gap!
    } else if (question.hasSecondStage) {
      // Demonstrated healthy cognitive flexibility
      revisedChoiceId = question.stageTwoCorrectId;
      confidence = 80;
    } else {
      // Regular probabilistic distribution (~72% accuracy)
      const isRight = Math.random() > 0.28;
      selectedAnswerId = isRight ? question.correctAnswerId : question.options.find(o => o.id !== question.correctAnswerId)?.id || question.options[0].id;
      confidence = 65 + Math.floor(Math.random() * 25);
    }

    const trial: TrialResult = evaluateTrial({
      question,
      selectedAnswerId,
      responseTimeMs,
      confidence,
      firstChoiceId: question.hasSecondStage ? question.options[0].id : undefined,
      revisedChoiceId,
    });
    trial.timestamp = timestamp;

    profile = updateUserProfile(profile, trial);
  }

  // Update streak for demo
  profile.streak = 5;
  profile.patterns = detectPatterns(profile.history);
  saveUserProfile(profile);
  setDemoModeFlag(true);
  return profile;
}

export function exportProfileJson(profile: UserProfile): string {
  return JSON.stringify(profile, null, 2);
}

export function importProfileJson(jsonStr: string): UserProfile {
  const parsed = JSON.parse(jsonStr) as UserProfile;
  if (!parsed || !Array.isArray(parsed.history) || typeof parsed.level !== 'number') {
    throw new Error('فرمت فایل پشتیبان نامعتبر است.');
  }
  parsed.patterns = detectPatterns(parsed.history);
  saveUserProfile(parsed);
  return parsed;
}
