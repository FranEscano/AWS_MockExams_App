import fs from 'fs';
import path from 'path';

// Strict type definitions for QuestionOption and Question
type QuestionOption = {
  text: string;
  correct: boolean;
};

type Question = {
  id: number;
  text: string;
  options: QuestionOption[];
  type: "single" | "multiple";
  explanation?: string;
};

// Type definition for ExamData
type ExamData = {
  title: string;
  questions: Question[];
  sourceFile?: string;
  createdAt?: string;
};

// Explicit type for currentQuestion
type CurrentQuestion = {
  text: string;
  options: QuestionOption[];
};

// Function to parse markdown content into ExamData
export const parseMarkdown = (markdown: string): ExamData => {
  // Split markdown into lines and trim whitespace
  const lines = markdown.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Extract title from markdown
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '').trim() || 'Untitled Exam';

  const questions: Question[] = [];
  let currentQuestion: CurrentQuestion | null = null;
  let correctAnswers: string[] = [];

  for (const line of lines) {
    // Detect new question
    if (/^\d+\./.test(line)) {
      // Save previous question if it exists
      if (currentQuestion?.options?.length) {
        questions.push({
          id: questions.length,
          text: currentQuestion.text,
          options: currentQuestion.options,
          type: correctAnswers.length > 1 ? 'multiple' : 'single'
        });
      }

      // Start new question
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, ''),
        options: []
      };
      correctAnswers = [];
      continue;
    }

    // Detect options
    if (line.startsWith('- ') && currentQuestion) {
      const optionText = line.substring(2).trim();
      const letterMatch = optionText.match(/^([A-E])\./);

      currentQuestion.options.push({
        text: optionText,
        correct: false
      });
      continue;
    }

    // Detect correct answers
    if (line.startsWith('Correct answer: ') && currentQuestion) {
      correctAnswers = line.split(': ')[1].split(/,\s*/).map(a => a.trim());

      // Mark correct options
      currentQuestion.options.forEach(opt => {
        const letterMatch = opt.text.match(/^([A-E])\./);
        if (letterMatch && correctAnswers.includes(letterMatch[1])) {
          opt.correct = true;
        }
      });
      continue;
    }

    // Detect explanations
    if (line.startsWith('Explanation: ') && questions.length > 0) {
      questions[questions.length - 1].explanation = line.split('Explanation: ')[1];
    }
  }

  // Add the last question if it exists
  if (currentQuestion?.options?.length) {
    questions.push({
      id: questions.length,
      text: currentQuestion.text,
      options: currentQuestion.options,
      type: correctAnswers.length > 1 ? 'multiple' : 'single'
    });
  }

  return {
    title,
    questions,
    createdAt: new Date().toISOString()
  };
};

// Function to convert all markdown exams to JSON format
const convertAllExams = async (): Promise<void> => {
  const mdDir = path.join(__dirname, '../../public/exams');
  const jsonDir = path.join(__dirname, '../../public/jsonExams');

  // Create JSON directory if it doesn't exist
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  try {
    // Read all files in the markdown directory
    const files = await fs.promises.readdir(mdDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    // Convert each markdown file to JSON
    await Promise.all(mdFiles.map(async (file) => {
      const mdPath = path.join(mdDir, file);
      const jsonPath = path.join(jsonDir, file.replace('.md', '.json'));

      try {
        // Read markdown file content
        const data = await fs.promises.readFile(mdPath, 'utf8');
        // Parse markdown content to ExamData
        const examData = parseMarkdown(data);
        examData.sourceFile = file;

        // Write ExamData to JSON file
        await fs.promises.writeFile(jsonPath, JSON.stringify(examData, null, 2));
        console.log(`Converted ${file} successfully`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }));
  } catch (err) {
    console.error('Error reading exams directory:', err);
  }
};

// Only run if not in test environment
if (process.env.NODE_ENV !== 'test') {
  console.log('Starting conversion...');
  convertAllExams().catch(console.error);
}
