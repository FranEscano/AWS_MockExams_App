import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExamView from "../ExamView";

const mockQuestions = [
  {
    id: 1,
    text: "What is AWS Lambda?",
    type: "single",
    options: [
      { text: "A. Serverless compute service", correct: true },
      { text: "B. Virtual machine service", correct: false },
    ],
  },
  {
    id: 2,
    text: "Which are AWS database services?",
    type: "multiple",
    options: [
      { text: "A. RDS", correct: true },
      { text: "B. DynamoDB", correct: true },
      { text: "C. EC2", correct: false },
    ],
  },
];

describe("ExamView", () => {
  const mockFinishExam = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            title: "AWS Practice Exam",
            questions: mockQuestions,
          }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loads and displays exam questions", async () => {
    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    // Check for exam title
    await expect(
      screen.findByText("AWS Practice Exam")
    ).resolves.toBeInTheDocument();

    // Check for questions using more flexible matching
    await expect(
      screen.findByText(/What is AWS Lambda\?/)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(/Which are AWS database services\?/)
    ).resolves.toBeInTheDocument();
  });

  it("handles single answer selection", async () => {
    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    const option = await screen.findByRole("radio", {
      name: /A\. Serverless compute service/,
    });
    fireEvent.click(option);
    expect(option).toBeChecked();
  });

  it("handles multiple answer selection", async () => {
    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    const option1 = await screen.findByRole("checkbox", { name: /A\. RDS/ });
    const option2 = await screen.findByRole("checkbox", {
      name: /B\. DynamoDB/,
    });

    fireEvent.click(option1);
    fireEvent.click(option2);

    expect(option1).toBeChecked();
    expect(option2).toBeChecked();
  });

  it("shows results when submitted", async () => {
    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    // Select correct answers
    const radioOption = await screen.findByRole("radio", {
      name: /A\. Serverless compute service/,
    });
    const checkbox1 = await screen.findByRole("checkbox", { name: /A\. RDS/ });
    const checkbox2 = await screen.findByRole("checkbox", {
      name: /B\. DynamoDB/,
    });

    fireEvent.click(radioOption);
    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    const submitButton = await screen.findByText("Mark Exam");
    fireEvent.click(submitButton);

    await expect(screen.findByText(/Score:/)).resolves.toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it("handles API errors", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("API is down"))
    );

    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    await expect(screen.findByText("API is down")).resolves.toBeInTheDocument();
  });

  it("shows loading state initially", async () => {
    // Mock a delayed response to ensure loading state appears
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    title: "AWS Practice Exam",
                    questions: mockQuestions,
                  }),
              }),
            100
          )
        )
    );

    render(<ExamView examId="exam1" onFinishExam={mockFinishExam} />);

    // Immediately check for loading state
    expect(screen.getByText("Loading Exam...")).toBeInTheDocument();

    // Wait for loading to complete and verify it disappears
    await waitFor(() => {
      expect(screen.queryByText("Loading Exam...")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when no questions", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            title: "Empty Exam",
            questions: [],
          }),
      })
    );

    render(<ExamView examId="empty-exam" onFinishExam={mockFinishExam} />);

    await expect(
      screen.findByText("There Are No Questions for this Exam")
    ).resolves.toBeInTheDocument();
  });
});
