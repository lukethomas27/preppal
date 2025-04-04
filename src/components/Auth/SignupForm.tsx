import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        if (signUpError.message.includes('email')) {
          setError('Invalid email format');
        } else if (signUpError.message.includes('password')) {
          setError('Password does not meet requirements');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Redirect to home page after successful signup and sign-in
      navigate('/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Your PrepPal Account</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="input"
          />
          <p className="mt-1 text-sm text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="input"
          />
        </div>
        <button 
          type="submit" 
          className={`w-full btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-secondary w-full"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm; 