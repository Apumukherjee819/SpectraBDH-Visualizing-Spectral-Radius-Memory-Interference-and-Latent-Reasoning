import React from 'react';
import { Sparkles, Cpu, BookOpen, ExternalLink, Zap, Award, Layers } from 'lucide-react';

export default function Header({ onOpenBlog, activeTourStep }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                DataForge <span className="text-cyan-400 font-mono">.pathway</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Award className="w-3 h-3" /> NeurIPS 2026 Edu Track
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Explain the Frontier: State Space Models & Dragon Hatchling (BDH)
            </p>
          </div>
        </div>

        {/* Live Substrate Ticker & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Vector Substrate (<span className="text-white font-bold">&lt;16ms</span> 60FPS)</span>
          </div>

          {/* Jump to BDH section */}
          <a
            href="#bdh-module"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>BDH & BDH CQ</span>
          </a>

          {/* Read Blog Post Button */}
          <button
            onClick={onOpenBlog}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Blog Post <span className="hidden sm:inline">(+10 Bonus)</span></span>
          </button>
        </div>

      </div>
    </header>
  );
}
