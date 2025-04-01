import fs from 'fs';
import { parseMarkdown } from '../convertMdToJson';

// Mock fs.readFile
jest.mock('fs', () => ({
  readFile: jest.fn((path, options, callback) => {
    // For callback-style usage
    if (typeof options === 'function') {
      options(null, Buffer.from('# Test Exam\n1. Question?\n- A. Option 1\nCorrect answer: A'));
    } 
    // For promise-style or other usage
    else if (typeof callback === 'function') {
      callback(null, Buffer.from('# Test Exam\n1. Question?\n- A. Option 1\nCorrect answer: A'));
    }
  })
}));

describe('parseMarkdown', () => {
  it('should parse markdown content correctly', () => {
    const result = parseMarkdown('# Test Exam\n1. Question?\n- A. Option 1\nCorrect answer: A');
    expect(result.title).toBe('Test Exam');
    expect(result.questions).toHaveLength(1);
  });
});