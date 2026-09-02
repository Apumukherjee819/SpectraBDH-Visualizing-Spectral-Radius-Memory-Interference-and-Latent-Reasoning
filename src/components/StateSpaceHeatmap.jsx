import React, { useState } from 'react';
import { Layers, Eye, Info } from 'lucide-react';

export default function StateSpaceHeatmap({
  tokens,
  stateHistory,
  gateHistory,
  dim,
  selectedStep,
  onSelectStep
}) {
  const [hoveredNeuron, setHoveredNeuron] = useState(null);
  const currentStep = Math.min(selectedStep, stateHistory.length - 1);
  const currentState = stateHistory[currentStep] || new Float64Array(dim);
  const displayDim = Math.min(dim, 48); // Show up to 48 neuron bars cleanly

  // Calculate activation min/max for color mapping
  let maxAbs = 0.01;
  for (let i = 0; i < currentState.length; i++) {
    if (Math.abs(currentState[i]) > maxAbs) maxAbs = Math.abs(currentState[i]);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
      
      {/* Header & Step Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Visible Recurrent State Space <span className="text-cyan-400 font-mono">h_t ∈ ℝ^{dim}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Step:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            t = {currentStep} / {tokens.length - 1}
          </span>
          <span className="text-slate-400">Token:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
            {tokens[currentStep]?.name || 'None'}
          </span>
        </div>
      </div>

      {/* Sequence Token Scrubber Timeline */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Scrub Sequence Timeline (Click or drag step):</span>
          <span className="text-slate-500">Key Items Highlighted in Cyan</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {tokens.map((tok, idx) => {
            const isCurrent = idx === currentStep;
            const isKey = tok.type === 'key_value';
            const isQuery = tok.type === 'query';

            return (
              <button
                key={idx}
                onClick={() => onSelectStep(idx)}
                className={`flex-shrink-0 px-2 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                    : isKey
                    ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/50'
                    : isQuery
                    ? 'bg-purple-950/50 text-purple-300 border-purple-500/40 hover:bg-purple-900/50'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
                title={`Step ${idx}: ${tok.name} (${tok.type})`}
              >
                <span className="opacity-60 text-[9px]">t{idx}:</span> {tok.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* State Vector Neuron Activation Bars */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Latent State Vector Activations h_{currentStep}[0..{displayDim - 1}]:</span>
          <span>
            {hoveredNeuron !== null ? (
              <span className="text-cyan-300 font-bold">
                Neuron h[{hoveredNeuron.idx}] = {hoveredNeuron.val.toFixed(4)}
              </span>
            ) : (
              <span className="text-slate-500">Hover bar for exact float</span>
            )}
          </span>
        </div>

        {/* 2D Activation Grid / Bar Graph */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          {Array.from({ length: displayDim }, (_, i) => {
            const val = currentState[i] || 0;
            const normVal = Math.min(1, Math.max(-1, val / maxAbs));
            const isPositive = normVal >= 0;
            const heightPercent = Math.max(8, Math.abs(normVal) * 100);

            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredNeuron({ idx: i, val })}
                onMouseLeave={() => setHoveredNeuron(null)}
                className="h-20 flex flex-col justify-center items-center relative group cursor-crosshair rounded bg-slate-900/50 hover:bg-slate-800 transition-colors p-0.5"
              >
                {/* Bar representation */}
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isPositive
                        ? `rgba(6, 182, 212, ${0.4 + Math.abs(normVal) * 0.6})`
                        : `rgba(239, 68, 68, ${0.4 + Math.abs(normVal) * 0.6})`
                    }}
                    className="w-full rounded-sm transition-all duration-150 shadow-sm"
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-500 mt-0.5">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* State compression telemetry footer */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
          <span className="text-slate-400">State Norm ||h_t||_2:</span>
          <span className="text-cyan-300 font-bold">
            {Math.sqrt(currentState.reduce((acc, v) => acc + v * v, 0)).toFixed(3)}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
          <span className="text-slate-400">Gate Intensity Δ_t:</span>
          <span className="text-indigo-300 font-bold">
            {(gateHistory[currentStep] || 1.0).toFixed(3)}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
          <span className="text-slate-400">Compression Factor:</span>
          <span className="text-emerald-300 font-bold">
            {((currentStep + 1) / (dim / 64)).toFixed(1)}x Tokens / State
          </span>
        </div>
      </div>

    </div>
  );
}
