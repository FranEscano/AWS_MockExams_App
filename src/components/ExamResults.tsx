import React from 'react';
import './ExamResults.css';

// Define the props for the ExamResults component
interface ExamResultsProps {
  score: number; // The score obtained in the exam
  examName: string; // The name of the exam
  examTitle: string; // The title of the exam (optional, defaults to examName)
  onRestart: () => void; // Function to handle the restart action
}

// ExamResults component displays the results of an exam
const ExamResults: React.FC<ExamResultsProps> = ({
  score,
  examName,
  examTitle = examName,
  onRestart
}) => {
  return (
    <div className="exam-results">
      <h2>Exam Results</h2>
      <h3>{examTitle || examName}</h3>

      <div className="score-display">
        <div className="score-circle">
          <span>{score}%</span>
        </div>
        <p className="score-text">
          {score >= 70 ? 'Passed' : 'Failed'}
        </p>
      </div>

      <div className="result-feedback">
        {score >= 70 ? (
          <p className="success">Congratulations! You have passed the exam</p>
        ) : (
          <p className="fail">Keep practicing. You can try again.</p>
        )}
      </div>

      <button onClick={onRestart} className="restart-button">
        Restart
      </button>
    </div>
  );
};

export default ExamResults;
