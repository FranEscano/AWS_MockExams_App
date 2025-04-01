import React from 'react';
import './ExamResults.css';

interface ExamResultsProps {
  score: number;
  examName: string;
  examTitle: string;
  onRestart: () => void;
}

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