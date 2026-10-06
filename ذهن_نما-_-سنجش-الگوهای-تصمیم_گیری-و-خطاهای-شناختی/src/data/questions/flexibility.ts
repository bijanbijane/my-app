import { ScenarioQuestion } from '../../types';

export const FLEXIBILITY_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'FLEX_001',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'تخمین موفقیت استارتاپ',
    difficulty: 2,
    prompt: 'یک استارتاپ هوش مصنوعی در سال اول رشد ۲۰۰ درصدی کاربر ثبت کرده است. مدیران پیش‌بینی رشد ۵ برابری درآمد در سال دوم را دارند. نظر اولیه شما درباره سرمایه‌گذاری چیست؟',
    context: 'بررسی فرصت سرمایه‌گذاری خطرپذیر',
    options: [
      { id: 'opt_1', text: 'سرمایه‌گذاری با مبلغ حداکثری' },
      { id: 'opt_2', text: 'سرمایه‌گذاری مشروط و محتاطانه' },
      { id: 'opt_3', text: 'امتناع از ورود به این حوزه' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'تغییر نظر بر اساس ترازنامه مالی و عدم وابستگی به ارقام بازاریابی اولیه.',
    reflectiveInsight: 'هنگام مواجهه با داده‌های ساختاری منفی، اصرار بر اشتیاق اولیه به ضرر سرمایه‌گذار تمام می‌شود.',
    constructs: ['cognitive_flexibility', 'evidence_updating', 'decision_quality'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'شواهد جدید حسابرسی مستقل فاش کرد: نرخ ریزش ماهانه کاربران ۸۰٪ است و تمام رشد از طریق تبلیغات یارانه‌ای موقت تامین شده است.',
    stageTwoEvidence: 'نرخ ریزش مشتریان ۸۰٪ است و مدل کسب‌وکار زیان‌ده است.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'با وجود شواهد منفی، هنوز به همان استراتژی قبلی پایبند می‌مانم' },
      { id: 'opt_2_2', text: 'نظرم را تغییر داده و سرمایه‌گذاری را بلافاصله لغو می‌کنم', isCorrect: true },
      { id: 'opt_2_3', text: 'مبلغ سرمایه‌گذاری را دو برابر می‌کنم تا رشد تسریع شود' }
    ],
    stageTwoCorrectId: 'opt_2_2',
    sourceBasis: 'Girotto & Gonzalez 2001 - Belief Revision in Probability',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_002',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'belief_revision',
    title: 'قضاوت اعتبار گزارش اقلیمی',
    difficulty: 2,
    prompt: 'مقاله‌ای ادعا می‌کند نوعی آلاینده صنعتی جدید کاملاً بی‌خطر است و هیچ اثر زیست‌محیطی ندارد. واکنش اولیه شما چیست؟',
    context: 'ارزیابی ایمنی محیط‌زیست در یک حوزه صنعتی',
    options: [
      { id: 'opt_1', text: 'پذیرش قطعی ادعای مقاله' },
      { id: 'opt_2', text: 'تردید علمی و نیاز به آزمایش‌های چندگانه' },
      { id: 'opt_3', text: 'رد فوری بدون خواندن جزییات' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'با مشخص شدن تعارض منافع حامی مالی، بازنگری در درجه اطمینان ضروری است.',
    reflectiveInsight: 'عقلانیت علمی وابسته به توانایی به‌روزرسانی باورها پس از برملا شدن زمینه‌های سوگیری است.',
    constructs: ['cognitive_flexibility', 'evidence_updating', 'bias_resistance'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'سند رسمی جدیدی نشان می‌دهد که این مقاله توسط کارخانه تولیدکننده همان آلاینده به صورت سفارشی تامین مالی شده است.',
    stageTwoEvidence: 'تعارض منافع نویسندگان با شرکت ذینفع.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'همچنان نتایج مقاله را کاملاً معتبر و علمی می‌دانم' },
      { id: 'opt_2_2', text: 'باورم را تغییر داده و مقاله را مشکوک و فاقد اعتبار مستقل ارزیابی می‌کنم', isCorrect: true },
      { id: 'opt_2_3', text: 'فرقی در ارزیابی من ایجاد نمی‌کند' }
    ],
    stageTwoCorrectId: 'opt_2_2',
    sourceBasis: 'Baron 2008 - Actively Open-Minded Thinking',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_003',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'معمای کارآگاه: مظنون اصلی',
    difficulty: 2,
    prompt: 'در یک پرونده سرقت از موزه، نگهبان شب با کیف پول پر از پول نقد دستگیر شده است. فرض اولیه کارآگاه این است که او سارق اصلی است. ارزیابی شما چیست؟',
    context: 'تحقیقات قضایی و تحلیل سرنخ‌ها',
    options: [
      { id: 'opt_1', text: 'نگهبان قطعا گناهکار است و پرونده باید بسته شود' },
      { id: 'opt_2', text: 'نگهبان مظنون شماره یک است اما شواهد تاییدکننده بیشتری لازم است' },
      { id: 'opt_3', text: 'نگهبان قطعا بی‌گناه است' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'انعطاف شناختی مستلزم رها کردن فرضیه اولیه در مواجهه با مدرک قطعی ردکننده (Alibi) است.',
    reflectiveInsight: 'ذهن تمایل دارد شواهد بعدی را طوری تفسیر کند که گناهکاری نگهبان را اثبات کند، مگر اینکه منعطف باشد.',
    constructs: ['cognitive_flexibility', 'evidence_updating'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'دوربین‌های شهری زمان‌دار نشان می‌دهند نگهبان در ساعت دقیق سرقت در بیمارستان بر بالین فرزندش بوده و پول نقد نیز وام بانکی ثبت‌شده اوست.',
    stageTwoEvidence: 'اثبات حضور مظنون در بیمارستان با فیلم مستند.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'فرضیه سارق بودن او را به طور کامل کنار می‌گذارم و سراغ سرنخ‌های جدید می‌روم', isCorrect: true },
      { id: 'opt_2_2', text: 'همچنان اصرار دارم او به طریقی همدست سارق است بدون هیچ مدرکی' },
      { id: 'opt_2_3', text: 'دوربین‌ها حتما فریب خورده‌اند' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Evans & Stanovich 2013 - Hypothesis Testing',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_004',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'انتخاب مسیر رانندگی',
    difficulty: 1,
    prompt: 'شما همیشه از مسیر بزرگراه اصلی به محل کار می‌روید چون معمولاً سریع‌تر است. امروز برنامه دارید از همان بزرگراه بروید. تصمیم اولیه چیست؟',
    context: 'انتخاب روزمره مسیر شهری',
    options: [
      { id: 'opt_1', text: 'حرکت از همان بزرگراه همیشگی' },
      { id: 'opt_2', text: 'انتخاب تصادفی یک کوچه فرعی' }
    ],
    correctAnswerId: 'opt_1',
    explanation: 'تطبیق بلادرنگ مسیر بر اساس نقشه ترافیکی زنده نشان‌دهنده انعطاف رفتاری است.',
    reflectiveInsight: 'عادت‌های رفتاری محکم‌ترین موانع انعطاف‌پذیری شناختی روزمره هستند.',
    constructs: ['cognitive_flexibility', 'decision_quality'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'رادیو پیام اعلام می‌کند یک تانکر در ابتدای بزرگراه واژگون شده و راه بندان سنگین ۴ ساعته ایجاد کرده است، اما خیابان ساحلی کاملاً خلوت است.',
    stageTwoEvidence: 'گزارش موثق تصادف و مسدودی قطعی مسیر معمول.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'بلافاصله مسیرم را به خیابان ساحلی تغییر می‌دهم', isCorrect: true },
      { id: 'opt_2_2', text: 'به بزرگراه می‌روم شاید تا برسم تصادف حل شده باشد' },
      { id: 'opt_2_3', text: 'ماشین را خاموش کرده و منتظر می‌مانم' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Leber et al. 2008 - Cognitive Flexibility and Task Switching',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_005',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'belief_revision',
    title: 'طرح جدید بازاریابی',
    difficulty: 2,
    prompt: 'تیم شما ۶ ماه وقت صرف طراحی یک بنر تبلیغاتی با تم سنتی کرده است. پیش‌بینی شما این است که این طرح فروش را افزایش خواهد داد.',
    context: 'تحلیل داده‌های تست A/B تبلیغات',
    options: [
      { id: 'opt_1', text: 'انتشار سراسری طرح سنتی' },
      { id: 'opt_2', text: 'آزمایش مقدماتی در جامعه کوچک' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'نادیده گرفتن تعصب روی طرح خودساخته هنگام مشاهده شکست تجربی تست.',
    reflectiveInsight: 'تلاش شخصی صرف‌شده باعث دل‌بستگی هیجانی به ایده‌ها می‌شود.',
    constructs: ['cognitive_flexibility', 'bias_resistance'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'نتیجه تست روی ۵۰ هزار مخاطب نشان داد طرح مدرن جایگزین ۳ برابر نرخ تبدیل بالاتری نسبت به طرح سنتی داشته است.',
    stageTwoEvidence: 'برتری آماری ۳۰۰ درصدی طرح رقیب در دنیای واقعی.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'طرح سنتی خودمان را کنار گذاشته و طرح مدرن برنده را منتشر می‌کنیم', isCorrect: true },
      { id: 'opt_2_2', text: 'طرح سنتی را منتشر می‌کنیم چون سلیقه ما مهم‌تر از بازخورد آماری است' },
      { id: 'opt_2_3', text: 'تست را آنقدر تکرار می‌کنیم تا شاید روزی طرح سنتی جلو بیفتد' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Stanovich 2011 - Rationality and the Reflective Mind',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_006',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'تشخیص عیب خودرو',
    difficulty: 2,
    prompt: 'مکانیک اولیه ادعا می‌کند صدای تق‌تق موتور خودرو ناشی از خرابی تسمه تایم است و خرج سنگینی دارد. نظر شما چیست؟',
    context: 'تصمیم‌گیری فنی در مواجهه با نظرات متضاد',
    options: [
      { id: 'opt_1', text: 'تعویض فوری و پرداخت هزینه سنگین' },
      { id: 'opt_2', text: 'گرفتن نظر تشخیصی دوم با دستگاه دیاگ' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'تغییر نظر در برابر سنجش ابزاری دقیق به جای تعصب روی نظر اول.',
    reflectiveInsight: 'هزینه اشتباه اولیه دیگران را نباید با لجاجت بر دوش گرفت.',
    constructs: ['cognitive_flexibility', 'evidence_updating'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'متخصص برق و دیاگ نشان داد تسمه کاملاً سالم و نو است، و تنها یک پیچ شل روی روکش اگزوز ارتعاش ایجاد می‌کرده و با ۲ دقیقه آچارکشی رفع شد.',
    stageTwoEvidence: 'شواهد عینی مکانیکی و تست دستگاه الکترونیکی.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'فرضیه تسمه تایم را کنار می‌گذارم و پیچ را محکم می‌کنم', isCorrect: true },
      { id: 'opt_2_2', text: 'با وجود رفع عیب، اصرار می‌کنم تسمه تایم نو را هم باز و تعویض کنند' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Baron 2008 - Flexible Thinking',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_007',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'belief_revision',
    title: 'تغییر نظر درباره همکار جدید',
    difficulty: 2,
    prompt: 'همکار جدیدی در روز اول بسیار ساکت، سرد و بی‌تفاوت به نظر می‌رسد. شما فکر می‌کنید او فردی مغرور و غیرهمکار است. برآورد شما چیست؟',
    context: 'ادراک بین‌فردی در محیط کار',
    options: [
      { id: 'opt_1', text: 'او قطعا فردی غیرقابل معاشرت است' },
      { id: 'opt_2', text: 'یک روز برای قضاوت خلق‌وخوی یک انسان کافی نیست' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'کنار گذاشتن برچسب اولیه در پرتو شواهد رفتاری روزهای بعد.',
    reflectiveInsight: 'خطای بنیادین انتساب تمایل دارد سکوت ناشی از اضطراب روز اول را به صفت پایدار غرور ربط دهد.',
    constructs: ['cognitive_flexibility', 'social_inference'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'روز بعد می‌فهمید مادر او شب قبل در بیمارستان بستری بوده و او امروز پس از بهبودی مادرش، بسیار گرم و با اشتیاق به تمام همکاران در پروژه‌ها کمک می‌کند.',
    stageTwoEvidence: 'شناخت بافت زمینه و موقعیت تنش‌زای شخصی.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'قضاوت اولیه‌ام را اصلاح می‌کنم و رفتار او را در زمینه درک می‌کنم', isCorrect: true },
      { id: 'opt_2_2', text: 'همچنان معتقدم او ذاتا مغرور است و کمک امروزش فیلم است' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Gilbert 1989 - Attributional Revision',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_008',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'پیش‌بینی آب‌وهوای کوهستان',
    difficulty: 1,
    prompt: 'برنامه هواشناسی دیروز نشان داده بود فردا هوای قله آفتابی خواهد بود. صبح زود آماده حرکت برای صعود ۵ ساعته می‌شوید.',
    context: 'تصمیم ایمنی ورزشی در طبیعت',
    options: [
      { id: 'opt_1', text: 'خروج به سمت قله بدون چک کردن شرایط لحظه‌ای' },
      { id: 'opt_2', text: 'بررسی رادار ابری لحظه‌ای قبل از کوهپیمایی' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'تغییر منعطف برنامه در برابر شواهد زنده هواشناسی ضامن ایمنی است.',
    reflectiveInsight: 'تصمیمات ایمنی نیازمند انعطاف شناختی سریع و فارغ از هزینه تدارکات اولیه است.',
    constructs: ['cognitive_flexibility', 'decision_quality'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'هواشناسی اضطراری هلال احمر اخطار طوفان تندری و رعد و برق مرگبار در ارتفاعات را برای ۲ ساعت آینده صادر کرده است.',
    stageTwoEvidence: 'هشدار قطعی شرایط مخاطره‌آمیز جانی.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'برنامه صعود را لغو کرده و به خانه برمی‌گردم', isCorrect: true },
      { id: 'opt_2_2', text: 'چون دیروز گفته بود آفتابی است بالا می‌روم' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Reason 1990 - Human Error and Situational Awareness',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_009',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'belief_revision',
    title: 'فرضیه علمی داروی جدید',
    difficulty: 3,
    prompt: 'یک تیم دانشگاهی فرضیه‌ای مطرح کرده که ترکیب ماده X برای تسکین درد موثرتر از ایبوپروفن است. آن‌ها بسیار به این فرضیه امیدوارند.',
    context: 'آزمایش بالینی کنترل‌شده دو سو کور',
    options: [
      { id: 'opt_1', text: 'باور به موفقیت حتمی پیش از اتمام آزمایش' },
      { id: 'opt_2', text: 'انتظار برای تحلیل داده‌های تصادفی‌سازی‌شده' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'پایبندی به اصل ابطال‌پذیری در روش علمی در مواجهه با عدم معناداری آماری.',
    reflectiveInsight: 'دانشمندان بزرگ کسانی هستند که فرضیه‌های مورد علاقه خود را با آرامش در برابر شواهد منفی رها می‌کنند.',
    constructs: ['cognitive_flexibility', 'reasoning_accuracy'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'کارآزمایی تصادفی روی ۲ هزار بیمار نشان داد ترکیب X هیچ برتری نسبت به دارونما ندارد (p > 0.40).',
    stageTwoEvidence: 'رد قاطع فرضیه در آزمون دوسوکور آماری.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'شکست فرضیه را می‌پذیرند و به دنبال مسیرهای درمانی دیگر می‌روند', isCorrect: true },
      { id: 'opt_2_2', text: 'داده‌ها را دستکاری می‌کنند تا فرضیه محبوبشان حفظ شود' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Popper 1959 - Logic of Scientific Discovery & Flexibility',
    minObservationsNeeded: 3
  },
  {
    id: 'FLEX_010',
    familyId: 'cognitive_flexibility',
    gameMechanic: 'evidence_update',
    title: 'تخفیف رستوران پر سر و صدا',
    difficulty: 1,
    prompt: 'شما وارد رستورانی می‌شوید که به دلیل دکوراسیون زیبایش تعریف آن را شنیده‌اید و می‌خواهید یک ساعت با آرامش کتاب بخوانید و غذا میل کنید.',
    context: 'سازگاری با تغییر شرایط آسایش محیطی',
    options: [
      { id: 'opt_1', text: 'سفارش بلافاصله غذا' },
      { id: 'opt_2', text: 'بررسی محیط صوتی سالن قبل از ثبت سفارش' }
    ],
    correctAnswerId: 'opt_2',
    explanation: 'خروج آرام از فضایی که با هدف شما تعارض پیدا کرده نشان‌دهنده هوشمندی انطباقی است.',
    reflectiveInsight: 'انسان‌ها گاهی به خاطر خجالت یا رودربایستی، علی‌رغم تغییر آشکار شرایط، تصمیم به ماندن می‌گیرند.',
    constructs: ['cognitive_flexibility', 'decision_quality'],
    primaryConstruct: 'cognitive_flexibility',
    confidenceRequired: true,
    speedImpact: false,
    hasSecondStage: true,
    stageTwoPrompt: 'بلافاصله متوجه می‌شوید کنار میز شما یک بلندگوی بزرگ با صدای بلند موسیقی هیپ‌هاپ گذاشته شده و بوی تند رنگ ساختمانی تازه از دیوار مجاور می‌آید.',
    stageTwoEvidence: 'ناهمخوانی کامل فضا با هدف آرامش و مطالعه.',
    stageTwoOptions: [
      { id: 'opt_2_1', text: 'تصمیمم را تغییر داده، تشکر می‌کنم و به کافه دنج دیگری می‌روم', isCorrect: true },
      { id: 'opt_2_2', text: 'با وجود سردرد می‌نشینم و غذای گران سفارش می‌دهم' }
    ],
    stageTwoCorrectId: 'opt_2_1',
    sourceBasis: 'Leber et al. 2008 - Behavioral Flexibility',
    minObservationsNeeded: 3
  }
];
