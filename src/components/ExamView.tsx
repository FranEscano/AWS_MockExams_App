import React, { useState, useEffect } from "react";
import "./ExamView.css";

// Define the structure of a Question object
interface Question {
  id: number;
  text: string;
  options: { text: string; correct: boolean }[];
  type: "single" | "multiple";
  explanation?: string;
}

// Define the props for the ExamView component
interface ExamViewProps {
  examId: string;
  onFinishExam: (score: number, title: string) => void;
}

// Main ExamView component
const ExamView: React.FC<ExamViewProps> = ({ examId, onFinishExam }) => {
  // State to store the list of questions
  const [questions, setQuestions] = useState([]);
  // State to store the user's answers
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState("");
  // State to control the display of results
  const [showResults, setShowResults] = useState(false);
  // State to store the user's score
  const [score, setScore] = useState(0);
  // State to store the exam title
  const [examTitle, setExamTitle] = useState("");

  // Fetch exam data when the component mounts or examId changes
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

  // Handle changes in user's answers
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

  // Calculate the user's score based on their answers
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

  // Handle the submission of the exam
  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  // Handle finishing the exam and passing the score to the parent component
  const handleFinish = () => {
    onFinishExam(score, examTitle);
  };

  // Render loading state
  if (isLoading) return "Loading Exam...";
  // Render error state
  if (error) return `{error}`;
  // Render no questions state
  if (questions.length === 0)
    return "There Are No Questions for this Exam";

  // Render the exam view
  return (
    <div>
      <h1>{examTitle}</h1>

      {questions.map((question) => (
        <div key={question.id}>
          <h2>
            {question.id + 1}. {question.text}
          </h2>
          <p>
            {question.type === "multiple"
              ? "[Multiple answers]"
              : "[One Answer]"}
          </p>

          <ul>
            {question.options.map((option, idx) => {
              const isSelected = answers[question.id]?.includes(option.text);
              const isCorrect = option.correct;
              const showCorrect = showResults && isCorrect;
              const showIncorrect = showResults && isSelected && !isCorrect;

              return (
                <li key={idx}>
                  <input
                    type={question.type === "multiple" ? "checkbox" : "radio"}
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={isSelected}
                    onChange={() =>
                      handleAnswerChange(
                        question.id,
                        option.text,
                        question.type === "multiple"
                      )
                    }
                    disabled={showResults}
                  />
                  {option.text}
                  {showCorrect && " ✓"}
                  {showIncorrect && " ✗"}
                </li>
              );
            })}
          </ul>

          {showResults && question.explanation && (
            <p>
              <strong>Explanation:</strong> {question.explanation}
            </p>
          )}
        </div>
      ))}

      {showResults ? (
        <div>
          <h2>Answers Summary</h2>
          <p>Score: {score}%</p>
          <button onClick={handleFinish}>End Exam</button>
        </div>
      ) : (
        <button onClick={handleSubmit}>Mark Exam</button>
      )}
    </div>
  );
};

export default ExamView;
