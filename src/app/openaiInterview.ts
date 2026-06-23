const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const apiUrl = import.meta.env.VITE_OPENAI_INTERVIEW_API_URL;

export type AiInterviewQuestion = {
  question: string;
  category: "Technical" | "HR" | "Scenario" | "Follow-up";
};

export type AiAnswerEvaluation = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
};

export type AiInterviewEvaluation = {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  overallScore: number;
  answerEvaluations: AiAnswerEvaluation[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  model?: string;
};

export type GenerateQuestionsRequest = {
  role: string;
  difficulty: string;
  type: string;
  skills: string;
  resume: string;
  previousQuestions: string[];
};

export type EvaluateInterviewRequest = GenerateQuestionsRequest & {
  questions: string[];
  answers: string[];
};

type ApiResponse<T> = {
  data?: T;
  error?: string;
  code?: string;
  openAiConfig?: {
    keyLength?: number;
    startsWithSk?: boolean;
    startsWithProjectKey?: boolean;
    startsWithServiceAccountKey?: boolean;
    startsWithValidPrefix?: boolean;
    hasWhitespace?: boolean;
    isPlaceholder?: boolean;
  };
};

async function requestOpenAiInterview<T>(
  action: "generateQuestions" | "evaluateInterview",
  payload: GenerateQuestionsRequest | EvaluateInterviewRequest
) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const body = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok || !body.data) {
    const configDetails = body.openAiConfig
      ? ` Config: keyLength=${body.openAiConfig.keyLength ?? 0}, startsWithSk=${Boolean(
          body.openAiConfig.startsWithSk
        )}, startsWithProjectKey=${Boolean(
          body.openAiConfig.startsWithProjectKey
        )}, startsWithServiceAccountKey=${Boolean(
          body.openAiConfig.startsWithServiceAccountKey
        )}, validPrefix=${Boolean(body.openAiConfig.startsWithValidPrefix)}.`
      : "";

    throw new Error(
      `${body.error || "OpenAI interview service is unavailable."}${configDetails}`
    );
  }

  return body.data;
}

export function generateOpenAiQuestions(payload: GenerateQuestionsRequest) {
  return requestOpenAiInterview<{ questions: AiInterviewQuestion[]; model?: string }>(
    "generateQuestions",
    payload
  );
}

export function evaluateOpenAiInterview(payload: EvaluateInterviewRequest) {
  return requestOpenAiInterview<AiInterviewEvaluation>(
    "evaluateInterview",
    payload
  );
}
