import React from 'react';
import { UserProfile } from '../types';
import { getActiveStoryFragment } from '../utils/storyFragments';
import { Eye, Sparkles, Feather } from 'lucide-react';

interface StoryFragmentCardProps {
  profile: UserProfile;
}

export const StoryFragmentCard: React.FC<StoryFragmentCardProps> = ({ profile }) => {
  const story = getActiveStoryFragment(profile);

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950/20 border border-amber-500/25 dark:border-amber-500/20 shadow-sm relative overflow-hidden transition-all text-slate-100">
      {/* Subtle enigmatic background aura */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Entity Indicator Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            <span>زمزمه‌های راویِ تالار</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800">
            {story.entityEmotionFa}
          </span>
        </div>

        {/* Story Title & Chapter */}
        <div className="mb-2">
          <span className="text-[10px] text-slate-400 block">
            {story.chapterFa}
          </span>
          <h4 className="text-xs font-black text-slate-100">
            {story.titleFa}
          </h4>
        </div>

        {/* Narrative Prose */}
        <p className="text-xs text-slate-300 leading-relaxed font-medium italic pr-2 border-r-2 border-amber-500/60">
          «{story.narrativeFa}»
        </p>
      </div>
    </div>
  );
};
