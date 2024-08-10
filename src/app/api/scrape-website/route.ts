import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract text from the body, removing script and style elements
    const text = $('body').clone().find('script, style').remove().end().text();
    
    // Clean up the text (remove extra whitespace, etc.)
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    
    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json({ error: 'Failed to scrape website' }, { status: 500 });
  }
}