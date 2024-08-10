// src/app/api/generate-email/route.ts
import { NextResponse } from 'next/server';
import { generateEmail } from '../../../lib/openai';

export async function POST(request: Request) {
  try {
    const { companyInfo, websiteContent } = await request.json();
    const email = await generateEmail(companyInfo, websiteContent);
    return NextResponse.json({ email });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json({ error: 'Failed to generate email', details: error }, { status: 500 });
  }
}