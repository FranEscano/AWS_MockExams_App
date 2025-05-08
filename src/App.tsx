import React, { useState, useEffect } from "react";
import "./App.css";
import ExamSelector from "./components/ExamSelector";
import ExamView from "./components/ExamView";
import HistoryPanel from "./components/HistoryPanel";
import ExamResults from "./components/ExamResults";

// Define the structure of a history entry
interface HistoryEntry {
  exam: string;
  title: string;
  score: number;
  date: string;
}

const App: React.FC = () => {
  // State to store the selected exam ID
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  // State to store the history of completed exams, initialized from localStorage
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem("examHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  // State to track if the exam has been finished
  const [examFinished, setExamFinished] = useState<boolean>(false);
  // State to store the final score of the completed exam
  const [finalScore, setFinalScore] = useState<number>(0);
  // State to store the title of the completed exam
  const [examTitle, setExamTitle] = useState<string>("");

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("examHistory", JSON.stringify(history));
  }, [history]);

  // Handle exam selection from the ExamSelector component
  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
    setExamFinished(false);
    setExamTitle("");
  };

  // Handle the completion of an exam
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

  // Handle restarting the exam selection process
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
          {/* Display welcome message if no exam is selected */}
          {!selectedExam ? (
            <div className="welcome-message">
              <h2>Welcome to AWS Cloud Practitioner Mock Exams</h2>
              <p>Select an Exam from Sidebar Dropdown</p>
            </div>
          ) : examFinished ? (
            // Display exam results if the exam is finished
            <ExamResults
              score={finalScore}
              examName={selectedExam}
              examTitle={examTitle}
              onRestart={handleRestart}
            />
          ) : (
            // Display the exam view if an exam is selected and not finished
            <ExamView examId={selectedExam} onFinishExam={handleExamFinish} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
