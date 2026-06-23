import {
  addDoc,
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  Bot,
  Check,
  Copy,
  FileUp,
  Mic,
  MicOff,
  RefreshCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Timestamp;
};

type AiRequestMessage = Pick<ChatMessage, "role" | "content">;

type AssistantIntent =
  | "roadmap"
  | "resume"
  | "mockInterview"
  | "companyPreparation"
  | "skillLearning"
  | "general";

const assistantApiUrl = "http://localhost:3001/api/career-assistant";

const starterPrompts = [
  "Crack Zoho in 60 Days",
  "Build Full Stack Roadmap",
  "Review My Resume",
  "Start Mock Interview",
];

const promptCards = [
  {
    title: "Crack Zoho",
    prompt: "Crack Zoho in 60 Days",
    description: "A focused placement roadmap with weekly milestones.",
  },
  {
    title: "Full Stack Plan",
    prompt: "Build Full Stack Roadmap",
    description: "Learn by building projects and interview proof.",
  },
  {
    title: "Resume Review",
    prompt: "Review My Resume",
    description: "Improve bullets, ATS fit, and recruiter impact.",
  },
  {
    title: "Mock Interview",
    prompt: "Start Mock Interview",
    description: "Practice answers with structured feedback.",
  },
];

function careerChatsCollection(uid: string) {
  return collection(db, "users", uid, "careerAssistantChats");
}

function detectIntent(message: string): AssistantIntent {
  const lowerMessage = message.toLowerCase();

  if (/(resume|cv|ats|bullet|profile|summary)/.test(lowerMessage)) {
    return "resume";
  }

  if (/(mock|interview|hr|behavioral|technical round|answer)/.test(lowerMessage)) {
    return "mockInterview";
  }

  if (/(company|zoho|tcs|infosys|accenture|prep|placement|apply)/.test(lowerMessage)) {
    return "companyPreparation";
  }

  if (/(roadmap|plan|days|week|month|timeline|schedule)/.test(lowerMessage)) {
    return "roadmap";
  }

  if (/(learn|skill|full stack|react|node|dsa|coding|project|system design)/.test(lowerMessage)) {
    return "skillLearning";
  }

  return "general";
}

function getNamedTarget(message: string) {
  const lowerMessage = message.toLowerCase();
  const targets = [
    ["zoho", "Zoho"],
    ["tcs", "TCS"],
    ["infosys", "Infosys"],
    ["full stack", "Full Stack"],
    ["react", "React"],
    ["dsa", "DSA"],
    ["resume", "Resume"],
  ];

  return targets.find(([key]) => lowerMessage.includes(key))?.[1] ?? "";
}

function getTimeline(message: string) {
  const match = message
    .toLowerCase()
    .match(/(\d+)\s*(days|day|weeks|week|months|month)/);

  if (!match) {
    return "";
  }

  const amount = Number(match[1]);
  const unit =
    amount === 1 ? match[2].replace(/s$/, "") : `${match[2].replace(/s$/, "")}s`;

  return `${amount} ${unit}`;
}

function getConversationalContext(
  previousMessage: string | undefined,
  target: string,
  timeline: string
) {
  if (target) {
    return `Based on your goal of cracking **${target}** in **${timeline}**, here is a focused preparation roadmap you can start today.`;
  }

  if (previousMessage) {
    return "Based on what you asked earlier and your latest message, here is the most useful next plan.";
  }

  return "Based on your goal, here is a practical plan you can act on right away.";
}

function extractFocus(message: string) {
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "and",
          "for",
          "the",
          "with",
          "can",
          "you",
          "how",
          "what",
          "make",
          "build",
          "start",
          "help",
          "need",
        ].includes(word)
    );

  return Array.from(new Set(words)).slice(0, 5);
}

function buildLocalMentorReply(
  history: AiRequestMessage[],
  resumeContext: string
) {
  const userMessages = history.filter((message) => message.role === "user");
  const latestMessage = userMessages[userMessages.length - 1]?.content ?? "";
  const previousMessage = userMessages[userMessages.length - 2]?.content;
  const intent = detectIntent(latestMessage);
  const focus = extractFocus(latestMessage);
  const topic = focus.length ? focus.join(", ") : "your goal";
  const hasResume = Boolean(resumeContext.trim());
  const namedTarget = getNamedTarget(latestMessage);
  const timeline = getTimeline(latestMessage) || "8 weeks";
  const contextLine = getConversationalContext(
    previousMessage,
    namedTarget,
    timeline
  );

  if (namedTarget) {
    return [
      `## 🚀 ${namedTarget} Preparation Roadmap`,
      contextLine,
      "",
      "### 🎯 Preparation strategy",
      `- Focus on the rounds ${namedTarget} is likely to test: aptitude, coding, technical fundamentals, project discussion, and HR communication.`,
      "- Keep your preparation output-driven: every week should produce solved problems, notes, mock scores, and interview stories.",
      "- Do not wait until the final week for mocks. Start light mocks from week 2 so nervousness drops early.",
      "",
      "### 📅 Weekly milestones",
      `- **Week 1:** Understand the ${namedTarget} pattern, collect previous questions, and revise aptitude basics.`,
      "- **Week 2:** Strengthen arrays, strings, hashing, recursion basics, and SQL or JavaScript fundamentals.",
      "- **Week 3:** Solve timed coding sets and write explanations for every mistake.",
      "- **Week 4:** Prepare 3 strong project stories using problem, stack, architecture, tradeoffs, and result.",
      "- **Week 5:** Go deeper into role-specific topics like frontend, backend, DSA, databases, or APIs.",
      "- **Week 6:** Attempt 2 full company-style mocks and repeat weak topics immediately.",
      "- **Week 7:** Polish resume, self-introduction, HR answers, and communication clarity.",
      "- **Week 8:** Run final revision, mixed practice, and a complete interview simulation.",
      "",
      "### 🕒 Daily routine",
      "- **60 minutes:** Coding or DSA practice.",
      "- **30 minutes:** Aptitude or company-pattern practice.",
      "- **30 minutes:** Project explanation, resume improvement, or interview storytelling.",
      "- **15 minutes:** Mistake log review. Write what went wrong and how you will avoid it next time.",
      "",
      "### 📚 Resources to use",
      "- Previous placement questions and company-specific interview experiences.",
      "- LeetCode or HackerRank for arrays, strings, hashing, sorting, recursion, and SQL.",
      "- Your own projects for technical discussion. Prepare architecture, challenges, and tradeoffs.",
      "- A simple mistake tracker in Notion, Sheets, or a notebook.",
      "",
      "### ✅ Expected outcomes",
      "- You can solve common coding questions under time pressure.",
      "- You can explain 2-3 projects confidently without sounding memorized.",
      "- Your resume bullets match the role and show measurable impact.",
      "- You have practiced enough mocks to answer calmly in the actual interview.",
      "",
      "### 👉 Clear next step",
      `Today, create a **${namedTarget} ${timeline} tracker** and complete: 10 aptitude questions, 2 coding problems, and one polished self-introduction.`,
    ].join("\n");
  }

  const responses: Record<AssistantIntent, string> = {
    roadmap: [
      `## 🧭 Roadmap for ${topic}`,
      contextLine,
      "",
      "### 🎯 Define the outcome",
      `Decide what "ready" means for ${topic}: target companies, role level, and proof you can show.`,
      "",
      "### 📅 Weekly milestones",
      "- **Foundation:** revise weak concepts and collect reference notes.",
      "- **Practice:** solve role-aligned problems or build one visible artifact.",
      "- **Proof:** update resume, GitHub, portfolio, and interview stories.",
      "",
      "### 🕒 Daily routine",
      "- **45 minutes:** learn or revise.",
      "- **30 minutes:** apply through problems or a project feature.",
      "- **15 minutes:** write mistakes and next actions.",
      "",
      "### 👉 Clear next step",
      "Start today by writing the top 5 skills for your target role and marking each one as strong, medium, or weak.",
    ].join("\n"),
    resume: [
      "## 📝 Resume Review Plan",
      contextLine,
      "",
      hasResume
        ? "Great, your resume context is attached. I will keep suggestions tied to your actual experience."
        : "You can still start now: paste 2-3 bullets and I will rewrite them directly.",
      "",
      "### 🔍 What to improve first",
      "- Is the headline aligned with the target role?",
      "- Do the first 3 bullets show measurable impact?",
      "- Are projects written with tech stack, problem, action, and result?",
      "",
      "### Better bullet formula",
      "`Built [feature/system] using [tools], improving [metric/user outcome] by [result].`",
      "",
      "### 👉 Clear next step",
      "Send one resume bullet here and I will rewrite it in recruiter-ready language.",
    ].join("\n"),
    mockInterview: [
      "## 🎙️ Mock Interview Mode",
      contextLine,
      "",
      `We can practice around **${topic}** with a realistic interviewer flow.`,
      "",
      "### Round structure",
      "1. Warm-up: role and project summary.",
      "2. Depth: technical or behavioral follow-ups.",
      "3. Pressure: tradeoffs, mistakes, and edge cases.",
      "4. Feedback: clarity, confidence, and content score.",
      "",
      "Answer this first:",
      "**Tell me about one project you built and the hardest technical decision you made.**",
      "",
      "### 👉 Clear next step",
      "Answer in 6-8 lines. I will score it and give you a stronger model answer.",
    ].join("\n"),
    companyPreparation: [
      `## 🏢 Company Preparation: ${topic}`,
      contextLine,
      "",
      "### 🎯 Focus areas",
      "- Understand the company pattern: aptitude, coding, technical, HR, or case-style rounds.",
      "- Build a role-specific question bank.",
      "- Prepare 3 project stories and 2 failure/learning stories.",
      "",
      "### 📚 Resources",
      "- Previous interview experiences.",
      "- Company-specific coding questions.",
      "- Your own project notes and resume stories.",
      "",
      "### 👉 Clear next step",
      "Start with one previous paper or interview experience, then build a mistake log from it.",
    ].join("\n"),
    skillLearning: [
      `## ⚡ Skill Learning Path: ${topic}`,
      contextLine,
      "",
      "### 🧪 Learn by building",
      "- Pick one core concept.",
      "- Build a small feature using it.",
      "- Explain the tradeoffs in plain language.",
      "- Add the result to your portfolio or interview notes.",
      "",
      "### Practice loop",
      "Study -> implement -> debug -> explain -> revise.",
      "",
      "### ✅ Expected outcome",
      "You should finish with something you can show in GitHub, explain in interviews, and convert into a resume bullet.",
      "",
      "### 👉 Clear next step",
      "Pick one concept today and build a tiny feature around it instead of only watching tutorials.",
    ].join("\n"),
    general: [
      "## 🌟 Mentor Response",
      contextLine,
      "",
      `For **${topic}**, here is a concrete career action plan.`,
      "",
      "### 📅 Weekly rhythm",
      "- **Mon-Tue:** Learn and revise weak concepts.",
      "- **Wed-Thu:** Apply through problems or project work.",
      "- **Fri:** Convert the work into resume or interview proof.",
      "- **Sat:** Take a mock test or mock interview.",
      "- **Sun:** Review mistakes and plan the next week.",
      "",
      "### 👉 Clear next step",
      "Choose the one outcome you want this week, then spend today creating the first proof artifact.",
    ].join("\n"),
  };

  return responses[intent];
}

async function requestAssistantReply(
  history: AiRequestMessage[],
  resumeContext: string
) {
  try {
    const response = await fetch(assistantApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, resumeContext }),
    });
    const body = (await response.json().catch(() => ({}))) as {
      data?: { reply?: string };
    };

    if (response.ok && body.data?.reply) {
      return body.data.reply;
    }
  } catch {
    // Fall back locally when the API is unavailable.
  }

  return buildLocalMentorReply(history, resumeContext);
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-[#1D4ED8]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  function flushList() {
    if (!listItems.length) {
      return;
    }

    elements.push(
      <ul key={`list-${elements.length}`} className="my-3 space-y-2 pl-1">
        {listItems.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span>{renderInlineMarkdown(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function flushTable() {
    if (!tableRows.length) {
      return;
    }

    const [headings, separator, ...rows] = tableRows;
    const bodyRows = separator?.every((cell) => /^-+$/.test(cell))
      ? rows
      : [separator, ...rows].filter(Boolean);

    elements.push(
      <div key={`table-${elements.length}`} className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-950"
                >
                  {renderInlineMarkdown(heading)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-slate-200 px-3 py-2 align-top"
                  >
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushTable();
      listItems.push(trimmed.slice(2));
      return;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      tableRows.push(
        trimmed
          .slice(1, -1)
          .split("|")
          .map((cell) => cell.trim())
      );
      return;
    }

    flushList();
    flushTable();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="mb-3 mt-1 text-xl font-semibold leading-snug text-slate-950"
        >
          {renderInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="mb-2 mt-5 border-t border-slate-200 pt-4 text-base font-semibold text-slate-950 first:border-t-0 first:pt-0"
        >
          {renderInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <p key={index} className="my-2">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
      return;
    }

    elements.push(
      <p key={index} className="my-2">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  flushTable();

  return <div className="text-[15px] leading-7 text-slate-700">{elements}</div>;
}

export function AICareerAssistant() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeContext, setResumeContext] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<
    Record<string, "up" | "down">
  >({});
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isGeneratingRef = useRef(false);
  const displayName = currentUser?.email?.split("@")[0] || "Student";
  const userInitial = displayName.charAt(0).toUpperCase();

  const lastUserIntent = useMemo(() => {
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    return latestUserMessage ? detectIntent(latestUserMessage.content) : null;
  }, [messages]);

  useEffect(() => {
    if (!currentUser?.uid) {
      setMessages([]);
      return;
    }

    const chatQuery = query(
      careerChatsCollection(currentUser.uid),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    return onSnapshot(
      chatQuery,
      (snapshot) => {
        if (isGeneratingRef.current) {
          return;
        }

        const savedMessages = snapshot.docs.map((document) => {
          const data = document.data() as DocumentData;
          return {
            id: document.id,
            role: data.role === "assistant" ? "assistant" : "user",
            content: data.content ?? "",
            createdAt: data.createdAt,
          };
        });

        setMessages(savedMessages);
      },
      () => setMessages([])
    );
  }, [currentUser?.uid]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, isTyping]);

  async function saveMessage(message: Omit<ChatMessage, "id">) {
    if (!currentUser?.uid) {
      return;
    }

    await addDoc(careerChatsCollection(currentUser.uid), {
      ...message,
      createdAt: serverTimestamp(),
    });
  }

  async function streamAssistantMessage(messageId: string, reply: string) {
    for (let index = 0; index < reply.length; index += 1) {
      const nextContent = reply.slice(0, index + 1);

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: nextContent,
              }
            : message
        )
      );

      await new Promise((resolve) => window.setTimeout(resolve, 8));
    }
  }

  async function sendMessage(messageText: string) {
    const prompt = messageText.trim();

    if (!prompt || isSending) {
      return;
    }

    setInput("");
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    const nextMessages = [...messages, userMessage];

    isGeneratingRef.current = true;
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const reply = await requestAssistantReply(
        nextMessages.map(({ role, content }) => ({ role, content })),
        resumeContext
      );
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };

      setIsTyping(false);
      setMessages((current) => [...current, assistantMessage]);
      await streamAssistantMessage(assistantMessageId, reply);
      await Promise.all([
        saveMessage({ role: "user", content: prompt }),
        saveMessage({ role: "assistant", content: reply }),
      ]);
    } finally {
      isGeneratingRef.current = false;
      setIsTyping(false);
      setIsSending(false);
    }
  }

  async function copyMessage(message: ChatMessage) {
    await navigator.clipboard?.writeText(message.content);
    setCopiedMessageId(message.id);
    window.setTimeout(() => setCopiedMessageId(null), 1600);
  }

  function setFeedback(messageId: string, feedback: "up" | "down") {
    setMessageFeedback((current) => ({
      ...current,
      [messageId]: current[messageId] === feedback ? undefined : feedback,
    }));
  }

  async function regenerateMessage(messageId: string) {
    if (isSending) {
      return;
    }

    const messageIndex = messages.findIndex((message) => message.id === messageId);

    if (messageIndex <= 0) {
      return;
    }

    const history = messages
      .slice(0, messageIndex)
      .map(({ role, content }) => ({ role, content }));

    setIsSending(true);
    setIsTyping(true);
    isGeneratingRef.current = true;

    try {
      const reply = await requestAssistantReply(history, resumeContext);

      setIsTyping(false);
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId ? { ...message, content: "" } : message
        )
      );
      await streamAssistantMessage(messageId, reply);
    } finally {
      isGeneratingRef.current = false;
      setIsTyping(false);
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function handleResumeUpload(file?: File) {
    if (!file) {
      return;
    }

    setResumeFileName(file.name);
    const text = await file.text().catch(() => "");
    setResumeContext(text.slice(0, 6000));
  }

  function handleVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setInput((current) =>
        current
          ? `${current} Voice input is not supported in this browser.`
          : "Voice input is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput((current) => [current, transcript].filter(Boolean).join(" "));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-132px)] w-full max-w-[1680px] gap-4 text-slate-950">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-teal-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live career workspace
                </div>
                <h1 className="truncate text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
                  Aspiro AI Career Assistant
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">
                {lastUserIntent ? `Mode: ${lastUserIntent}` : "New chat"}
              </span>
              <span
                className={`rounded-full border px-3 py-1.5 font-medium ${
                  resumeContext
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                Resume {resumeContext ? "attached" : "not attached"}
              </span>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_#eef2ff,_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#ffffff_100%)] px-3 py-5 sm:px-5 lg:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {!messages.length && (
              <div className="mx-auto flex w-full max-w-4xl flex-col items-center py-8 text-center sm:py-12">
                <div className="mb-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase text-slate-600 shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-teal-600" />
                  Personal AI placement coach
                </div>
                <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                  What should we prepare today, {displayName}?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Ask for roadmaps, company prep, resume edits, mock interviews,
                  or a practical plan for your next career milestone.
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {promptCards.map((card) => (
                    <button
                      key={card.prompt}
                      type="button"
                      onClick={() => void sendMessage(card.prompt)}
                      className="group rounded-xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-xl hover:shadow-teal-100/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950 group-hover:text-teal-700">
                            {card.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {card.description}
                          </p>
                        </div>
                        <Sparkles className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-teal-500" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-950 hover:text-white sm:text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <article
                  key={message.id}
                  className={`group flex w-full gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md shadow-slate-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[78%] ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 px-1 text-xs font-medium text-slate-500">
                      <span>{isUser ? "You" : "Aspiro AI"}</span>
                    </div>
                    <div
                      className={`min-w-0 rounded-2xl px-4 py-3 sm:px-5 ${
                        isUser
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-300"
                          : "border border-slate-200 bg-white text-slate-800 shadow-sm"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-[15px] leading-7">
                          {message.content}
                        </p>
                      ) : (
                        <MarkdownMessage content={message.content} />
                      )}
                    </div>
                    <div
                      className={`mt-2 flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 ${
                        isUser ? "self-end" : "self-start"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => void copyMessage(message)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                        title="Copy"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      {!isUser && (
                        <>
                          <button
                            type="button"
                            onClick={() => void regenerateMessage(message.id)}
                            disabled={isSending}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Regenerate"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeedback(message.id, "up")}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100 ${
                              messageFeedback[message.id] === "up"
                                ? "text-teal-600"
                                : "text-slate-500 hover:text-slate-950"
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeedback(message.id, "down")}
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100 ${
                              messageFeedback[message.id] === "down"
                                ? "text-rose-600"
                                : "text-slate-500 hover:text-slate-950"
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isUser && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-teal-100">
                      {userInitial || <User className="h-4 w-4" />}
                    </div>
                  )}
                </article>
              );
            })}

            {isTyping && (
              <div className="flex justify-start gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md shadow-slate-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm">
                  <span className="mr-3 inline-flex gap-1 align-middle">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:240ms]" />
                  </span>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-xl sm:px-5 lg:px-8"
        >
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              {resumeFileName ? (
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <FileUp className="h-4 w-4 shrink-0" />
                  <span className="truncate">{resumeFileName}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Attach a resume to personalize answers.
                </div>
              )}
              <div className="hidden text-xs text-slate-400 sm:block">
                Press Send to start or continue the chat.
              </div>
            </div>

            <div className="flex items-end gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-200/70 sm:gap-2">
              <label
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                title="Upload resume"
              >
                <FileUp className="h-5 w-5" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="sr-only"
                  onChange={(event) => handleResumeUpload(event.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                  isListening
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
                title="Voice input"
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for a roadmap, resume review, or mock interview..."
                rows={1}
                className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-6 text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setVoiceChatEnabled((enabled) => !enabled)}
                className={`hidden h-11 items-center gap-2 rounded-xl px-3 text-sm transition sm:flex ${
                  voiceChatEnabled
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
                title="Voice chat"
              >
                <Volume2 className="h-4 w-4" />
                Voice
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                title="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </section>

      <aside className="hidden w-72 shrink-0 space-y-3 2xl:block">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">Session</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Messages</p>
              <p className="mt-1 font-semibold text-slate-950">{messages.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Resume</p>
              <p className="mt-1 font-semibold text-slate-950">
                {resumeContext ? "On" : "Off"}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Current mode</p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-950">
              {lastUserIntent ?? "New chat"}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">Suggested prompts</p>
          <div className="mt-3 space-y-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
