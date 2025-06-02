import React from "react";

interface HistoryEntry {
  exam: string;
  score: number | null;
  date: string;
  mode?: "test" | "study";
}

interface HistoryPanelProps {
  history: HistoryEntry[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  return (
    <div className="history-panel">
      <h3>Historic of Exams</h3>
      {history.length === 0 ? (
        <p>There Are Not Exam Finished</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.exam.toUpperCase()}</strong>
              <span>
                {entry.mode === "study"
                  ? "Study Mode"
                  : `${entry.score}%`}
              </span>
              <small>{entry.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;
