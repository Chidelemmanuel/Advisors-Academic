import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Institution & Course Selection Advisory Endpoint
app.post('/api/institution-advisory', async (req, res) => {
  try {
    const { studentProfile, selectedInstitution, selectedFaculty, selectedCourse, userQuery } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        source: 'heuristic_advisory',
        advice: `Based on your entrance exam score (${studentProfile?.entranceExamScore || 265}/400) and interest in ${studentProfile?.primaryInterest || 'Technology'}:
1. **Institution Alignment**: ${selectedInstitution?.name || 'Selected Higher Institution'} is renowned for high academic standards, strong faculty credentials, and national accreditation.
2. **Faculty & Course Fit**: The ${selectedFaculty?.name || 'chosen faculty'} providing ${selectedCourse?.name || 'the degree program'} matches current industry demand with strong graduate placement.
3. **Admission Preparedness**: Make sure your High School / O-Level credits in ${selectedCourse?.requiredSubjects?.join(', ') || 'Mathematics, English, and Sciences'} are verified before the post-UTME screening window closes.`,
        recommendationRating: 'High Suitability',
        keyActionSteps: [
          'Verify your O-Level / High School credit combinations on the institution admission portal.',
          'Prepare your official transcript and score slips for the upcoming departmental screening.',
          'Review the Year 1 curriculum outline to get a head start on core courses.',
        ],
      });
    }

    const systemInstruction = `You are a university admissions director and career counselor specializing in higher education institution selection, faculties, and undergraduate degree programs.
Provide concise, authoritative guidance to help students decide whether a chosen higher institution, faculty, and course is right for them based on their entrance scores, high school subjects, and career goals.
Always respond in clean JSON with the schema:
{
  "advice": "Formatted 2-3 paragraph academic guidance explaining why this institution, faculty, and course is or isn't a strong fit",
  "recommendationRating": "Strong Match | Highly Recommended | Competitive Challenge | Alternative Suggested",
  "keyActionSteps": ["step 1", "step 2", "step 3"],
  "careerOutlook": "Summary of graduate industry demand and career opportunities"
}`;

    const prompt = `Student Assessment Request:
- Student Name: ${studentProfile?.studentName || 'Student'}
- Entrance Exam Score: ${studentProfile?.entranceExamScore || 265} (Scale: 400)
- High School GPA: ${studentProfile?.gpa || 3.7}
- High School Subjects Passed: ${JSON.stringify(studentProfile?.highSchoolSubjects || [])}
- Primary Field of Interest: ${studentProfile?.primaryInterest || 'Computer & Engineering Sciences'}
- Target Career Aspiration: ${studentProfile?.targetCareer || 'Software Systems Architect'}

Selected Higher Institution:
- Name: ${selectedInstitution?.name || 'Not yet chosen'} (${selectedInstitution?.type || ''})
- Location: ${selectedInstitution?.location?.city || ''}, ${selectedInstitution?.location?.stateCountry || ''}
- National Ranking: #${selectedInstitution?.nationalRanking || 'N/A'}
- Annual Tuition: ${selectedInstitution?.annualTuitionEstimate || 'Standard'}

Selected Faculty:
- Name: ${selectedFaculty?.name || 'Not yet chosen'}
- Dean: ${selectedFaculty?.deanName || ''}

Selected Degree Program / Course:
- Course Code & Name: ${selectedCourse?.code || ''} ${selectedCourse?.name || ''}
- Degree Awarded: ${selectedCourse?.degreeAwarded || ''} (${selectedCourse?.durationYears || 4} Years)
- Departmental Cut-Off Mark: ${selectedCourse?.cutOffScore || 'N/A'}
- Required Subjects: ${JSON.stringify(selectedCourse?.requiredSubjects || [])}
- Employability Rate: ${selectedCourse?.employabilityRate || 95}%

Student Question / Inquiry:
"${userQuery || 'Is this institution and course combination the best path for my academic background and career goals?'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        advice: text,
        recommendationRating: 'Recommended',
        keyActionSteps: ['Check admission requirements', 'Register before deadline'],
      };
    }

    return res.json({
      source: 'gemini_ai',
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error in institution advisory:', error);
    res.status(500).json({ error: 'Failed to generate advisory', message: error?.message });
  }
});

// AI Academic Advising & Recommendation Rationale Endpoint
app.post('/api/advising', async (req, res) => {
  try {
    const { profile, completedCourses, semesterPlan, candidateCourses, userQuery } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Return structured fallback response if no API key is configured
      return res.json({
        source: 'heuristic_engine',
        advice: `Based on your profile as a ${profile?.standing || 'Undergraduate'} in ${profile?.major || 'Computer Science'} pursuing the ${profile?.track || 'General'} track:
1. **Workload Feasibility**: You currently have ${semesterPlan?.length || 0} courses planned (${(semesterPlan || []).reduce((acc: number, c: any) => acc + (c.credits || 0), 0)} credits). Ensure your balance between rigorous algorithmic work and elective projects doesn't exceed ${profile?.maxWeeklyHours || 25} hours/week.
2. **Prerequisite Check**: Your completed coursework provides a strong foundation. Prioritize fulfilling any core requirements before taking high-level 400-level electives.
3. **Career Alignment**: For ${profile?.track || 'your career goals'}, consider pairing a core systems or theoretical course with a practical project-based elective to showcase in portfolio reviews.`,
        recommendedCodes: (candidateCourses || []).slice(0, 3).map((c: any) => c.code),
        riskWarnings: semesterPlan && semesterPlan.length > 4 ? ['High course load: Enrolling in >4 heavy technical courses in a single semester increases burnout risk.'] : [],
        pacingAssessment: 'On track for normal 4-year graduation timeline.',
      });
    }

    const systemInstruction = `You are a university chief academic advisor specializing in undergraduate course selection, curriculum planning, degree prerequisites, and student wellness.
Your goal is to provide concise, authoritative, constructive course recommendations and semester workload reviews.
Always output clean JSON with the following schema:
{
  "advice": "Clear, formatted 2-3 paragraph academic guidance directly addressing the student's situation and questions",
  "recommendedCodes": ["COURSE_CODE_1", "COURSE_CODE_2"],
  "riskWarnings": ["warning about conflicting exams, heavy proof workload, or excessive credit load"],
  "pacingAssessment": "Evaluation of graduation timeline progress",
  "suggestedAlternatives": ["COURSE_CODE_3"]
}`;

    const prompt = `Student Profile:
- Name: ${profile?.name || 'Undergraduate Student'}
- Major: ${profile?.major || 'Computer Science'}
- Standing: ${profile?.standing || 'Junior'}
- Current GPA: ${profile?.gpa || '3.6'}
- Target Career Track: ${profile?.track || 'Artificial Intelligence'}
- Target Credits: ${profile?.targetCredits || 15}
- Max Preferred Study Hours/Week: ${profile?.maxWeeklyHours || 25}
- Preferred Modality / Style: ${profile?.preferredModality || 'Balanced (Exams + Projects)'}

Completed Courses with Grades:
${JSON.stringify(completedCourses || [], null, 2)}

Currently Planned Semester Courses:
${JSON.stringify((semesterPlan || []).map((c: any) => ({ code: c.code, name: c.name, credits: c.credits, workloadHours: c.workloadHours, difficulty: c.difficulty })), null, 2)}

Available Candidate Courses to consider:
${JSON.stringify((candidateCourses || []).map((c: any) => ({ code: c.code, name: c.name, credits: c.credits, prereqs: c.prerequisites, track: c.track, workload: c.workloadHours })), null, 2)}

Student Question / Goal:
"${userQuery || 'Please review my current semester course selection, check my prerequisite readiness and workload, and suggest optimal electives for my career track.'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        advice: text,
        recommendedCodes: [],
        riskWarnings: [],
        pacingAssessment: 'On track',
      };
    }

    return res.json({
      source: 'gemini_ai',
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error during AI advising generation:', error);
    res.status(500).json({
      error: 'Failed to generate academic advising',
      message: error?.message || 'Internal server error',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Course Recommendation Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
