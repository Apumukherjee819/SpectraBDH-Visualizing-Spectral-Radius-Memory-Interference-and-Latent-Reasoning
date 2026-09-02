import React, { useRef, useEffect } from 'react';
import { TrendingDown, Zap, BarChart2 } from 'lucide-react';

export default function MemoryDecayPlot({
  fidelityHistory,
  groundTruthAssociations,
  spectralRadius,
  totalTokens,
  dim,
  modelType
}) {
  const canvasRef = useRef(null);
  const keys = Object.keys(groundTruthAssociations);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 30, bottom: 35, left: 45 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Background Grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    for (let yVal = 0; yVal <= 1.0; yVal += 0.25) {
      const y = padding.top + plotH * (1 - yVal);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`${(yVal * 100).toFixed(0)}%`, 10, y + 3);
    }

    // X-Axis steps
    const maxSteps = Math.max(1, totalTokens - 1);
    for (let s = 0; s <= maxSteps; s += Math.max(1, Math.floor(maxSteps / 5))) {
      const x = padding.left + (s / maxSteps) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`t=${s}`, x - 8, height - 15);
    }

    // Draw Theoretical Exponential Upper Bound Curve rho^L
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let s = 0; s <= maxSteps; s++) {
      const x = padding.left + (s / maxSteps) * plotW;
      const theoreticalDecay = Math.pow(spectralRadius, s) * (dim / (dim + s * 0.5));
      const y = padding.top + plotH * (1 - Math.max(0, Math.min(1, theoreticalDecay)));
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot Empirical Retrieval Fidelity Curves for each Key
    const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
    keys.forEach((keyName, kIdx) => {
      const item = groundTruthAssociations[keyName];
      const startStep = item.insertStep;
      const color = colors[kIdx % colors.length];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      let started = false;
      for (let t = startStep; t < fidelityHistory.length; t++) {
        const x = padding.left + (t / maxSteps) * plotW;
        const fid = fidelityHistory[t]?.[keyName] ?? 0;
        const y = padding.top + plotH * (1 - fid);

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Key Injection Point Dot
      const xStart = padding.left + (startStep / maxSteps) * plotW;
      const yStart = padding.top + plotH * (1 - (fidelityHistory[startStep]?.[keyName] ?? 1.0));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(xStart, yStart, 4.5, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [fidelityHistory, groundTruthAssociations, spectralRadius, totalTokens, dim, modelType]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Memory Retention & Decay Trajectory <span className="text-slate-400 font-mono">ρ(A)^L vs Empirical</span>
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500"></span> Theoretical Bound ρ^L
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-1 bg-cyan-400 rounded-full"></span> Empirical State Recall
          </span>
        </div>
      </div>

      {/* Plot Canvas */}
      <div className="relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={580}
          height={210}
          className="w-full rounded-xl bg-slate-950/90 border border-slate-800"
        />
      </div>

      {/* Dynamic Interpretation */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
        <span className="text-slate-400">
          Mathematical Law: <span className="text-white font-semibold">I(X_t; H_{'{t+L}'}) ≤ d · ρ(A)^L</span>
        </span>
        <span className="text-indigo-300">
          {modelType === 'linear_ssm'
            ? 'Classical SSM: Exponential forgetting confirmed'
            : modelType === 'selective_ssm'
            ? 'Selective SSM: Gating shields memory from noise'
            : 'Dragon Hatchling (BDH): Synaptic plasticity preserves associations'}
        </span>
      </div>

    </div>
  );
}
