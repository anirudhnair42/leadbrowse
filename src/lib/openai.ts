import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmail(companyInfo: string, websiteContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: "You are a helpful assistant that generates personalized emails."},
        {role: "user", content: `Using the following information about a company and the content from their website, write a personalized email to convince them to work with a broker. Make it sound natural and not too salesy.

Company Info:
${companyInfo}

Website Content:
${websiteContent}

Email:`}
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email:', error);
    throw error;
  }
}