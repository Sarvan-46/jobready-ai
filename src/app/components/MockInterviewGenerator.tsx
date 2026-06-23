import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Mic,
  MicOff,
  MessageSquareText,
  Radio,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import {
  evaluateOpenAiInterview,
  generateOpenAiQuestions,
  type AiInterviewEvaluation,
} from "../openaiInterview";
import { saveMockInterview, useMockInterviews } from "../userData";

const roles = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
  "Node.js Developer",
] as const;

const difficulties = ["Easy", "Medium", "Hard"] as const;
const interviewTypes = ["Technical", "HR", "Mixed"] as const;

type Role = (typeof roles)[number];
type Difficulty = (typeof difficulties)[number];
type InterviewType = (typeof interviewTypes)[number];
type AnswerMode = "text" | "voice";
type MicrophonePermissionStatus =
  | "unsupported"
  | "unknown"
  | "prompt"
  | "granted"
  | "denied";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: SpeechRecognitionResultItem;
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  error?: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type VoiceMetric = {
  questionIndex: number;
  transcript: string;
  answerLength: number;
  wordsSpoken: number;
  speakingDurationSeconds: number;
  updatedAt: string;
};

type Evaluation = {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  overallScore: number;
  answerEvaluations: AnswerEvaluation[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  model?: string;
  source?: "openai" | "local";
};

type AnswerEvaluation = {
  question: string;
  answer: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestedAnswer: string;
  feedback?: string;
};

type QuestionBank = Record<Role, Record<Difficulty, string[]>>;

const hrQuestionBank: Record<Difficulty, string[]> = {
  Easy: [
    "Tell me about yourself and why this role interests you.",
    "What are your top strengths for this position?",
    "What is one weakness you are actively improving?",
    "Describe a time you worked well with a teammate.",
    "How do you organize your work when deadlines are close?",
    "Why do you want to join a product-focused team?",
    "Tell me about a project you are proud of.",
    "How do you respond when you receive feedback?",
    "What motivates you to keep learning?",
    "How would a teammate describe your communication style?",
    "What kind of manager helps you do your best work?",
    "How do you handle a task that feels unfamiliar?",
  ],
  Medium: [
    "Tell me about a time you handled disagreement in a team.",
    "Describe a situation where you had to learn quickly to deliver work.",
    "How do you balance speed and quality during a project?",
    "Tell me about a time you showed ownership without being asked.",
    "Describe a difficult feedback conversation and what changed afterward.",
    "How do you explain technical work to a non-technical stakeholder?",
    "Tell me about a time your first approach did not work.",
    "How do you prioritize when several people need your help?",
    "Describe a time you improved a process for your team.",
    "What would you do in your first 30 days in this role?",
    "How do you stay confident when you do not know an answer immediately?",
    "Tell me about a time you had to earn trust on a team.",
  ],
  Hard: [
    "Tell me about a high-pressure situation where your decision affected the outcome.",
    "Describe a time you challenged a decision respectfully and what happened.",
    "How would you handle joining a team with unclear expectations and urgent deadlines?",
    "Tell me about a time you made a trade-off that disappointed one stakeholder.",
    "Describe a failure that changed how you work.",
    "How do you rebuild trust after missing a commitment?",
    "Tell me about a time you influenced people without authority.",
    "How would you handle a teammate who repeatedly blocks delivery?",
    "Describe how you would communicate risk to leadership before a launch.",
    "What would you do if your technical recommendation was rejected?",
    "Tell me about a time you had to defend quality when the team wanted to move faster.",
    "How do you keep improving when your performance has plateaued?",
  ],
};

const technicalQuestionBank: QuestionBank = {
  "Frontend Developer": {
    Easy: [
      "What is the difference between HTML, CSS, and JavaScript in a web page?",
      "How does the browser render a page after receiving HTML and CSS?",
      "What is semantic HTML, and why does it matter?",
      "Explain the difference between block, inline, and inline-block elements.",
      "How do you make a layout responsive for mobile and desktop screens?",
      "What is the box model in CSS?",
      "How would you fetch data from an API in a frontend application?",
      "What is the difference between localStorage and sessionStorage?",
      "How do you handle a button click in JavaScript?",
      "What are common causes of slow page load on the frontend?",
      "How do forms work in the browser?",
      "What is accessibility, and what are two things you check first?",
      "How would you debug a style that is not applying?",
      "What is the purpose of CSS flexbox?",
      "How do media queries help responsive design?",
    ],
    Medium: [
      "How would you structure reusable components for a dashboard UI?",
      "Explain controlled and uncontrolled form inputs.",
      "How do you prevent unnecessary re-renders in a frontend app?",
      "How would you handle loading, empty, and error states for API data?",
      "Describe how you would optimize images for a production website.",
      "How do you manage shared state across multiple components?",
      "What is event delegation, and when is it useful?",
      "How would you implement client-side filtering and pagination?",
      "Explain how CSS specificity can create maintenance issues.",
      "How do you test an interactive frontend component?",
      "What trade-offs exist between CSS grid and flexbox?",
      "How would you protect a frontend route that requires authentication?",
      "How do you handle API latency in the user interface?",
      "What are Core Web Vitals, and why do they matter?",
      "How would you design a component library for consistency?",
    ],
    Hard: [
      "Design a frontend architecture for a complex SaaS app with multiple teams contributing.",
      "How would you investigate and fix a production memory leak in a browser app?",
      "How would you reduce JavaScript bundle size without removing core functionality?",
      "Explain how you would implement optimistic updates with rollback on failure.",
      "How would you build an accessible custom combobox from scratch?",
      "Design a strategy for offline support and conflict resolution in a frontend app.",
      "How would you profile and fix layout shifts in a large application?",
      "Compare server-side rendering, static rendering, and client-side rendering for a job portal.",
      "How would you safely migrate a large CSS codebase to a design system?",
      "How would you handle real-time UI updates from several data sources?",
      "Describe a strategy for frontend observability and error monitoring.",
      "How would you isolate a flaky frontend test in CI?",
      "How would you prevent race conditions during rapid search input changes?",
      "Design a secure approach for storing and refreshing auth tokens in the browser.",
      "How would you create a performance budget and enforce it across releases?",
    ],
  },
  "React Developer": {
    Easy: [
      "What problem does React solve in frontend development?",
      "What is JSX?",
      "What are props in React?",
      "What is state in React?",
      "How does useState work?",
      "What is the purpose of useEffect?",
      "How do you render a list of items in React?",
      "Why do React lists need keys?",
      "What is conditional rendering?",
      "How do you pass data from a parent component to a child component?",
      "What is a controlled input in React?",
      "How do you handle a form submit in React?",
      "What is component composition?",
      "How do you add event handlers in React?",
      "What is the difference between state and props?",
    ],
    Medium: [
      "How would you split a large React page into maintainable components?",
      "Explain dependency arrays in useEffect.",
      "How do you avoid stale state in React updates?",
      "When would you use useMemo or useCallback?",
      "How would you manage server data versus UI state?",
      "How do you prevent prop drilling in a medium-sized app?",
      "What are error boundaries, and where would you use them?",
      "How would you implement reusable form validation?",
      "How do you handle loading and error states in a React query flow?",
      "Explain how React reconciliation uses keys.",
      "How would you test a component that calls an API?",
      "How do you design reusable hooks?",
      "What are common causes of React hydration issues?",
      "How would you migrate class components to hooks?",
      "How do you keep React components accessible?",
    ],
    Hard: [
      "Design a React architecture for a multi-step interview practice workflow.",
      "How would you diagnose excessive renders across a large React tree?",
      "How would you implement optimistic UI updates with React state and server sync?",
      "Explain how concurrent rendering can affect UI assumptions.",
      "How would you build a reusable data grid with sorting, filters, and virtualization?",
      "How do you design React state boundaries for a complex dashboard?",
      "How would you prevent race conditions when effects fetch data repeatedly?",
      "How would you introduce code splitting in an existing React app?",
      "Describe a strategy for testing hooks and components in a production React codebase.",
      "How would you handle a performance regression after adding context providers?",
      "How do you design a robust form system with dynamic fields?",
      "How would you handle feature flags in React without making components messy?",
      "What risks appear when storing derived state, and how do you avoid them?",
      "How would you debug a hydration mismatch in a server-rendered React page?",
      "How would you build a reusable modal system that remains accessible?",
    ],
  },
  "Backend Developer": {
    Easy: [
      "What is the role of a backend server in a web application?",
      "What is the difference between GET, POST, PUT, PATCH, and DELETE?",
      "What is a database index?",
      "What is authentication?",
      "What is authorization?",
      "How does a REST API usually structure resources?",
      "What is JSON, and why is it common in APIs?",
      "How do environment variables help backend apps?",
      "What is basic input validation?",
      "How would you log an error on the server?",
      "What is the difference between SQL and NoSQL databases?",
      "What is a status code, and what does 404 mean?",
      "How do you keep secrets out of source code?",
      "What is pagination in an API?",
      "What is a migration in database development?",
    ],
    Medium: [
      "How would you design an API endpoint for saving interview results?",
      "How do you validate and sanitize user input?",
      "How would you structure services and controllers in a backend app?",
      "What are transactions, and when do you need them?",
      "How would you handle rate limiting for an API?",
      "Explain how caching can improve backend performance.",
      "How do you handle background jobs?",
      "How would you design error responses for a public API?",
      "What is connection pooling?",
      "How do you approach database schema changes safely?",
      "How would you secure an endpoint that returns user-specific data?",
      "How do you monitor a backend service in production?",
      "What trade-offs exist between REST and GraphQL?",
      "How would you handle file uploads securely?",
      "How do you prevent duplicate writes in an API?",
    ],
    Hard: [
      "Design a scalable backend for an interview platform with spikes during campus hiring season.",
      "How would you investigate a production API latency incident?",
      "Design an idempotent payment or subscription endpoint.",
      "How would you shard or partition data for high-volume user activity?",
      "How do you design reliable retries without causing duplicate side effects?",
      "Explain how you would handle consistency between a database and a search index.",
      "How would you secure a multi-tenant backend system?",
      "Design an audit logging system for sensitive user actions.",
      "How would you migrate a large table with minimal downtime?",
      "Compare queue-based processing and synchronous processing for long-running work.",
      "How would you design graceful degradation when a dependency fails?",
      "How do you prevent cascading failures in a distributed backend?",
      "Design a strategy for API versioning across mobile and web clients.",
      "How would you detect and mitigate abuse of a public API?",
      "How would you design observability for tracing one request across services?",
    ],
  },
  "Node.js Developer": {
    Easy: [
      "What is Node.js?",
      "How is Node.js different from running JavaScript in the browser?",
      "What is npm used for?",
      "What is the event loop in simple terms?",
      "How do you create a basic HTTP server in Node.js?",
      "What is Express used for?",
      "What is middleware in Express?",
      "How do you read environment variables in Node.js?",
      "What is package.json?",
      "How do you handle errors in an Express route?",
      "What is async and await?",
      "How do you return JSON from an API endpoint?",
      "What is the difference between dependencies and devDependencies?",
      "How do you parse request bodies in Express?",
      "How do you connect Node.js to a database?",
    ],
    Medium: [
      "Explain how the Node.js event loop affects backend performance.",
      "How would you structure routes, controllers, and services in Express?",
      "How do you handle async errors consistently in Node.js?",
      "What are streams, and when would you use them?",
      "How would you implement JWT authentication in Node.js?",
      "How do you validate API input in an Express app?",
      "How would you add request logging and correlation IDs?",
      "How do worker threads differ from child processes?",
      "How would you prevent blocking the event loop?",
      "What is CORS, and how do you configure it safely?",
      "How do you manage database connections in a Node.js app?",
      "How would you test an Express API endpoint?",
      "How do you handle file uploads in Node.js?",
      "How would you implement rate limiting in Express?",
      "What are common security headers for a Node.js API?",
    ],
    Hard: [
      "Design a Node.js service that processes interview evaluations asynchronously.",
      "How would you diagnose event-loop lag in production?",
      "How would you scale a Node.js API across CPU cores and multiple machines?",
      "Design a robust retry strategy for external API calls in Node.js.",
      "How would you stream a large export without exhausting memory?",
      "How would you implement graceful shutdown for a Node.js service?",
      "How do you prevent memory leaks caused by listeners, caches, or closures?",
      "How would you design a plugin architecture in Node.js?",
      "How would you secure refresh token rotation in a Node.js backend?",
      "Compare queues, cron jobs, and event-driven processing in Node.js.",
      "How would you monitor heap usage and garbage collection behavior?",
      "How would you build a real-time notification system with Node.js?",
      "How would you handle backpressure when consuming a high-volume stream?",
      "How would you design integration tests that use real services safely?",
      "How would you debug a production-only race condition in a Node.js service?",
    ],
  },
  "Full Stack Developer": {
    Easy: [
      "What happens from clicking a button in the browser to saving data on the server?",
      "What is the difference between frontend and backend validation?",
      "How does a frontend call a backend API?",
      "What is a database record?",
      "How do you pass user input from a form to an API?",
      "What is authentication in a full stack app?",
      "What is the role of routing on the frontend and backend?",
      "How do you show loading states while data is being fetched?",
      "What is CORS?",
      "How do you store configuration for different environments?",
      "What is deployment?",
      "How would you debug a broken API call from the browser?",
      "What is the difference between client state and server data?",
      "How do you display validation errors to a user?",
      "What is a status code returned by a backend?",
    ],
    Medium: [
      "Design a full stack flow for creating and viewing mock interview results.",
      "How would you handle authentication across frontend routes and backend APIs?",
      "How do you keep frontend types aligned with backend responses?",
      "How would you implement pagination from database to UI?",
      "How do you manage optimistic UI updates with backend confirmation?",
      "What trade-offs exist between server-rendered and client-rendered full stack apps?",
      "How would you debug a bug that could be in the UI, API, or database?",
      "How do you handle schema migrations without breaking the frontend?",
      "How would you design reusable API clients on the frontend?",
      "How do you validate data on both sides without duplicating too much logic?",
      "How would you manage file uploads from UI to storage?",
      "How do you handle role-based access in a full stack app?",
      "How would you build a notification feature end to end?",
      "How do you monitor a full stack app after release?",
      "How would you protect an app from duplicate form submissions?",
    ],
    Hard: [
      "Design a full stack architecture for a placement preparation platform with analytics.",
      "How would you implement real-time interview progress updates across devices?",
      "How would you design end-to-end observability from browser action to database query?",
      "How would you migrate a full stack app from one auth provider to another?",
      "Design a secure multi-tenant data model and UI permission strategy.",
      "How would you implement offline drafts and server reconciliation?",
      "How would you prevent duplicated questions across generated interview sessions?",
      "How would you optimize slow dashboard analytics end to end?",
      "How do you coordinate breaking API changes with a deployed frontend?",
      "How would you design a scalable search feature across frontend and backend?",
      "How would you recover from a partial outage in an external AI provider?",
      "Design an experiment framework for testing new interview workflows.",
      "How would you enforce performance budgets across client and server?",
      "How would you handle sensitive resume data throughout the stack?",
      "How would you investigate a user report that saved answers disappeared?",
    ],
  },
  "Software Engineer": {
    Easy: [
      "What is an algorithm?",
      "What is a data structure?",
      "Explain the difference between an array and a linked list.",
      "What is time complexity?",
      "What is a function, and why do we use functions?",
      "What is debugging?",
      "How do you approach solving a new coding problem?",
      "What is version control?",
      "What does it mean to write clean code?",
      "What is a unit test?",
      "What is the difference between compile-time and runtime errors?",
      "How do you handle edge cases?",
      "What is a code review?",
      "What is an API?",
      "How do you document a technical decision?",
    ],
    Medium: [
      "How would you compare two algorithms for the same problem?",
      "Explain how you would design a simple URL shortener.",
      "How do you decide between readability and performance?",
      "What are common causes of bugs in asynchronous code?",
      "How would you test a function with many edge cases?",
      "Explain how hashing works at a high level.",
      "How would you refactor duplicated logic safely?",
      "What are trade-offs between relational and document databases?",
      "How would you handle errors in a service used by other teams?",
      "How do you reason about space complexity?",
      "What is the difference between vertical and horizontal scaling?",
      "How would you design a simple rate limiter?",
      "How do you break down a large technical task?",
      "What makes an API easy to maintain?",
      "How would you debug a feature that works locally but fails in production?",
    ],
    Hard: [
      "Design a distributed system for generating and evaluating mock interviews at scale.",
      "How would you identify a bottleneck in a system with frontend, API, and database layers?",
      "Compare consistency and availability trade-offs in a user-facing product.",
      "How would you design a fault-tolerant job processing system?",
      "Explain how you would handle data corruption discovered after a release.",
      "How would you design an API contract that supports future product changes?",
      "How would you approach a major refactor in a high-traffic codebase?",
      "Design a cache invalidation strategy for user analytics.",
      "How would you reason about concurrency issues in a shared resource?",
      "How do you balance technical debt with feature delivery under pressure?",
      "How would you design a system that remains useful when AI evaluation is unavailable?",
      "Describe a strategy for safely rolling out a risky backend change.",
      "How would you build reliability targets for a new service?",
      "How would you diagnose inconsistent results across environments?",
      "How would you lead the technical design for an ambiguous product request?",
    ],
  },
};

function shuffleQuestions(questions: string[]) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function uniqueQuestions(questions: string[]) {
  return Array.from(new Set(questions));
}

function getQuestionPool(
  role: Role,
  difficulty: Difficulty,
  type: InterviewType
) {
  const technicalQuestions = technicalQuestionBank[role][difficulty];
  const hrQuestions = hrQuestionBank[difficulty].map((question) =>
    question.replace("this role", `the ${role} role`)
  );

  if (type === "Technical") {
    return uniqueQuestions(technicalQuestions);
  }

  if (type === "HR") {
    return uniqueQuestions(hrQuestions);
  }

  return uniqueQuestions([...technicalQuestions, ...hrQuestions]);
}

function generateQuestionSet(
  role: Role,
  difficulty: Difficulty,
  type: InterviewType,
  previouslyAsked: string[]
) {
  const pool = getQuestionPool(role, difficulty, type);
  const usedQuestions = new Set(previouslyAsked);
  const unseenQuestions = shuffleQuestions(
    pool.filter((question) => !usedQuestions.has(question))
  );
  const reusableQuestions = shuffleQuestions(
    pool.filter((question) => usedQuestions.has(question))
  );
  const selected = uniqueQuestions([...unseenQuestions, ...reusableQuestions]).slice(
    0,
    10
  );

  return selected;
}

function createContextualFallbackQuestions(
  role: Role,
  difficulty: Difficulty,
  type: InterviewType,
  skills: string,
  resume: string,
  previouslyAsked: string[]
) {
  const skillList = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const primarySkill = skillList[0] ?? "your strongest technical skill";
  const secondarySkill = skillList[1] ?? "your project experience";
  const resumeContext = resume.trim()
    ? "one resume highlight"
    : "a recent project";
  const candidateQuestions = [
    `Explain how you would use ${primarySkill} to solve a practical problem as a ${role}.`,
    `What trade-offs would you consider when using ${secondarySkill} in a ${difficulty.toLowerCase()} ${role} interview scenario?`,
    `Tell me about ${resumeContext} that best proves you are ready for this ${role} role.`,
    `Describe a time you had to learn a tool quickly and apply it to a real project.`,
    `How would you debug a production issue related to ${primarySkill}?`,
    `Scenario: a teammate disagrees with your technical approach. How would you handle it?`,
    `Scenario: a deadline is close and quality is at risk. What would you do first?`,
    `Follow-up: what metric would you use to prove your solution worked?`,
    `Follow-up: what would you improve if you had another week on the project?`,
    `How would you explain a ${primarySkill} decision to a non-technical stakeholder?`,
    `What is the hardest technical decision you made in ${resumeContext}, and why?`,
    `How would you prioritize maintainability, performance, and delivery speed for this role?`,
  ];
  const typeFilteredQuestions =
    type === "Technical"
      ? candidateQuestions.filter((question) => !question.startsWith("Tell me"))
      : type === "HR"
      ? candidateQuestions.filter(
          (question) =>
            question.startsWith("Tell me") ||
            question.startsWith("Describe") ||
            question.startsWith("Scenario")
        )
      : candidateQuestions;
  const usedQuestions = new Set(previouslyAsked);

  return uniqueQuestions(typeFilteredQuestions).filter(
    (question) => !usedQuestions.has(question)
  );
}

function createNonRepeatingFillQuestions(
  role: Role,
  difficulty: Difficulty,
  skills: string,
  resume: string,
  previouslyAsked: string[],
  existingQuestions: string[]
) {
  const usedQuestions = new Set([...previouslyAsked, ...existingQuestions]);
  const primarySkill =
    skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)[0] ?? "your core technical skill";
  const resumePhrase = resume.trim()
    ? "your resume highlights"
    : "your most relevant project";
  const fillQuestions = [
    `Walk me through a recent ${role} decision involving ${primarySkill} that you would handle differently now.`,
    `How would you adapt ${resumePhrase} into a stronger ${difficulty.toLowerCase()} interview story?`,
    `What follow-up question would you expect after discussing ${primarySkill}, and how would you answer it?`,
    `Describe a realistic ${role} scenario where communication changed the technical outcome.`,
    `How would you validate a ${primarySkill} solution before sharing it with users?`,
    `What risk would you call out first when planning a ${difficulty.toLowerCase()} ${role} task?`,
    `How would you mentor a teammate through a problem similar to ${resumePhrase}?`,
    `Which trade-off from ${resumePhrase} best demonstrates your readiness for this role?`,
    `How would you recover if your first ${primarySkill} approach failed during an interview exercise?`,
    `What would you ask the interviewer to clarify before solving a ${role} scenario?`,
  ];

  return fillQuestions.filter((question) => !usedQuestions.has(question));
}

function createQuestionSetId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `qs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function inferQuestionCategory(question: string) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.startsWith("follow-up")) {
    return "Follow-up";
  }

  if (lowerQuestion.startsWith("scenario")) {
    return "Scenario";
  }

  if (
    /tell me|describe a time|feedback|manager|teammate|communication|motivates/.test(
      lowerQuestion
    )
  ) {
    return "HR";
  }

  return "Technical";
}

function readStoredQuestions(key: string) {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as unknown;

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function createSuggestedAnswer(question: string, role: Role, type: InterviewType) {
  if (type === "HR" || question.toLowerCase().includes("tell me about")) {
    return `A strong answer should briefly frame the situation, explain your specific action, and close with a measurable result. For this ${role} question, connect your experience to the role, mention collaboration or ownership, and end with what you learned.`;
  }

  return `A strong answer should define the concept, explain the approach you would take, discuss trade-offs, and include a concrete example from a project. For this ${role} question, mention constraints, implementation details, testing, and how you would measure success.`;
}

function evaluateSingleAnswer(
  question: string,
  answer: string,
  role: Role,
  type: InterviewType,
  difficulty: Difficulty
): AnswerEvaluation {
  const trimmedAnswer = answer.trim();
  const wordCount = trimmedAnswer
    ? trimmedAnswer.split(/\s+/).filter(Boolean).length
    : 0;
  const lowerAnswer = trimmedAnswer.toLowerCase();
  const hasExample = /\b(project|built|implemented|designed|worked|created|improved|led)\b/.test(
    lowerAnswer
  );
  const hasOutcome = /\b(result|reduced|increased|improved|saved|measured|impact|metric|because)\b/.test(
    lowerAnswer
  );
  const hasStructure = /\b(first|then|next|finally|because|therefore)\b/.test(
    lowerAnswer
  );
  const difficultyBonus = difficulty === "Hard" ? 4 : difficulty === "Medium" ? 2 : 0;
  const baseScore =
    wordCount === 0
      ? 0
      : 35 +
        Math.min(30, wordCount) +
        (hasExample ? 12 : 0) +
        (hasOutcome ? 10 : 0) +
        (hasStructure ? 7 : 0) +
        difficultyBonus;
  const score = clampScore(baseScore);

  return {
    question,
    answer,
    score,
    strengths: [
      wordCount >= 45
        ? "Provides enough detail for the interviewer to evaluate the answer."
        : "Starts with a concise response that can be expanded.",
      hasExample
        ? "Includes practical experience or implementation context."
        : "Keeps the answer focused on the question.",
      hasStructure
        ? "Uses a clear flow that is easy to follow."
        : "Can become stronger with a clearer beginning, middle, and close.",
    ],
    weaknesses: [
      wordCount < 35
        ? "The answer is too short for a complete interview response."
        : "The answer can be sharpened with more specific language.",
      hasOutcome
        ? "The result could still be quantified more clearly."
        : "Missing measurable outcome, business impact, or validation detail.",
      type === "HR"
        ? "Add more reflection on what you learned or changed afterward."
        : "Add more technical trade-offs, constraints, or testing details.",
    ],
    suggestedAnswer: createSuggestedAnswer(question, role, type),
  };
}

function evaluateAnswers(
  questions: string[],
  answers: string[],
  role: Role,
  type: InterviewType,
  difficulty: Difficulty
): Evaluation {
  const answerEvaluations = questions.map((question, index) =>
    evaluateSingleAnswer(question, answers[index] ?? "", role, type, difficulty)
  );
  const answeredCount = answers.filter((answer) => answer.trim().length > 0).length;
  const averageLength = answeredCount
    ? answers.reduce((total, answer) => total + answer.trim().length, 0) /
      answeredCount
    : 0;
  const averageAnswerScore = answerEvaluations.length
    ? Math.round(
        answerEvaluations.reduce((total, item) => total + item.score, 0) /
          answerEvaluations.length
      )
    : 0;
  const completeAnswerBonus = Math.round((answeredCount / 10) * 8);
  const depthScore = Math.min(10, Math.round(averageLength / 35));
  const baseScore = clampScore(averageAnswerScore + completeAnswerBonus + depthScore);

  const communicationScore = clampScore(
    baseScore + (answers.some((answer) => answer.includes(".")) ? 4 : -4)
  );
  const technicalScore =
    type === "HR"
      ? clampScore(baseScore - 8)
      : clampScore(baseScore + (type === "Technical" ? 5 : 2));
  const confidenceScore = clampScore(baseScore + (answeredCount === 10 ? 4 : -6));
  const problemSolvingScore = clampScore(baseScore + (averageLength > 280 ? 5 : -2));
  const overallScore = Math.round(
    (communicationScore + technicalScore + confidenceScore + problemSolvingScore) /
      4
  );

  return {
    communicationScore,
    technicalScore,
    confidenceScore,
    problemSolvingScore,
    overallScore,
    source: "local",
    answerEvaluations,
    strengths: [
      answeredCount >= 8
        ? "Consistent coverage across the interview."
        : "Good start on completing the core questions.",
      averageLength >= 180
        ? "Answers include useful detail and context."
        : "Responses are concise and easy to scan.",
      type === "HR"
        ? "Good focus on self-awareness and collaboration."
        : "Good alignment with role-specific interview topics.",
    ],
    weaknesses: [
      answeredCount < 10
        ? "Some questions still need answers before a real interview."
        : "A few answers can be tightened with clearer outcomes.",
      averageLength < 160
        ? "Several answers would benefit from examples, metrics, or trade-offs."
        : "Some answers may be too broad without a crisp closing point.",
      "Confidence signals can improve by using a clearer situation-action-result structure.",
    ],
    suggestions: [
      "Use the STAR format for behavioral answers.",
      "Add measurable results, constraints, and decisions to technical answers.",
      "Practice speaking each response aloud within two minutes.",
    ],
  };
}

function normalizeScore(score: number) {
  return clampScore(Number.isFinite(score) ? score : 0);
}

function normalizeTextList(items: string[] | undefined, fallback: string) {
  const cleanItems = Array.isArray(items)
    ? items.map((item) => item.trim()).filter(Boolean)
    : [];

  return cleanItems.length ? cleanItems : [fallback];
}

function fromOpenAiEvaluation(result: AiInterviewEvaluation): Evaluation {
  return {
    communicationScore: normalizeScore(result.communicationScore),
    technicalScore: normalizeScore(result.technicalScore),
    confidenceScore: normalizeScore(result.confidenceScore),
    problemSolvingScore: normalizeScore(result.problemSolvingScore),
    overallScore: normalizeScore(result.overallScore),
    model: result.model,
    source: "openai",
    answerEvaluations: result.answerEvaluations.map((answerEvaluation) => ({
      question: answerEvaluation.question,
      answer: answerEvaluation.answer,
      score: normalizeScore(answerEvaluation.score),
      feedback: answerEvaluation.feedback,
      strengths: normalizeTextList(
        answerEvaluation.strengths,
        answerEvaluation.feedback || "Clear interview response."
      ),
      weaknesses: normalizeTextList(
        answerEvaluation.weaknesses,
        "Add more detail, examples, or measurable impact."
      ),
      suggestedAnswer: answerEvaluation.idealAnswer,
    })),
    strengths: normalizeTextList(result.strengths, "Solid interview foundation."),
    weaknesses: normalizeTextList(
      result.weaknesses,
      "Answers can be improved with clearer structure and examples."
    ),
    suggestions: normalizeTextList(
      result.suggestions,
      "Practice concise responses with examples and measurable outcomes."
    ),
  };
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
}

function createVoiceMetric(
  questionIndex: number,
  transcript: string,
  speakingDurationSeconds = 0
): VoiceMetric {
  return {
    questionIndex,
    transcript,
    answerLength: transcript.length,
    wordsSpoken: countWords(transcript),
    speakingDurationSeconds,
    updatedAt: new Date().toISOString(),
  };
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function getPermissionLabel(status: MicrophonePermissionStatus) {
  const labels: Record<MicrophonePermissionStatus, string> = {
    unsupported: "Speech recognition unavailable",
    unknown: "Microphone permission unknown",
    prompt: "Microphone permission required",
    granted: "Microphone permission granted",
    denied: "Microphone permission denied",
  };

  return labels[status];
}

export function MockInterviewGenerator() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { interviews } = useMockInterviews(currentUser?.uid, 100);
  const [role, setRole] = useState<Role>("Frontend Developer");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [type, setType] = useState<InterviewType>("Mixed");
  const [skills, setSkills] = useState("React, JavaScript, APIs, CSS");
  const [resume, setResume] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedReportId, setSavedReportId] = useState("");
  const [questionSetId, setQuestionSetId] = useState("");
  const [questionSetTimestamp, setQuestionSetTimestamp] = useState("");
  const [questionCategories, setQuestionCategories] = useState<string[]>([]);
  const [aiModel, setAiModel] = useState("");
  const [questionSource, setQuestionSource] = useState<"openai" | "local">("local");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("text");
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetric[]>([]);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [microphonePermission, setMicrophonePermission] =
    useState<MicrophonePermissionStatus>("unknown");
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingBaseDurationRef = useRef(0);
  const currentQuestionRef = useRef(0);
  const answersRef = useRef<string[]>([]);
  const recognitionBaseAnswerRef = useRef("");

  const storageKey = useMemo(
    () => `jobready-mock-interview-${role}-${difficulty}-${type}`,
    [difficulty, role, type]
  );
  const askedQuestionsStorageKey = useMemo(
    () => `jobready-asked-questions-${role}-${difficulty}`,
    [difficulty, role]
  );
  const firebaseAskedQuestions = useMemo(
    () =>
      uniqueQuestions(
        interviews.flatMap((interview) => [
          ...(interview.askedQuestions ?? []),
          ...interview.answers.map((answer) => answer.question),
        ])
      ),
    [interviews]
  );
  const totalAvailableQuestions = getQuestionPool(role, difficulty, "Mixed").length;

  const progress = questions.length
    ? Math.round(((currentQuestion + 1) / questions.length) * 100)
    : 0;
  const answeredCount = answers.filter((answer) => answer.trim()).length;
  const currentAnswer = answers[currentQuestion] ?? "";
  const currentVoiceMetric =
    voiceMetrics.find((metric) => metric.questionIndex === currentQuestion) ??
    createVoiceMetric(currentQuestion, currentAnswer);
  const speechRecognitionSupported = Boolean(getSpeechRecognitionConstructor());

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
    setLiveTranscript("");
  }, [currentQuestion]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!speechRecognitionSupported) {
      setMicrophonePermission("unsupported");
      return;
    }

    if (!navigator.permissions?.query) {
      setMicrophonePermission("unknown");
      return;
    }

    let active = true;
    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (!active) {
          return;
        }

        permissionStatus = status;
        setMicrophonePermission(status.state as MicrophonePermissionStatus);
        status.onchange = () => {
          setMicrophonePermission(status.state as MicrophonePermissionStatus);
        };
      })
      .catch(() => {
        if (active) {
          setMicrophonePermission("unknown");
        }
      });

    return () => {
      active = false;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [speechRecognitionSupported]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const timer = window.setInterval(() => {
      const questionIndex = currentQuestionRef.current;
      const startedAt = recordingStartedAtRef.current;
      const duration = startedAt
        ? recordingBaseDurationRef.current +
          Math.round((Date.now() - startedAt) / 1000)
        : recordingBaseDurationRef.current;

      upsertVoiceMetric(questionIndex, answersRef.current[questionIndex] ?? "", duration);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (!questions.length || evaluation) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [evaluation, questions.length]);

  useEffect(() => {
    if (!questions.length) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        elapsedSeconds,
        questions,
        questionSetId,
        questionSetTimestamp,
        voiceMetrics,
        questionCategories,
        aiModel,
        questionSource,
      })
    );
  }, [
    aiModel,
    answers,
    elapsedSeconds,
    questionSetId,
    questionSetTimestamp,
    questionCategories,
    questionSource,
    questions,
    questions.length,
    storageKey,
    voiceMetrics,
  ]);

  const startInterview = async () => {
    const localAskedQuestions = readStoredQuestions(askedQuestionsStorageKey);
    const previouslyAsked = uniqueQuestions([
      ...localAskedQuestions,
      ...firebaseAskedQuestions,
    ]);
    const newQuestionSetId = createQuestionSetId();
    const newQuestionSetTimestamp = new Date().toISOString();
    let generatedQuestions: string[] = [];
    let generatedCategories: string[] = [];
    let generatedModel = "";
    let generatedSource: "openai" | "local" = "openai";

    setGeneratingQuestions(true);
    setAiError(null);

    try {
      const response = await generateOpenAiQuestions({
        role,
        difficulty,
        type,
        skills,
        resume,
        previousQuestions: previouslyAsked,
      });
      const uniqueGeneratedQuestions = response.questions.filter(
        (questionItem, index, questionItems) =>
          questionItem.question.trim() &&
          !previouslyAsked.includes(questionItem.question.trim()) &&
          questionItems.findIndex(
            (item) => item.question.trim() === questionItem.question.trim()
          ) === index
      );

      generatedQuestions = uniqueGeneratedQuestions
        .map((questionItem) => questionItem.question.trim())
        .slice(0, 10);
      generatedCategories = uniqueGeneratedQuestions
        .map((questionItem) => questionItem.category)
        .slice(0, 10);
      generatedModel = response.model ?? "";

      if (generatedQuestions.length < 10) {
        throw new Error("OpenAI returned fewer than 10 unique questions.");
      }
    } catch (error) {
      const poolQuestions = getQuestionPool(role, difficulty, type).filter(
        (question) => !previouslyAsked.includes(question)
      );
      const contextualQuestions = createContextualFallbackQuestions(
        role,
        difficulty,
        type,
        skills,
        resume,
        previouslyAsked
      );

      generatedQuestions = uniqueQuestions([
        ...shuffleQuestions(contextualQuestions),
        ...shuffleQuestions(poolQuestions),
      ]).slice(0, 10);
      generatedCategories = generatedQuestions.map(inferQuestionCategory);
      generatedSource = "local";
      generatedModel = "";
      setAiError(
        error instanceof Error
          ? `OpenAI unavailable: ${error.message} Local questions loaded.`
          : "OpenAI unavailable. Local questions loaded."
      );
    } finally {
      setGeneratingQuestions(false);
    }

    if (generatedQuestions.length < 10) {
      const localQuestions = createNonRepeatingFillQuestions(
        role,
        difficulty,
        skills,
        resume,
        previouslyAsked,
        generatedQuestions
      );

      generatedQuestions = uniqueQuestions([
        ...generatedQuestions,
        ...localQuestions,
      ]).slice(0, 10);
      generatedCategories = generatedQuestions.map(inferQuestionCategory);
      generatedSource = "local";
    }

    while (generatedQuestions.length < 10) {
      const nextQuestion = `Scenario: for ${role} practice set ${newQuestionSetId.slice(
        0,
        8
      )}, how would you handle a ${difficulty.toLowerCase()} challenge using ${
        skills.split(",")[0]?.trim() || "your strongest skill"
      }?`;
      const uniqueQuestion =
        generatedQuestions.length === 0
          ? nextQuestion
          : `${nextQuestion} Follow-up ${generatedQuestions.length + 1}: what would you do differently next time?`;

      generatedQuestions.push(uniqueQuestion);
      generatedCategories.push(inferQuestionCategory(uniqueQuestion));
      generatedSource = "local";
    }

    const updatedAskedQuestions = uniqueQuestions([
      ...localAskedQuestions,
      ...generatedQuestions,
    ]);

    window.localStorage.setItem(
      askedQuestionsStorageKey,
      JSON.stringify(updatedAskedQuestions)
    );
    setQuestions(generatedQuestions);
    setAnswers(Array(generatedQuestions.length).fill(""));
    setElapsedSeconds(0);
    setCurrentQuestion(0);
    setEvaluation(null);
    setSaveError(null);
    setSaved(false);
    setSavedReportId("");
    setQuestionSetId(newQuestionSetId);
    setQuestionSetTimestamp(newQuestionSetTimestamp);
    setVoiceMetrics([]);
    setLiveTranscript("");
    setSpeechError("");
    setQuestionCategories(generatedCategories);
    setAiModel(generatedModel);
    setQuestionSource(generatedSource);
  };

  const resetInterview = () => {
    recognitionRef.current?.abort();
    window.localStorage.removeItem(storageKey);
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestion(0);
    setElapsedSeconds(0);
    setEvaluation(null);
    setSaveError(null);
    setSaved(false);
    setSavedReportId("");
    setQuestionSetId("");
    setQuestionSetTimestamp("");
    setVoiceMetrics([]);
    setLiveTranscript("");
    setIsRecording(false);
    setSpeechError("");
    setQuestionCategories([]);
    setAiModel("");
    setQuestionSource("local");
    setAiError(null);
  };

  const updateAnswerAtIndex = (questionIndex: number, value: string) => {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === questionIndex ? value : answer
      )
    );
  };

  const updateAnswer = (value: string) => {
    updateAnswerAtIndex(currentQuestion, value);
  };

  const upsertVoiceMetric = (
    questionIndex: number,
    transcript: string,
    speakingDurationSeconds?: number
  ) => {
    setVoiceMetrics((currentMetrics) => {
      const existingMetric = currentMetrics.find(
        (metric) => metric.questionIndex === questionIndex
      );
      const nextMetric = createVoiceMetric(
        questionIndex,
        transcript,
        speakingDurationSeconds ?? existingMetric?.speakingDurationSeconds ?? 0
      );
      const remainingMetrics = currentMetrics.filter(
        (metric) => metric.questionIndex !== questionIndex
      );

      return [...remainingMetrics, nextMetric].sort(
        (firstMetric, secondMetric) =>
          firstMetric.questionIndex - secondMetric.questionIndex
      );
    });
  };

  const stopVoiceRecording = () => {
    if (!recognitionRef.current) {
      setIsRecording(false);
      return;
    }

    recognitionRef.current.stop();
    setIsRecording(false);
  };

  const startVoiceRecording = () => {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();

    if (!SpeechRecognitionConstructor) {
      setMicrophonePermission("unsupported");
      setSpeechError("Voice interview mode is not supported in this browser.");
      return;
    }

    recognitionRef.current?.abort();
    const questionIndex = currentQuestionRef.current;
    const existingMetric = voiceMetrics.find(
      (metric) => metric.questionIndex === questionIndex
    );
    const recognition = new SpeechRecognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionBaseAnswerRef.current = (answers[questionIndex] ?? "").trim();
    recordingBaseDurationRef.current =
      existingMetric?.speakingDurationSeconds ?? 0;
    recordingStartedAtRef.current = Date.now();
    recognitionRef.current = recognition;
    setAnswerMode("voice");
    setLiveTranscript("");
    setSpeechError("");

    recognition.onstart = () => {
      setIsRecording(true);
      setMicrophonePermission("granted");
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicrophonePermission("denied");
        setSpeechError("Microphone permission was denied.");
        return;
      }

      setSpeechError("Voice recording stopped. Please try again.");
    };

    recognition.onend = () => {
      const startedAt = recordingStartedAtRef.current;
      const duration = startedAt
        ? recordingBaseDurationRef.current +
          Math.round((Date.now() - startedAt) / 1000)
        : recordingBaseDurationRef.current;

      setIsRecording(false);
      recordingStartedAtRef.current = null;
      upsertVoiceMetric(
        questionIndex,
        answersRef.current[questionIndex] ?? recognitionBaseAnswerRef.current,
        duration
      );
    };

    recognition.onresult = (event) => {
      let sessionTranscript = "";
      let hasFinalResult = false;

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        sessionTranscript = `${sessionTranscript} ${result[0].transcript}`.trim();
        hasFinalResult = hasFinalResult || result.isFinal;
      }

      const transcript = [
        recognitionBaseAnswerRef.current,
        sessionTranscript,
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const startedAt = recordingStartedAtRef.current;
      const duration = startedAt
        ? recordingBaseDurationRef.current +
          Math.round((Date.now() - startedAt) / 1000)
        : recordingBaseDurationRef.current;

      setLiveTranscript(sessionTranscript);
      updateAnswerAtIndex(questionIndex, transcript);
      upsertVoiceMetric(questionIndex, transcript, duration);

      if (hasFinalResult) {
        setSpeechError("");
      }
    };

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      setSpeechError("Voice recording could not start. Please try again.");
    }
  };

  const submitInterview = async () => {
    if (isRecording) {
      stopVoiceRecording();
    }

    setSaving(true);
    setSaveError(null);
    setAiError(null);
    setSaved(false);
    setSavedReportId("");

    try {
      let result: Evaluation;

      try {
        result = fromOpenAiEvaluation(
          await evaluateOpenAiInterview({
            role,
            difficulty,
            type,
            skills,
            resume,
            previousQuestions: firebaseAskedQuestions,
            questions,
            answers,
          })
        );
        setAiModel(result.model ?? aiModel);
      } catch (error) {
        result = evaluateAnswers(questions, answers, role, type, difficulty);
        setAiError(
          error instanceof Error
            ? `OpenAI evaluation unavailable: ${error.message} Local evaluation saved.`
            : "OpenAI evaluation unavailable. Local evaluation saved."
        );
      }

      setEvaluation(result);

      const reportId = await saveMockInterview({
        questionSetId,
        questionSetTimestamp,
        role,
        type,
        difficulty,
        overallScore: result.overallScore,
        technicalScore: result.technicalScore,
        communicationScore: result.communicationScore,
        confidenceScore: result.confidenceScore,
        problemSolvingScore: result.problemSolvingScore,
        askedQuestions: questions,
        answers: result.answerEvaluations,
        voiceMetrics,
        questionCategories,
        aiModel: result.model ?? aiModel,
        questionSource,
        evaluationSource: result.source ?? "local",
        skills,
        resumeHighlights: resume,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
      });
      setSaved(true);
      setSavedReportId(reportId);
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to save this interview."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm text-[#2563EB] mb-4">
              <Sparkles className="w-4 h-4" />
              AI Mock Interview Generator
            </div>
            <h1 className="text-3xl text-slate-900 mb-2">
              Practice a role-specific interview
            </h1>
            <p className="text-slate-500 max-w-3xl">
              Generate ten focused questions from your target role, difficulty,
              interview type, resume notes, and skills.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-center">
              <p className="text-2xl text-slate-900">{questions.length || 10}</p>
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-slate-900">{answeredCount}</p>
              <p className="text-xs text-slate-500">Answered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-slate-900">{formatTime(elapsedSeconds)}</p>
              <p className="text-xs text-slate-500">Timer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-xl text-slate-900">Interview Setup</h2>
              <p className="text-sm text-slate-500">
                {totalAvailableQuestions} available questions
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm text-slate-600">Select Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {roles.map((roleOption) => (
                  <option key={roleOption}>{roleOption}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Difficulty</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {difficulties.map((difficultyOption) => (
                  <button
                    key={difficultyOption}
                    type="button"
                    onClick={() => setDifficulty(difficultyOption)}
                    className={`rounded-xl border px-3 py-3 text-sm transition-all ${
                      difficulty === difficultyOption
                        ? "border-[#2563EB] bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#2563EB]"
                    }`}
                  >
                    {difficultyOption}
                  </button>
                ))}
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Interview Type</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {interviewTypes.map((typeOption) => (
                  <button
                    key={typeOption}
                    type="button"
                    onClick={() => setType(typeOption)}
                    className={`rounded-xl border px-3 py-3 text-sm transition-all ${
                      type === typeOption
                        ? "border-[#2563EB] bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#2563EB]"
                    }`}
                  >
                    {typeOption}
                  </button>
                ))}
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Skills</span>
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="React, SQL, Python, APIs"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Resume Highlights</span>
              <textarea
                value={resume}
                onChange={(event) => setResume(event.target.value)}
                placeholder="Paste projects, internships, achievements, or tools from your resume."
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startInterview}
                disabled={generatingQuestions}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#2563EB]/20 transition-all hover:bg-[#1D4ED8]"
              >
                {generatingQuestions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                {generatingQuestions ? "Generating" : "Generate"}
              </button>
              <button
                type="button"
                onClick={startInterview}
                disabled={generatingQuestions}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#2563EB] px-4 py-3 text-sm font-medium text-[#2563EB] transition-all hover:bg-[#2563EB]/10"
              >
                {generatingQuestions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {generatingQuestions ? "Generating" : "Generate New Set"}
              </button>
              <button
                type="button"
                onClick={resetInterview}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-slate-600 transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                aria-label="Reset interview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {aiError && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {aiError}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-6">
          {!questions.length ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center">
                <MessageSquareText className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h2 className="text-2xl text-slate-900 mb-2">
                Ready when you are
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Choose a role, difficulty, and interview type, then generate a
                fresh set of questions for a realistic practice session.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <p className="text-sm text-[#2563EB] mb-1">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                  <h2 className="text-2xl text-slate-900">
                    {role} - {type} - {difficulty}
                  </h2>
                  {questionSetId && (
                    <p className="text-sm text-slate-500 mt-1">
                      Set {questionSetId.slice(0, 8)} -{" "}
                      {questionSetTimestamp
                        ? new Date(questionSetTimestamp).toLocaleString()
                        : "Created now"}
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <p className="text-lg leading-8 text-slate-900">
                    {questions[currentQuestion]}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="text-sm text-slate-600">Your Answer</span>
                    <p className="text-xs text-slate-500">
                      {answerMode === "voice"
                        ? "Voice transcript fills this answer automatically."
                        : "Type your answer or switch to voice mode."}
                    </p>
                  </div>
                  <div className="inline-grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {(["text", "voice"] as AnswerMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          if (mode === "text" && isRecording) {
                            stopVoiceRecording();
                          }
                          setAnswerMode(mode);
                        }}
                        className={`rounded-lg px-4 py-2 text-sm transition-all ${
                          answerMode === mode
                            ? "bg-white text-[#2563EB] shadow-sm"
                            : "text-slate-500 hover:text-[#2563EB]"
                        }`}
                      >
                        {mode === "text" ? "Text Mode" : "Voice Mode"}
                      </button>
                    ))}
                  </div>
                </div>

                {answerMode === "voice" && (
                  <div className="rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${
                            isRecording
                              ? "bg-[#2563EB] text-white"
                              : "bg-white text-[#2563EB]"
                          }`}
                        >
                          {isRecording && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-[#2563EB]/30" />
                          )}
                          <Radio className="relative h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-900">
                            {isRecording ? "Recording in progress" : "Voice ready"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getPermissionLabel(microphonePermission)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        disabled={!speechRecognitionSupported}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                          isRecording
                            ? "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                            : "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20 hover:bg-[#1D4ED8]"
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </button>
                    </div>

                    {!speechRecognitionSupported && (
                      <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-600">
                        Voice interview mode needs Chrome or Edge with Web Speech
                        API support. You can continue in Text Mode.
                      </p>
                    )}
                    {speechError && (
                      <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-rose-700">
                        {speechError}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        ["Voice Answer Length", currentVoiceMetric.answerLength],
                        [
                          "Speaking Duration",
                          formatTime(currentVoiceMetric.speakingDurationSeconds),
                        ],
                        ["Words Spoken", currentVoiceMetric.wordsSpoken],
                      ].map(([label, value]) => (
                        <div
                          key={label as string}
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 text-lg text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-slate-900">
                        {isRecording && (
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                        )}
                        Live Transcript
                      </div>
                      <p className="min-h-6 text-sm leading-6 text-slate-600">
                        {liveTranscript ||
                          currentAnswer ||
                          "Start recording to see speech appear here."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    value={currentAnswer}
                    onChange={(event) => {
                      updateAnswer(event.target.value);
                      if (answerMode === "voice") {
                        upsertVoiceMetric(currentQuestion, event.target.value);
                      }
                    }}
                    rows={10}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-16 text-slate-900 outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    placeholder={
                      answerMode === "voice"
                        ? "Use the microphone button to speak your answer."
                        : "Type your answer here. Drafts are auto-saved in this browser."
                    }
                  />
                  {answerMode === "voice" && (
                    <button
                      type="button"
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      disabled={!speechRecognitionSupported}
                      className={`absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        isRecording
                          ? "bg-rose-50 text-rose-600 ring-2 ring-rose-100"
                          : "bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                      }`}
                      aria-label={
                        isRecording ? "Stop voice recording" : "Start voice recording"
                      }
                    >
                      {isRecording ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Save className="w-4 h-4 text-[#2563EB]" />
                  Auto-saved - {currentAnswer.length} characters
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecording) {
                        stopVoiceRecording();
                      }
                      setCurrentQuestion((question) => Math.max(0, question - 1));
                    }}
                    disabled={currentQuestion === 0}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-all hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecording) {
                        stopVoiceRecording();
                      }
                      setCurrentQuestion((question) =>
                        Math.min(questions.length - 1, question + 1)
                      );
                    }}
                    disabled={currentQuestion === questions.length - 1}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-all hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={submitInterview}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#2563EB]/20 transition-all hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {saving ? "Evaluating" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {evaluation && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1 text-sm text-[#059669] mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    Evaluation Complete
                  </div>
                  <h2 className="text-2xl text-slate-900">AI Evaluation</h2>
                  <p className="text-slate-500 mt-1">
                    {saved
                      ? "Saved to Firebase mock interview history."
                      : saving
                      ? "Saving your interview result..."
                      : "Review your score breakdown and feedback."}
                  </p>
                  {saveError && (
                    <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {saveError}
                    </p>
                  )}
                  {savedReportId && (
                    <button
                      type="button"
                      onClick={() => navigate(`/interview-report/${savedReportId}`)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#2563EB]/20 transition-all hover:bg-[#1D4ED8]"
                    >
                      <FileText className="w-4 h-4" />
                      View Interview Report
                    </button>
                  )}
                </div>
                <div className="rounded-2xl bg-[#2563EB] px-6 py-5 text-center text-white shadow-lg shadow-[#2563EB]/20">
                  <p className="text-sm opacity-80">Overall Score</p>
                  <p className="text-4xl">{evaluation.overallScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                  ["Communication", evaluation.communicationScore],
                  ["Technical", evaluation.technicalScore],
                  ["Confidence", evaluation.confidenceScore],
                  ["Problem Solving", evaluation.problemSolvingScore],
                ].map(([label, score]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-slate-600">{label}</p>
                      <p className="text-lg text-slate-900">{score}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-white overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  ["Strengths", evaluation.strengths],
                  ["Weaknesses", evaluation.weaknesses],
                  ["Improvement Suggestions", evaluation.suggestions],
                ].map(([title, items]) => (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <h3 className="text-slate-900 mb-4">{title as string}</h3>
                    <ul className="space-y-3">
                      {(items as string[]).map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-slate-900 mb-4">Answer Evaluation</h3>
                <div className="space-y-4">
                  {evaluation.answerEvaluations.map((answerEvaluation, index) => (
                    <div
                      key={`${answerEvaluation.question}-${index}`}
                      className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                        <p className="text-sm text-slate-700 flex-1">
                          {index + 1}. {answerEvaluation.question}
                        </p>
                        <span className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm text-[#2563EB]">
                          {answerEvaluation.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-slate-900 mb-1">Strength</p>
                          <p className="text-slate-500">
                            {answerEvaluation.strengths[0]}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-900 mb-1">Weakness</p>
                          <p className="text-slate-500">
                            {answerEvaluation.weaknesses[0]}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-900 mb-1">Suggested Answer</p>
                          <p className="text-slate-500">
                            {answerEvaluation.suggestedAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
