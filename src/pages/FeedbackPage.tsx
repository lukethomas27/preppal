import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const FeedbackPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">We Value Your Feedback</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        Your feedback helps us improve PrepPal. Let us know what you think about our app, report any issues you encounter, or suggest new features you'd like to see.
      </p>
      <FeedbackForm />
    </div>
  );
};

export default FeedbackPage; 