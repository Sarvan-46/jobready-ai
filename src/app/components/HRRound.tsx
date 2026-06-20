import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { saveRoundScore } from "../userData";

type HRQuestion = {
  question: string;
  category: string;
  guide: string;
};

const questions: HRQuestion[] = [
  {
    question: "Tell me about yourself.",
    category: "Introduction",
    guide: "Cover your current background, relevant experience, and the role you are targeting.",
  },
  {
    question: "Why do you want to work for this company?",
    category: "Motivation",
    guide: "Connect company mission, product, culture, and role responsibilities to your goals.",
  },
  {
    question: "What are your greatest strengths?",
    category: "Self Assessment",
    guide: "Mention strengths with evidence, not just adjectives.",
  },
  {
    question: "What is one weakness you are actively improving?",
    category: "Self Awareness",
    guide: "Choose a real but manageable weakness and explain your improvement plan.",
  },
  {
    question: "Describe a challenging situation you handled well.",
    category: "Behavioral",
    guide: "Use the STAR method: Situation, Task, Action, Result.",
  },
  {
    question: "How do you handle feedback or criticism?",
    category: "Growth Mindset",
    guide: "Show openness, ownership, and a specific example of acting on feedback.",
  },
  {
    question: "Tell me about a time you worked in a team.",
    category: "Teamwork",
    guide: "Explain your role, collaboration style, and the shared outcome.",
  },
  {
    question: "How do you manage deadlines and pressure?",
    category: "Work Style",
    guide: "Discuss prioritization, communication, and calm execution.",
  },
  {
    question: "Where do you see yourself in five years?",
    category: "Career Goals",
    guide: "Balance ambition with alignment to the role and company path.",
  },
  {
    question: "Why should we hire you?",
    category: "Closing",
    guide: "Summarize your skills, attitude, preparation, and value to the team.",
  },
];

const scoreAnswer = (answer: string) => {
  const trimmed = answer.trim();
  if (!trimmed) return 0;

  const wordCount = trimmed.split(/\s+/).length;
  const hasStructure =
    /situation|task|action|result|first|second|finally|example/i.test(trimmed);
  const hasImpact =
    /result|improved|learned|delivered|achieved|reduced|increased|because/i.test(
      trimmed
    );
  const hasRoleFit =
    /team|company|role|customer|project|skill|growth|value/i.test(trimmed);

  let score = Math.min(45, wordCount * 2);
  if (hasStructure) score += 18;
  if (hasImpact) score += 20;
  if (hasRoleFit) score += 17;

  return Math.min(100, score);
};

export function HRRound() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const answeredCount = answers.filter((answer) => answer.trim()).length;
  const question = questions[currentQuestion];

  const questionScores = useMemo(
    () => answers.map((answer) => scoreAnswer(answer)),
    [answers]
  );

  const finalScore = useMemo(
    () =>
      Math.round(
        questionScores.reduce((total, score) => total + score, 0) /
          questions.length
      ),
    [questionScores]
  );

  const strengths = useMemo(() => {
    const strongSignals = [];
    const completeAnswers = answers.filter((answer) => answer.trim().length > 0);
    const structuredAnswers = answers.filter((answer) =>
      /situation|task|action|result|first|second|finally|example/i.test(answer)
    );
    const impactAnswers = answers.filter((answer) =>
      /result|improved|learned|delivered|achieved|reduced|increased/i.test(answer)
    );

    if (completeAnswers.length >= 8) {
      strongSignals.push("Strong interview completion and consistency");
    }
    if (structuredAnswers.length >= 4) {
      strongSignals.push("Good use of structured storytelling");
    }
    if (impactAnswers.length >= 4) {
      strongSignals.push("Clear focus on outcomes and learning");
    }
    if (finalScore >= 75) {
      strongSignals.push("Professional, role-ready answer quality");
    }

    return strongSignals.length
      ? strongSignals
      : ["You have a clear starting point for building stronger HR answers"];
  }, [answers, finalScore]);

  const weaknesses = useMemo(() => {
    const improvementAreas = [];
    const shortAnswers = answers.filter(
      (answer) => answer.trim() && answer.trim().split(/\s+/).length < 18
    );
    const blankAnswers = questions.length - answeredCount;
    const lowStructureCount = answers.filter(
      (answer) =>
        answer.trim() &&
        !/situation|task|action|result|first|second|finally|example/i.test(
          answer
        )
    ).length;

    if (blankAnswers > 0) {
      improvementAreas.push(`Answer all questions before a real HR round`);
    }
    if (shortAnswers.length >= 3) {
      improvementAreas.push("Add more context, examples, and measurable detail");
    }
    if (lowStructureCount >= 5) {
      improvementAreas.push("Use STAR or a clear beginning-middle-result flow");
    }
    if (finalScore < 70) {
      improvementAreas.push("Tie answers more directly to the role and company");
    }

    return improvementAreas.length
      ? improvementAreas
      : ["Keep refining specificity and confidence for senior interviewers"];
  }, [answers, answeredCount, finalScore]);

  const updateAnswer = (value: string) => {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === currentQuestion ? value : answer
      )
    );
  };

  const goToPrevious = () => {
    setCurrentQuestion((index) => Math.max(index - 1, 0));
  };

  const goToNext = () => {
    setCurrentQuestion((index) => Math.min(index + 1, questions.length - 1));
  };

  const resetInterview = () => {
    setAnswers(Array(questions.length).fill(""));
    setCurrentQuestion(0);
    setIsSubmitted(false);
    setSaveStatus("");
  };

  const submitInterview = async () => {
    setIsSubmitted(true);
    setSaveStatus("Saving HR score...");

    try {
      await saveRoundScore("hr", finalScore);
      setSaveStatus("HR score saved to Firebase.");
    } catch (error) {
      setSaveStatus(
        error instanceof Error ? error.message : "Could not save HR score."
      );
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-blue-100">JobReady AI</span>
            </div>
            <h1 className="text-3xl mb-2 text-white">
              AI HR Interview Simulator
            </h1>
            <p className="text-blue-100 max-w-2xl">
              Practice 10 HR interview questions, write full answers, and get a
              scored strengths and weaknesses review.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-[280px]">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{answeredCount}/10</p>
              <p className="text-sm text-blue-100">Answered</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{currentQuestion + 1}/10</p>
              <p className="text-sm text-blue-100">Question</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{isSubmitted ? finalScore : 0}%</p>
              <p className="text-sm text-blue-100">Score</p>
            </div>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="space-y-6">
          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#10B981]/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">
                    Interview Submitted
                  </h2>
                  <p className="text-[#94A3B8]">
                    Your AI-style HR readiness score and feedback are ready.
                  </p>
                  {saveStatus && (
                    <p className="text-sm text-[#94A3B8] mt-2">{saveStatus}</p>
                  )}
                </div>
              </div>
              <button
                onClick={resetInterview}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Interview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0F172A] rounded-xl p-5">
                <Target className="w-6 h-6 text-[#2563EB] mb-3" />
                <p className="text-sm text-[#94A3B8] mb-2">Final Score</p>
                <p className="text-4xl text-white">{finalScore}%</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-5">
                <CheckCircle2 className="w-6 h-6 text-[#10B981] mb-3" />
                <p className="text-sm text-[#94A3B8] mb-2">Completed</p>
                <p className="text-4xl text-white">{answeredCount}/10</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-5">
                <TrendingUp className="w-6 h-6 text-[#F59E0B] mb-3" />
                <p className="text-sm text-[#94A3B8] mb-2">Readiness</p>
                <p className="text-4xl text-white">
                  {finalScore >= 80 ? "High" : finalScore >= 60 ? "Good" : "Build"}
                </p>
              </div>
            </div>

            <div className="w-full bg-[#0F172A] rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-3 rounded-full transition-all"
                style={{ width: `${finalScore}%` }}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#10B981]" />
                </div>
                <h2 className="text-xl text-white">Strengths</h2>
              </div>
              <div className="space-y-3">
                {strengths.map((strength) => (
                  <div
                    key={strength}
                    className="flex items-start gap-3 bg-[#0F172A] rounded-lg p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 shrink-0" />
                    <p className="text-[#CBD5E1]">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h2 className="text-xl text-white">Weaknesses</h2>
              </div>
              <div className="space-y-3">
                {weaknesses.map((weakness) => (
                  <div
                    key={weakness}
                    className="flex items-start gap-3 bg-[#0F172A] rounded-lg p-4"
                  >
                    <ArrowRight className="w-5 h-5 text-[#F59E0B] mt-0.5 shrink-0" />
                    <p className="text-[#CBD5E1]">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <h2 className="text-xl text-white mb-5">Question Review</h2>
            <div className="space-y-3">
              {questions.map((item, index) => (
                <button
                  key={item.question}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setIsSubmitted(false);
                  }}
                  className="w-full text-left bg-[#0F172A] border border-[#334155] rounded-xl p-4 hover:border-[#2563EB] transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-white mb-1">
                        {index + 1}. {item.question}
                      </p>
                      <p className="text-sm text-[#94A3B8]">
                        {answers[index] || "No answer provided"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#2563EB]/20 text-[#60A5FA] rounded-full text-sm shrink-0">
                      {questionScores[index]}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-[#94A3B8] mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <h2 className="text-2xl text-white leading-snug mb-3">
                  {question.question}
                </h2>
                <span className="inline-flex px-3 py-1 bg-[#2563EB]/20 text-[#60A5FA] rounded-full text-sm">
                  {question.category}
                </span>
              </div>
              <div className="hidden md:flex w-12 h-12 bg-[#2563EB]/20 rounded-xl items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-[#60A5FA]" />
              </div>
            </div>

            <div className="w-full bg-[#0F172A] rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 mb-6">
              <p className="text-sm text-[#94A3B8] mb-2">AI Coaching Prompt</p>
              <p className="text-[#CBD5E1]">{question.guide}</p>
            </div>

            <label className="block text-white mb-3" htmlFor="hr-answer">
              Your Answer
            </label>
            <textarea
              id="hr-answer"
              value={answers[currentQuestion]}
              onChange={(event) => updateAnswer(event.target.value)}
              placeholder="Write your answer as if you are speaking to an HR interviewer..."
              className="w-full min-h-[260px] bg-[#0F172A] border border-[#334155] rounded-xl p-5 text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-y"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Question
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                {currentQuestion < questions.length - 1 && (
                  <button
                    onClick={goToNext}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] transition-all"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={submitInterview}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Interview
                </button>
              </div>
            </div>
          </section>

          <aside className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 h-fit">
            <h3 className="text-white mb-4">Interview Map</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => {
                const isCurrent = index === currentQuestion;
                const isAnswered = answers[index].trim().length > 0;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`h-10 rounded-lg text-sm transition-all ${
                      isCurrent
                        ? "bg-[#2563EB] text-white"
                        : isAnswered
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:border-[#2563EB]"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Answered</span>
                <span className="text-white">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Remaining</span>
                <span className="text-white">{questions.length - answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Current Draft</span>
                <span className="text-white">
                  {scoreAnswer(answers[currentQuestion])}%
                </span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <p className="text-sm text-[#94A3B8] mb-2">Answer Quality</p>
              <div className="w-full bg-[#1E293B] rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-2 rounded-full transition-all"
                  style={{ width: `${scoreAnswer(answers[currentQuestion])}%` }}
                />
              </div>
              <p className="text-sm text-[#CBD5E1]">
                Add examples, results, and role fit to improve this answer.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
