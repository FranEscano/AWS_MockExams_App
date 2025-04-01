import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExamResults from "../ExamResults";

describe("ExamResults", () => {
  const mockRestart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays passing results correctly", () => {
    render(
      <ExamResults
        score={85}
        examName="exam1"
        examTitle="AWS Fundamentals"
        onRestart={mockRestart}
      />
    );

    expect(screen.getByText("Exam Results")).toBeInTheDocument();
    expect(screen.getByText("AWS Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(
      screen.getByText(/Congratulations! You have passed the exam/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Passed")).toBeInTheDocument();
  });

  it("displays failing results correctly", () => {
    render(
      <ExamResults
        score={65}
        examName="exam1"
        examTitle="AWS Fundamentals"
        onRestart={mockRestart}
      />
    );

    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(
      screen.getByText(/Keep practicing. You can try again./i)
    ).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("calls restart handler", () => {
    render(
      <ExamResults
        score={75}
        examName="exam1"
        examTitle="AWS Fundamentals"
        onRestart={mockRestart}
      />
    );

    fireEvent.click(screen.getByText("Restart"));
    expect(mockRestart).toHaveBeenCalled();
  });
});
