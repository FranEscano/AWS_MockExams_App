#!/usr/bin/env ts-node
import fs from 'fs/promises';
import path from 'path';
import { parseMarkdown } from '../src/utils/convertMdToJson';

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/exams');
const OUTPUT_DIR = path.join(__dirname, '../public/jsonExams');

async function convertAllExams(): Promise<void> {
  try {
    console.log('Starting exam conversion...');
    
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get all markdown files
    const files = await fs.readdir(INPUT_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.warn('No markdown files found in', INPUT_DIR);
      return;
    }

    // Process each file
    const results = await Promise.allSettled(
      mdFiles.map(async (file) => {
        const mdPath = path.join(INPUT_DIR, file);
        const jsonPath = path.join(OUTPUT_DIR, file.replace('.md', '.json'));
        
        try {
          const data = await fs.readFile(mdPath, 'utf8');
          const examData = parseMarkdown(data);
          examData.sourceFile = file;
          
          await fs.writeFile(jsonPath, JSON.stringify(examData, null, 2));
          return { file, status: 'success' };
        } catch (error) {
          return { file, status: 'error', error };
        }
      })
    );

    // Report results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success');
    const failed = results.filter(r => 
      r.status === 'rejected' || 
      (r.status === 'fulfilled' && r.value.status === 'error')
    );

    console.log(`\nConversion complete:`);
    console.log(`✅ ${successful.length} files converted successfully`);
    
    if (failed.length > 0) {
      console.log(`❌ ${failed.length} files failed:`);
      failed.forEach((result) => {
        const file = result.status === 'fulfilled' ? result.value.file : 'unknown';
        const error = result.status === 'fulfilled' ? result.value.error : result.reason;
        console.log(`  - ${file}:`, error instanceof Error ? error.message : error);
      });
    }

  } catch (error) {
    console.error('Fatal error during conversion:', error);
    process.exit(1);
  }
}

// Run the conversion
convertAllExams()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));