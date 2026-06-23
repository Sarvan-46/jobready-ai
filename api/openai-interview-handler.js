import {
  assertValidOpenAiApiKey,
  formatOpenAiServerError,
  getOpenAiConfigStatus,
} from "./openai-config.js";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value) {
  return Array.isArray(value)
    ? value.map((item) => asString(item)).filter(Boolean)
    : [];
}

function parseBody(body) {
  const source =
    typeof body === "string" ? JSON.parse(body) : body;
  const value = source ?? {};
  const action =
    value.action === "evaluateInterview"
      ? "evaluateInterview"
      : "generateQuestions";
  const base = {
    action,
    role: asString(value.role),
    difficulty: asString(value.difficulty),
    type: asString(value.type),
    skills: asString(value.skills),
    resume: asString(value.resume),
    previousQuestions: asStringArray(value.previousQuestions).slice(0, 150),
  };

  if (action === "evaluateInterview") {
    return {
      ...base,
      action,
      questions: asStringArray(value.questions).slice(0, 10),
      answers: asStringArray(value.answers).slice(0, 10),
    };
  }

  return { ...base, action };
}

function extractResponseText(responseBody) {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  const output = Array.isArray(responseBody.output) ? responseBody.output : [];
  return output
    .flatMap((item) => {
      const record = item;
      return Array.isArray(record.content) ? record.content : [];
    })
    .map((content) => {
      const record = content;
      return typeof record.text === "string" ? record.text : "";
    })
    .filter(Boolean)
    .join("\n");
}

function buildInput(systemPrompt, userPayload) {
  return [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: JSON.stringify(userPayload),
    },
  ];
}

async function callOpenAI(apiKey, systemPrompt, userPayload, schema) {
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: buildInput(systemPrompt, userPayload),
      temperature: 0.5,
      text: {
        format: {
          type: "json_schema",
          name: "jobready_interview_response",
          schema,
          strict: true,
        },
      },
    }),
  });
  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = responseBody.error;
    const message = asString(error?.message) || "OpenAI request failed.";
    const requestError = new Error(message);
    requestError.status = response.status;
    requestError.code = asString(error?.code) || "OPENAI_UPSTREAM_ERROR";
    requestError.diagnostics = getOpenAiConfigStatus(apiKey);
    throw requestError;
  }

  const text = extractResponseText(responseBody);

  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return {
    data: JSON.parse(text),
    model,
  };
}

const questionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "category"],
        properties: {
          question: { type: "string" },
          category: {
            type: "string",
            enum: ["Technical", "HR", "Scenario", "Follow-up"],
          },
        },
      },
    },
  },
};

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "communicationScore",
    "technicalScore",
    "confidenceScore",
    "problemSolvingScore",
    "overallScore",
    "answerEvaluations",
    "strengths",
    "weaknesses",
    "suggestions",
  ],
  properties: {
    communicationScore: { type: "number" },
    technicalScore: { type: "number" },
    confidenceScore: { type: "number" },
    problemSolvingScore: { type: "number" },
    overallScore: { type: "number" },
    answerEvaluations: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "question",
          "answer",
          "score",
          "feedback",
          "strengths",
          "weaknesses",
          "idealAnswer",
        ],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
          score: { type: "number" },
          feedback: { type: "string" },
          strengths: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
          weaknesses: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
          idealAnswer: { type: "string" },
        },
      },
    },
    strengths: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
    weaknesses: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
    suggestions: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
  },
};

export default async function handler(req, res) {
  res.setHeader?.("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const apiKey = assertValidOpenAiApiKey();
    const body = parseBody(req.body);

    if (body.action === "generateQuestions") {
      const result = await callOpenAI(
        apiKey,
        [
          "You are an expert technical and HR interviewer for JobReady AI.",
          "Generate exactly 10 unique interview questions tailored to the candidate context.",
          "Do not repeat or closely paraphrase any previousQuestions.",
          "Include a balanced mix of Technical, HR, Scenario, and Follow-up questions.",
          "Use the role, difficulty, interview type, skills, and resume highlights.",
          "Return only valid JSON matching the schema.",
        ].join(" "),
        body,
        questionSchema
      );

      res.status(200).json({
        data: {
          ...result.data,
          model: result.model,
        },
      });
      return;
    }

    const result = await callOpenAI(
      apiKey,
      [
        "You are an expert mock interview evaluator for JobReady AI.",
        "Evaluate each submitted answer against its question, role, difficulty, interview type, skills, and resume context.",
        "For every answer, give a 0-100 score, concise feedback, three strengths, three weaknesses, and an ideal answer.",
        "Treat blank answers as 0 and provide coaching-oriented feedback.",
        "Return aggregate communication, technical, confidence, problem-solving, and overall scores.",
        "Return only valid JSON matching the schema.",
      ].join(" "),
      body,
      evaluationSchema
    );

    res.status(200).json({
      data: {
        ...result.data,
        model: result.model,
      },
    });
  } catch (error) {
    const formatted = formatOpenAiServerError(error);
    res.status(formatted.status).json(formatted.body);
  }
}
