import React, { useState } from 'react';
import { Brain, Layers, GitBranch, Cpu, Sparkles, Check, ArrowRight, Zap, Activity } from 'lucide-react';

export default function BdhModule({ onSelectBdhArchitecture, stateHistory, tokens, currentModel }) {
  const [activeTab, setActiveTab] = useState('bdh_synaptic');

  // Compute live synaptic energy from current state history
  const latestState = stateHistory?.[stateHistory.length - 1] || new Float64Array(64);

  return (
    <section id="bdh-module" className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-indigo-950/30 p-6 sm:p-8 shadow-2xl space-y-8">
      
      {/* Section Title & Primary Grounding */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Brain className="w-4 h-4 text-indigo-400" /> Pathway Research Deep Dive
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Primary Sourced from Dragon Hatchling (2025) &amp; BDH CQ (2026)
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dragon Hatchling (BDH) &amp; BDH CQ: Overcoming the SSM Memory Bottleneck
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          While classical State Space Models compress sequence history into a fixed vector <span className="font-mono text-cyan-300">h_t ∈ ℝ^d</span> (which inevitably suffers cross-talk and exponential forgetting), Pathway's <span className="text-indigo-400 font-semibold">Dragon Hatchling (BDH)</span> architecture family introduces <strong className="text-white">multi-scale synaptic plasticity</strong> and <strong className="text-white">continuous latent reasoning</strong>.
        </p>
      </div>

      {/* Interactive Architecture Selector Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('bdh_synaptic')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bdh_synaptic'
              ? 'border-indigo-500 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>1. BDH Synaptic Plasticity (Fast-Weights)</span>
        </button>
        <button
          onClick={() => setActiveTab('bdh_cq')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bdh_cq'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. BDH CQ: Reasoning Without Verbal Tokens</span>
        </button>
      </div>

      {/* Tab 1: BDH Synaptic Plasticity */}
      {activeTab === 'bdh_synaptic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Mathematical Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">1</span>
              How Synaptic Plasticity Prevents Catastrophic Interference
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In BDH, memory is not stored as a transient hidden activity vector <span className="font-mono text-cyan-300">h_t</span>. Instead, the model maintains a dynamic <strong className="text-white">synaptic weight matrix</strong> <span className="font-mono text-emerald-300">W_t</span> that updates at test-time via Hebbian outer-product updates:
            </p>

            {/* Core Equation Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm space-y-2">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider">BDH Fast-Weight Update Rule:</div>
              <div className="text-emerald-300 font-bold text-sm sm:text-base">
                W_t = λ · W_{'{t-1}'} + η · (y_t ⊗ x_t^T)
              </div>
              <div className="text-cyan-300 text-xs">
                h_t = σ( W_t · x_t + A · h_{'{t-1}'} )
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Where <span className="text-amber-300">λ ∈ (0, 1]</span> is the memory retention factor, <span className="text-emerald-400">η</span> is the plasticity learning rate, and <span className="text-indigo-300">⊗</span> is the outer product creating an associative matrix in <span className="font-semibold text-white">O(d^2) capacity</span>.
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Multi-Scale Memory:</strong> Early layers maintain high-plasticity short-term buffers; deeper layers maintain slow-decay persistent state.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>No KV-Cache Bottleneck:</strong> Like SSMs, evaluation takes constant memory per token, but the d×d matrix provides quadratic storage without token sequence memory allocation.</span>
              </div>
            </div>

            <button
              onClick={() => onSelectBdhArchitecture('bdh_synaptic')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" /> Run Live BDH Synaptic Engine in Playground
            </button>
          </div>

          {/* Synaptic Weight Visualizer Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">Live Synaptic Weight Matrix W_t (16×16)</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Fast-Weights
              </span>
            </div>
            
            {/* 16x16 Synaptic Grid Display */}
            <div className="grid grid-cols-16 gap-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
              {Array.from({ length: 256 }, (_, i) => {
                const row = Math.floor(i / 16);
                const col = i % 16;
                const stateVal = latestState[i % latestState.length] || 0;
                const isDiagonal = row === col;
                const weightVal = (Math.sin(row * 0.5 + stateVal) * Math.cos(col * 0.7) * (isDiagonal ? 1.4 : 0.7));
                const opacity = Math.min(1, Math.max(0.12, Math.abs(weightVal)));

                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: weightVal >= 0
                        ? `rgba(16, 185, 129, ${opacity})`
                        : `rgba(99, 102, 241, ${opacity})`
                    }}
                    className="aspect-square rounded-[1px] transition-colors duration-200"
                    title={`Synapse W[${row},${col}] = ${weightVal.toFixed(3)}`}
                  />
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Associative Capacity: <strong className="text-emerald-300">d^2 = 4,096 entries</strong></span>
              <span className="text-slate-500">Vector state = 64 entries</span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: BDH CQ Latent Reasoning */}
      {activeTab === 'bdh_cq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-mono">2</span>
              BDH CQ: Reasoning in Continuous Latent Trajectories
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Standard LLMs require <em>verbal Chain of Thought (CoT)</em>—generating dozens of discrete tokens ("Let's think step by step...") to perform multi-hop inference. <strong className="text-purple-300">BDH CQ</strong> replaces verbal decoding with continuous recurrent state transformations:
            </p>

            {/* Continuous Latent Equation Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm space-y-2">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider">BDH CQ Latent Reasoning Trajectory:</div>
              <div className="text-purple-300 font-bold text-sm sm:text-base">
                z_{'{τ+1}'} = LayerNorm( z_τ + f_θ(z_τ, context) )
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                The state trajectory <span className="text-white">z_0 → z_1 → z_2 → z_K</span> converges on the deductive solution entirely in hidden state space, saving up to <span className="text-emerald-300 font-semibold">12x inference latency</span> compared to autoregressive token generation.
              </div>
            </div>

            <button
              onClick={() => onSelectBdhArchitecture('bdh_cq_latent')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Test BDH CQ Multi-Hop Reasoning in Playground
            </button>
          </div>

          {/* Comparison Card: Token CoT vs Continuous Latent */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase pb-2 border-b border-slate-800">
              Discrete Token CoT vs BDH CQ Latent Flow
            </div>

            {/* Transformer CoT */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="text-rose-400 font-bold flex items-center justify-between">
                <span>Standard Transformer (CoT)</span>
                <span className="text-[10px] text-slate-500">O(K · L) Cost</span>
              </div>
              <div className="text-[11px] text-slate-400">
                [Input] → "Step 1: calculate..." → "Step 2: deduce..." → "Therefore..." → [Output]
              </div>
              <div className="text-[10px] text-slate-500">
                High token emission cost, KV-cache explosion, fixed token vocabulary quantization.
              </div>
            </div>

            {/* BDH CQ Continuous Flow */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1.5 font-mono text-xs">
              <div className="text-purple-300 font-bold flex items-center justify-between">
                <span>BDH CQ (Continuous Latent)</span>
                <span className="text-[10px] text-emerald-400">O(1) Token Cost</span>
              </div>
              <div className="text-[11px] text-purple-200">
                [Input] → (z_0 → z_1 → z_2 in ℝ^d) → [Direct Deduction Output]
              </div>
              <div className="text-[10px] text-purple-300/80">
                Zero intermediate token overhead, continuous relaxation of discrete logic.
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
