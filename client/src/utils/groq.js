const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ── Cover Letter Generator ────────────────────────────────
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
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');
    return text;
  } catch (error) {
    console.error('Groq error:', error.message);
    throw new Error(error.message || 'Failed to generate cover letter');
  }
};

// ── Job Description Generator ─────────────────────────────
export const generateJobDescription = async ({
  jobTitle,
  company,
  location,
  jobType,
  experience,
  skills,
  salaryMin,
  salaryMax
}) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is missing from .env file');
  }

  const prompt = `Write a professional, detailed and ATS-friendly job description for the following position:

Job Title: ${jobTitle}
Company: ${company}
Location: ${location || 'Not specified'}
Job Type: ${jobType || 'Full Time'}
Experience Required: ${experience || 'Not specified'}
Required Skills: ${skills || 'Not specified'}
${salaryMin ? `Salary Range: ₹${salaryMin} - ₹${salaryMax} per month` : ''}

Write a complete job description with these sections:
1. About the Role (2-3 lines overview)
2. Key Responsibilities (5-6 bullet points using • symbol)
3. Requirements (4-5 bullet points using • symbol)
4. What We Offer (3-4 bullet points using • symbol)

Instructions:
- Make it professional and engaging
- Use action verbs for responsibilities
- Be specific about technical requirements
- Make it ATS friendly with relevant keywords
- Keep total length between 250-350 words
- Do NOT use markdown headers with # symbols
- Use plain section names followed by colon`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');
    return text;
  } catch (error) {
    console.error('Groq error:', error.message);
    throw new Error(error.message || 'Failed to generate job description');
  }
};

// ── ATS Resume Builder ────────────────────────────────────
export const buildATSResume = async ({
  resumeText,
  atsScore,
  improvements,
  suggestedSkills,
  keywordsMissing,
  jobTitle
}) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is missing from .env file');
  }

  const prompt = `You are an expert resume writer. Based on the existing resume and ATS analysis feedback below, create a completely new ATS-optimized resume.

EXISTING RESUME TEXT:
${resumeText}

ATS ANALYSIS FEEDBACK:
- Current ATS Score: ${atsScore}/100
- Missing Keywords: ${keywordsMissing?.join(', ') || 'None'}
- Suggested Skills to Add: ${suggestedSkills?.join(', ') || 'None'}
- Improvements Needed: ${improvements?.map(i => i.suggestion).join('. ') || 'None'}
${jobTitle ? `- Target Job Title: ${jobTitle}` : ''}

Create a NEW ATS-optimized resume. Respond ONLY with valid JSON, no markdown, no extra text:

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+91 9876543210",
  "location": "City, State",
  "linkedin": "linkedin.com/in/username",
  "github": "github.com/username",
  "summary": "2-3 line professional summary with keywords",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2022 - Present",
      "location": "City, State",
      "points": [
        "Achievement with quantifiable result (40% improvement)",
        "Another achievement with metrics",
        "Third achievement"
      ]
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "University Name",
      "year": "2020 - 2024",
      "gpa": "8.5/10"
    }
  ],
  "skills": {
    "technical": ["React", "Node.js", "MongoDB"],
    "tools": ["Git", "Docker", "VS Code"],
    "soft": ["Leadership", "Communication", "Problem Solving"]
  },
  "projects": [
    {
      "name": "Project Name",
      "tech": "React, Node.js",
      "points": ["What you built", "Impact it had"]
    }
  ],
  "certifications": ["AWS Certified Developer"],
  "languages": ["English (Fluent)", "Tamil (Native)"],
  "atsScore": 92
}

IMPORTANT RULES:
- Use ALL missing keywords naturally in the content
- Add quantifiable achievements with numbers and percentages
- Make professional summary keyword rich for ATS
- Add all suggested skills that are relevant
- Keep ALL real data from original resume
- Enhance and improve existing content significantly
- Return ONLY the JSON object, nothing else`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');

    // Clean and parse JSON safely
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Groq error:', error.message);
    throw new Error(error.message || 'Failed to build resume');
  }
};