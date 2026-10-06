import { PatternInsight, TrialResult } from '../types';

export function detectPatterns(history: TrialResult[]): PatternInsight[] {
  const patterns: PatternInsight[] = [];

  // 1. Anchoring pattern
  const anchoringTrials = history.filter(
    (t) => t.biasManifested === 'anchoring' || (t.isIntuitiveLureSelected && t.questionId.startsWith('BIAS_006'))
  );
  if (anchoringTrials.length >= 3) {
    patterns.push({
      id: 'pattern_anchoring',
      titleFa: 'هیپنوتیزم با عدد اول',
      descriptionFa:
        'در خریدها و تخفیف‌ها، اولین قیمتی که می‌بینی در ذهنت میخکوب می‌شود و بقیه مقایسه‌ها را تحت تاثیر قرار می‌دهد.',
      constructId: 'bias_resistance',
      biasType: 'anchoring',
      evidenceCount: anchoringTrials.length,
      strength: anchoringTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: anchoringTrials[0].timestamp,
      recommendationFa:
        'وقتی قیمت تخفیفی می‌بینی، قیمت خط‌خورده اولیه را نادیده بگیر و بپرس: «آیا این جنس ارزش این مقدار پول را دارد؟»',
    });
  }

  // 2. Sunk-Cost Pattern
  const sunkCostTrials = history.filter(
    (t) => t.biasManifested === 'sunk_cost' || (t.gameMechanic === 'sunk_cost_choice' && !t.isCorrect)
  );
  if (sunkCostTrials.length >= 3) {
    patterns.push({
      id: 'pattern_sunk_cost',
      titleFa: 'اصرار به ادامه مسیر اشتباه',
      descriptionFa:
        'چون قبلاً وقت یا پولی خرج کرده‌ای، حتی وقتی می‌دانی ادامه دادن ضرر است، دلت نمی‌آید پروژه یا بلیت را رها کنی.',
      constructId: 'bias_resistance',
      biasType: 'sunk_cost',
      evidenceCount: sunkCostTrials.length,
      strength: sunkCostTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: sunkCostTrials[0].timestamp,
      recommendationFa:
        'یادت باشد پولی که رفته دیگر برنمی‌گردد؛ تصمیم امروزت نباید فدای اشتباه دیروز شود.',
    });
  }

  // 3. Framing Effect
  const framingTrials = history.filter(
    (t) => t.biasManifested === 'framing' || (t.gameMechanic === 'framing_split' && !t.isCorrect)
  );
  if (framingTrials.length >= 3) {
    patterns.push({
      id: 'pattern_framing',
      titleFa: 'فریب کلمات سود و زیان',
      descriptionFa:
        'یک موضوع یکسان اگر با کلمات «نجات و سود» بیان شود با خوش‌بینی، و اگر با «زیان و باخت» بیان شود با ترس تصمیم می‌گیری.',
      constructId: 'bias_resistance',
      biasType: 'framing',
      evidenceCount: framingTrials.length,
      strength: framingTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: framingTrials[0].timestamp,
      recommendationFa:
        'همیشه ماجرا را وارونه کن: اگر پیشنهاد مثبت بود، رویکرد منفی‌اش را بسنج و برعکس.',
    });
  }

  // 4. Overconfidence vs Calibration
  if (history.length >= 5) {
    const avgConfidence = history.reduce((sum, t) => sum + t.confidence, 0) / history.length;
    const accuracyRate = (history.filter((t) => t.isCorrect).length / history.length) * 100;
    const gap = avgConfidence - accuracyRate;

    if (gap > 18) {
      patterns.push({
        id: 'pattern_overconfidence',
        titleFa: 'اعتماد‌به‌نفس جلوتر از واقعیت',
        descriptionFa:
          'معمولاً با اطمینان بسیار بالا (مثلاً ۹۰٪ یا ۱۰۰٪) پاسخ می‌دهی، در حالی که در عمل درصدی از آن حدس‌ها غلط از آب درمی‌آید.',
        constructId: 'metacognitive_calibration',
        evidenceCount: history.length,
        strength: history.length >= 8 ? 'solid' : 'preliminary',
        lastObserved: history[0].timestamp,
        recommendationFa:
          'قبل از ادعای قطعی، ۳ ثانیه فکر کن: «اگر اشتباه کرده باشم، کجای استدلالم سوراخ است؟»',
      });
    } else if (gap < -18) {
      patterns.push({
        id: 'pattern_underconfidence',
        titleFa: 'شک بی‌دلیل به نبوغ خودت',
        descriptionFa:
          'پاسخ‌هایت اغلب درست و تحلیلی هستند، اما در ارزیابی خودت دچار کم‌رویی می‌شوی و درصد اطمینان خیلی پایینی ثبت می‌کنی.',
        constructId: 'metacognitive_calibration',
        evidenceCount: history.length,
        strength: history.length >= 8 ? 'solid' : 'preliminary',
        lastObserved: history[0].timestamp,
        recommendationFa:
          'به عقلت بیشتر اعتماد کن؛ شواهد نشان می‌دهد خیلی دقیق‌تر از آنی هستی که خیال می‌کنی!',
      });
    }
  }

  // 5. Cognitive Reflection & Fast Intuitive Lure
  const fastLureTrials = history.filter(
    (t) => t.isIntuitiveLureSelected && t.responseTimeMs < 4000
  );
  if (fastLureTrials.length >= 3) {
    patterns.push({
      id: 'pattern_fast_lure',
      titleFa: 'شلیک شتاب‌زده به جواب دم‌دست',
      descriptionFa:
        'به محض اینکه یک جواب تر و تمیز به چشمت می‌خورد، قبل از اینکه مغزت حساب‌وکتاب کند کلیک می‌کنی و در تله می‌افتی.',
      constructId: 'cognitive_reflection',
      evidenceCount: fastLureTrials.length,
      strength: fastLureTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: fastLureTrials[0].timestamp,
      recommendationFa:
        'هر وقت جوابی «بدیهی» به نظر رسید، ترمز کن! دقیقاً همان‌جا تله اصلی پهن شده است.',
    });
  }

  // 6. Belief Perseverance / Reluctance to Update
  const updateTrials = history.filter(
    (t) => t.evidenceUpdateScore !== undefined && t.evidenceUpdateScore < 50
  );
  if (updateTrials.length >= 3) {
    patterns.push({
      id: 'pattern_belief_perseverance',
      titleFa: 'سرسختی روی حرف اول',
      descriptionFa:
        'حتی وقتی شواهد و مدارک تازه نشان می‌دهند که حدس اولت اشتباه بوده، باز هم تغییر موضع برایت دشوار است.',
      constructId: 'cognitive_flexibility',
      evidenceCount: updateTrials.length,
      strength: updateTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: updateTrials[0].timestamp,
      recommendationFa:
        'تغییر نظر در برابر حقیقت نشانه باهوشی است، نه شکست؛ انعطاف‌پذیر باش!',
    });
  }

  // 7. Base-Rate Neglect & Vivid Anecdotes
  const baseRateTrials = history.filter(
    (t) => t.biasManifested === 'base_rate_neglect' || (t.gameMechanic === 'base_rate_vivid' && !t.isCorrect)
  );
  if (baseRateTrials.length >= 3) {
    patterns.push({
      id: 'pattern_base_rate',
      titleFa: 'باور به یک داستان به جای آمار',
      descriptionFa:
        'با شنیدن یک ماجرای مهیج یا تجربه شخصی یک نفر، کل آمار و احتمالات منطقی جامعه را نادیده می‌گیری.',
      constructId: 'reasoning_accuracy',
      biasType: 'base_rate_neglect',
      evidenceCount: baseRateTrials.length,
      strength: baseRateTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: baseRateTrials[0].timestamp,
      recommendationFa:
        'یک تجربه شخصی استثنایی هرگز جایگزین صدها هزار نمونه آماری در دنیای واقعی نمی‌شود.',
    });
  }

  // 8. Ambiguity Tolerance
  const rashAttributionTrials = history.filter(
    (t) =>
      t.familyId === 'emotion_inference' &&
      !t.isCorrect &&
      !t.ambiguityAccepted &&
      (t.questionId === 'EMO_002' || t.questionId === 'EMO_005' || t.questionId === 'EMO_007' || t.questionId === 'EMO_009')
  );
  if (rashAttributionTrials.length >= 3) {
    patterns.push({
      id: 'pattern_ambiguity_rash',
      titleFa: 'ترس از گفتنِ «نمی‌دانم»',
      descriptionFa:
        'وقتی نشانه‌ها مبهم است و اطلاعات کافی نیست، به جای صبر کردن، سریع نیت‌خوانی می‌کنی و فرضیه منفی می‌بافی.',
      constructId: 'ambiguity_tolerance',
      evidenceCount: rashAttributionTrials.length,
      strength: rashAttributionTrials.length >= 5 ? 'solid' : 'preliminary',
      lastObserved: rashAttributionTrials[0].timestamp,
      recommendationFa:
        'سکوت یا رفتار خنثی دیگران دلیل بر دلخوری نیست؛ شجاعت این را داشته باش که بگویی «هنوز چیزی معلوم نیست».',
    });
  }

  return patterns;
}
