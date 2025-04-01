import fs from 'fs';
import path from 'path';

// Definición estricta de tipos
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

type ExamData = {
  title: string;
  questions: Question[];
  sourceFile?: string;
  createdAt?: string;
};

// Tipo explícito para currentQuestion
type CurrentQuestion = {
  text: string;
  options: QuestionOption[];
};

export const parseMarkdown = (markdown: string): ExamData => {
  const lines = markdown.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extraer título
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '').trim() || 'Untitled Exam';

  const questions: Question[] = [];
  let currentQuestion: CurrentQuestion | null = null;
  let correctAnswers: string[] = [];

  for (const line of lines) {
    // Detectar nueva pregunta
    if (/^\d+\./.test(line)) {
      // Guardar pregunta anterior si existe
      if (currentQuestion?.options?.length) {
        questions.push({
          id: questions.length,
          text: currentQuestion.text,
          options: currentQuestion.options,
          type: correctAnswers.length > 1 ? 'multiple' : 'single'
        });
      }

      // Iniciar nueva pregunta
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, ''),
        options: []
      };
      correctAnswers = [];
      continue;
    }

    // Detectar opciones
    if (line.startsWith('- ') && currentQuestion) {
      const optionText = line.substring(2).trim();
      const letterMatch = optionText.match(/^([A-E])\./);
      
      currentQuestion.options.push({
        text: optionText,
        correct: false
      });
      continue;
    }

    // Detectar respuestas correctas
    if (line.startsWith('Correct answer: ') && currentQuestion) {
      correctAnswers = line.split(': ')[1].split(/,\s*/).map(a => a.trim());
      
      // Marcar opciones correctas
      currentQuestion.options.forEach(opt => {
        const letterMatch = opt.text.match(/^([A-E])\./);
        if (letterMatch && correctAnswers.includes(letterMatch[1])) {
          opt.correct = true;
        }
      });
      continue;
    }

    // Detectar explicaciones
    if (line.startsWith('Explanation: ') && questions.length > 0) {
      questions[questions.length - 1].explanation = line.split('Explanation: ')[1];
    }
  }

  // Añadir la última pregunta si existe
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

const convertAllExams = async (): Promise<void> => {
  const mdDir = path.join(__dirname, '../../public/exams');
  const jsonDir = path.join(__dirname, '../../public/jsonExams');

  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  try {
    const files = await fs.promises.readdir(mdDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    await Promise.all(mdFiles.map(async (file) => {
      const mdPath = path.join(mdDir, file);
      const jsonPath = path.join(jsonDir, file.replace('.md', '.json'));

      try {
        const data = await fs.promises.readFile(mdPath, 'utf8');
        const examData = parseMarkdown(data);
        examData.sourceFile = file;
        
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