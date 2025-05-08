import React from "react";

// Define the structure of a HistoryEntry object
interface HistoryEntry {
  exam: string;
  score: number;
  date: string;
}

// Define the props for the HistoryPanel component
interface HistoryPanelProps {
  history: HistoryEntry[];
}

// Main HistoryPanel component
const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  return (
    <div className="history-panel">
      <h3>Historic of Exams</h3>
      {/* Check if there are any history entries */}
      {history.length === 0 ? (
        <p>There Are Not Exam Finished</p>
      ) : (
        <ul>
          {/* Map through the history array and display each entry */}
          {history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.exam.toUpperCase()}</strong> {/* Display exam name in uppercase */}
              <span>{entry.score}%</span> {/* Display exam score */}
              <small>{entry.date}</small> {/* Display exam date */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;
