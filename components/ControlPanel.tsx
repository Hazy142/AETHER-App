
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
    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 ${
      isActive ? 'border-brand-text/80 shadow-lg' : 'border-brand-outline hover:border-brand-text/50 bg-brand-bg/50'
    }`}
    style={{ backgroundColor: isActive ? chakra.color : undefined }}
    aria-pressed={isActive}
    >
    <div className={`font-bold text-lg ${isActive ? 'text-black' : 'text-brand-text'}`}>{chakra.name}</div>
    <div className={`text-sm ${isActive ? 'text-black/80' : 'text-brand-text-muted'}`}>{chakra.description}</div>
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
    <div className="h-full bg-brand-surface p-4 flex flex-col space-y-4 overflow-y-auto">
      <div className="flex-shrink-0 px-2">
        <h2 className="text-3xl font-bold tracking-wider">AETHER</h2>
        <p className="text-brand-text-muted">Digital Simulation</p>
      </div>

      {/* Session Control Card */}
      <div className="bg-brand-bg/30 p-4 rounded-lg space-y-4 border border-brand-outline">
        <h3 className="text-sm font-semibold text-brand-text-muted tracking-widest uppercase">Session</h3>
        <div className="flex items-center justify-between space-x-2">
            <button
                onClick={toggleSession}
                className={`px-6 py-3 rounded-full text-lg font-bold transition-all w-32 flex items-center justify-center ${isSessionActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
                {isSessionActive ? 'Stop' : 'Start'}
            </button>
            <button
                onClick={() => setViewMode(viewMode === ViewMode.SCENE_3D ? ViewMode.SESSION_POV : ViewMode.SCENE_3D)}
                className="p-3 rounded-full bg-brand-outline hover:bg-brand-text/20 transition-colors"
                title="Toggle View"
                aria-label="Toggle 3D Scene and POV mode"
              >
                {viewMode === ViewMode.SCENE_3D ? 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l8 4" /></svg>
                }
            </button>
        </div>
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-brand-text-muted">
            Audio Volume: {volume}%
          </label>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-brand-outline"
            style={{ accentColor: '#a8a8ff' }}
          />
        </div>
      </div>

      {/* Active Chakra Details Card */}
      <div className="bg-brand-bg/30 p-4 rounded-lg space-y-2 border-2 transition-colors duration-300" style={{ borderColor: activeChakra.color }}>
         <h3 className="text-lg font-semibold" style={{ color: activeChakra.color }}>{activeChakra.name.toUpperCase()} CHAKRA</h3>
         <p className="text-sm text-brand-text-muted h-10">{activeChakra.description}</p>
         <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-brand-text-muted">
            Frequency: {frequencies[activeChakraIndex].toFixed(1)} Hz
          </label>
          <input
            id="frequency"
            type="range"
            min={activeChakra.minHz}
            max={activeChakra.maxHz}
            step="0.1"
            value={frequencies[activeChakraIndex]}
            onChange={(e) => setFrequency(activeChakraIndex, parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-brand-outline"
            style={{ accentColor: activeChakra.color }}
          />
        </div>
      </div>
      
      {/* Chakra Selection List */}
      <div className="space-y-2">
        {chakras.map((chakra, index) => (
          <ChakraSelector
            key={chakra.name}
            chakra={chakra}
            isActive={index === activeChakraIndex}
            onClick={() => setActiveChakraIndex(index)}
          />
        ))}
      </div>

      {/* Session History Card */}
      <div className="bg-brand-bg/30 p-4 rounded-lg border border-brand-outline flex flex-col flex-shrink-0 min-h-[200px]">
        <h3 className="text-sm font-semibold text-brand-text-muted tracking-widest uppercase mb-2">Session History</h3>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {sessionLogs.length === 0 && (
                <div className="text-center text-brand-text-muted py-8">No sessions logged yet.</div>
            )}
            {sessionLogs.slice().reverse().map(log => (
                <div key={log.id} className="bg-brand-bg/50 p-3 rounded-lg border-l-4" style={{ borderColor: chakras[log.chakraIndex].color }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-brand-text">{chakras[log.chakraIndex].name}</p>
                            <p className="text-xs text-brand-text-muted">{new Date(log.startTime).toLocaleString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                             <StarRatingDisplay rating={log.userRating} />
                             <p className="text-sm font-mono text-brand-text-muted">{formatDuration(log.duration)}</p>
                        </div>
                    </div>
                    {log.userNotes && <p className="text-sm mt-2 pt-2 border-t border-brand-outline text-brand-text-muted italic">"{log.userNotes}"</p>}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
