import { ConstructId } from '../types';

export interface ConstructWeightConfig {
  accuracyWeight: number;
  calibrationWeight: number;
  evidenceUpdateWeight: number;
  speedWeight: number;
  lureResistanceWeight: number;
  ambiguityWeight: number;
}

export const SCORING_CONFIG: Record<ConstructId, ConstructWeightConfig> = {
  cognitive_reflection: {
    accuracyWeight: 0.35,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.0,
    speedWeight: 0.10,
    lureResistanceWeight: 0.40,
    ambiguityWeight: 0.0,
  },
  reasoning_accuracy: {
    accuracyWeight: 0.60,
    calibrationWeight: 0.20,
    evidenceUpdateWeight: 0.0,
    speedWeight: 0.10,
    lureResistanceWeight: 0.10,
    ambiguityWeight: 0.0,
  },
  decision_quality: {
    accuracyWeight: 0.45,
    calibrationWeight: 0.20,
    evidenceUpdateWeight: 0.15,
    speedWeight: 0.10,
    lureResistanceWeight: 0.10,
    ambiguityWeight: 0.0,
  },
  cognitive_flexibility: {
    accuracyWeight: 0.25,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.50,
    speedWeight: 0.10,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.0,
  },
  metacognitive_calibration: {
    accuracyWeight: 0.20,
    calibrationWeight: 0.70,
    evidenceUpdateWeight: 0.0,
    speedWeight: 0.0,
    lureResistanceWeight: 0.10,
    ambiguityWeight: 0.0,
  },
  bias_resistance: {
    accuracyWeight: 0.35,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.15,
    speedWeight: 0.05,
    lureResistanceWeight: 0.30,
    ambiguityWeight: 0.0,
  },
  social_inference: {
    accuracyWeight: 0.55,
    calibrationWeight: 0.20,
    evidenceUpdateWeight: 0.15,
    speedWeight: 0.0,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.10,
  },
  emotion_inference: {
    accuracyWeight: 0.45,
    calibrationWeight: 0.20,
    evidenceUpdateWeight: 0.0,
    speedWeight: 0.0,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.35,
  },
  ambiguity_tolerance: {
    accuracyWeight: 0.25,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.10,
    speedWeight: 0.0,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.50,
  },
  speed_accuracy_balance: {
    accuracyWeight: 0.45,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.0,
    speedWeight: 0.40,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.0,
  },
  self_awareness: {
    accuracyWeight: 0.30,
    calibrationWeight: 0.55,
    evidenceUpdateWeight: 0.15,
    speedWeight: 0.0,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.0,
  },
  evidence_updating: {
    accuracyWeight: 0.20,
    calibrationWeight: 0.15,
    evidenceUpdateWeight: 0.65,
    speedWeight: 0.0,
    lureResistanceWeight: 0.0,
    ambiguityWeight: 0.0,
  },
};

/**
 * Clean, non-academic titles that make sense immediately to a real user.
 * No dry university psychology jargon.
 */
export const CONSTRUCT_METADATA: Record<
  ConstructId,
  { nameFa: string; descriptionFa: string; icon: string; categoryFa: string }
> = {
  cognitive_reflection: {
    nameFa: 'مکث طلایی',
    descriptionFa: 'توانایی ایستادن و ترمز کردن قبل از زدنِ اولین جوابی که به ذهنت خطور می‌کنه.',
    icon: 'Brain',
    categoryFa: 'کنترل شتاب‌زدگی',
  },
  reasoning_accuracy: {
    nameFa: 'ردیاب مغالطات',
    descriptionFa: 'مچ‌گیری از استدلال‌های غلط، دروغ‌های آماری و فرمول‌های گول‌زننده.',
    icon: 'Compass',
    categoryFa: 'منطق و محاسبات',
  },
  decision_quality: {
    nameFa: 'حساب‌وکتاب هوشمند',
    descriptionFa: 'سنجش درست سود و زیان وقتی پول یا انتخابی مهم وسط است.',
    icon: 'Target',
    categoryFa: 'تصمیم‌گیری مالی',
  },
  cognitive_flexibility: {
    nameFa: 'شهامت تغییر نظر',
    descriptionFa: 'یک‌دنده نبودن و پذیرش واقعیت وقتی مدرک جدید خلاف حرف اولت ثابت شد.',
    icon: 'Shuffle',
    categoryFa: 'انعطاف فکری',
  },
  metacognitive_calibration: {
    nameFa: 'تطابق ادعا با واقعیت',
    descriptionFa: 'آیا وقتی می‌گی «صددرصد مطمئنم»، واقعاً درسته یا داری بلوف می‌زنی؟',
    icon: 'Gauge',
    categoryFa: 'خودشناسی',
  },
  bias_resistance: {
    nameFa: 'پادزهر تله‌های فکری',
    descriptionFa: 'گول نخوردن در حراجی‌ها، تخفیف‌های دروغی و احساس هدررفتن پول.',
    icon: 'ShieldCheck',
    categoryFa: 'هوشیاری در قضاوت',
  },
  social_inference: {
    nameFa: 'آدم‌شناسی و نیت‌خوانی',
    descriptionFa: 'فهمیدن قصد و غرض واقعی آدم‌ها از پشت لبخند یا حرف‌های مبهم.',
    icon: 'Users',
    categoryFa: 'هوش اجتماعی',
  },
  emotion_inference: {
    nameFa: 'کشف حس پنهان',
    descriptionFa: 'تشخیص حس واقعی طرف مقابل از روی رفتار، سکوت یا نشانه‌های ریز.',
    icon: 'HeartHandshake',
    categoryFa: 'احساسات',
  },
  ambiguity_tolerance: {
    nameFa: 'شجاعت گفتنِ «نمی‌دانم»',
    descriptionFa: 'قضاوت نکردن با اطلاعات نصفه‌نیمه و پذیرفتن این‌که هنوز وقت حدس زدن نیست.',
    icon: 'HelpCircle',
    categoryFa: 'پذیرش ابهام',
  },
  speed_accuracy_balance: {
    nameFa: 'سرعت به‌موقع',
    descriptionFa: 'تند فکر کردن بدون اینکه به خاطر عجله خراب‌کاری کنی.',
    icon: 'Timer',
    categoryFa: 'مدیریت زمان',
  },
  self_awareness: {
    nameFa: 'آینه خودشناسی',
    descriptionFa: 'شناخت صادقانه توانایی‌های واقعی خودت، بدون توجیه و تعارف.',
    icon: 'Eye',
    categoryFa: 'خودشناسی',
  },
  evidence_updating: {
    nameFa: 'به‌روزرسانی سریع فرضیه‌ها',
    descriptionFa: 'سرعت جذب اطلاعات تازه و کنار گذاشتن پیش‌داوری‌های قدیمی.',
    icon: 'RefreshCw',
    categoryFa: 'انعطاف فکری',
  },
};

export const LEVEL_DEFINITIONS = [
  { level: 1, titleFa: 'کنجکاو', minXp: 0, requiredTrials: 0 },
  { level: 2, titleFa: 'تیزببین', minXp: 150, requiredTrials: 5 },
  { level: 3, titleFa: 'مچ‌گیر تله‌ها', minXp: 400, requiredTrials: 12 },
  { level: 4, titleFa: 'منطقی خونسرد', minXp: 800, requiredTrials: 22 },
  { level: 5, titleFa: 'استراتژیست', minXp: 1400, requiredTrials: 35 },
  { level: 6, titleFa: 'ذهن ضدضربه', minXp: 2200, requiredTrials: 50 },
];
