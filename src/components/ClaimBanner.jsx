import React from 'react';
import { Target, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

export default function ClaimBanner({ currentModel, evaluations, spectralRadius }) {
  const isInterfering = evaluations.some(e => !e.isCorrect);
  const isBdhorMamba = currentModel === 'bdh_synaptic' || currentModel === 'bdh_cq_latent' || currentModel === 'selective_ssm';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-indigo-950/40 p-6 shadow-2xl backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Claim Text Area */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Target className="w-3.5 h-3.5" /> Falsifiable Hypothesis
            </span>
            <span className="text-xs text-slate-400 font-mono">NeurIPS 2026 Core Claim</span>
          </div>

          <p className="text-sm sm:text-base md:text-lg font-medium text-slate-100 leading-relaxed">
            <span className="text-cyan-300 font-semibold">"A fixed-size linear recurrent state </span>
            <span className="font-mono text-cyan-200 text-xs sm:text-sm bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
              h_t = A·h_{'{t-1}'} + B·x_t
            </span>
            <span className="text-slate-200"> processes sequences in </span>
            <span className="text-indigo-300 font-semibold">O(1) memory per step</span>
            <span className="text-slate-200">, but prior associative recall decays exponentially with sequence length </span>
            <span className="font-mono text-amber-300">L</span>
            <span className="text-slate-200"> at rate </span>
            <span className="font-mono text-amber-300">ρ(A)^L</span>
            <span className="text-slate-200">, causing catastrophic interference that </span>
            <span className="text-emerald-300 font-semibold">selective gating and synaptic plasticity (BDH)</span>
            <span className="text-slate-200"> systematically mitigate."</span>
          </p>
        </div>

        {/* Live Empirical Status Card */}
        <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 gap-2 min-w-[210px]">
          <div className="text-left md:text-right">
            <div className="text-[11px] font-mono uppercase text-slate-400">Live Empirical Verdict</div>
            <div className="flex items-center md:justify-end gap-1.5 mt-1">
              {currentModel === 'linear_ssm' ? (
                isInterfering ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4" /> Hypothesis Confirmed: Collapse Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <CheckCircle2 className="w-4 h-4" /> Near-Boundary Retention
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> BDH / Plasticity Solved
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono text-right">
            Spectral Radius: <span className="text-white font-bold">{spectralRadius.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
