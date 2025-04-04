import React, { useState, useEffect, useRef } from 'react';

interface TimerStep {
  instruction: string;
  duration: number; // in seconds
  customDuration?: number; // user-defined duration in seconds
}

interface CookingTimerProps {
  steps: TimerStep[];
  onComplete?: () => void;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentStep < steps.length - 1) {
      // Play sound when step is complete
      audioRef.current?.play();
      // Move to next step
      setCurrentStep((prev) => prev + 1);
      setTimeLeft(steps[currentStep + 1].customDuration || steps[currentStep + 1].duration);
    } else if (timeLeft === 0 && currentStep === steps.length - 1) {
      // All steps complete
      audioRef.current?.play();
      setIsComplete(true);
      setIsRunning(false);
      onComplete?.();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentStep, steps, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTimeLeft(steps[0].customDuration || steps[0].duration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customTime);
    if (!isNaN(minutes) && minutes > 0) {
      const newSteps = [...steps];
      newSteps[currentStep] = {
        ...newSteps[currentStep],
        customDuration: minutes * 60,
      };
      setTimeLeft(minutes * 60);
      setShowCustomTimeInput(false);
    }
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setTimeLeft(steps[currentStep + 1].customDuration || steps[currentStep + 1].duration);
    }
  };

  return (
    <div className="cooking-timer">
      <div className="timer-display">
        <h3>Step {currentStep + 1} of {steps.length}</h3>
        <div className="time">{formatTime(timeLeft)}</div>
        <div className="current-instruction">{steps[currentStep].instruction}</div>
      </div>

      <div className="timer-controls">
        {!isComplete && (
          <>
            {!isRunning ? (
              <button onClick={handleStart} className="timer-button start">
                Start
              </button>
            ) : (
              <button onClick={handlePause} className="timer-button pause">
                Pause
              </button>
            )}
            <button onClick={handleReset} className="timer-button reset">
              Reset
            </button>
            <button onClick={() => setShowCustomTimeInput(true)} className="timer-button custom">
              Set Time
            </button>
            <button onClick={handleSkipStep} className="timer-button skip">
              Skip Step
            </button>
          </>
        )}
        {isComplete && (
          <div className="timer-complete">
            <h3>All steps completed! 🎉</h3>
            <button onClick={handleReset} className="timer-button">
              Start Over
            </button>
          </div>
        )}
      </div>

      {showCustomTimeInput && (
        <form onSubmit={handleCustomTimeSubmit} className="custom-time-form">
          <input
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            placeholder="Enter minutes"
            min="1"
          />
          <button type="submit" className="timer-button">Set</button>
          <button 
            type="button" 
            onClick={() => setShowCustomTimeInput(false)}
            className="timer-button cancel"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="steps-progress">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookingTimer; 