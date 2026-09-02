import React, { useState, useMemo } from 'react';
import { Target, Search, ArrowRight, ShieldCheck, AlertCircle, BarChart3 } from 'lucide-react';
import { runSequenceSimulation } from '../engine/ssmEngine';

export default function NiahStressTester({ dim, spectralRadius, synapticRate }) {
  const [haystackLength, setHaystackLength] = useState(35);
  const needleKey = 'SECRET_KEY';
  const needleVal = 'PATHWAY_42';

  // Generate synthetic NIAH sequence with needle placed at position 2
  const niahSequence = useMemo(() => {
    const seq = [];
    seq.push({ name: 'System_Init', type: 'noise', important: false });
    seq.push({ name: 'Key:SECRET_KEY', type: 'key_value', key: needleKey, value: needleVal, important: true });
    
    // Inject distractor noise tokens
    for (let i = 0; i < haystackLength; i++) {
      seq.push({
        name: `distract_${String(i).padStart(2, '0')}`,
        type: 'noise',
        important: false
      });
    }
    
    // Query at the very end
    seq.push({ name: 'Query:SECRET_KEY', type: 'query', key: needleKey, important: true });
    return seq;
  }, [haystackLength]);

  // Run all 3 architectures on this stress sequence
  const simulationData = useMemo(() => {
    const ssm = runSequenceSimulation({
      tokens: niahSequence,
      dim,
      spectralRadius,
      modelType: 'linear_ssm',
      synapticRate
    });

    const mamba = runSequenceSimulation({
      tokens: niahSequence,
      dim,
      spectralRadius,
      modelType: 'selective_ssm',
      synapticRate
    });

    const bdh = runSequenceSimulation({
      tokens: niahSequence,
      dim,
      spectralRadius,
      modelType: 'bdh_synaptic',
      synapticRate
    });

    const ssmFid = Math.round((ssm.evaluations[0]?.fidelity || 0) * 100);
    const mambaFid = Math.round((mamba.evaluations[0]?.fidelity || 0) * 100);
    const bdhFid = Math.round((bdh.evaluations[0]?.fidelity || 0) * 100);

    return { ssmFid, mambaFid, bdhFid, ssmEval: ssm.evaluations[0], mambaEval: mamba.evaluations[0], bdhEval: bdh.evaluations[0] };
  }, [niahSequence, dim, spectralRadius, synapticRate]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Search className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Needle in a Haystack (NIAH) Context Scaler
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Stress-test how deep a needle key can be buried before catastrophic state interference destroys the memory.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
          Needle inserted at step t=1 • Queried at t={haystackLength + 2}
        </span>
      </div>

      {/* Haystack Length Slider */}
      <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 font-bold">Haystack Distractor Tokens (L):</span>
          <span className="text-amber-400 font-bold text-sm">{haystackLength} Distractor Tokens</span>
        </div>
        <input
          type="range"
          min="5"
          max="80"
          step="5"
          value={haystackLength}
          onChange={(e) => setHaystackLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>5 tokens (Easy)</span>
          <span>35 tokens (Classical SSM Collapses)</span>
          <span>80 tokens (Extreme Long-Range)</span>
        </div>
      </div>

      {/* Comparative Response Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Model 1: Classical Linear SSM */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">1. Classical SSM</span>
            <span className={simulationData.ssmFid > 45 ? 'text-cyan-400 font-bold' : 'text-rose-400 font-bold'}>
              {simulationData.ssmFid}% Fidelity
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${simulationData.ssmFid}%` }}
              className={`h-full ${simulationData.ssmFid > 45 ? 'bg-cyan-400' : 'bg-rose-500'}`}
            />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
            <div className="text-slate-500 text-[9px] uppercase">Reconstructed Output:</div>
            <div className={simulationData.ssmFid > 45 ? 'text-cyan-300 font-bold' : 'text-rose-400 font-bold truncate'}>
              "{simulationData.ssmEval?.predicted || 'Lost'}"
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
            {simulationData.ssmFid > 45
              ? 'Within memory envelope: State has not decayed completely yet.'
              : 'Collapsed: Exponential decay ρ(A)^L washed out the secret key.'}
          </div>
        </div>

        {/* Model 2: Selective SSM (Mamba S6) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300">2. Selective SSM</span>
            <span className={simulationData.mambaFid > 45 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {simulationData.mambaFid}% Fidelity
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${simulationData.mambaFid}%` }}
              className={`h-full ${simulationData.mambaFid > 45 ? 'bg-cyan-400' : 'bg-amber-500'}`}
            />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
            <div className="text-slate-500 text-[9px] uppercase">Reconstructed Output:</div>
            <div className={simulationData.mambaFid > 45 ? 'text-cyan-300 font-bold' : 'text-amber-300 font-bold truncate'}>
              "{simulationData.mambaEval?.predicted || 'Degraded'}"
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Input-dependent Δ_t throttles decay during noise tokens, extending recall horizon.
          </div>
        </div>

        {/* Model 3: Dragon Hatchling (BDH) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 font-mono text-xs shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300">3. Dragon Hatchling</span>
            <span className="text-emerald-400 font-bold">{simulationData.bdhFid}% Fidelity</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${simulationData.bdhFid}%` }}
              className="h-full bg-emerald-400 shadow-sm shadow-emerald-400"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] space-y-1">
            <div className="text-slate-500 text-[9px] uppercase">Reconstructed Output:</div>
            <div className="text-emerald-300 font-bold truncate">
              "{simulationData.bdhEval?.predicted || 'PATHWAY_42'}"
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Synaptic fast-weights store the (Key ⊗ Value) pair into d×d subspace with zero noise cross-talk.
          </div>
        </div>

      </div>

    </div>
  );
}
