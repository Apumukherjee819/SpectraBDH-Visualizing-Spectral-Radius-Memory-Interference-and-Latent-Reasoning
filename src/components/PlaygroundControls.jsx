import React from 'react';
import { Sliders, RotateCcw, Plus, Trash2, Cpu, Sparkles, Brain, Zap } from 'lucide-react';
import { PRESET_SEQUENCES } from '../engine/ssmEngine';

export default function PlaygroundControls({
  modelType,
  setModelType,
  dim,
  setDim,
  spectralRadius,
  setSpectralRadius,
  synapticRate,
  setSynapticRate,
  tokens,
  setTokens,
  activePresetId,
  setActivePresetId,
  onReset
}) {
  const handleSelectPreset = (presetKey) => {
    const preset = PRESET_SEQUENCES[presetKey];
    if (!preset) return;
    setActivePresetId(presetKey);
    setTokens(JSON.parse(JSON.stringify(preset.tokens)));
  };

  const handleAddToken = (type) => {
    const newIdx = tokens.length;
    let newToken;
    if (type === 'key_value') {
      const keyId = `K${tokens.filter(t => t.type === 'key_value').length + 1}`;
      newToken = {
        name: `${keyId}:Val_${Math.floor(Math.random() * 90 + 10)}`,
        type: 'key_value',
        key: keyId,
        value: `Val_${Math.floor(Math.random() * 90 + 10)}`,
        important: true
      };
    } else if (type === 'noise') {
      newToken = {
        name: `noise_${newIdx}`,
        type: 'noise',
        important: false
      };
    } else if (type === 'query') {
      const keys = tokens.filter(t => t.type === 'key_value').map(t => t.key);
      const targetKey = keys[0] || 'K1';
      newToken = {
        name: `Query:${targetKey}`,
        type: 'query',
        key: targetKey,
        important: true
      };
    }
    setTokens([...tokens, newToken]);
  };

  const handleRemoveToken = (idx) => {
    if (tokens.length <= 2) return;
    const nextTokens = tokens.filter((_, i) => i !== idx);
    setTokens(nextTokens);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Concept Variable Controllers & Architecture Substrate
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-slate-400 uppercase">
          Preset Investigation Experiments:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.entries(PRESET_SEQUENCES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                activePresetId === key
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-semibold shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="font-bold text-xs truncate">{p.title}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-mono">{p.tokens.length} tokens</div>
            </button>
          ))}
        </div>
      </div>

      {/* Architecture Switcher */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono text-slate-400 uppercase">
          Active Model Architecture:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          
          <button
            onClick={() => setModelType('linear_ssm')}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              modelType === 'linear_ssm'
                ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-lg shadow-indigo-500/25'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Classical SSM</span>
            </div>
            <div className="text-[10px] opacity-75 font-mono mt-1">h_t = A·h_{'{t-1}'} + x_t</div>
          </button>

          <button
            onClick={() => setModelType('selective_ssm')}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              modelType === 'selective_ssm'
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-lg shadow-cyan-500/25'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Selective SSM</span>
            </div>
            <div className="text-[10px] opacity-75 font-mono mt-1">Mamba S6 (Δ-Gating)</div>
          </button>

          <button
            onClick={() => setModelType('bdh_synaptic')}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              modelType === 'bdh_synaptic'
                ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-lg shadow-emerald-500/25'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Dragon Hatchling</span>
            </div>
            <div className="text-[10px] opacity-75 font-mono mt-1">BDH Synaptic Fast-Weights</div>
          </button>

          <button
            onClick={() => setModelType('bdh_cq_latent')}
            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
              modelType === 'bdh_cq_latent'
                ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-lg shadow-purple-500/25'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BDH CQ</span>
            </div>
            <div className="text-[10px] opacity-75 font-mono mt-1">Latent Reasoning Trajectory</div>
          </button>

        </div>
      </div>

      {/* Real Variable Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
        
        {/* State Dimension d */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">State Dimension (d):</span>
            <span className="text-cyan-300 font-bold">{dim} units</span>
          </div>
          <input
            type="range"
            min="16"
            max="128"
            step="16"
            value={dim}
            onChange={(e) => setDim(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>16 (Bottleneck)</span>
            <span>64 (Standard)</span>
            <span>128 (High)</span>
          </div>
        </div>

        {/* Spectral Radius rho(A) */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Spectral Radius ρ(A):</span>
            <span className={spectralRadius > 1.0 ? 'text-rose-400 font-bold' : 'text-indigo-300 font-bold'}>
              {spectralRadius.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="1.05"
            step="0.01"
            value={spectralRadius}
            onChange={(e) => setSpectralRadius(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0.50 (Fast Decay)</span>
            <span>0.95 (Long Memory)</span>
            <span>1.05 (Unstable)</span>
          </div>
        </div>

        {/* BDH Plasticity Rate eta */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">BDH Plasticity Rate (η):</span>
            <span className="text-emerald-300 font-bold">{synapticRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.80"
            step="0.05"
            value={synapticRate}
            onChange={(e) => setSynapticRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0.05 (Rigid)</span>
            <span>0.35 (Optimal)</span>
            <span>0.80 (Hyper-Plastic)</span>
          </div>
        </div>

      </div>

      {/* Dynamic Token Editor Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
        <span className="text-slate-400">Sequence Tokens ({tokens.length} total):</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddToken('key_value')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
          >
            <Plus className="w-3 h-3" /> Insert [Key:Val]
          </button>
          <button
            onClick={() => handleAddToken('noise')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Distractor Token
          </button>
          <button
            onClick={() => handleAddToken('query')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Probe Query
          </button>
          <button
            onClick={() => handleRemoveToken(tokens.length - 1)}
            disabled={tokens.length <= 2}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 disabled:opacity-30 transition-colors"
            title="Remove last token"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
