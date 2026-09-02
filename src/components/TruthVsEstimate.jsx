import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function TruthVsEstimate({ evaluations, modelType }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Truth Beside Estimate: Associative Recall Telemetry
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Evaluating Final Step Reconstructions
        </span>
      </div>

      {/* Comparisons Grid / Table */}
      {evaluations.length === 0 ? (
        <div className="p-6 text-center text-xs font-mono text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
          No key-value associations defined in current sequence. Add a [Key:Value] token to test recall!
        </div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((item, idx) => {
            const isMatch = item.isCorrect;
            const fidelityPct = (item.fidelity * 100).toFixed(1);

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isMatch
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Key & Elapsed Steps */}
                  <div className="space-y-1 min-w-[130px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                        Key: {item.key}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Elapsed: <span className="text-slate-200 font-semibold">{item.stepsElapsed} steps</span> ago
                    </div>
                  </div>

                  {/* Side by Side: Ground Truth vs Model Prediction */}
                  <div className="flex-1 flex flex-wrap items-center gap-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
                    
                    {/* Expected Ground Truth */}
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-[10px] uppercase text-slate-500">Expected Truth</div>
                      <div className="text-emerald-400 font-bold text-sm truncate">
                        "{item.groundTruth}"
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />

                    {/* Model Reconstructed Estimate */}
                    <div className="flex-1 min-w-[150px]">
                      <div className="text-[10px] uppercase text-slate-500">Model Output</div>
                      <div
                        className={`font-bold text-sm truncate ${
                          isMatch ? 'text-cyan-300' : 'text-rose-400'
                        }`}
                      >
                        {item.predicted}
                      </div>
                    </div>

                  </div>

                  {/* Accuracy & Fidelity Metric */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 min-w-[110px]">
                    <div className="flex items-center gap-1 font-mono text-xs font-bold">
                      {isMatch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Recall OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400">
                          <XCircle className="w-4 h-4" /> Lost (Noise)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Fidelity: <span className={isMatch ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>{fidelityPct}%</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Educational Summary Footnote */}
      <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
        💡 <span className="text-slate-300 font-semibold">The Lesson:</span> When sequence length exceeds memory capacity ($L &gt; d$), linear recurrence projects new token activations directly onto old subspace dimensions, causing irrecoverable cross-talk and memory corruption unless gated or stored in fast-weight synapses.
      </div>

    </div>
  );
}
