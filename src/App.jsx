import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ClaimBanner from './components/ClaimBanner';
import GuidedTour, { TOUR_STEPS } from './components/GuidedTour';
import EigenPhasePlot from './components/EigenPhasePlot';
import StateSpaceHeatmap from './components/StateSpaceHeatmap';
import MemoryDecayPlot from './components/MemoryDecayPlot';
import TruthVsEstimate from './components/TruthVsEstimate';
import PlaygroundControls from './components/PlaygroundControls';
import ArchitectureArena from './components/ArchitectureArena';
import NiahStressTester from './components/NiahStressTester';
import LearnerDiagnostic from './components/LearnerDiagnostic';
import BdhModule from './components/BdhModule';
import LimitationsModule from './components/LimitationsModule';
import CitationsSection from './components/CitationsSection';
import BlogPostModal from './components/BlogPostModal';
import { runSequenceSimulation, PRESET_SEQUENCES } from './engine/ssmEngine';
import confetti from 'canvas-confetti';
import { Sparkles, Activity, Layers, ShieldCheck, Code2, Cpu, BookOpen, Swords, Search, Award } from 'lucide-react';

export default function App() {
  // State management for interactive substrate
  const [modelType, setModelType] = useState('linear_ssm');
  const [dim, setDim] = useState(64);
  const [spectralRadius, setSpectralRadius] = useState(0.95);
  const [synapticRate, setSynapticRate] = useState(0.35);
  const [activePresetId, setActivePresetId] = useState('ASSOCIATIVE_COLLAPSE');
  
  // Sequence tokens
  const [tokens, setTokens] = useState(
    () => JSON.parse(JSON.stringify(PRESET_SEQUENCES.ASSOCIATIVE_COLLAPSE.tokens))
  );

  // Guided tour state
  const [currentTourStep, setCurrentTourStep] = useState(1);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [selectedTimelineStep, setSelectedTimelineStep] = useState(0);

  // Blog modal state
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  // Run live simulation whenever inputs change (<16ms client-side execution)
  const simulationResults = useMemo(() => {
    return runSequenceSimulation({
      tokens,
      dim,
      spectralRadius,
      modelType,
      synapticRate
    });
  }, [tokens, dim, spectralRadius, modelType, synapticRate]);

  // Handle applying a step from the guided tour
  const handleApplyStep = (tourStep) => {
    if (tourStep.recommendedModel) setModelType(tourStep.recommendedModel);
    if (tourStep.recommendedRho) setSpectralRadius(tourStep.recommendedRho);
    if (tourStep.presetId && PRESET_SEQUENCES[tourStep.presetId]) {
      setActivePresetId(tourStep.presetId);
      setTokens(JSON.parse(JSON.stringify(PRESET_SEQUENCES[tourStep.presetId].tokens)));
    }
    // Celebrate step 4 completion
    if (tourStep.step === 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setModelType('linear_ssm');
    setDim(64);
    setSpectralRadius(0.95);
    setSynapticRate(0.35);
    setActivePresetId('ASSOCIATIVE_COLLAPSE');
    setTokens(JSON.parse(JSON.stringify(PRESET_SEQUENCES.ASSOCIATIVE_COLLAPSE.tokens)));
    setSelectedTimelineStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        onOpenBlog={() => setIsBlogOpen(true)}
        activeTourStep={currentTourStep}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        
        {/* 1. Core Falsifiable Claim Hero Banner */}
        <ClaimBanner
          currentModel={modelType}
          evaluations={simulationResults.evaluations}
          spectralRadius={spectralRadius}
        />

        {/* 2. 60-Second Guided Learning Tour */}
        <GuidedTour
          currentStep={currentTourStep}
          onSelectStep={(step) => setCurrentTourStep(step)}
          onApplyStepSettings={handleApplyStep}
          isSandboxMode={isSandboxMode}
          onToggleSandbox={() => setIsSandboxMode(!isSandboxMode)}
        />

        {/* 3. Interactive Visual Substrate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: State Heatmap & Scrubber (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <StateSpaceHeatmap
              tokens={tokens}
              stateHistory={simulationResults.stateHistory}
              gateHistory={simulationResults.gateHistory}
              dim={dim}
              selectedStep={selectedTimelineStep}
              onSelectStep={(idx) => setSelectedTimelineStep(idx)}
            />

            {/* Memory Retention & Decay Trajectory Plot */}
            <MemoryDecayPlot
              fidelityHistory={simulationResults.fidelityHistory}
              groundTruthAssociations={simulationResults.groundTruthAssociations}
              spectralRadius={spectralRadius}
              totalTokens={tokens.length}
              dim={dim}
              modelType={modelType}
            />

            {/* Truth Beside Estimate Telemetry Matrix */}
            <TruthVsEstimate
              evaluations={simulationResults.evaluations}
              modelType={modelType}
            />
          </div>

          {/* Right Column: Controls, Sliders & Eigen Phase Diagram (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Eigenvalue Polar Phase Canvas */}
            <EigenPhasePlot
              eigenvalues={simulationResults.eigenvalues}
              spectralRadius={spectralRadius}
            />

            {/* Interactive Concept Controls & Sliders */}
            <PlaygroundControls
              modelType={modelType}
              setModelType={setModelType}
              dim={dim}
              setDim={setDim}
              spectralRadius={spectralRadius}
              setSpectralRadius={setSpectralRadius}
              synapticRate={synapticRate}
              setSynapticRate={setSynapticRate}
              tokens={tokens}
              setTokens={setTokens}
              activePresetId={activePresetId}
              setActivePresetId={setActivePresetId}
              onReset={handleReset}
            />

          </div>

        </div>

        {/* 4. Head-to-Head Multi-Model Architecture Arena */}
        <ArchitectureArena
          tokens={tokens}
          dim={dim}
          spectralRadius={spectralRadius}
          synapticRate={synapticRate}
        />

        {/* 5. Needle in a Haystack (NIAH) Context Stress-Tester */}
        <NiahStressTester
          dim={dim}
          spectralRadius={spectralRadius}
          synapticRate={synapticRate}
        />

        {/* 6. Deep BDH & BDH CQ Native Module */}
        <BdhModule
          stateHistory={simulationResults.stateHistory}
          tokens={tokens}
          currentModel={modelType}
          onSelectBdhArchitecture={(type) => {
            setModelType(type);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 7. The 60-Second Learner Diagnostic & Mastery Check */}
        <LearnerDiagnostic />

        {/* 8. Limitations, Boundary Localization & Misconceptions */}
        <LimitationsModule />

        {/* 9. Primary Research Citations (2022–2026) & Licensing */}
        <CitationsSection />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs font-mono text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <span className="font-bold text-white">DataForge 2026: Pathway Track</span>
          <span>•</span>
          <span>NeurIPS 2026 Education Track Format</span>
          <span>•</span>
          <button
            onClick={() => setIsBlogOpen(true)}
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" /> Blog Post (Topic 6)
          </button>
        </div>
        <p>Built with 100% Client-Side Pure JavaScript Linear Substrate (<span className="text-emerald-400 font-bold">&lt;16ms</span> 60FPS latency).</p>
      </footer>

      {/* Blog Post Reader Modal */}
      <BlogPostModal
        isOpen={isBlogOpen}
        onClose={() => setIsBlogOpen(false)}
      />

    </div>
  );
}
