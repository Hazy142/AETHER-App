
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
            className="focus:outline-none"
            aria-label={`Rate ${ratingValue} stars`}
          >
            <svg
              className={`w-10 h-10 transition-colors duration-150 ${ratingValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-brand-outline'}`}
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-md p-6 border border-brand-outline animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Session Complete</h2>
          <p className="text-brand-text-muted mt-1">Please rate your session.</p>
        </div>
        
        <div className="my-6 p-4 rounded-lg border-l-4" style={{borderColor: chakra.color, backgroundColor: 'rgba(10,10,15, 0.5)'}}>
            <p className="font-semibold text-lg" style={{color: chakra.color}}>{chakra.name} Chakra</p>
            <div className="flex justify-between text-brand-text-muted text-sm mt-1">
                <span>Duration: {formatDuration(session.duration)}</span>
                <span>Frequency: {session.frequency.toFixed(1)} Hz</span>
            </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-center text-sm font-medium text-brand-text-muted mb-2">How effective was this session?</label>
            <StarRatingInput rating={rating} setRating={setRating} />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-brand-text-muted">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full bg-brand-bg border border-brand-outline rounded-md p-2 focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:outline-none"
              style={{'--tw-ring-color': chakra.color} as React.CSSProperties}
              placeholder="e.g., felt very relaxed, noticed a tingling sensation..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-brand-text bg-brand-outline hover:bg-brand-text/20 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-md text-white font-semibold transition-colors"
            style={{backgroundColor: chakra.color}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
