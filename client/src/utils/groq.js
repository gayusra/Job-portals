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
/* export const buildATSResume = async ({

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
}; */

// ── ATS Resume Builder ────────────────────────────────────
export const buildATSResume = async ({
  resumeText,
  atsScore,
  improvements,
  suggestedSkills,
  keywordsMissing,
  jobTitle
}) => {
  if (!GROQ_API_KEY) throw new Error('Groq API key is missing');

  const prompt = `You are a world-class professional resume writer with 15 years of experience. You specialize in writing ATS-optimized resumes that get candidates hired at top tech companies.

EXISTING RESUME CONTENT TO IMPROVE:
${resumeText}

ATS ANALYSIS:
- Current ATS Score: ${atsScore}/100
- Missing Keywords to ADD: ${keywordsMissing?.join(', ') || 'None'}
- Suggested Skills: ${suggestedSkills?.join(', ') || 'None'}
- Issues to Fix: ${improvements?.map(i => i.issue).join(', ') || 'None'}
${jobTitle ? `- Target Job: ${jobTitle}` : ''}

STRICT RULES YOU MUST FOLLOW:
1. PROJECTS: Write 3-4 detailed bullet points per project with:
   - Specific technologies used
   - Quantified impact (%, numbers, time saved)
   - Technical challenges solved
   - Business value delivered
   Example: "Built a real-time weather app using React.js and OpenWeatherMap API with Redux state management, achieving 95% uptime and 2-second load time for 500+ daily users"

2. EXPERIENCE: Each bullet point must have:
   - Strong action verb (Architected, Engineered, Optimized, Delivered)
   - Technical detail
   - Measurable result with specific numbers
   Example: "Architected RESTful APIs using Node.js and Express.js reducing response time by 45% serving 10,000+ daily requests"

3. SKILLS: Organize naturally into Technical/Tools/Soft Skills — do NOT randomly insert keywords

4. SUMMARY: Write 3 powerful sentences with job title, years of experience, key technologies and measurable achievements

5. KEYWORDS: Naturally embed ALL missing keywords throughout the content — never add them as standalone items

6. EDUCATION: Keep original education details exactly as provided

7. QUALITY STANDARD: Every bullet point must be interview-ready and impressive

Respond ONLY with valid JSON, no markdown, no extra text:

{
  "name": "Full Name from resume",
  "email": "email from resume or professional@email.com",
  "phone": "phone from resume",
  "location": "location from resume",
  "linkedin": "linkedin from resume",
  "github": "github from resume",
  "summary": "3 powerful sentences: [Job Title] with [X]+ years experience in [key tech]. Specialized in [specific skills with measurable impact]. Proven track record of [achievement with number].",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Month Year - Present",
      "location": "City, State",
      "points": [
        "Architected and deployed [specific feature] using [tech stack], resulting in [X]% improvement in [metric]",
        "Engineered [specific solution] with [technology], reducing [problem] by [X]% and saving [time/cost]",
        "Collaborated with [team size] cross-functional team to deliver [project] with [X]% increase in [business metric]",
        "Implemented [specific technical detail] using [tools], achieving [measurable outcome]"
      ]
    }
  ],
  "education": [
    {
      "degree": "exact degree from resume",
      "institution": "exact institution from resume",
      "year": "year from resume",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": ["list all technical skills including missing keywords naturally"],
    "tools": ["all tools and platforms"],
    "soft": ["Leadership", "Communication", "Problem Solving", "Agile", "CI/CD"]
  },
  "projects": [
    {
      "name": "Project Name from resume",
      "tech": "All technologies used",
      "points": [
        "Designed and developed [specific feature] using [exact tech stack] with [architecture pattern], handling [scale/users]",
        "Implemented [specific technical feature like auth/API/database] using [technology], achieving [performance metric]",
        "Integrated [third-party service or feature] resulting in [X]% improvement in [user metric or performance]",
        "Deployed on [platform] with [CI/CD tool], maintaining [X]% uptime and reducing deployment time by [X]%"
      ]
    }
  ],
  "certifications": [],
  "languages": ["English (Fluent)"],
  "atsScore": 92
}

IMPORTANT: Base ALL content on the actual resume provided. Do NOT invent companies or degrees. DO enhance project descriptions significantly with technical depth and metrics.`;

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
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');

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