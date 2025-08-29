
import { useEffect, useRef, useCallback } from 'react';

const RAMP_TIME = 0.05; // seconds for smooth transitions

export const useBinauralBeat = (
  isPlaying: boolean,
  frequency: number,
  baseFrequency: number,
  volume: number
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);

  // Sets up the audio graph. Idempotent and safe.
  const setupAudioGraph = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error("AudioContext is not supported in this browser.");
      return null;
    }

    try {
      const context = new AudioContextClass();
      audioContextRef.current = context;

      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.connect(context.destination);
      gainNodeRef.current = gainNode;

      const merger = context.createChannelMerger(2);
      merger.connect(gainNode);

      const leftOscillator = context.createOscillator();
      leftOscillator.type = 'sine';
      leftOscillator.connect(merger, 0, 0);
      leftOscillator.start();
      leftOscillatorRef.current = leftOscillator;

      const rightOscillator = context.createOscillator();
      rightOscillator.type = 'sine';
      rightOscillator.connect(merger, 0, 1);
      rightOscillator.start();
      rightOscillatorRef.current = rightOscillator;
      
      return context;
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      return null;
    }
  }, []);
  
  // Effect to handle play/stop state
  useEffect(() => {
    const context = audioContextRef.current;
    if (isPlaying) {
      if (!context) return; 

      if (context.state === 'suspended') {
        context.resume();
      }
      
      const targetGain = volume / 100;
      gainNodeRef.current?.gain.cancelScheduledValues(context.currentTime);
      gainNodeRef.current?.gain.setTargetAtTime(targetGain, context.currentTime, RAMP_TIME);
    } else {
      if (context && gainNodeRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
        gainNodeRef.current.gain.setTargetAtTime(0, context.currentTime, RAMP_TIME);
      }
    }
  }, [isPlaying, volume]);

  // Effect to handle frequency changes
  useEffect(() => {
    if (isPlaying && audioContextRef.current && leftOscillatorRef.current && rightOscillatorRef.current) {
      const context = audioContextRef.current;
      const leftFreq = baseFrequency - frequency / 2;
      const rightFreq = baseFrequency + frequency / 2;
      
      leftOscillatorRef.current.frequency.setTargetAtTime(leftFreq, context.currentTime, RAMP_TIME);
      rightOscillatorRef.current.frequency.setTargetAtTime(rightFreq, context.currentTime, RAMP_TIME);
    }
  }, [isPlaying, frequency, baseFrequency]);
  
  // Cleanup on unmount
  useEffect(() => {
    const audioContext = audioContextRef.current;
    return () => {
      if (audioContext) {
        // A brief ramp down to avoid clicks on component unmount/fast refresh
        const gain = gainNodeRef.current;
        if(gain) {
            gain.gain.cancelScheduledValues(audioContext.currentTime);
            gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.01);
        }
        setTimeout(() => {
            audioContext.close().catch(() => {});
        }, 100);
      }
    };
  }, []);

  // Function to be called on user gesture to initialize and resume the AudioContext
  const triggerUserInteraction = useCallback(() => {
    const context = setupAudioGraph();
    if (context && context.state === 'suspended') {
      context.resume();
    }
  }, [setupAudioGraph]);

  return { triggerUserInteraction };
};
