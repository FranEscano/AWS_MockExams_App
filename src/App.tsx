import React, { useState, useEffect } from "react";
import "./App.css";
import ExamSelector from "./components/ExamSelector";
import ExamView from "./components/ExamView";
import HistoryPanel from "./components/HistoryPanel";
import ExamResults from "./components/ExamResults";
import "./styles/global.css";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthProvider";

interface HistoryEntry {
  exam: string;
  title: string;
  score: number | null;
  date: string;
  mode?: "test" | "study";
}

const App: React.FC = () => {
  const { session } = useAuth();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem("examHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [examTitle, setExamTitle] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
      const mode = (localStorage.getItem("aws_mode") as "test" | "study") || "test";
      const newEntry: HistoryEntry = {
        exam: selectedExam,
        title: title || selectedExam,
        score: mode === "test" ? score : null,
        date: new Date().toLocaleDateString(),
        mode,
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

  if (!session) {
    return (
      <div className="App auth-container">
        <header className="App-header">
          <h1>AWS Certification Practice</h1>
        </header>
        <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "2rem" }}>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "App dark-mode" : "App light-mode"}>
      <header className="App-header">
        <h1>AWS Certification Practice</h1>
        <div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
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
              <h2>Welcome to AWS Cloud Practitioner Mock Exams</h2>
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
