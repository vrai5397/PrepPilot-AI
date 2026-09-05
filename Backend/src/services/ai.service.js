const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


// ============================================================
// INTERVIEW REPORT SCHEMA
// ============================================================

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .describe(
            "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        ),

    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The technical question that can be asked in the interview"),

                intention: z
                    .string()
                    .describe("The intention of the interviewer behind asking this question"),

                answer: z
                    .string()
                    .describe(
                        "How to answer this question, what points to cover, what approach to take, etc."
                    )
            })
        )
        .describe(
            "Technical questions that can be asked in the interview along with their intention and how to answer them"
        ),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The behavioral question that can be asked in the interview"),

                intention: z
                    .string()
                    .describe("The intention of the interviewer behind asking this question"),

                answer: z
                    .string()
                    .describe(
                        "How to answer this question, what points to cover, what approach to take, etc."
                    )
            })
        )
        .describe(
            "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
        ),

    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe("The skill which the candidate is lacking"),

                severity: z
                    .enum(["low", "medium", "high"])
                    .describe(
                        "The severity of this skill gap and how important it is for the job"
                    )
            })
        )
        .describe(
            "List of skill gaps in the candidate's profile along with their severity"
        ),

    preparationPlan: z
        .array(
            z.object({
                day: z
                    .number()
                    .describe(
                        "The day number in the preparation plan, starting from 1"
                    ),

                focus: z
                    .string()
                    .describe(
                        "The main focus of this day in the preparation plan"
                    ),

                tasks: z
                    .array(z.string())
                    .describe(
                        "List of tasks to be completed on this day"
                    )
            })
        )
        .describe(
            "A day-wise preparation plan for the candidate"
        ),

    jobTitle: z
        .string()
        .describe(
            "The title of the job for which the interview report is generated"
        )
});


// ============================================================
// GENERATE INTERVIEW REPORT
// ============================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const response = await ai.models.generateContent({
            // CHANGED: gemini-3.5-flash
            model: "gemini-3.5-flash-lite",

            contents: `
Generate a personalized interview preparation report based on the candidate's
resume, self-description, and target job description.

Return ONLY valid JSON in exactly this structure:

{
  "jobTitle": "Junior Full Stack Developer",
  "matchScore": 88,

  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "skillGaps": [
    {
      "skill": "string",
      "severity": "low"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["string"]
    }
  ]
}

RULES:

- Generate exactly 10 technicalQuestions objects.
- Generate exactly 10 behavioralQuestions objects.
- Generate exactly 7 preparationPlan objects.
- skillGaps must contain objects, NOT strings.
- Every skillGaps object must contain:
  "skill"
  "severity"

- severity must be exactly one of:
  "low"
  "medium"
  "high"

- jobTitle is required.
- Extract the job title from the job description.
- matchScore must be a number between 0 and 100.
- Do not add extra fields.
- Do not omit required fields.
- Every question must have question, intention and answer.
- Questions must be relevant to the target job.
- Answers should be practical and useful for interview preparation.
- Skill gaps must be based on the candidate profile versus the job description.
- Preparation plan must be realistic and tailored to the candidate.
- Do not invent candidate experience that is not present in the provided information.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}
`,

            config: {
                responseMimeType: "application/json",

                responseJsonSchema: {
                    type: "object",

                    properties: {
                        jobTitle: {
                            type: "string"
                        },

                        matchScore: {
                            type: "number"
                        },

                        technicalQuestions: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    question: {
                                        type: "string"
                                    },

                                    intention: {
                                        type: "string"
                                    },

                                    answer: {
                                        type: "string"
                                    }
                                },

                                required: [
                                    "question",
                                    "intention",
                                    "answer"
                                ]
                            }
                        },

                        behavioralQuestions: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    question: {
                                        type: "string"
                                    },

                                    intention: {
                                        type: "string"
                                    },

                                    answer: {
                                        type: "string"
                                    }
                                },

                                required: [
                                    "question",
                                    "intention",
                                    "answer"
                                ]
                            }
                        },

                        skillGaps: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    skill: {
                                        type: "string"
                                    },

                                    severity: {
                                        type: "string",

                                        enum: [
                                            "low",
                                            "medium",
                                            "high"
                                        ]
                                    }
                                },

                                required: [
                                    "skill",
                                    "severity"
                                ]
                            }
                        },

                        preparationPlan: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    day: {
                                        type: "number"
                                    },

                                    focus: {
                                        type: "string"
                                    },

                                    tasks: {
                                        type: "array",

                                        items: {
                                            type: "string"
                                        }
                                    }
                                },

                                required: [
                                    "day",
                                    "focus",
                                    "tasks"
                                ]
                            }
                        }
                    },

                    required: [
                        "jobTitle",
                        "matchScore",
                        "technicalQuestions",
                        "behavioralQuestions",
                        "skillGaps",
                        "preparationPlan"
                    ]
                }
            }
        });

        // Safely parse AI response
        let data;

        try {
            data = JSON.parse(response.text);
        } catch (parseError) {
            console.error("AI JSON PARSE ERROR:", parseError);
            console.error("RAW AI RESPONSE:", response.text);

            throw new Error(
                "AI returned an invalid JSON response"
            );
        }

        // Validate response using Zod
        const result = interviewReportSchema.safeParse(data);

        if (!result.success) {
            console.error(
                "ZOD VALIDATION ERROR:",
                result.error
            );

            console.error(
                "AI RESPONSE:",
                response.text
            );

            throw new Error(
                "AI generated an invalid interview report"
            );
        }

        return result.data;

    } catch (error) {
        console.error(
            "generateInterviewReport error:",
            error
        );

        throw error;
    }
}


// ============================================================
// GENERATE PDF FROM HTML
// ============================================================

async function generatePdfFromHtml(htmlContent) {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        });

        const page = await browser.newPage();

        await page.setContent(
            htmlContent,
            {
                waitUntil: "networkidle0"
            }
        );

        const pdfBuffer = await page.pdf({
            format: "A4",

            printBackground: true,

            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}


// ============================================================
// GENERATE RESUME PDF
// ============================================================

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    const resumePdfSchema = z.object({
        html: z
            .string()
            .describe(
                "The complete HTML content of the resume which can be converted to PDF using Puppeteer"
            )
    });


    // ========================================================
    // RESUME HTML TEMPLATE
    // ========================================================

    const htmlTemplate = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

* {
    box-sizing: border-box;
}

body {
    font-family: 'Calibri', 'Arial', sans-serif;
    color: #1a1a1a;
    font-size: 11pt;
    line-height: 1.4;
    margin: 0;
    padding: 0;
}

.header {
    text-align: center;
    margin-bottom: 10px;
}

.header h1 {
    margin: 0 0 4px 0;
    font-size: 20pt;
    letter-spacing: 1px;
    color: #1a1a1a;
}

.header .contact-line {
    font-size: 9.5pt;
    color: #333;
}

.header .contact-line a {
    color: #1a4d8f;
    text-decoration: none;
}

h2.section-title {
    font-size: 12pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1a1a1a;
    border-bottom: 1.5px solid #1a1a1a;
    padding-bottom: 2px;
    margin: 14px 0 6px 0;
}

.entry-title-row {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 11pt;
}

.entry-subtitle-row {
    display: flex;
    justify-content: space-between;
    font-style: italic;
    font-size: 10pt;
    color: #333;
    margin-bottom: 3px;
}

ul {
    margin: 2px 0 8px 0;
    padding-left: 18px;
}

li {
    margin-bottom: 2px;
}

.skills-row {
    margin-bottom: 4px;
    font-size: 10.5pt;
}

.skills-row b {
    color: #1a1a1a;
}

.tech-line {
    font-size: 9.5pt;
    color: #444;
    font-style: italic;
}

</style>

</head>

<body>

<div class="header">

    <h1>[FULL NAME]</h1>

    <div class="contact-line">
        [Phone] | [Email] | [LinkedIn] | [GitHub] | [Location]
    </div>

</div>


<h2 class="section-title">
    Professional Summary
</h2>

<p>
    [2-3 sentence summary tailored to the target job]
</p>


<h2 class="section-title">
    Education
</h2>

<div class="entry-title-row">
    <span>[Institution Name]</span>
    <span>[Location]</span>
</div>

<div class="entry-subtitle-row">
    <span>[Degree, Branch]</span>
    <span>[CGPA/Percentage | Duration]</span>
</div>


<h2 class="section-title">
    Technical Skills
</h2>

<div class="skills-row">
    <b>Programming:</b> [languages]
</div>

<div class="skills-row">
    <b>Web Technologies:</b> [frameworks/libraries]
</div>

<div class="skills-row">
    <b>Databases:</b> [databases]
</div>

<div class="skills-row">
    <b>Cloud & Tools:</b> [tools]
</div>

<div class="skills-row">
    <b>Core CS:</b> [DSA, OOP, DBMS, OS, Networks, etc.]
</div>


<h2 class="section-title">
    Projects
</h2>

<div class="entry-title-row">
    <span>[Project Name]</span>
    <span>[Date/Context]</span>
</div>

<ul>

    <li>
        [Bullet describing what was built and the impact/metric]
    </li>

    <li>
        [Bullet describing a specific technical contribution]
    </li>

    <li>
        [Bullet describing a result, optimization, or outcome]
    </li>

</ul>

<div class="tech-line">
    Tech: [stack used]
</div>


<!-- Repeat project block for each project -->


<h2 class="section-title">
    Achievements
</h2>

<ul>

    <li>
        [Achievement bullet]
    </li>

</ul>


<h2 class="section-title">
    Certifications
</h2>

<ul>

    <li>
        [Certification name] — [Issuer] ([Date])
    </li>

</ul>


</body>

</html>
`;


    // ========================================================
    // RESUME PROMPT
    // ========================================================

    const prompt = `
You are an expert professional resume writer.

Generate a tailored resume in HTML for a candidate applying to a
specific job.

Use the candidate's resume, self-description and target job description.

Follow the exact HTML structure and CSS template provided below.

Do not change the CSS or overall structure unnecessarily.

Only replace the bracketed placeholder content with real information
from the candidate's provided information.

TEMPLATE:

${htmlTemplate}


CANDIDATE DATA:

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}


RULES:

- Use the same section order as the template:

Professional Summary
Education
Technical Skills
Projects
Achievements
Certifications

- If the candidate has relevant Work Experience, insert it after
  Education and before Projects.

- Keep the header as:
  Name
  Phone | Email | LinkedIn | GitHub | Location

- Tailor the Professional Summary to the target job.

- Tailor project descriptions to relevant job requirements.

- Use strong action verbs.

- Use quantified achievements only when supported by the candidate's
  provided information.

- NEVER invent fake experience.

- NEVER invent fake companies.

- NEVER invent fake projects.

- NEVER invent fake metrics.

- Keep the resume ATS-friendly.

- Do not use tables for layout.

- Do not use images.

- Do not use icons.

- Use standard HTML elements.

- Keep the resume within 1-2 A4 pages.

- Include only genuinely relevant projects.

- Most relevant projects should appear first.

- Make the content professional and natural.

- Do not make the resume sound AI-generated.

- Return ONLY a JSON object.

Required format:

{
    "html": "complete HTML document"
}

Do not use markdown code fences.
`;


    try {

        const response = await ai.models.generateContent({

            // CHANGED: gemini-3.5-flash
            model: "gemini-3.5-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema:
                    zodToJsonSchema(
                        resumePdfSchema,
                        {
                            target: "openApi3"
                        }
                    )
            }
        });


        // ====================================================
        // PARSE AI RESPONSE
        // ====================================================

        let jsonContent;

        try {

            jsonContent = JSON.parse(
                response.text
            );

        } catch (error) {

            console.error(
                "RESUME AI JSON PARSE ERROR:",
                error
            );

            console.error(
                "RAW AI RESPONSE:",
                response.text
            );

            throw new Error(
                "AI returned invalid resume data"
            );
        }


        // ====================================================
        // VALIDATE HTML
        // ====================================================

        if (
            !jsonContent.html ||
            typeof jsonContent.html !== "string"
        ) {

            throw new Error(
                "AI did not return valid HTML content for the resume"
            );
        }


        // ====================================================
        // GENERATE PDF
        // ====================================================

        const pdfBuffer =
            await generatePdfFromHtml(
                jsonContent.html
            );


        return pdfBuffer;

    } catch (error) {

        console.error(
            "generateResumePdf error:",
            error
        );

        throw error;
    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    generateInterviewReport,
    generateResumePdf
};