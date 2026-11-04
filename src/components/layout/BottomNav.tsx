'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  Timer,
  Menu,
  Heart
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu
}) => {
  const { t } = useApp();

  const NAV_ITEMS = [
    { id: 'dashboard', label: t('homeDashboard'), icon: LayoutDashboard },
    { id: 'journey', label: t('journey'), icon: Sparkles },
    { id: 'bloom-ai', label: t('bloomAi'), icon: Bot },
    { id: 'contractions', label: t('contractions'), icon: Timer },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden flex justify-center">
      <div className="glass-pill px-3 py-2 rounded-full flex items-center justify-between gap-1 shadow-dock max-w-sm w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 py-1.5 px-2 rounded-full flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-xs scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu Pill */}
        <button
          onClick={onOpenMobileMenu}
          className="flex-1 py-1.5 px-2 rounded-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-all"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
