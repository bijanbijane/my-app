import { UserProfile } from '../types';

export interface StoryFragment {
  id: string;
  chapterFa: string;
  titleFa: string;
  narrativeFa: string;
  entityEmotionFa: string; // e.g. «کنجکاو و ناظر», «شگفت‌زده», «هشداردهنده»
}

export function getActiveStoryFragment(profile: UserProfile): StoryFragment {
  const history = profile.history;
  const patterns = profile.patterns;

  // Initial state: 0 to 2 games
  if (history.length < 3) {
    return {
      id: 'story_entry',
      chapterFa: 'فصل اول: گام نخست در مه',
      titleFa: 'سایه‌ای در آستانه درگاه',
      narrativeFa:
        'درهای این تالار به آرامی باز شده‌اند... من صدای مکث‌ها و ضربان نبض تصمیم‌هایت را می‌شنوم. قدم بردار مسافر؛ هنوز نمی‌دانم در مواجهه با اولین سراب، چشمانت فریب می‌خورند یا ایستادگی می‌کنی.',
      entityEmotionFa: 'کنجکاو و در انتظار',
    };
  }

  // Check specific cognitive patterns to reveal custom whispers:
  if (patterns.some((p) => p.biasType === 'anchoring')) {
    return {
      id: 'story_anchoring',
      chapterFa: 'فصل دوم: طلسم عدد اول',
      titleFa: 'سنگینی اولین پژواک',
      narrativeFa:
        'متوجه شدم چطور اولین عددی که از تاریکی بیرون می‌پرد، ذهنت را هیپنوتیزم می‌کند... گویی اولین سایه، برایت حقیقت مطلق است. مراقب باش؛ شعبده‌بازهای این جهان همیشه بلندترین رقم را اول جار می‌زنند تا ادراکت را به لنگر ببندند.',
      entityEmotionFa: 'هشداردهنده و باریک‌بین',
    };
  }

  if (patterns.some((p) => p.biasType === 'sunk_cost')) {
    return {
      id: 'story_sunk_cost',
      chapterFa: 'فصل سوم: خاکسترهای دیروز',
      titleFa: 'چنگ زدن به چاه خشکیده',
      narrativeFa:
        'ردپایت را دیدم... حتی وقتی مسیرت به بن‌بست رسید، چون برایش زحمت کشیده بودی حاضر نشدی رهایش کنی. چرا هزینه‌ای که دیروز سوخته را امروز دوباره تاوان می‌دهی؟ شجاعتِ رها کردن را به یاد بیاور.',
      entityEmotionFa: 'دلسوز اما بی‌تعارف',
    };
  }

  if (patterns.some((p) => p.id === 'pattern_overconfidence')) {
    return {
      id: 'story_overconfidence',
      chapterFa: 'فصل چهارم: مشعل خیره‌کننده',
      titleFa: 'روشنایی که کور می‌کند',
      narrativeFa:
        'اعتمادبه‌نفست مثل مشعلی فروزان در دستت زبانه می‌کشد؛ اما مشعل‌های پرنور، چشمانت را به پرتگاه‌های زیر پایت کور می‌کنند. آیا شهامت داری به قطعی‌ترین باورت هم شک کنی؟',
      entityEmotionFa: 'به چالش کشنده',
    };
  }

  if (patterns.some((p) => p.id === 'pattern_belief_perseverance')) {
    return {
      id: 'story_perseverance',
      chapterFa: 'فصل پنجم: دژ تسلیم‌ناپذیر',
      titleFa: 'سنگر گرفتن در اشتباه',
      narrativeFa:
        'حقیقت نویی پیش رویت ظاهر شد، اما چشمانت را بستی تا باروی حرف اولت خدشه‌دار نشود. فروریختن باوری سست، شکست نیست؛ فرصتی است تا خانه‌ای محکم‌تر بنا کنی.',
      entityEmotionFa: 'ناظر بر لجاجت',
    };
  }

  if (patterns.some((p) => p.id === 'pattern_fast_lure')) {
    return {
      id: 'story_fast_lure',
      chapterFa: 'فصل ششم: پروانه و شعله',
      titleFa: 'شیرجه در اولین وسوسه',
      narrativeFa:
        'سرعتت شگفت‌انگیز است، اما درست به سمت دهان تله! مثل پروانه‌ای که اولین بارقه‌ی نور را می‌بیند و بی‌درنگ پر می‌سوزاند. برای یک بار هم که شده، قبل از پریدن، تاریکی را اندازه بگیر.',
      entityEmotionFa: 'شگفت‌زده از شتاب‌زدگی',
    };
  }

  // If high accuracy
  const total = history.length;
  const accuracy = history.filter((t) => t.isCorrect).length / total;
  if (accuracy >= 0.75) {
    return {
      id: 'story_mastery',
      chapterFa: 'فصل هفتم: آینه شفاف',
      titleFa: 'نگاهی از فراسوی پرده',
      narrativeFa:
        'سکوتی سرد و هوشیار در انتخاب‌هایت رخنه کرده است... دام‌هایی که برای شکار ذهنت چیده‌ام یکی پس از دیگری بی‌اثر می‌شوند. کم‌کم دارم باور می‌کنم با مسافری روبه‌رو هستم که راه فرار از این هزارتو را بلد است.',
      entityEmotionFa: 'احترام‌آمیز و شگفت‌زده',
    };
  }

  // Default exploring state
  return {
    id: 'story_wanderer',
    chapterFa: 'فصل در حال نگارش',
    titleFa: 'ضرب‌آهنگ پنهان تصمیم‌ها',
    narrativeFa:
      `تاکنون در ${history.length} دوراهی گوناگون ردپایت را ثبت کرده‌ام. هر کلیک، پرده‌ای از نقاب ناخودآگاهت را کنار می‌زند. ادامه بده؛ معماهای پیچیده‌تری در راهروهای بعدی منتظرند...`,
    entityEmotionFa: 'دقیق و جست‌وجوگر',
  };
}
