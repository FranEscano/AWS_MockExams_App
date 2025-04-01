import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders AWS Certification header", () => {
    render(<App />);
    expect(screen.getByText("AWS Certification Practice")).toBeInTheDocument();
  });

  it("shows welcome message when no exam is selected", () => {
    render(<App />);
    expect(
      screen.getByText("Welcome to AWS Cloud Practioner Mock Exams")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select an Exam from Sidebar Dropdown")
    ).toBeInTheDocument();
  });

  it("displays exam selector dropdown", () => {
    render(<App />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // More specific query to avoid the multiple elements issue
    expect(
      screen.getByRole("heading", { name: "Select an Exam" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Select an Exam" })
    ).toBeInTheDocument();
  });

  it("shows empty history message initially", () => {
    render(<App />);
    expect(screen.getByText("Historic of Exams")).toBeInTheDocument();
    expect(screen.getByText("There Are Not Exam Finished")).toBeInTheDocument();
  });
});
