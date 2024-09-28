// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processCode } from '@/utils/codeProcessor';
import { processWithAI } from '@/utils/aiProcessor';

export async function POST(req: NextRequest) {
  try {
    const { userRequest } = await req.json();
    const code = await processCode();
    const aiResult = await processWithAI(code, userRequest);

    // Assuming processCode returns the list of scanned files
    const scannedFiles = code.split('\n\n').map(fileContent => fileContent.split('\n')[0].replace('File: ', ''));

    return NextResponse.json({ aiResult, scannedFiles }, { status: 200 });
  } catch (error) {
    console.error('Error during analysis:', error);
    return NextResponse.json({ error: 'An error occurred during analysis' }, { status: 500 });
  }
}