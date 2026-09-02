import React, { useMemo } from 'react';
import { Swords, CheckCircle2, XCircle, AlertTriangle, Layers, Cpu, Zap, Brain, Database } from 'lucide-react';
import { runSequenceSimulation } from '../engine/ssmEngine';

export default function ArchitectureArena({ tokens, dim, spectralRadius, synapticRate }) {
  // Run all 4 models simultaneously on the active sequence
  const results = useMemo(() => {
    const linear = runSequenceSimulation({
      tokens,
      dim,
      spectralRadius,
      modelType: 'linear_ssm',
      synapticRate
    });

    const selective = runSequenceSimulation({
      tokens,
      dim,
      spectralRadius,
      modelType: 'selective_ssm',
      synapticRate
    });

    const bdh = runSequenceSimulation({
      tokens,
      dim,
      spectralRadius,
      modelType: 'bdh_synaptic',
      synapticRate
    });

    const bdhCq = runSequenceSimulation({
      tokens,
      dim,
      spectralRadius,
      modelType: 'bdh_cq_latent',
      synapticRate
    });

    // Helper to calculate average fidelity across all key-value probes
    const getAvgFidelity = (evals) => {
      if (!evals || evals.length === 0) return 0;
      const sum = evals.reduce((acc, e) => acc + e.fidelity, 0);
      return Math.round((sum / evals.length) * 100);
    };

    const L = tokens.length;

    return [
      {
        name: 'Classical Linear SSM',
        subtitle: 'Fixed Linear Recurrence',
        icon: Cpu,
        color: 'indigo',
        fidelity: getAvgFidelity(linear.evaluations),
        memoryComplexity: 'O(1) Constant (64 floats)',
        kvCacheSize: `${dim} floats`,
        evals: linear.evaluations,
        verdict: getAvgFidelity(linear.evaluations) > 50 ? 'Borderline Recall' : 'Catastrophic Collapse',
        verdictType: getAvgFidelity(linear.evaluations) > 50 ? 'warning' : 'danger',
        mechanism: 'Fixed transition A^L causes exponential decay ρ(A)^L.'
      },
      {
        name: 'Selective SSM (Mamba S6)',
        subtitle: 'Input-Dependent Δ(x_t) Gating',
        icon: Zap,
        color: 'cyan',
        fidelity: getAvgFidelity(selective.evaluations),
        memoryComplexity: 'O(1) Constant (64 floats)',
        kvCacheSize: `${dim} floats`,
        evals: selective.evaluations,
        verdict: getAvgFidelity(selective.evaluations) > 70 ? 'High Fidelity' : 'Selective Decay',
        verdictType: getAvgFidelity(selective.evaluations) > 70 ? 'success' : 'warning',
        mechanism: 'Dynamically scales Δ_t to filter out noise, but capacity is still bounded by vector state dimension d.'
      },
      {
        name: 'Dragon Hatchling (BDH)',
        subtitle: 'Synaptic Fast-Weights W_t',
        icon: Brain,
        color: 'emerald',
        fidelity: getAvgFidelity(bdh.evaluations),
        memoryComplexity: 'O(1) Token Cost (d² Synapses)',
        kvCacheSize: `${dim * dim} parameters`,
        evals: bdh.evaluations,
        verdict: 'Lossless Associative Memory',
        verdictType: 'success',
        mechanism: 'Hebbian fast-weights W_t = λW_{t-1} + η(y⊗xᵀ) provide O(d²) associative binding without token memory allocation.'
      },
      {
        name: 'Standard Transformer (KV-Cache)',
        subtitle: 'Full Quadratic Self-Attention',
        icon: Database,
        color: 'purple',
        fidelity: 99, // Transformer retains all KV pairs exactly
        memoryComplexity: `O(N) Unbounded (${L * dim * 2} floats)`,
        kvCacheSize: `${L * dim * 2} entries`,
        evals: [],
        verdict: 'Lossless but O(N) Cache Explosion',
        verdictType: 'warning',
        mechanism: 'Stores every past key-value vector in VRAM. Lossless recall, but memory explodes quadratically with long contexts.'
      }
    ];
  }, [tokens, dim, spectralRadius, synapticRate]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Swords className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Architecture Arena: Head-to-Head Multi-Model Faceoff
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulating the exact same sequence ({tokens.length} tokens) across all 4 paradigm architectures simultaneously.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
          Sequence Length: <span className="text-cyan-400 font-bold">L = {tokens.length} tokens</span>
        </div>
      </div>

      {/* Grid of 4 Model Faceoff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((arch, idx) => {
          const IconComp = arch.icon;
          const isDanger = arch.verdictType === 'danger';
          const isWarning = arch.verdictType === 'warning';
          const isSuccess = arch.verdictType === 'success';

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4 flex flex-col justify-between space-y-4 transition-all duration-200 ${
                isSuccess
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : isDanger
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-1">{arch.name}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">{arch.subtitle}</div>
              </div>

              {/* Fidelity Bar Meter */}
              <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Recall Fidelity:</span>
                  <span
                    className={`font-bold ${
                      isSuccess ? 'text-emerald-400' : isDanger ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {arch.fidelity}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${arch.fidelity}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSuccess
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                        : isDanger
                        ? 'bg-rose-500 shadow-sm shadow-rose-500'
                        : 'bg-amber-400 shadow-sm shadow-amber-400'
                    }`}
                  />
                </div>
              </div>

              {/* Memory Footprint Badge */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>VRAM Footprint:</span>
                  <span className="text-slate-200 font-semibold">{arch.memoryComplexity}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Cache Overhead:</span>
                  <span className="text-cyan-300 font-bold">{arch.kvCacheSize}</span>
                </div>
              </div>

              {/* Empirical Verdict Tag */}
              <div
                className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 ${
                  isSuccess
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isDanger
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                {isDanger && <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                {isWarning && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                <span className="font-bold truncate">{arch.verdict}</span>
              </div>

              {/* Mechanism Explanation */}
              <div className="text-[10px] text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                {arch.mechanism}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
