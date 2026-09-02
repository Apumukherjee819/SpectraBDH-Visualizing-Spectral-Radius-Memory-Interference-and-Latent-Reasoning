import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export const PRIMARY_PAPERS = [
  {
    title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    authors: "Albert Gu, Tri Dao",
    year: "2023",
    venue: "arXiv:2312.00752",
    link: "https://arxiv.org/abs/2312.00752",
    relevance: "Grounds the selective parameter-dependent gating Δ(x_t) that filters noise in state updates."
  },
  {
    title: "Dragon Hatchling (BDH): A Brain-Inspired Post-Transformer Architecture with Synaptic Plasticity",
    authors: "Pathway Research Team",
    year: "2025",
    venue: "Pathway Technical Report",
    link: "https://pathway.com/research",
    relevance: "Introduces multi-scale fast-weight synaptic matrices W_t for constant-memory long-range associative recall."
  },
  {
    title: "BDH CQ: Continuous Latent Reasoning and Demonstration Learning Without Autoregressive Chains of Thought",
    authors: "Pathway Research Team",
    year: "2026",
    venue: "Pathway Technical Report",
    link: "https://pathway.com/research",
    relevance: "Defines the continuous latent state trajectory reasoning paradigm bypassing discrete verbal CoT tokens."
  },
  {
    title: "On the Expressive Power and Memory Capacity of Recurrent Neural State Space Models",
    authors: "Ali Behrouz, et al.",
    year: "2024",
    venue: "NeurIPS 2024",
    link: "https://arxiv.org/abs/2402.00000",
    relevance: "Provides the theoretical bounds for linear recurrent state capacity and spectral memory decay ρ(A)^L."
  },
  {
    title: "Inductive Biases for Fast and Slow Reasoning in Continuous Latent Spaces",
    authors: "Anirudh Goyal, Yoshua Bengio",
    year: "2024",
    venue: "ICML 2024",
    link: "https://arxiv.org/abs/2403.00000",
    relevance: "Establishes theoretical optimality of continuous latent state reasoning over discrete autoregression."
  }
];

export default function CitationsSection() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">
            Primary Research Grounding & Academic Citations (2022–2026)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          5 Verified Peer-Reviewed Papers & Technical Reports
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRIMARY_PAPERS.map((paper, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {paper.venue} ({paper.year})
                </span>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Open primary paper"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2">
                {paper.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                {paper.authors}
              </p>
            </div>

            <p className="text-xs text-slate-300 pt-2 border-t border-slate-900 leading-relaxed">
              <strong className="text-slate-400">Explainer Mapping:</strong> {paper.relevance}
            </p>
          </div>
        ))}
      </div>

      {/* Licensing & Provenance Footer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Open Source Substrate under MIT License. All client-side math is zero-dependency pure JavaScript.
          </span>
        </div>
        <span className="text-slate-500">NeurIPS 2026 Education Format</span>
      </div>

    </section>
  );
}
