import React from 'react';
import { Play, FastForward, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, Compass, Sparkles } from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    badge: 'Step 1: The O(1) Promise',
    title: 'How Recurrent States Compress History',
    summary: 'Standard Transformers store an ever-growing KV-cache (O(N) memory per token). SSMs compress the entire unbounded sequence history into a single fixed vector h_t in R^d.',
    actionPrompt: 'Observe the Recurrent State Heatmap below. Notice how the state dimension remains constant at d=64 regardless of token length.',
    recommendedModel: 'linear_ssm',
    recommendedRho: 0.95,
    presetId: 'ASSOCIATIVE_COLLAPSE'
  },
  {
    step: 2,
    badge: 'Step 2: The Spectral Trap & Decay',
    title: 'Why Classical SSMs Suffer Catastrophic Forgetting',
    summary: 'Because transition matrix A is applied repeatedly (A^L), token information decays exponentially at rate rho(A)^L. With rho(A)=0.85, a token inserted at step 0 is virtually erased by step 15.',
    actionPrompt: 'Lower the Spectral Radius slider to 0.75 and watch the Truth vs Estimate matrix turn red as the model forgets [Token_A = Alpha].',
    recommendedModel: 'linear_ssm',
    recommendedRho: 0.75,
    presetId: 'ASSOCIATIVE_COLLAPSE'
  },
  {
    step: 3,
    badge: 'Step 3: The Selective Gating Fix (Mamba S6)',
    title: 'Input-Dependent Delta Gating',
    summary: 'Gu & Dao (2023) introduced selective state spaces: rather than applying static decay, the model dynamically scales Delta(x_t), compressing noisy distractor tokens while preserving informative tokens.',
    actionPrompt: 'Switch architecture to Selective SSM (Mamba S6) and watch how distractor tokens are filtered out while key tokens persist.',
    recommendedModel: 'selective_ssm',
    recommendedRho: 0.95,
    presetId: 'ASSOCIATIVE_COLLAPSE'
  },
  {
    step: 4,
    badge: 'Step 4: The BDH Synaptic Frontier',
    title: 'Dragon Hatchling: Fast-Weights & Latent Reasoning',
    summary: 'Pathway\'s Dragon Hatchling (BDH) implements multi-scale synaptic plasticity W_t = lambda W_{t-1} + eta (y_t (x) x_t). BDH CQ further reasons over continuous latent trajectories without generating verbose token chains.',
    actionPrompt: 'Switch architecture to Dragon Hatchling (BDH) and watch the associative memory matrix remain 100% stable with zero interference noise!',
    recommendedModel: 'bdh_synaptic',
    recommendedRho: 0.95,
    presetId: 'BDH_CQ_REASONING'
  }
];

export default function GuidedTour({
  currentStep,
  onSelectStep,
  onApplyStepSettings,
  isSandboxMode,
  onToggleSandbox
}) {
  const activeTour = TOUR_STEPS[currentStep - 1] || TOUR_STEPS[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md">
      
      {/* Step Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            60-Second Guided Learning Journey
          </span>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1.5">
          {TOUR_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                onSelectStep(s.step);
                onApplyStepSettings(s);
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                currentStep === s.step
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Step {s.step}
            </button>
          ))}
          <button
            onClick={onToggleSandbox}
            className={`ml-2 px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
              isSandboxMode
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                : 'bg-slate-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
            }`}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Free Sandbox
          </button>
        </div>
      </div>

      {/* Active Step Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold">{activeTour.badge}</span>
          </div>
          <h3 className="text-base font-bold text-white">{activeTour.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeTour.summary}</p>
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-amber-300/90 font-mono flex items-start gap-2">
            <span className="text-amber-400 font-bold">👉 Action:</span>
            <span>{activeTour.actionPrompt}</span>
          </div>
        </div>

        {/* Navigation & Preset Auto-apply */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <button
            onClick={() => onApplyStepSettings(activeTour)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Apply This Step's Preset Setup
          </button>

          <div className="flex items-center justify-between gap-2">
            <button
              disabled={currentStep <= 1}
              onClick={() => {
                const prev = Math.max(1, currentStep - 1);
                onSelectStep(prev);
                onApplyStepSettings(TOUR_STEPS[prev - 1]);
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Prev
            </button>
            <button
              disabled={currentStep >= TOUR_STEPS.length}
              onClick={() => {
                const next = Math.min(TOUR_STEPS.length, currentStep + 1);
                onSelectStep(next);
                onApplyStepSettings(TOUR_STEPS[next - 1]);
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
