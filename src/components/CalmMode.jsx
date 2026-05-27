import { PauseCircle, PlayCircle, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

function CalmMode() {
  const [seconds, setSeconds] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  function setTimer(value) {
    setSeconds(value);
    setIsRunning(false);
  }

  function resetTimer() {
    setSeconds(120);
    setIsRunning(false);
  }

  return (
    <section className="section calm-section" id="calm">
      <div className="section-title">
        <span>Calm Mode</span>
        <h2>Pause before the cleaning urge</h2>
        <p>
          Start with only 2 minutes. The goal is not perfection. The goal is one
          small pause.
        </p>
      </div>

      <div className="calm-card">
        <div className={isRunning ? "breath-circle breathing" : "breath-circle"}>
          <p>Breathe</p>
          <h3>
            {minutes}:{remainingSeconds.toString().padStart(2, "0")}
          </h3>
        </div>

        <p className="calm-message">
          This is an urge. It can feel strong, but it will rise and fall. You are
          safe in this moment.
        </p>

        <div className="timer-options">
          <button onClick={() => setTimer(120)}>2 min</button>
          <button onClick={() => setTimer(300)}>5 min</button>
          <button onClick={() => setTimer(600)}>10 min</button>
        </div>

        <div className="calm-actions">
          <button className="primary-btn" onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            {isRunning ? "Pause" : "Start"}
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