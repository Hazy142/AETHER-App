import React, { useEffect, useRef } from 'react';

interface SessionViewProps {
  frequency: number;
  color: string;
  isActive: boolean;
}

export const SessionView: React.FC<SessionViewProps> = ({ frequency, color, isActive }) => {
  // FIX: Initialize useRef with null. The call was missing a required argument.
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const opacityRef = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = (time: number) => {
      if (!isActive || !elementRef.current) {
        if(elementRef.current) elementRef.current.style.opacity = '0';
        return;
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      
      const period = 1000 / frequency; // in ms
      const halfPeriod = period / 2;
      const elapsedTime = time - lastTimeRef.current;

      if (elapsedTime > halfPeriod) {
        opacityRef.current = opacityRef.current === 1 ? 0.2 : 1;
        lastTimeRef.current = time;
      }

      elementRef.current.style.opacity = `${opacityRef.current}`;
      // FIX: Use window.requestAnimationFrame to avoid potential issues with polyfills or shadowed variables.
      requestRef.current = window.requestAnimationFrame(animate);
    };

    if (isActive) {
      // FIX: Use window.requestAnimationFrame to avoid potential issues with polyfills or shadowed variables.
      requestRef.current = window.requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        // FIX: Use window.cancelAnimationFrame to avoid potential issues with polyfills or shadowed variables.
        window.cancelAnimationFrame(requestRef.current);
      }
      if(elementRef.current) elementRef.current.style.opacity = '0';
    }

    return () => {
      if (requestRef.current) {
        // FIX: Use window.cancelAnimationFrame to avoid potential issues with polyfills or shadowed variables.
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, frequency]);

  return (
    <div
      ref={elementRef}
      className="absolute inset-0 z-50 transition-opacity duration-100"
      style={{
        backgroundColor: color,
        backgroundImage: `radial-gradient(circle, ${color} 0%, #000000 100%)`,
        opacity: 0,
      }}
    ></div>
  );
};
