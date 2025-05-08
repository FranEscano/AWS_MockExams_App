import React, { useState } from "react";

// Define the props for the ExamSelector component
interface ExamSelectorProps {
  onSelectExam: (examId: string) => void; // Function to handle exam selection
  selectedExam: string | null; // Currently selected exam ID
}

// List of available exams
const examList = [
  "exam1", "exam2", "exam3", "exam4", "exam5",
  "exam6", "exam7", "exam8", "exam9", "exam10",
  "exam11", "exam12", "exam13", "exam14", "exam15",
  "exam16", "exam17", "exam18", "exam19", "exam20",
  "exam21", "exam22", "exam23"
];

// ExamSelector component allows users to select an exam from a dropdown list
const ExamSelector: React.FC<ExamSelectorProps> = ({ onSelectExam, selectedExam }) => {
  // State to manage the currently selected exam
  const [selected, setSelected] = useState<string>("");

  // Handle change event for the dropdown
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value; // Get the selected value
    setSelected(value); // Update the state with the selected value
    onSelectExam(value); // Call the onSelectExam function with the selected value
  };

  return (
    <div className="exam-selector">
      <h3>Select an Exam</h3>
      <select
        value={selectedExam || selected} // Set the value of the dropdown
        onChange={handleChange} // Handle change event
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
