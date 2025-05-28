import React, { useState, useEffect } from "react";
import "./App.css";
import ExamSelector from "./components/ExamSelector";
import ExamView from "./components/ExamView";
import HistoryPanel from "./components/HistoryPanel";
import ExamResults from "./components/ExamResults";
import "./styles/global.css";

// Supabase Auth
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthProvider";

// Define the structure of a history entry
interface HistoryEntry {
  exam: string;
  title: string;
  score: number;
  date: string;
}

const App: React.FC = () => {
  const { session } = useAuth(); // 🔐 acceso al estado de sesión

  // State to store the selected exam ID
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

  // 🔐 Mostrar formulario de login si no hay sesión
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
          {/* 🔐 Botón para cerrar sesión */}
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
