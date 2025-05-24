import React, { useState, useEffect, useRef } from "react";
import { ProgressBar } from "./exam/ProgressBar";
import "./ExamView.css";

interface Question {
  id: number;
  text: string;
  options: { text: string; correct: boolean }[];
  type: "single" | "multiple";
  explanation?: string;
}

interface ExamViewProps {
  examId: string;
  onFinishExam: (score: number, title: string) => void;
}

const ExamView: React.FC<ExamViewProps> = ({ examId, onFinishExam }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [examTitle, setExamTitle] = useState<string>("");
  const EXAM_DURATION = 5 * 60; // 65 minutos en segundos
  const TOTAL_QUESTIONS = 65;

  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const questionsRef = useRef<HTMLDivElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (questionsRef.current) {
        const questionElements =
          questionsRef.current.querySelectorAll(".question-card");
        let visibleIndex = 0;

        questionElements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            visibleIndex = index;
          }
        });

        setCurrentQuestionIndex(visibleIndex + 1); // +1 porque empieza en 0
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [questions]);

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    setCurrentQuestionIndex(Math.max(answeredCount, currentQuestionIndex));
  }, [answers]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/jsonExams/${examId}.json`);

        if (!response.ok) throw new Error("Exam not Found");

        const data = await response.json();

        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error("Invalid Exam Format");
        }

        setQuestions(data.questions);
        setExamTitle(data.title || examId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error Loading the Exam");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleAnswerChange = (
    questionId: number,
    optionText: string,
    isMultiple: boolean
  ) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (isMultiple) {
        newAnswers[questionId] = newAnswers[questionId]?.includes(optionText)
          ? newAnswers[questionId].filter((a) => a !== optionText)
          : [...(newAnswers[questionId] || []), optionText];
      } else {
        newAnswers[questionId] = [optionText];
      }
      return newAnswers;
    });
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((question) => {
      const selected = answers[question.id] || [];
      const correctAnswers = question.options
        .filter((opt) => opt.correct)
        .map((opt) => opt.text);

      if (question.type === "single") {
        if (selected.length === 1 && correctAnswers.includes(selected[0])) {
          correctCount++;
        }
      } else {
        const allCorrect =
          correctAnswers.length === selected.length &&
          selected.every((ans) => correctAnswers.includes(ans));
        if (allCorrect) correctCount++;
      }
    });

    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleFinish = () => {
    onFinishExam(score, examTitle);
  };

  if (isLoading) return <div className="loading">Loading Exam...</div>;
  if (error) return <div className="error">{error}</div>;
  if (questions.length === 0)
    return <div className="error">There Are No Questions for this Exam</div>;

  return (
    <div className="exam-container">
      <div className="progress-bar-container">
        <ProgressBar
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          duration={EXAM_DURATION}
        />
      </div>
      <h2 className="exam-title">{examTitle}</h2>

      <div className="questions-list">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`question-card ${showResults ? "show-answers" : ""}`}
          >
            <div className="question-header">
              <h3>
                {question.id + 1}. {question.text}
              </h3>
              <span className="question-type">
                {question.type === "multiple"
                  ? "[Multiple answers]"
                  : "[One Answer]"}
              </span>
            </div>

            <div className="options-container">
              {question.options.map((option, idx) => {
                const isSelected = answers[question.id]?.includes(option.text);
                const isCorrect = option.correct;
                const showCorrect = showResults && isCorrect;
                const showIncorrect = showResults && isSelected && !isCorrect;

                return (
                  <label
                    key={idx}
                    className={`option-label 
                      ${isSelected ? "selected" : ""}
                      ${showCorrect ? "correct" : ""}
                      ${showIncorrect ? "incorrect" : ""}
                    `}
                  >
                    <input
                      type={question.type === "single" ? "radio" : "checkbox"}
                      name={`question-${question.id}`}
                      checked={isSelected || false}
                      onChange={() =>
                        handleAnswerChange(
                          question.id,
                          option.text,
                          question.type === "multiple"
                        )
                      }
                      disabled={showResults}
                    />
                    <span className="option-text">{option.text}</span>
                    {showCorrect && <span className="correct-mark">✓</span>}
                    {showIncorrect && <span className="incorrect-mark">✗</span>}
                  </label>
                );
              })}
            </div>

            {showResults && question.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
      {showResults ? (
        <div className="results-summary">
          <h3>Answers Summary</h3>
          <div className="score-display">
            Score: <span>{score}%</span>
          </div>
          <button onClick={handleFinish} className="finish-button">
            End Exam
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
          className="submit-button"
        >
          Mark Exam
        </button>
      )}
    </div>
  );
};

export default ExamView;
