import React, { useState, useCallback } from 'react';
import { CHAKRAS, BINAURAL_BASE_HZ } from './constants';
import { useBinauralBeat } from './hooks/useBinauralBeat';
import { ControlPanel } from './components/ControlPanel';
import { ThreeScene } from './components/ThreeScene';
import { SessionView } from './components/SessionView';
import { FeedbackModal } from './components/FeedbackModal';
import { ViewMode, SessionLog } from './types';

// Separate Interface für aktive Sessions
interface ActiveSession {
  id: string;
  startTime: number;
  chakraIndex: number;
  frequency: number;
}

// Interface für abgeschlossene Sessions (vor Feedback)
interface CompletedSession extends ActiveSession {
  endTime: number;
  duration: number;
}

function App() {
  const [activeChakraIndex, setActiveChakraIndex] = useState(3);
  const [frequencies, setFrequencies] = useState<number[]>(CHAKRAS.map(c => c.defaultHz));
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volume, setVolume] = useState(25);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SCENE_3D);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [currentSession, setCurrentSession] = useState<ActiveSession | null>(null);
  const [pendingFeedbackSession, setPendingFeedbackSession] = useState<CompletedSession | null>(null);

  const { triggerUserInteraction } = useBinauralBeat(
    isSessionActive,
    frequencies[activeChakraIndex],
    BINAURAL_BASE_HZ,
    volume
  );

  const toggleSession = useCallback(() => {
    triggerUserInteraction(); 
    setIsSessionActive(prev => {
      const isNowActive = !prev;
      if (isNowActive) {
        // Neue aktive Session erstellen
        setCurrentSession({
          id: Date.now().toString(),
          startTime: Date.now(),
          chakraIndex: activeChakraIndex,
          frequency: frequencies[activeChakraIndex],
        });
      } else {
        // Session beenden
        if (currentSession && currentSession.startTime) {
          const endTime = Date.now();
          const completedSession: CompletedSession = {
            ...currentSession,
            endTime,
            duration: (endTime - currentSession.startTime) / 1000,
          };
          setPendingFeedbackSession(completedSession);
          setCurrentSession(null);
        }
      }
      return isNowActive;
    });
  }, [triggerUserInteraction, currentSession, activeChakraIndex, frequencies]);

  const handleSaveSession = (rating: number, notes: string) => {
    if (pendingFeedbackSession) {
      const newLog: SessionLog = {
        ...pendingFeedbackSession,
        userRating: rating,
        userNotes: notes,
      };
      setSessionLogs(prevLogs => [...prevLogs, newLog]);
      setPendingFeedbackSession(null);
    }
  };

  const handleCancelFeedback = () => {
    setPendingFeedbackSession(null);
  };

  const setFrequency = (chakraIndex: number, newFreq: number) => {
    const newFrequencies = [...frequencies];
    newFrequencies[chakraIndex] = newFreq;
    setFrequencies(newFrequencies);
  };

  const activeChakra = CHAKRAS[activeChakraIndex];
  
  return (
    <>
      <div className="w-screen h-screen flex flex-col md:flex-row bg-brand-bg">
        <div className="md:w-1/3 lg:w-1/4 h-auto md:h-full flex-shrink-0">
          <ControlPanel
            chakras={CHAKRAS}
            activeChakraIndex={activeChakraIndex}
            setActiveChakraIndex={setActiveChakraIndex}
            frequencies={frequencies}
            setFrequency={setFrequency}
            isSessionActive={isSessionActive}
            toggleSession={toggleSession}
            volume={volume}
            setVolume={setVolume}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sessionLogs={sessionLogs}
          />
        </div>
        
        <div className="flex-grow h-full relative p-4">
          { (viewMode === ViewMode.SCENE_3D) ? (
            <ThreeScene
              activeChakra={activeChakraIndex}
              activeFrequency={frequencies[activeChakraIndex]}
              isSessionActive={isSessionActive}
              intensity={currentSession ? Math.min(1, (Date.now() - currentSession.startTime!) / 60000) : 0}
            />
          ) : (
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-brand-text">{activeChakra.name} Chakra Session</h2>
                <div className="text-6xl font-mono text-brand-text">{frequencies[activeChakraIndex].toFixed(1)} Hz</div>
                <p className="text-brand-text-muted max-w-md">
                  You are in POV mode. The screen simulates the light therapy goggles. 
                  Use the view toggle in the control panel to return to the 3D scene.
                </p>
              </div>
            </div>
          )
          }
          
          <SessionView 
            frequency={frequencies[activeChakraIndex]}
            color={activeChakra.color}
            isActive={isSessionActive && viewMode === ViewMode.SESSION_POV}
          />
        </div>
      </div>
      {pendingFeedbackSession && (
        <FeedbackModal
          session={pendingFeedbackSession}
          onSave={handleSaveSession}
          onCancel={handleCancelFeedback}
        />
      )}
    </>
  );
}

export default App;