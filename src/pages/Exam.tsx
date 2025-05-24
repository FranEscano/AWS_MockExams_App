import React, { useState, useEffect } from "react";
import { ProgressBar } from "../components/exam/ProgressBar";

const Exam: React.FC = () => {
  // Configuración del examen (ej: AWS Cloud Practitioner)
  const EXAM_DURATION = 65 * 60; // 65 minutos en segundos
  const TOTAL_QUESTIONS = 65;

  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lógica para avanzar preguntas (adaptar a tu implementación actual)
  const handleNextQuestion = () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  return (
    <div className="exam-container">
      <ProgressBar
        currentQuestion={currentQuestion}
        totalQuestions={TOTAL_QUESTIONS}
        timeLeft={timeLeft}
        duration={EXAM_DURATION}
      />

      {/* Resto del código del examen... */}
      <button onClick={handleNextQuestion}>Siguiente Pregunta</button>
    </div>
  );
};

export default Exam;
