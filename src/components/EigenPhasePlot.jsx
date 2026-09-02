import React, { useRef, useEffect } from 'react';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export default function EigenPhasePlot({ eigenvalues, spectralRadius }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Stability Boundary: Unit Circle (|lambda| = 1.0)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Spectral Radius Circle (|lambda| = rho)
    const rhoRadius = radius * spectralRadius;
    const isExplosive = spectralRadius > 1.0;
    const isMarginal = Math.abs(spectralRadius - 1.0) < 0.02;

    ctx.fillStyle = isExplosive
      ? 'rgba(239, 68, 68, 0.12)'
      : isMarginal
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(6, 182, 212, 0.1)';
    ctx.strokeStyle = isExplosive
      ? 'rgba(239, 68, 68, 0.8)'
      : isMarginal
      ? 'rgba(245, 158, 11, 0.8)'
      : 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rhoRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Plot individual complex eigenvalues
    eigenvalues.forEach((ev) => {
      const px = centerX + ev.real * radius;
      const py = centerY - ev.imag * radius;
      const mag = Math.sqrt(ev.real * ev.real + ev.imag * ev.imag);

      ctx.fillStyle = mag > 1.0 ? '#ef4444' : '#38bdf8';
      ctx.shadowColor = mag > 1.0 ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Label Unit Circle
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '10px monospace';
    ctx.fillText('|λ|=1.0 (Unit Circle)', centerX + radius - 45, centerY - 8);

  }, [eigenvalues, spectralRadius]);

  const isStable = spectralRadius <= 1.0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl flex flex-col justify-between">
      
      {/* Title & Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Eigenvalue Phase Diagram
          </h4>
        </div>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            spectralRadius > 1.0
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : spectralRadius > 0.9
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          ρ(A) = {spectralRadius.toFixed(2)}
        </span>
      </div>

      {/* Canvas */}
      <div className="relative flex items-center justify-center my-1">
        <canvas
          ref={canvasRef}
          width={240}
          height={200}
          className="rounded-xl bg-slate-950/80 border border-slate-800/80"
        />
      </div>

      {/* Mathematical Interpretation */}
      <div className="mt-2 text-[11px] text-slate-300 font-mono space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Dynamical Regime:</span>
          <span className={spectralRadius > 1.0 ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
            {spectralRadius > 1.0
              ? 'Explosive Divergence'
              : spectralRadius > 0.95
              ? 'Long-Horizon Memory'
              : 'Rapid Exponential Decay'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Spectral Radius ρ(A):</span>
          <span className="text-white font-semibold">{spectralRadius.toFixed(3)}</span>
        </div>
      </div>

    </div>
  );
}
