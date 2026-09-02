import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RefreshCw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    id: 1,
    question: "Why does a classical linear state space model (h_t = A·h_{t-1} + x_t) forget earlier tokens exponentially fast?",
    options: [
      { id: 'a', text: "Because the transition matrix A is repeatedly multiplied (A^L), decaying at rate ρ(A)^L.", correct: true },
      { id: 'b', text: "Because the state vector dimension randomly shrinks over time.", correct: false },
      { id: 'c', text: "Because matrix addition causes integer overflow after 10 steps.", correct: false }
    ],
    explanation: "Correct! The state transition is governed by powers of A (h_L ≈ A^L h_0). By the spectral mapping theorem, the state magnitude scales with the spectral radius ρ(A)^L. If ρ < 1, the memory vanishes exponentially."
  },
  {
    id: 2,
    question: "How does Dragon Hatchling (BDH)'s synaptic plasticity (W_t) solve the state capacity bottleneck?",
    options: [
      { id: 'a', text: "It allocates an infinite KV-cache for every token like a standard Transformer.", correct: false },
      { id: 'b', text: "It stores fast-weights in a d×d matrix W_t updated via outer-products (y ⊗ xᵀ), providing O(d²) capacity in O(1) compute.", correct: true },
      { id: 'c', text: "It compresses all inputs into an MP3 audio file.", correct: false }
    ],
    explanation: "Correct! By maintaining a 2D synaptic weight matrix W_t updated via Hebbian outer products, BDH provides d² associative storage capacity per layer without growing with sequence length."
  },
  {
    id: 3,
    question: "In BDH CQ, how does the model reason over multi-step deductions without emitting verbal tokens?",
    options: [
      { id: 'a', text: "It unrolls a continuous dynamical trajectory z_{τ+1} = LayerNorm(z_τ + f_θ(z_τ)) in latent state space.", correct: true },
      { id: 'b', text: "It hides secret text tokens in invisible Unicode white space.", correct: false },
      { id: 'c', text: "It pauses execution for 5 seconds before answering.", correct: false }
    ],
    explanation: "Correct! BDH CQ performs continuous latent flow relaxation, allowing representation trajectories to settle into deductive fixed-point attractors without paying discrete autoregressive token decoding costs."
  }
];

export default function LearnerDiagnostic() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId, optionId) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionId
    });
  };

  const handleEvaluate = () => {
    setSubmitted(true);
    const score = QUESTIONS.filter(q => selectedAnswers[q.id] === q.options.find(o => o.correct)?.id).length;
    if (score === QUESTIONS.length) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = QUESTIONS.filter(q => selectedAnswers[q.id] === q.options.find(o => o.correct)?.id).length;
  const isComplete = Object.keys(selectedAnswers).length === QUESTIONS.length;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              The 60-Second Learner Diagnostic &amp; Mastery Check
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Verify your intuitive and mathematical grasp of state space limits and Dragon Hatchling (BDH).
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                score === 3
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              Mastery Score: {score} / 3 Correct
            </span>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Retake diagnostic"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {QUESTIONS.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const correctOption = q.options.find(o => o.correct)?.id;
          const isCorrect = userAnswer === correctOption;

          return (
            <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pl-7">
                {q.options.map((opt) => {
                  const isSelected = userAnswer === opt.id;
                  let optStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80';

                  if (submitted) {
                    if (opt.correct) {
                      optStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-300 line-through';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-950/50 border-cyan-500 text-cyan-200 font-semibold shadow-md shadow-cyan-500/10';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-sans transition-all flex items-center justify-between gap-2 ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {submitted && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {submitted && isSelected && !opt.correct && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submit */}
              {submitted && (
                <div className="mt-2 pl-7 text-[11px] font-sans text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-cyan-300 font-bold">💡 Why: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            disabled={!isComplete}
            onClick={handleEvaluate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>Submit Answers &amp; Check Mastery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
