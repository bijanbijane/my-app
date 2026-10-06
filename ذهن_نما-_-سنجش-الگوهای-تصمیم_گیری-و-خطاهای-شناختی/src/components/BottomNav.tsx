import React from 'react';
import { Home, Compass, Lightbulb, History, BookOpen } from 'lucide-react';

export type NavTab = 'home' | 'profile' | 'patterns' | 'history' | 'research';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  patternsCount: number;
}

interface TabItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  patternsCount,
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'بازی', icon: Home },
    { id: 'profile', label: 'اسرار ذهن', icon: Compass },
    { id: 'patterns', label: 'کدهای لو‌رفته', icon: Lightbulb, badge: patternsCount > 0 ? patternsCount : null },
    { id: 'history', label: 'ردپاها', icon: History },
    { id: 'research', label: 'پشت پرده', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as NavTab)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-all duration-150 ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
