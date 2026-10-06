import { ScenarioQuestion, FamilyId } from '../types';
import { REFLECTION_QUESTIONS } from './questions/reflection';
import { BIAS_QUESTIONS } from './questions/biases';
import { FLEXIBILITY_QUESTIONS } from './questions/flexibility';
import { RISK_QUESTIONS } from './questions/risk';
import { SOCIAL_QUESTIONS } from './questions/social';
import { EMOTION_QUESTIONS } from './questions/emotion';
import { METACOGNITION_QUESTIONS } from './questions/metacognition';
import { REASONING_QUESTIONS } from './questions/reasoning';
import { EXPANDED_QUESTIONS } from './expandedQuestions';
import { ROLE_SPECIFIC_QUESTIONS } from './roleQuestions';

export const ALL_QUESTIONS: ScenarioQuestion[] = [
  ...ROLE_SPECIFIC_QUESTIONS,
  ...REFLECTION_QUESTIONS,
  ...BIAS_QUESTIONS,
  ...FLEXIBILITY_QUESTIONS,
  ...RISK_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...EMOTION_QUESTIONS,
  ...METACOGNITION_QUESTIONS,
  ...REASONING_QUESTIONS,
  ...EXPANDED_QUESTIONS,
];

export function getQuestionsForRole(roleId: string): ScenarioQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.roleId === roleId);
}

export const QUESTION_MAP: Map<string, ScenarioQuestion> = new Map(
  ALL_QUESTIONS.map((q) => [q.id, q])
);

export const QUESTIONS_BY_FAMILY: Record<FamilyId, ScenarioQuestion[]> = {
  cognitive_reflection: ALL_QUESTIONS.filter((q) => q.familyId === 'cognitive_reflection'),
  cognitive_biases: ALL_QUESTIONS.filter((q) => q.familyId === 'cognitive_biases'),
  cognitive_flexibility: ALL_QUESTIONS.filter((q) => q.familyId === 'cognitive_flexibility'),
  risk_ambiguity: ALL_QUESTIONS.filter((q) => q.familyId === 'risk_ambiguity'),
  social_inference: ALL_QUESTIONS.filter((q) => q.familyId === 'social_inference'),
  emotion_inference: ALL_QUESTIONS.filter((q) => q.familyId === 'emotion_inference'),
  metacognition: ALL_QUESTIONS.filter((q) => q.familyId === 'metacognition'),
  reasoning_patterns: ALL_QUESTIONS.filter((q) => q.familyId === 'reasoning_patterns'),
};

export const FAMILY_METADATA: Record<
  FamilyId,
  { nameFa: string; shortDescFa: string; icon: string }
> = {
  cognitive_reflection: {
    nameFa: 'تله‌های جواب اول',
    shortDescFa: 'آیا می‌توانی به اولین جواب وسوسه‌انگیز «نه» بگویی؟',
    icon: 'Brain',
  },
  cognitive_biases: {
    nameFa: 'شعبده‌های ذهن و حراجی‌ها',
    shortDescFa: 'گول نخوردن با ترفندهای لنگر، تخفیف دروغی و زیان',
    icon: 'ShieldCheck',
  },
  cognitive_flexibility: {
    nameFa: 'شهامت تغییر نظر',
    shortDescFa: 'وقتی مدرک تازه می‌رسد، یک‌دنده می‌مانی یا منعطف؟',
    icon: 'RefreshCw',
  },
  risk_ambiguity: {
    nameFa: 'قمار، شانس و دودلی',
    shortDescFa: 'تصمیم‌گیری بین سود حتمی یا قمار پرخطر',
    icon: 'Target',
  },
  social_inference: {
    nameFa: 'آدم‌شناسی و تعارفات',
    shortDescFa: 'خواندن نیت واقعی افراد در تعارف و سوءتفاهم‌ها',
    icon: 'Users',
  },
  emotion_inference: {
    nameFa: 'کشف حس و فرضیه‌بافی',
    shortDescFa: 'تشخیص احساسات بدون وصله کردن برچسب عجولانه',
    icon: 'HeartHandshake',
  },
  metacognition: {
    nameFa: 'سنجش بلوف و اعتماد‌به‌نفس',
    shortDescFa: 'آیا ادعایت دقیقاً با دانشت هم‌خوانی دارد؟',
    icon: 'Gauge',
  },
  reasoning_patterns: {
    nameFa: 'معماهای منطق و احتمال',
    shortDescFa: 'ردیابی مغالطات و اشتباهات ریاضی رایج روزمره',
    icon: 'Compass',
  },
};
