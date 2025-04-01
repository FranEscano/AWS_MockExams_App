import React, { useState } from "react";

interface ExamSelectorProps {
  onSelectExam: (examId: string) => void;
  selectedExam: string | null;
}

const examList = [
    "exam1", "exam2", "exam3", "exam4", "exam5",
    "exam6", "exam7", "exam8", "exam9", "exam10",
    "exam11", "exam12", "exam13", "exam14", "exam15",
    "exam16", "exam17", "exam18", "exam19", "exam20",
    "exam21", "exam22", "exam23"
];

const ExamSelector: React.FC<ExamSelectorProps> = ({ onSelectExam, selectedExam }) => {
  const [selected, setSelected] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    onSelectExam(value);
  };

  return (
    <div className="exam-selector">
      <h3>Select an Exam</h3>
      <select 
        value={selectedExam || selected}
        onChange={handleChange}
        className="exam-dropdown"
      >
        <option value="" disabled>Select an Exam</option>
        {examList.map((exam) => (
          <option key={exam} value={exam}>
            {exam.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExamSelector;