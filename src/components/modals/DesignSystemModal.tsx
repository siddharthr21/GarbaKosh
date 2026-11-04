'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Palette,
  X,
  Sparkles,
  Heart,
  Baby,
  ShieldCheck,
  Check,
  Layers
} from 'lucide-react';

export const DesignSystemModal: React.FC = () => {
  const { isDesignSystemOpen, setIsDesignSystemOpen } = useApp();

  if (!isDesignSystemOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-card rounded-4xl max-w-2xl w-full p-6 md:p-8 shadow-card border border-border relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">Garbkosh · Maternal Design Tokens</h2>
              <p className="text-xs text-muted-foreground">Warm, soothing, and accessible maternal wellness aesthetics</p>
            </div>
          </div>

          <button
            onClick={() => setIsDesignSystemOpen(false)}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6 text-xs">
          {/* Swatches */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Core Color Tokens</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl border border-border bg-[#FAF6EE] text-foreground space-y-1">
                <div className="h-10 rounded-xl bg-[#FAF6EE] border border-black/5" />
                <div className="font-bold">Warm Ivory</div>
                <div className="text-[10px] text-muted-foreground">#FAF6EE · Background</div>
              </div>

              <div className="p-3 rounded-2xl border border-border bg-card text-foreground space-y-1">
                <div className="h-10 rounded-xl bg-[#FFFDF8] border border-black/5" />
                <div className="font-bold">Cream Surface</div>
                <div className="text-[10px] text-muted-foreground">#FFFDF8 · Cards</div>
              </div>

              <div className="p-3 rounded-2xl border border-border bg-primary text-white space-y-1">
                <div className="h-10 rounded-xl bg-[#7A9A7E]" />
                <div className="font-bold">Sage Green</div>
                <div className="text-[10px] text-white/80">#7A9A7E · Primary</div>
              </div>

              <div className="p-3 rounded-2xl border border-border bg-accent text-white space-y-1">
                <div className="h-10 rounded-xl bg-[#C47A5A]" />
                <div className="font-bold">Terracotta</div>
                <div className="text-[10px] text-white/80">#C47A5A · Accent</div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-2 p-4 bg-muted/30 rounded-2xl border border-border">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Typography Scales</h3>
            <h1 className="font-serif text-2xl font-bold text-foreground">Fraunces Serif Headline (Display)</h1>
            <h2 className="font-serif text-lg font-bold text-foreground">Playfair / Fraunces Subheading</h2>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Inter Sans Body: Gentle, evidence-based guidance for you and your growing family. Clean readability, high contrast, and accessible WCAG AA standards.
            </p>
          </div>

          {/* Frosted Glass Utilities */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Frosted Glass Elements</h3>
            <div className="p-4 rounded-3xl glass-panel text-xs space-y-1">
              <span className="font-bold text-foreground block">.glass-panel</span>
              <p className="text-muted-foreground">Translucent backdrop blur (16px) with delicate border border-border/70</p>
            </div>
            <div className="p-3 rounded-full glass-pill text-xs flex items-center justify-between px-5">
              <span className="font-bold text-foreground">.glass-pill</span>
              <span className="text-primary font-semibold">Floating Mobile Dock Navigation</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => setIsDesignSystemOpen(false)}
            className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
