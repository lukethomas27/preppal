import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleCustomEvent = () => {
      document.addEventListener('openFeedbackModal', () => {
        // Find any parent component that can open the feedback modal
        const event = new CustomEvent('openFeedbackModalRequest');
        document.dispatchEvent(event);
      });
    };

    handleCustomEvent();
    return () => {
      document.removeEventListener('openFeedbackModal', handleCustomEvent);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!title.trim() || !description.trim()) {
      setError('Please fill out all fields');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('feedback').insert([
        {
          user_id: user?.id || null,
          email: user?.email || 'anonymous',
          feedback_type: feedbackType,
          title: title.trim(),
          description: description.trim(),
          status: 'new',
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      setTitle('');
      setDescription('');
      setFeedbackType('suggestion');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          Thank you for your feedback! We appreciate your input.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedbackType" className="label">
            Feedback Type
          </label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={e => setFeedbackType(e.target.value)}
            className="input"
            disabled={loading}
          >
            <option value="suggestion">Suggestion</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Brief summary of your feedback"
            required
            disabled={loading}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please provide details about your feedback"
            required
            disabled={loading}
            rows={5}
            className="input"
          />
        </div>

        <button
          type="submit"
          className={`w-full btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
