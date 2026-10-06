import { CognitiveRoleId, UserProfile, ScenarioQuestion } from '../types';
import { COGNITIVE_ROLES } from '../data/cognitiveRoles';
import { ROLE_SPECIFIC_QUESTIONS } from '../data/roleQuestions';

export interface DailyRoleBountyInfo {
  roleId: CognitiveRoleId;
  roleNameFa: string;
  avatarEmoji: string;
  bountyTitleFa: string;
  descriptionFa: string;
  xpReward: number;
  medalId: string;
  medalTitleFa: string;
  medalIcon: string;
  isCompletedToday: boolean;
  targetQuestion: ScenarioQuestion;
}

export const ROLE_MEDALS_CATALOG: Record<
  CognitiveRoleId,
  { id: string; titleFa: string; descFa: string; icon: string }
> = {
  detective: {
    id: 'detective_magnifier',
    titleFa: 'نشان ذره‌بین طلایی کارآگاه',
    descFa: 'کشف تناقض در پرونده ویژه روزانه و راستی‌آزمایی شواهد',
    icon: '🕵️‍♂️',
  },
  judge: {
    id: 'judge_gavel',
    titleFa: 'مدال چکش زرین عدالت',
    descFa: 'داوری عادلانه و بی‌طرفی در برابر لنگرها و بازی کلمات',
    icon: '⚖️',
  },
  sage: {
    id: 'sage_scroll',
    titleFa: 'طومار حکمت باستان',
    descFa: 'حل پارادوکس روزانه و ترمز بر شهود شتاب‌زده',
    icon: '📜',
  },
  police: {
    id: 'police_star',
    titleFa: 'ستاره طلایی مهار بحران',
    descFa: 'تصمیم‌گیری میلی‌ثانیه‌ای در ماموریت اضطراری پلیس',
    icon: '⭐',
  },
  herbalist: {
    id: 'herbalist_flask',
    titleFa: 'اکسیر شفا و حقیقت کیمیاگر',
    descFa: 'تفکیک دارونما از واقعیت و تنظیم دقیق دوزها',
    icon: '🧪',
  },
  chef: {
    id: 'chef_toque',
    titleFa: 'کلاه زرین سرآشپز چابک',
    descFa: 'رهایی از سوگیری هزینه هدررفته در اوج شلوغی مطبخ',
    icon: '👨‍🍳',
  },
};

export function getDailyRoleBounty(profile: UserProfile): DailyRoleBountyInfo {
  const roles: CognitiveRoleId[] = ['detective', 'judge', 'sage', 'police', 'herbalist', 'chef'];
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const roleId = roles[dayOfYear % roles.length];
  const roleConfig = COGNITIVE_ROLES[roleId];
  const medal = ROLE_MEDALS_CATALOG[roleId];
  const todayStr = today.toISOString().slice(0, 10);
  const isCompletedToday = profile.dailyRoleCompletedDate === todayStr;

  const roleQuestions = ROLE_SPECIFIC_QUESTIONS.filter((q) => q.roleId === roleId);
  const targetQuestion = roleQuestions[dayOfYear % roleQuestions.length] || roleQuestions[0];

  return {
    roleId,
    roleNameFa: roleConfig.nameFa,
    avatarEmoji: roleConfig.avatarEmoji,
    bountyTitleFa: `مأموریت روزانه هویت‌ها: پرونده ${roleConfig.nameFa}`,
    descriptionFa: `امروز در نقش «${roleConfig.nameFa}» معما را حل کن تا ۵۰ امتیاز XP اضافه و «${medal.titleFa}» را به تالار افتخاراتت اضافه کنی!`,
    xpReward: 50,
    medalId: medal.id,
    medalTitleFa: medal.titleFa,
    medalIcon: medal.icon,
    isCompletedToday,
    targetQuestion,
  };
}
