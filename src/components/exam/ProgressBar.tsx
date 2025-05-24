import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  duration: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  timeLeft,
  duration,
}) => {
  const isTimeCritical = timeLeft < 5 * 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="progress-container">
      <div className="progress-section">
        <span className="progress-label">
          Question {currentQuestion} / {totalQuestions} •
          <span className="progress-percent">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="progress-section">
        <span className={`time-label ${isTimeCritical ? "time-critical" : ""}`}>
          ⏱️ {formatTime(timeLeft)} {isTimeCritical && "| ¡Últimos minutos!"}
        </span>
        <div className="progress-bar">
          <div
            className="time-fill"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
