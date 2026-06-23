console.log("OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0, 10));
console.log("KEY LENGTH:", process.env.OPENAI_API_KEY?.length);
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  assertValidOpenAiApiKey,
  formatOpenAiServerError,
  getOpenAiConfigStatus,
} from "./api/openai-config.js";
import openAiInterviewHandler from "./api/openai-interview-handler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const openAiApiUrl = "https://api.openai.com/v1/responses";
const defaultModel = "gpt-4.1-mini";

console.log("[OpenAI] Loaded configuration", getOpenAiConfigStatus());

function extractOpenAiText(responseBody) {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  const output = Array.isArray(responseBody.output) ? responseBody.output : [];
  return output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .filter(Boolean)
    .join("\n");
}

function sanitizeAssistantMessages(messages) {
  return Array.isArray(messages)
    ? messages
        .map((message) => ({
          role: message?.role === "assistant" ? "assistant" : "user",
          content:
            typeof message?.content === "string"
              ? message.content.trim().slice(0, 4000)
              : "",
        }))
        .filter((message) => message.content)
        .slice(-24)
    : [];
}

function uniqueItems(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function getMessageIntent(message) {
  const lowerMessage = message.toLowerCase();

  if (/(resume|cv|ats|bullet|summary|experience)/.test(lowerMessage)) {
    return "resume";
  }

  if (/(interview|answer|voice|hr|behavioral|technical round)/.test(lowerMessage)) {
    return "interview";
  }

  if (/(roadmap|plan|schedule|learn|study|prepare|timeline)/.test(lowerMessage)) {
    return "roadmap";
  }

  if (/(company|role|job|placement|apply|application)/.test(lowerMessage)) {
    return "job-search";
  }

  if (/(code|coding|dsa|project|portfolio|github)/.test(lowerMessage)) {
    return "technical";
  }

  return "general";
}

function getMentorIntent(message) {
  const lowerMessage = message.toLowerCase();

  if (/(resume|cv|ats|bullet|profile|summary)/.test(lowerMessage)) {
    return "resume review";
  }

  if (/(mock|interview|hr|behavioral|technical round|answer)/.test(lowerMessage)) {
    return "mock interview";
  }

  if (/(company|zoho|tcs|infosys|accenture|prep|placement|apply)/.test(lowerMessage)) {
    return "company preparation";
  }

  if (/(roadmap|plan|days|week|month|timeline|schedule)/.test(lowerMessage)) {
    return "roadmap";
  }

  if (/(learn|skill|full stack|react|node|dsa|coding|project|system design)/.test(lowerMessage)) {
    return "skill learning";
  }

  return "general mentoring";
}

function getNamedTarget(message) {
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

function getTimeline(message) {
  const lowerMessage = message.toLowerCase();
  const match = lowerMessage.match(
    /(\d+)\s*(days|day|weeks|week|months|month)/
  );

  if (!match) {
    return "";
  }

  const amount = Number(match[1]);
  const unit = amount === 1 ? match[2].replace(/s$/, "") : `${match[2].replace(/s$/, "")}s`;

  return `${amount} ${unit}`;
}

function getConversationalContext(previousMessage, latestMessage, target, timeline) {
  if (target) {
    return `Based on your goal of cracking **${target}** in **${timeline}**, here is a focused preparation roadmap you can start today.`;
  }

  if (previousMessage) {
    return `Based on what you asked earlier and your latest message, here is the most useful next plan.`;
  }

  return `Based on your goal, here is a practical plan you can act on right away.`;
}

function extractKeywords(message) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "and",
    "are",
    "can",
    "for",
    "from",
    "have",
    "help",
    "how",
    "into",
    "make",
    "need",
    "that",
    "the",
    "this",
    "with",
    "what",
    "when",
    "will",
    "you",
    "your",
  ]);

  return uniqueItems(
    message
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  ).slice(0, 5);
}

function buildLocalCareerReply(messages, resumeContext) {
  const userMessages = messages.filter((message) => message.role === "user");
  const latestUserMessage = userMessages[userMessages.length - 1]?.content ?? "";
  const previousUserMessage = userMessages[userMessages.length - 2]?.content ?? "";
  const intent = getMentorIntent(latestUserMessage);
  const keywords = extractKeywords(latestUserMessage);
  const hasResume = Boolean(resumeContext.trim());
  const namedTarget = getNamedTarget(latestUserMessage);
  const timeline = getTimeline(latestUserMessage) || "8 weeks";
  const focus = keywords.length ? keywords.join(", ") : "your current goal";
  const contextLine = getConversationalContext(
    previousUserMessage,
    latestUserMessage,
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

  const actionMap = {
    "resume review": [
      `## 📝 Resume Review Plan`,
      contextLine,
      "",
      "### 🔍 What to improve first",
      "- Make the headline match the exact role you want.",
      "- Rewrite bullets so they show impact, tools, and measurable result.",
      "- Move your strongest project or experience higher.",
      "- Remove vague phrases like “worked on” and replace them with action verbs.",
      "",
      hasResume
        ? "### ✅ Personalized guidance\nYour uploaded resume context is available, so the next rewrite should preserve your real experience while making it sharper."
        : "### 👉 Clear next step\nPaste 3 resume bullets here, and I will rewrite them into recruiter-ready bullets.",
    ],
    "mock interview": [
      `## 🎙️ Mock Interview Mode`,
      contextLine,
      "",
      "Let us make this feel like a real interview. I will ask one question at a time, then evaluate your answer for structure, depth, clarity, and confidence.",
      "",
      "### 🔥 First question",
      "**Tell me about one project you built, the hardest technical decision you made, and why you chose that approach.**",
      "",
      "### 👉 Clear next step",
      "Answer in 6-8 lines. I will then give you a score, feedback, and a stronger model answer.",
    ],
    roadmap: [
      `## 🧭 Roadmap for ${focus}`,
      contextLine,
      "",
      "### 📌 Phase 1: Foundation",
      "- Identify the exact target role and required skills.",
      "- Fix the weakest prerequisite first.",
      "",
      "### 🛠️ Phase 2: Proof",
      "- Build one project or portfolio artifact tied to the role.",
      "- Convert the work into resume bullets and interview stories.",
      "",
      "### 🎯 Phase 3: Interview readiness",
      "- Practice role-specific questions.",
      "- Review mistakes and repeat the weak areas.",
      "",
      "### 👉 Clear next step",
      "Start today by choosing one target role and listing the top 5 skills it requires.",
    ],
    "company preparation": [
      `## 🏢 Company Preparation: ${focus}`,
      contextLine,
      "",
      "### 🎯 Round-wise focus",
      "- Aptitude: speed, accuracy, and repeated pattern practice.",
      "- Coding: arrays, strings, hashing, recursion, and implementation clarity.",
      "- Technical: projects, fundamentals, and tradeoffs.",
      "- HR: motivation, communication, and company fit.",
      "",
      "### 👉 Clear next step",
      "Start with one previous paper or interview experience, then build a mistake log from it.",
    ],
    "skill learning": [
      `## ⚡ Skill Learning Plan: ${focus}`,
      contextLine,
      "",
      "### 🧪 Learn in a project loop",
      "1. Learn one concept.",
      "2. Apply it in a small feature.",
      "3. Debug one failure.",
      "4. Explain the tradeoff out loud.",
      "5. Save the artifact for portfolio or interview use.",
      "",
      "### 👉 Clear next step",
      "Pick one concept today and build a tiny feature around it instead of only watching tutorials.",
    ],
    "general mentoring": [
      `## 🌟 Career Mentor Plan: ${focus}`,
      contextLine,
      "",
      "### ✅ Immediate plan",
      "- Pick one target outcome for this week.",
      "- Convert it into 3 deliverables: one skill, one proof artifact, and one interview story.",
      "- Spend 90 minutes per day on practice and 15 minutes reviewing mistakes.",
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
    ],
  };

  return actionMap[intent].join("\n");
}

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Invalid JSON request body." });
    return;
  }

  next(error);
});

app.post("/api/openai-interview", openAiInterviewHandler);

app.get("/api/openai-status", (_req, res) => {
  res.status(200).json({
    data: getOpenAiConfigStatus(),
  });
});

app.post("/api/career-assistant", async (req, res) => {
  const messages = sanitizeAssistantMessages(
    req.body?.messages ??
      (typeof req.body?.message === "string"
        ? [{ role: "user", content: req.body.message }]
        : [])
  );
  const resumeContext =
    typeof req.body?.resumeContext === "string" ? req.body.resumeContext : "";

  if (!messages.length) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  try {
    const apiKey = assertValidOpenAiApiKey();
    const model = process.env.OPENAI_MODEL || defaultModel;
    const response = await fetch(openAiApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              "You are Aspiro AI, a ChatGPT-style career mentor inside JobReady AI.",
              "Write conversationally like ChatGPT, Claude, or Gemini: warm, practical, direct, and specific.",
              "Use the full conversation history to answer naturally, remember earlier user goals, and avoid repeating previous advice.",
              "Never start with phrases like 'I am carrying forward your earlier context', 'I am using your earlier message', or other robotic context disclaimers.",
              "Prefer natural openings such as 'Based on your goal of...', 'Great, here is a focused plan...', or 'Since you are targeting...'.",
              "Infer the user's intent as one of: roadmap, resume review, mock interview, company preparation, skill learning, or general mentoring.",
              "Be role-specific and company-specific whenever the user names a role, skill, company, timeline, or resume detail.",
              "For roadmap requests, give phases, milestones, and daily/weekly actions.",
              "For resume review, critique and rewrite bullets using impact, metrics, tools, and role alignment.",
              "For mock interviews, ask one question at a time and wait for the answer before scoring.",
              "For company preparation, produce round-wise prep and expected question patterns.",
              "For skill learning, teach through projects, practice loops, and checkpoints.",
              "Use Markdown with emojis, headings, bullets, bold text, and short sections.",
              "Avoid tables unless the user explicitly asks for a table; prefer rich formatted plans with sections.",
              "Every answer must include actionable advice, a clear next step, personalized guidance, daily routine or practice rhythm when relevant, resources when useful, and expected outcomes when useful.",
              "Do not give generic motivational filler.",
              "Avoid claiming you saved files or completed actions outside the chat.",
            ].join(" "),
          },
          ...messages,
          ...(resumeContext.trim()
            ? [
                {
                  role: "user",
                  content: `Resume context for this conversation:\n${resumeContext.slice(
                    0,
                    6000
                  )}`,
                },
              ]
            : []),
        ],
        temperature: 0.6,
      }),
    });
    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      const requestError = new Error(
        responseBody.error?.message ||
          "Unable to complete career assistant request."
      );
      requestError.status = response.status;
      requestError.code = responseBody.error?.code || "OPENAI_UPSTREAM_ERROR";
      requestError.diagnostics = getOpenAiConfigStatus(apiKey);

      const formatted = formatOpenAiServerError(requestError);
      res.status(formatted.status).json({
        ...formatted.body,
        data: {
          reply: buildLocalCareerReply(messages, resumeContext),
          source: "local",
          upstreamError: formatted.body.error,
        },
      });
      return;
    }

    const reply = extractOpenAiText(responseBody);

    res.status(200).json({
      data: {
        reply: reply || "I am ready to help with your career preparation.",
        model,
        source: "openai",
      },
    });
  } catch (error) {
    const formatted = formatOpenAiServerError(error);
    res.status(formatted.status).json({
      ...formatted.body,
      data: {
        reply: buildLocalCareerReply(messages, resumeContext),
        source: "local",
        upstreamError: formatted.body.error,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`JobReady AI backend listening on http://localhost:${port}`);
});
