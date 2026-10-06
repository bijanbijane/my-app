import { ScenarioQuestion, FamilyId, CognitiveRoleId } from '../types';

export interface QuestionVisualMeta {
  imageUrl: string;
  altText: string;
  accentColor: string;
  badgeLabelFa: string;
}

export const IMAGES = {
  detective: '/src/assets/images/detective_scene_1791184643379.jpg',
  courtroom: '/src/assets/images/courtroom_scene_1791184658321.jpg',
  sage: '/src/assets/images/sage_mountain_1791184671519.jpg',
  police: '/src/assets/images/police_street_1791184685300.jpg',
  alchemy: '/src/assets/images/alchemy_lab_1791184696718.jpg',
  chef: '/src/assets/images/chef_kitchen_1791185524650.jpg',
  library: '/src/assets/images/ancient_library_1791185534667.jpg',
  bazaar: '/src/assets/images/market_bazaar_1791185545155.jpg',
  crisis: '/src/assets/images/crisis_command_1791185553821.jpg',
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getQuestionVisual(
  question: ScenarioQuestion,
  activeRoleId?: CognitiveRoleId
): QuestionVisualMeta {
  const effectiveRole = question.roleId || activeRoleId;
  const hash = hashString(question.id || question.title);

  if (effectiveRole === 'detective') {
    return {
      imageUrl: IMAGES.detective,
      altText: 'صحنه جرم و تحقیق کارآگاه',
      accentColor: '#f59e0b',
      badgeLabelFa: 'پرونده کارآگاهی',
    };
  }

  if (effectiveRole === 'judge') {
    return {
      imageUrl: IMAGES.courtroom,
      altText: 'تالار دادگاه و ترازوی قضاوت',
      accentColor: '#a855f7',
      badgeLabelFa: 'جلسه دادگاه',
    };
  }

  if (effectiveRole === 'sage') {
    const sageImages = [IMAGES.sage, IMAGES.library];
    return {
      imageUrl: sageImages[hash % sageImages.length],
      altText: 'خلوتگاه حکمت و طومارهای کهن',
      accentColor: '#06b6d4',
      badgeLabelFa: 'تأمل حکیمانه',
    };
  }

  if (effectiveRole === 'police') {
    const policeImages = [IMAGES.police, IMAGES.crisis];
    return {
      imageUrl: policeImages[hash % policeImages.length],
      altText: 'عملیات یگان ویژه و مهار بحران',
      accentColor: '#3b82f6',
      badgeLabelFa: 'عملیات واکنش سریع',
    };
  }

  if (effectiveRole === 'herbalist') {
    const herbalImages = [IMAGES.alchemy, IMAGES.bazaar];
    return {
      imageUrl: herbalImages[hash % herbalImages.length],
      altText: 'کارگاه عصاره‌گیری و بازار عطاران',
      accentColor: '#10b981',
      badgeLabelFa: 'دکان و لابراتوار عطار',
    };
  }

  if (effectiveRole === 'chef') {
    return {
      imageUrl: IMAGES.chef,
      altText: 'آشپزخانه مجلل در اوج سرویس شام',
      accentColor: '#f97316',
      badgeLabelFa: 'سرویس شب شلوغ مطبخ',
    };
  }

  // Visual variety by Family with alternating cinematic images
  switch (question.familyId) {
    case 'cognitive_reflection':
    case 'metacognition': {
      const reflectionPool = [IMAGES.sage, IMAGES.library];
      return {
        imageUrl: reflectionPool[hash % reflectionPool.length],
        altText: 'معمای عقل و خودآگاهی',
        accentColor: '#06b6d4',
        badgeLabelFa: 'آزمون تفکر شکیبا',
      };
    }
    case 'cognitive_biases': {
      const biasPool = [IMAGES.courtroom, IMAGES.bazaar];
      return {
        imageUrl: biasPool[hash % biasPool.length],
        altText: 'مواجهه با سوگیری‌های ذهنی و قضاوت',
        accentColor: '#a855f7',
        badgeLabelFa: 'مچ‌گیری از تله‌های ذهن',
      };
    }
    case 'cognitive_flexibility':
    case 'social_inference': {
      const flexPool = [IMAGES.detective, IMAGES.bazaar];
      return {
        imageUrl: flexPool[hash % flexPool.length],
        altText: 'تحلیل شواهد و روانشناسی اجتماعی',
        accentColor: '#f59e0b',
        badgeLabelFa: 'سرنخ‌ها و چرخش باورها',
      };
    }
    case 'risk_ambiguity':
    case 'reasoning_patterns':
    case 'emotion_inference':
    default: {
      const riskPool = [IMAGES.crisis, IMAGES.police, IMAGES.chef];
      return {
        imageUrl: riskPool[hash % riskPool.length],
        altText: 'تصمیم‌گیری تحت ریسک و فشار',
        accentColor: '#3b82f6',
        badgeLabelFa: 'محاسبه ریسک و احتمال',
      };
    }
  }
}

/**
 * Trims long didactic text into a punchy, easy-to-read format.
 * Eliminates walls of text so user is never bored.
 */
export function formatConcisePrompt(prompt: string): string {
  if (prompt.length <= 150) return prompt;

  const sentences = prompt.split(/(?<=[.؟!])\s+/);
  if (sentences.length > 2) {
    return sentences.slice(0, 2).join(' ') + ' ' + (sentences[sentences.length - 1] || '');
  }
  return prompt;
}

/**
 * Summarizes explanations into 2 short bullet points so reading is instant.
 */
export function formatConciseExplanation(expl: string, insight: string): { rule: string; takeaway: string } {
  const shortExpl = expl.split('.')[0] || expl;
  const shortInsight = insight.split('.')[0] || insight;
  return {
    rule: shortExpl.trim(),
    takeaway: shortInsight.trim(),
  };
}
