import { ScenarioQuestion, TrialResult } from '../types';
import { SCORING_CONFIG } from '../data/scoringConfig';

export interface ScoreComputationInput {
  question: ScenarioQuestion;
  selectedAnswerId: string;
  responseTimeMs: number;
  confidence: number; // 0 to 100
  firstChoiceId?: string;
  revisedChoiceId?: string;
}

export function evaluateTrial(input: ScoreComputationInput): TrialResult {
  const { question, selectedAnswerId, responseTimeMs, confidence, firstChoiceId, revisedChoiceId } = input;

  // Determine correct answer based on whether this was a second-stage decision
  const isSecondStageChoice = question.hasSecondStage && Boolean(revisedChoiceId);
  const targetCorrectId = (isSecondStageChoice && question.stageTwoCorrectId)
    ? question.stageTwoCorrectId
    : question.correctAnswerId;

  const isCorrect = selectedAnswerId === targetCorrectId;
  const isIntuitiveLureSelected = Boolean(
    question.intuitiveAnswerId && selectedAnswerId === question.intuitiveAnswerId
  );

  // Ambiguity acceptance check
  const allAvailableOptions = [...question.options, ...(question.stageTwoOptions || [])];
  const selectedOption = allAvailableOptions.find((opt) => opt.id === selectedAnswerId);
  const ambiguityAccepted = Boolean(selectedOption?.isAmbiguityAcceptance);

  // Evidence updating score (if multi-stage)
  let evidenceUpdateScore = 50; // neutral default
  let changedMind = false;
  if (question.hasSecondStage && firstChoiceId && revisedChoiceId) {
    changedMind = firstChoiceId !== revisedChoiceId;
    if (question.stageTwoCorrectId) {
      evidenceUpdateScore = revisedChoiceId === question.stageTwoCorrectId ? 100 : 20;
    } else {
      evidenceUpdateScore = changedMind ? 85 : 35;
    }
  }

  // Metacognitive Calibration calculation
  // Brier distance: target outcome is 100 if correct, 0 if incorrect.
  // Calibration penalty is proportional to |confidence - outcome|
  const targetOutcome = isCorrect ? 100 : 0;
  const calibrationDistance = Math.abs(confidence - targetOutcome);
  // Calibration score from 0 to 100 (100 = perfect calibration, 0 = severe overconfidence or extreme miscalibration)
  const calibrationScore = Math.max(0, Math.round(100 - calibrationDistance));

  // Speed-accuracy score
  let speedScore = 70;
  if (question.speedImpact) {
    if (responseTimeMs < 2000 && isIntuitiveLureSelected) {
      speedScore = 20; // Impulsive rash answer falling into trap
    } else if (responseTimeMs >= 2500 && isCorrect) {
      speedScore = 100; // Reflective pause resulting in accurate logic
    } else if (responseTimeMs > 25000) {
      speedScore = 60; // Slightly sluggish but acceptable
    } else {
      speedScore = isCorrect ? 90 : 50;
    }
  }

  // Lure resistance score
  const lureScore = isIntuitiveLureSelected ? 10 : isCorrect ? 100 : 60;

  // Ambiguity score
  let ambiguityScore = 50;
  if (question.correctAnswerId && selectedOption?.isAmbiguityAcceptance) {
    ambiguityScore = isCorrect ? 100 : 50;
  } else if (!isCorrect && question.options.some((o) => o.isAmbiguityAcceptance)) {
    ambiguityScore = 20; // jumped to conclusion when they should have recognized insufficient data
  }

  // Weighted composite score based on primary construct weights
  const weights = SCORING_CONFIG[question.primaryConstruct];
  const accuracyComponent = (isCorrect ? 100 : 15) * weights.accuracyWeight;
  const calibrationComponent = calibrationScore * weights.calibrationWeight;
  const evidenceComponent = evidenceUpdateScore * weights.evidenceUpdateWeight;
  const speedComponent = speedScore * weights.speedWeight;
  const lureComponent = lureScore * weights.lureResistanceWeight;
  const ambiguityComponent = ambiguityScore * weights.ambiguityWeight;

  const rawScore = Math.round(
    accuracyComponent +
      calibrationComponent +
      evidenceComponent +
      speedComponent +
      lureComponent +
      ambiguityComponent
  );
  const finalScore = Math.min(100, Math.max(10, rawScore));

  const biasManifested = isIntuitiveLureSelected ? question.biasExamined : undefined;

  return {
    questionId: question.id,
    familyId: question.familyId,
    gameMechanic: question.gameMechanic,
    constructs: question.constructs,
    difficulty: question.difficulty,
    selectedAnswerId,
    correctAnswerId: question.correctAnswerId,
    isCorrect,
    isIntuitiveLureSelected,
    responseTimeMs,
    confidence,
    score: finalScore,
    firstChoiceId,
    revisedChoiceId,
    changedMind,
    evidenceUpdateScore,
    biasManifested,
    ambiguityAccepted,
    timestamp: Date.now(),
  };
}
