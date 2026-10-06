/**
 * Core Types for ZehnNama Cognitive Assessment Engine
 */

export type FamilyId =
  | 'cognitive_reflection' // مقاومت در برابر پاسخ شهودی
  | 'cognitive_flexibility' // انعطاف‌پذیری و تغییر نظر
  | 'cognitive_biases' // سوگیری‌های شناختی
  | 'risk_ambiguity' // تصمیم‌گیری تحت ریسک و ابهام
  | 'social_inference' // شناخت اجتماعی و نظریه ذهن
  | 'emotion_inference' // استنباط هیجان و تحمل ابهام
  | 'metacognition' // فراشناخت و کالیبراسیون اطمینان
  | 'reasoning_patterns'; // استدلال، احتمال و الگو

export type ConstructId =
  | 'cognitive_reflection' // توانایی مکث و بررسی پاسخ شهودی قبل از انتخاب
  | 'reasoning_accuracy' // دقت استدلال منطقی و ریاضی
  | 'decision_quality' // کیفیت تصمیم در شرایط ریسک و ابهام
  | 'cognitive_flexibility' // توانایی تغییر نظر هنگام دریافت شواهد جدید
  | 'metacognitive_calibration' // هماهنگی بین میزان اطمینان و عملکرد واقعی
  | 'bias_resistance' // مقاومت در برابر سوگیری‌های شناختی
  | 'social_inference' // استنباط باور، قصد و حالت ذهنی دیگران
  | 'emotion_inference' // استنباط هیجان از موقعیت و شواهد
  | 'ambiguity_tolerance' // تحمل ابهام و انتخاب گزینه ناکافی بودن اطلاعات
  | 'speed_accuracy_balance' // هماهنگی سرعت پاسخ با دقت
  | 'self_awareness' // خودآگاهی از سطح عملکرد
  | 'evidence_updating'; // به‌روزرسانی باورها بر اساس شواهد جدید

export type BiasType =
  | 'anchoring'
  | 'framing'
  | 'availability'
  | 'confirmation_bias'
  | 'halo_effect'
  | 'sunk_cost'
  | 'loss_aversion'
  | 'base_rate_neglect'
  | 'outcome_bias'
  | 'conjunction_fallacy'
  | 'endowment_effect';

export type GameMechanic =
  | 'crt_lure' // ۱. اولین حدس
  | 'evidence_update' // ۲. اطلاعات جدید
  | 'halo_judgement' // ۳. قضاوت اولیه
  | 'risk_lottery' // ۴. پول یا احتمال؟
  | 'social_tom' // ۵. دو روایت
  | 'emotion_ambiguity' // ۶. احساس پشت رفتار
  | 'follow_money' // ۷. پول را دنبال کن
  | 'sunk_cost_choice' // ۸. هزینه‌ای که قبلاً داده‌ای
  | 'framing_split' // ۹. قاب‌بندی
  | 'base_rate_vivid' // ۱۰. نمونه یا واقعیت؟
  | 'calibration_test' // ۱۱. چقدر مطمئنی؟
  | 'belief_revision'; // ۱۲. نظر قبلی من

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  isLure?: boolean; // intuitive attractor that is factually wrong
  isAmbiguityAcceptance?: boolean; // e.g. "اطلاعات برای قضاوت کافی نیست"
  biasAssociated?: BiasType;
  pointWeight?: number; // 0 to 100
}

export interface ScenarioQuestion {
  id: string;
  familyId: FamilyId;
  gameMechanic: GameMechanic;
  title: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  context?: string;
  options: QuestionOption[];
  correctAnswerId: string;
  intuitiveAnswerId?: string; // the typical intuitive trap
  explanation: string;
  reflectiveInsight: string; // friendly cognitive debrief
  constructs: ConstructId[];
  primaryConstruct: ConstructId;
  secondaryConstructs?: ConstructId[];
  confidenceRequired: boolean;
  speedImpact: boolean; // whether response time is scored
  biasExamined?: BiasType;
  sourceBasis: string; // e.g. "Frederick 2005 - CRT paradigm"
  minObservationsNeeded: number;
  hasSecondStage?: boolean;
  stageTwoPrompt?: string;
  stageTwoEvidence?: string;
  stageTwoOptions?: QuestionOption[];
  stageTwoCorrectId?: string;
  roleId?: CognitiveRoleId;
  roleMissionTitleFa?: string;
}

export interface TrialResult {
  questionId: string;
  familyId: FamilyId;
  gameMechanic: GameMechanic;
  constructs: ConstructId[];
  difficulty: 1 | 2 | 3;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  isIntuitiveLureSelected: boolean;
  responseTimeMs: number;
  confidence: number; // 0 to 100
  score: number; // 0 to 100
  firstChoiceId?: string;
  revisedChoiceId?: string;
  changedMind?: boolean;
  evidenceUpdateScore?: number; // 0 to 100
  biasManifested?: BiasType;
  roleId?: CognitiveRoleId;
  isDailyRoleMission?: boolean;
  ambiguityAccepted?: boolean;
  timestamp: number;
}

export type ConfidenceReliability = 'insufficient' | 'low' | 'medium' | 'high';

export type CognitiveRoleId = 'detective' | 'judge' | 'sage' | 'police' | 'herbalist' | 'chef';

export interface CognitiveRoleConfig {
  id: CognitiveRoleId;
  nameFa: string;
  avatarEmoji: string;
  badgeTitleFa: string;
  taglineFa: string;
  descriptionFa: string;
  primaryFamily: FamilyId;
  color: string;
  accentBg: string;
  missionsTitleFa: string;
  powerNameFa: string;
  powerDescFa: string;
  powerIcon: string;
}

export interface ConstructScore {
  constructId: ConstructId;
  nameFa: string;
  descriptionFa: string;
  score: number; // 0 to 100
  trialsCount: number;
  reliability: ConfidenceReliability;
  trend: 'improving' | 'stable' | 'fluctuating' | 'declining' | 'unknown';
  averageConfidence: number;
  accuracyRate: number;
}

export interface PatternInsight {
  id: string;
  titleFa: string;
  descriptionFa: string;
  constructId: ConstructId;
  biasType?: BiasType;
  evidenceCount: number;
  strength: 'preliminary' | 'solid'; // preliminary >= 3, solid >= 5
  lastObserved: number;
  recommendationFa: string;
}

export interface WeeklySummary {
  trialsCount: number;
  averageAccuracy: number;
  averageConfidence: number;
  calibrationGap: number;
  calibrationChange: number;
  accuracyChange: number;
  strongestConstructFa: string;
  growingConstructFa: string;
  keyPatternSummaryFa: string;
}

export interface UserProfile {
  level: number;
  levelTitleFa: string;
  xp: number;
  streak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  history: TrialResult[];
  constructs: Record<ConstructId, ConstructScore>;
  patterns: PatternInsight[];
  dailyChallengeCompletedDate?: string;
  dailyRoleCompletedDate?: string;
  roleMedals?: string[];
  activeRoleId?: CognitiveRoleId;
  bestSurvivalStreak?: number;
  tonePreference?: 'witty' | 'academic';
}
