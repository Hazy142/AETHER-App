
import React, { useState } from 'react';
import { Chakra, SessionLog } from '../types';

interface FeedbackModalProps {
  session: Omit<SessionLog, 'userRating' | 'userNotes'>;
  chakra: Chakra;
  onSave: (rating: number, notes: string) => void;
  onCancel: () => void;
}

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const StarRatingInput: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center space-x-2">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            key={i}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(ratingValue)}
            className="focus:outline-none group transition-transform duration-200 hover:scale-125 active:scale-110"
            aria-label={`Rate ${ratingValue} stars`}
          >
            <svg
              className={`w-10 h-10 transition-all duration-300 ${
                ratingValue <= (hoverRating || rating) 
                  ? 'text-yellow-400 drop-shadow-lg animate-pulse-gentle' 
                  : 'text-brand-outline hover:text-yellow-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};


export const FeedbackModal: React.FC<FeedbackModalProps> = ({ session, chakra, onSave, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    onSave(rating, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-brand-surface to-brand-bg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-brand-outline/50 backdrop-blur-sm animate-scale-in transform">
        <div className="text-center mb-6 animate-slide-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center animate-pulse-gentle">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-text to-purple-400 bg-clip-text text-transparent">
            Session Complete
          </h2>
          <p className="text-brand-text-muted mt-2 animate-fade-in-delay">Please rate your session experience.</p>
        </div>
        
        <div 
          className="my-6 p-6 rounded-xl border-l-4 relative overflow-hidden animate-slide-in-up" 
          style={{
            borderColor: chakra.color, 
            backgroundColor: 'rgba(10,10,15, 0.6)',
            boxShadow: `0 0 30px ${chakra.color}20`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current/10 to-transparent opacity-30" 
               style={{ color: chakra.color }} />
          <p className="font-bold text-xl relative z-10" style={{color: chakra.color}}>
            {chakra.name} Chakra
          </p>
          <div className="flex justify-between text-brand-text-muted text-sm mt-2 relative z-10">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
              </svg>
              Duration: {formatDuration(session.duration)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z"/>
              </svg>
              Frequency: {session.frequency.toFixed(1)} Hz
            </span>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in-delay">
          <div>
            <label className="block text-center text-sm font-medium text-brand-text-muted mb-4">
              How effective was this session?
            </label>
            <StarRatingInput rating={rating} setRating={setRating} />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-brand-text-muted mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-brand-bg/50 backdrop-blur-sm border border-brand-outline/50 rounded-xl p-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:outline-none transition-all duration-300 hover:bg-brand-bg/70 focus:bg-brand-bg/80 resize-none"
              style={{'--tw-ring-color': chakra.color} as React.CSSProperties}
              placeholder="e.g., felt very relaxed, noticed a tingling sensation..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4 animate-slide-in-up">
          <button 
            onClick={onCancel}
            className="group px-6 py-3 rounded-xl text-brand-text bg-brand-outline/50 hover:bg-brand-text/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 active:scale-95"
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              Discard
            </span>
          </button>
          <button 
            onClick={handleSave}
            className="group px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: chakra.color,
              boxShadow: `0 4px 20px ${chakra.color}40`
            }}
          >
            <span className="transition-transform duration-200 group-hover:scale-110 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"/>
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
              </svg>
              Save Session
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
