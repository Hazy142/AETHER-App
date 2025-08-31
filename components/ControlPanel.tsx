import React from 'react';
import { Chakra, SessionLog, ViewMode } from '../types';
import EyeIcon from './icons/EyeIcon';
import CubeIcon from './icons/CubeIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import './ControlPanel.css';

interface ControlPanelProps {
  chakras: Chakra[];
  activeChakraIndex: number;
  setActiveChakraIndex: (index: number) => void;
  frequencies: number[];
  setFrequency: (chakraIndex: number, newFreq: number) => void;
  isSessionActive: boolean;
  toggleSession: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sessionLogs: SessionLog[];
}

const ChakraSelector: React.FC<{ chakra: Chakra; isActive: boolean; onClick: () => void }> = ({ chakra, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
        isActive 
          ? 'border-brand-text/80 shadow-lg shadow-current/20 animate-glow' 
          : 'border-brand-outline hover:border-brand-text/50 bg-brand-bg/50 hover:bg-brand-bg/70 backdrop-blur-sm'
      }`}
      style={{ 
        backgroundColor: isActive ? chakra.color : undefined,
        boxShadow: isActive ? `0 0 20px ${chakra.color}40` : undefined
      }}
      aria-pressed={isActive}
    >
      <div className={`font-bold text-lg transition-colors duration-200 ${isActive ? 'text-black' : 'text-brand-text group-hover:text-brand-text/90'}`}>
        {chakra.name}
      </div>
      <div className={`text-sm transition-colors duration-200 ${isActive ? 'text-black/80' : 'text-brand-text-muted group-hover:text-brand-text-muted/90'}`}>
        {chakra.description}
      </div>
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-30" 
             style={{ backgroundSize: '200% 100%' }} />
      )}
    </button>
);

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-brand-outline'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
      </svg>
    ))}
  </div>
);

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    chakras,
    activeChakraIndex,
    setActiveChakraIndex,
    frequencies,
    setFrequency,
    isSessionActive,
    toggleSession,
    volume,
    setVolume,
    viewMode,
    setViewMode,
    sessionLogs,
  } = props;

  const activeChakra = chakras[activeChakraIndex];

  return (
    <div className="h-full bg-gradient-to-b from-brand-surface to-brand-bg p-4 flex flex-col space-y-6 overflow-y-auto animate-slide-in-left">
      {/* Header */}
      <div className="flex-shrink-0 px-2 animate-fade-in">
        <h2 className="text-4xl font-bold tracking-wider bg-gradient-to-r from-brand-text to-purple-400 bg-clip-text text-transparent">
          AETHER
        </h2>
        <p className="text-brand-text-muted animate-fade-in-delay">Digital Simulation</p>
      </div>

      {/* Session Control Card */}
      <div className="bg-brand-bg/40 backdrop-blur-sm p-6 rounded-xl space-y-4 border border-brand-outline/50 shadow-lg animate-slide-in-up">
        <h3 className="text-sm font-semibold text-brand-text-muted tracking-widest uppercase flex items-center">
          <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${isSessionActive ? 'bg-green-400 animate-pulse-gentle' : 'bg-brand-outline'}`}></span>
          Session
        </h3>
        <div className="flex items-center justify-between space-x-3">
          <button
            onClick={toggleSession}
            className={`group px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 w-36 flex items-center justify-center transform hover:scale-105 active:scale-95 ${
              isSessionActive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 animate-breathe' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30'
            }`}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {isSessionActive ? 'Stop' : 'Start'}
            </span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === ViewMode.SCENE_3D ? ViewMode.SESSION_POV : ViewMode.SCENE_3D)}
            className="group p-4 rounded-2xl bg-brand-outline/50 hover:bg-brand-text/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 active:scale-95"
            title="Toggle View"
            aria-label="Toggle 3D Scene and POV mode"
          >
            <div className="transition-transform duration-300 group-hover:rotate-12">
              {viewMode === ViewMode.SCENE_3D ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l8 4" /></svg>
              }
            </div>
          </button>
        </div>
        <div className="space-y-2">
          <label htmlFor="volume" className="block text-sm font-medium text-brand-text-muted">
            Audio Volume: {volume}%
          </label>
          <div className="relative">
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value, 10))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-brand-outline/50 backdrop-blur-sm transition-all duration-200 hover:h-4"
              style={{ accentColor: '#a8a8ff' }}
            />
            <div 
              className="absolute top-0 h-3 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 pointer-events-none"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Chakra Details Card */}
      <div 
        className="bg-brand-bg/40 backdrop-blur-sm p-6 rounded-xl space-y-3 border-2 transition-all duration-500 shadow-lg animate-scale-in relative overflow-hidden" 
        style={{ 
          borderColor: activeChakra.color,
          boxShadow: `0 0 30px ${activeChakra.color}20`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current/5 to-transparent opacity-30" 
             style={{ color: activeChakra.color }} />
        <h3 
          className="text-xl font-bold tracking-wide relative z-10" 
          style={{ color: activeChakra.color }}
        >
          {activeChakra.name.toUpperCase()} CHAKRA
        </h3>
        <p className="text-sm text-brand-text-muted relative z-10 leading-relaxed">
          {activeChakra.description}
        </p>
        <div className="space-y-2 relative z-10">
          <label htmlFor="frequency" className="block text-sm font-medium text-brand-text-muted">
            Frequency: {frequencies[activeChakraIndex].toFixed(1)} Hz
          </label>
          <div className="relative">
            <input
              id="frequency"
              type="range"
              min={activeChakra.minHz}
              max={activeChakra.maxHz}
              step="0.1"
              value={frequencies[activeChakraIndex]}
              onChange={(e) => setFrequency(activeChakraIndex, parseFloat(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-brand-outline/50 backdrop-blur-sm transition-all duration-200 hover:h-4"
              style={{ accentColor: activeChakra.color }}
            />
            <div 
              className="absolute top-0 h-3 rounded-lg transition-all duration-300 pointer-events-none"
              style={{ 
                width: `${((frequencies[activeChakraIndex] - activeChakra.minHz) / (activeChakra.maxHz - activeChakra.minHz)) * 100}%`,
                backgroundColor: activeChakra.color,
                boxShadow: `0 0 10px ${activeChakra.color}60`
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Chakra Selection List */}
      <div className="space-y-3 animate-fade-in-delay">
        {chakras.map((chakra, index) => (
          <div key={chakra.name} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <ChakraSelector
              chakra={chakra}
              isActive={index === activeChakraIndex}
              onClick={() => setActiveChakraIndex(index)}
            />
          </div>
        ))}
      </div>

      {/* Session History Card */}
      <div className="bg-brand-bg/40 backdrop-blur-sm p-6 rounded-xl border border-brand-outline/50 flex flex-col flex-shrink-0 min-h-[200px] shadow-lg animate-fade-in-delay">
        <h3 className="text-sm font-semibold text-brand-text-muted tracking-widest uppercase mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Session History
        </h3>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {sessionLogs.length === 0 && (
                <div className="text-center text-brand-text-muted py-8 animate-pulse-gentle">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  No sessions logged yet.
                </div>
            )}
            {sessionLogs.slice().reverse().map((log, index) => (
                <div 
                  key={log.id} 
                  className="group bg-brand-bg/60 backdrop-blur-sm p-4 rounded-xl border-l-4 transition-all duration-300 hover:bg-brand-bg/80 hover:scale-[1.02] animate-slide-in-up" 
                  style={{ 
                    borderColor: chakras[log.chakraIndex].color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="font-bold text-brand-text group-hover:text-white transition-colors duration-200">
                              {chakras[log.chakraIndex].name}
                            </p>
                            <p className="text-xs text-brand-text-muted">
                              {new Date(log.startTime).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0 space-y-1">
                             <StarRatingDisplay rating={log.userRating} />
                             <p className="text-sm font-mono text-brand-text-muted">
                               {formatDuration(log.duration)}
                             </p>
                        </div>
                    </div>
                    {log.userNotes && (
                      <p className="text-sm mt-3 pt-3 border-t border-brand-outline/50 text-brand-text-muted italic leading-relaxed">
                        "{log.userNotes}"
                      </p>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};