import React from 'react';
import { AlertTriangle, HelpCircle, XCircle, Info, CheckCircle2 } from 'lucide-react';

export default function LimitationsModule() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white">
            Honest Limitations, Boundary Conditions &amp; Misconceptions
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          In strict accordance with NeurIPS Education Track standards, we state exact failure modes, approximations, and debunk common theoretical misconceptions.
        </p>
      </div>

      {/* Grid of 3 Critical Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Limitation 1: Exact Retrieval Collapse */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <XCircle className="w-4 h-4" />
            <span>1. Exact Retrieval Bottleneck</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Unlike full Attention (which retains the exact uncompressed tokens in KV-cache), SSMs and linear recurrences maintain a compressed summary. While semantic tracking succeeds, retrieving exact random strings (e.g. 256-bit hashes or phone numbers) after thousands of steps inevitably degrades.
          </p>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900">
            Capacity bound: <span className="text-amber-300"># associations ≤ d / log|V|</span>
          </div>
        </div>

        {/* Limitation 2: High-Frequency Bandwidth & Smoothing */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <Info className="w-4 h-4" />
            <span>2. High-Frequency State Smoothing</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Continuous-time discretization in SSMs acts as a low-pass filter over the sequence. If a task requires rapid state oscillations at every single token without semantic continuity, SSM hidden states smooth out the transient signals.
          </p>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900">
            Bandwidth bound: <span className="text-indigo-300">Nyquist limit Δt · ω_max &lt; π</span>
          </div>
        </div>

        {/* Limitation 3: Gradient Vanishing in Deep Unrolling */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>3. Training Gradient Sensitivity</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            When training recurrent SSMs over sequences of length L &gt; 100,000 tokens, gradients (∂h_L / ∂h_0 = ∏ A_t) can vanish or explode unless structured initialization (like HiPPO) and careful normalization are applied.
          </p>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900">
            Mitigation: <span className="text-rose-300">HiPPO initialization &amp; RMSNorm</span>
          </div>
        </div>

      </div>

      {/* Common Misconceptions Debunked */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Common Misconceptions Debunked
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="space-y-1">
            <div className="text-rose-400 font-mono line-through">
              "Setting spectral radius ρ(A) = 1.0 achieves infinite lossless memory."
            </div>
            <div className="text-slate-300 text-xs">
              <strong className="text-emerald-400 font-semibold">Reality:</strong> Unitary / orthogonal matrices (ρ = 1) prevent vanishing norms, but sequential token injections continuously rotate the state vector. New tokens overwrite earlier subspace directions through orthogonal interference.
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-rose-400 font-mono line-through">
              "Recurrent architectures cannot be trained in parallel on GPUs."
            </div>
            <div className="text-slate-300 text-xs">
              <strong className="text-emerald-400 font-semibold">Reality:</strong> Linear time-invariant SSMs can be computed via associative parallel scan in O(log L) parallel depth during training, while switching to O(1) recurrent step at test-time inference.
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
