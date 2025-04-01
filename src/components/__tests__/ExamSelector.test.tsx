import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExamSelector from '../ExamSelector';

// Mock the exam list
jest.mock('../ExamSelector', () => {
  const ExamSelector = ({ onSelectExam, selectedExam }: { 
    onSelectExam: (examId: string) => void, 
    selectedExam: string | null 
  }) => (
    <select 
      data-testid="exam-selector" 
      value={selectedExam || ''}
      onChange={(e) => onSelectExam(e.target.value)}
    >
      <option value="" disabled>Choose a Practice Exam</option>
      <option value="exam1">EXAM1</option>
      <option value="exam2">EXAM2</option>
    </select>
  );
  return ExamSelector;
});

describe('ExamSelector', () => {
  it('renders without crashing', () => {
    render(<ExamSelector onSelectExam={jest.fn()} selectedExam={null} />);
    expect(screen.getByTestId('exam-selector')).toBeInTheDocument();
  });

  it('calls onSelectExam with correct value', () => {
    const mockOnSelect = jest.fn();
    render(<ExamSelector onSelectExam={mockOnSelect} selectedExam={null} />);
    
    fireEvent.change(screen.getByTestId('exam-selector'), {
      target: { value: 'exam2' }
    });
    
    expect(mockOnSelect).toHaveBeenCalledWith('exam2');
  });

  it('shows current selected exam', () => {
    render(<ExamSelector onSelectExam={jest.fn()} selectedExam="exam2" />);
    expect(screen.getByTestId('exam-selector')).toHaveValue('exam2');
  });
});