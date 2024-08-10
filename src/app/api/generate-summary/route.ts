import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function scrapeWebsite(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const text = $('body').clone().find('script, style').remove().end().text();
  return text.replace(/\s+/g, ' ').trim();
}

export async function POST(request: Request) {
  try {
    const { companyInfo, website } = await request.json();
    const websiteContent = await scrapeWebsite(website);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: "You are a helpful assistant that generates concise company summaries."},
        {role: "user", content: `Based on the following company information and website content, provide a 2-sentence summary of the company. Focus on their main product or service and their unique value proposition.

Company Info:
${companyInfo}

Website Content:
${websiteContent}

Summary:`}
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const summary = response.choices[0].message.content?.trim();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating company summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary', details: error }, { status: 500 });
  }
}