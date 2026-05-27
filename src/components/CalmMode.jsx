import { PauseCircle, PlayCircle, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function CalmMode() {
  const [seconds, setSeconds] = useState(120);
  const [totalSeconds, setTotalSeconds] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  const breathingSteps = useMemo(
    () => [
      {
        label: "Breathe in",
        duration: 4,
        message: "Slowly breathe in through your nose.",
      },
      {
        label: "Hold gently",
        duration: 2,
        message: "Hold it softly. No pressure.",
      },
      {
        label: "Breathe out",
        duration: 6,
        message: "Release the breath slowly.",
      },
      {
        label: "Rest",
        duration: 2,
        message: "Let your body settle for a moment.",
      },
    ],
    []
  );

  const cycleDuration = breathingSteps.reduce(
    (total, step) => total + step.duration,
    0
  );

  const elapsed = totalSeconds - seconds;
  const cycleSecond = elapsed % cycleDuration;

  let currentStep = breathingSteps[0];
  let passed = 0;

  for (const step of breathingSteps) {
    if (cycleSecond >= passed && cycleSecond < passed + step.duration) {
      currentStep = step;
      break;
    }

    passed += step.duration;
  }

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsRunning(false);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = Math.max(0, Math.round((seconds / totalSeconds) * 100));

  function setTimer(value) {
    setSeconds(value);
    setTotalSeconds(value);
    setIsRunning(false);
  }

  function resetTimer() {
    setSeconds(120);
    setTotalSeconds(120);
    setIsRunning(false);
  }

  return (
    <section className="section calm-section" id="calm">
      <div className="section-title">
        <span>Calm Mode</span>

        <h2>Follow a gentle breathing rhythm</h2>

        <p>
          Use this pause when the urge feels strong. Follow the circle, breathe
          slowly, and let the feeling pass without rushing.
        </p>
      </div>

      <div className="calm-card enhanced-calm-card">
        <div
          className={
            isRunning
              ? `breath-circle breathing ${currentStep.label
                  .toLowerCase()
                  .replaceAll(" ", "-")}`
              : "breath-circle"
          }
        >
          <p>{isRunning ? currentStep.label : "Ready"}</p>

          <h3>
            {minutes}:{remainingSeconds.toString().padStart(2, "0")}
          </h3>

          <span>{progress}% left</span>
        </div>

        <div className="breath-instruction">
          <h3>{isRunning ? currentStep.label : "Begin when you feel ready"}</h3>
          <p>
            {isRunning
              ? currentStep.message
              : "You do not need to fix everything now. Start with one soft breath."}
          </p>
        </div>

        <div className="breath-steps">
          {breathingSteps.map((step) => (
            <div
              key={step.label}
              className={
                isRunning && currentStep.label === step.label
                  ? "breath-step active-step"
                  : "breath-step"
              }
            >
              <span>{step.duration}s</span>
              <p>{step.label}</p>
            </div>
          ))}
        </div>

        <p className="calm-message">
          An urge can feel powerful, but it is temporary. You are practicing a
          pause, and that pause matters.
        </p>

        <div className="timer-options">
          <button onClick={() => setTimer(120)}>2 min</button>
          <button onClick={() => setTimer(300)}>5 min</button>
          <button onClick={() => setTimer(600)}>10 min</button>
        </div>

        <div className="calm-actions">
          <button
            className="primary-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            {isRunning ? "Pause" : "Begin"}
          </button>

          <button className="secondary-btn" onClick={resetTimer}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default CalmMode;