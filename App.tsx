import React, { useState, useCallback } from 'react';
import { CHAKRAS, BINAURAL_BASE_HZ } from './constants';
import { useBinauralBeat } from './hooks/useBinauralBeat';
import { ControlPanel } from './components/ControlPanel';
import { ThreeScene } from './components/ThreeScene';
import { SessionView } from './components/SessionView';
import { FeedbackModal } from './components/FeedbackModal';
import { ViewMode, SessionLog } from './types';

function App() {
  const [activeChakraIndex, setActiveChakraIndex] = useState(3);
  const [frequencies, setFrequencies] = useState<number[]>(CHAKRAS.map(c => c.defaultHz));
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volume, setVolume] = useState(25);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SCENE_3D);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [currentSession, setCurrentSession] = useState<Partial<SessionLog> | null>(null);
  const [pendingFeedbackSession, setPendingFeedbackSession] = useState<Omit<SessionLog, 'userRating' | 'userNotes'> | null>(null);

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
        setCurrentSession({
          id: Date.now().toString(),
          startTime: Date.now(),
          chakraIndex: activeChakraIndex,
          frequency: frequencies[activeChakraIndex],
        });
      } else {
        if (currentSession && currentSession.startTime) {
          const endTime = Date.now();
          const sessionToEnd = {
            ...currentSession,
            endTime,
            duration: (endTime - currentSession.startTime) / 1000,
          } as Omit<SessionLog, 'userRating' | 'userNotes'>;
          setPendingFeedbackSession(sessionToEnd);
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
      <main className="w-screen h-screen flex flex-col md:flex-row bg-brand-bg">
        {/* === KORRIGIERTE ZEILE UNTEN === */}
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
              activeChakra={activeChakra}
              activeFrequency={frequencies[activeChakraIndex]}
              isSessionActive={isSessionActive}
              intensity={currentSession ? Math.min(1, (Date.now() - currentSession.startTime!) / 60000) : 0}
            />
          ) : (
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-center p-8">
              <div className="z-10 relative">
                <h2 className="text-4xl font-bold mb-2" style={{color: activeChakra.color}}>
                  {activeChakra.name} Chakra Session
                </h2>
                <p className="text-2xl text-brand-text-muted">{frequencies[activeChakraIndex].toFixed(1)} Hz</p>
                <p className="mt-4 text-brand-text-muted">You are in POV mode. The screen simulates the light therapy goggles. <br/>Use the view toggle in the control panel to return to the 3D scene.</p>
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
      </main>
      {pendingFeedbackSession && (
        <FeedbackModal 
          session={pendingFeedbackSession} 
          chakra={CHAKRAS[pendingFeedbackSession.chakraIndex]}
          onSave={handleSaveSession}
          onCancel={handleCancelFeedback}
        />
      )}
    </>
  );
}

export default App;