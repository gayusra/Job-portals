const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateCoverLetter = async ({
  jobTitle,
  company,
  skills,
  experience,
  description
}) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is missing from .env file');
  }

  const prompt = `Write a professional job application cover letter for the following job:

Job Title: ${jobTitle}
Company: ${company}
Required Skills: ${skills?.join(', ') || 'Not specified'}
Experience Required: ${experience || 'Not specified'}
Job Description: ${description?.slice(0, 300) || 'Not specified'}

Instructions:
- Write in first person
- Keep it to 3 short paragraphs
- First paragraph: express interest in the role
- Second paragraph: highlight relevant skills
- Third paragraph: closing statement
- Keep it professional and concise
- Start directly with "Dear Hiring Manager,"`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');

    return text;
  } catch (error) {
    console.error('Groq error:', error.message);
    throw new Error(error.message || 'Failed to generate cover letter');
  }
};