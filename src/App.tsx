import React, { useState, useEffect } from "react";
import "./App.css";
import ExamSelector from "./components/ExamSelector";
import ExamView from "./components/ExamView";
import HistoryPanel from "./components/HistoryPanel";
import ExamResults from "./components/ExamResults";

interface HistoryEntry {
  exam: string;
  title: string;
  score: number;
  date: string;
}

const App: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    // Initialize state from localStorage
    const savedHistory = localStorage.getItem("examHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [examTitle, setExamTitle] = useState<string>("");

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem("examHistory", JSON.stringify(history));
  }, [history]);

  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
    setExamFinished(false);
    setExamTitle("");
  };

  const handleExamFinish = (score: number, title: string) => {
    if (selectedExam) {
      const newEntry = {
        exam: selectedExam,
        title: title || selectedExam,
        score,
        date: new Date().toLocaleDateString(),
      };
      setHistory([...history, newEntry]);
      setFinalScore(score);
      setExamTitle(title);
      setExamFinished(true);
    }
  };

  const handleRestart = () => {
    setSelectedExam(null);
    setExamFinished(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AWS Certification Practice</h1>
      </header>
      <div className="main-container">
        <div className="sidebar">
          <ExamSelector
            onSelectExam={handleExamSelect}
            selectedExam={selectedExam}
          />
          <HistoryPanel history={history} />
        </div>
        <div className="content">
          {!selectedExam ? (
            <div className="welcome-message">
              <h2>Welcome to AWS Cloud Practioner Mock Exams</h2>
              <p>Select an Exam from Sidebar Dropdown</p>
            </div>
          ) : examFinished ? (
            <ExamResults
              score={finalScore}
              examName={selectedExam}
              examTitle={examTitle}
              onRestart={handleRestart}
            />
          ) : (
            <ExamView examId={selectedExam} onFinishExam={handleExamFinish} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
