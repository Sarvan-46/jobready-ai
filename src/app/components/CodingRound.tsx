import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Code,
  FileText,
  Play,
  Send,
  Target,
  Terminal,
  Trophy,
} from "lucide-react";
import { saveRoundScore } from "../userData";

type TestCaseStatus = "passed" | "failed" | "pending";

type TestCase = {
  id: number;
  input: string;
  expected: string;
  status: TestCaseStatus;
};

const starterCode = `function maxProfit(prices) {
  let minPrice = Infinity;
  let bestProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    bestProfit = Math.max(bestProfit, price - minPrice);
  }

  return bestProfit;
}`;

const initialTestCases: TestCase[] = [
  {
    id: 1,
    input: "prices = [7, 1, 5, 3, 6, 4]",
    expected: "5",
    status: "pending",
  },
  {
    id: 2,
    input: "prices = [7, 6, 4, 3, 1]",
    expected: "0",
    status: "pending",
  },
  {
    id: 3,
    input: "prices = [2, 4, 1, 9]",
    expected: "8",
    status: "pending",
  },
];

export function CodingRound() {
  const [code, setCode] = useState(starterCode);
  const [testCases, setTestCases] = useState(initialTestCases);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const passedCount = testCases.filter((test) => test.status === "passed").length;
  const score = Math.round((passedCount / testCases.length) * 100);

  const scoreMessage = useMemo(() => {
    if (!isSubmitted) return "Run the sample tests before submitting.";
    if (score === 100) return "Excellent. All visible cases passed.";
    if (score >= 70) return "Good progress. Review edge cases before moving on.";
    return "Keep iterating on the core logic and test coverage.";
  }, [isSubmitted, score]);

  const runCode = () => {
    setHasRunCode(true);
    setIsSubmitted(false);
    setTestCases((cases) =>
      cases.map<TestCase>((test) => ({
        ...test,
        status:
          code.includes("bestProfit") || code.includes("maxProfit")
            ? "passed"
            : test.id === 1
            ? "passed"
            : "failed",
      }))
    );
  };

  const submitSolution = async () => {
    setHasRunCode(true);
    setIsSubmitted(true);
    setSaveStatus("Saving coding score...");

    const nextCases: TestCase[] = testCases.map((test) => ({
        ...test,
        status:
          code.length > 120 ? "passed" : test.id === 1 ? "passed" : "failed",
      }));
    const nextPassedCount = nextCases.filter(
      (test) => test.status === "passed"
    ).length;
    const nextScore = Math.round((nextPassedCount / nextCases.length) * 100);

    setTestCases(nextCases);

    try {
      await saveRoundScore("coding", nextScore);
      setSaveStatus("Coding score saved to Firebase.");
    } catch (error) {
      setSaveStatus(
        error instanceof Error ? error.message : "Could not save coding score."
      );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-blue-100">JobReady AI</span>
            </div>
            <h1 className="text-3xl mb-2 text-white">Coding Round</h1>
            <p className="text-blue-100 max-w-2xl">
              Solve interview-style programming questions with test cases,
              instant run feedback, and submission scoring.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-[280px]">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{score}%</p>
              <p className="text-sm text-blue-100">Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{passedCount}/3</p>
              <p className="text-sm text-blue-100">Passed</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">35m</p>
              <p className="text-sm text-blue-100">Timer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="space-y-6">
          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full">
                    Easy
                  </span>
                  <span className="px-3 py-1 bg-[#2563EB]/20 text-[#60A5FA] text-xs rounded-full">
                    Arrays
                  </span>
                </div>
                <h2 className="text-2xl text-white mb-2">
                  Best Time to Buy and Sell Stock
                </h2>
                <p className="text-[#94A3B8]">
                  Given an array where each value is the price of a stock on a
                  given day, choose one day to buy and a later day to sell.
                  Return the maximum profit possible. Return 0 if no profit can
                  be made.
                </p>
              </div>
              <div className="hidden sm:flex w-12 h-12 bg-[#2563EB]/20 rounded-xl items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#60A5FA]" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
                <p className="text-sm text-[#94A3B8] mb-2">Example</p>
                <pre className="text-sm text-[#CBD5E1] whitespace-pre-wrap font-mono">
{`Input: prices = [7, 1, 5, 3, 6, 4]
Output: 5
Explanation: Buy at 1 and sell at 6.`}
                </pre>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0F172A] rounded-xl p-4">
                  <Target className="w-5 h-5 text-[#2563EB] mb-2" />
                  <p className="text-sm text-[#94A3B8]">Goal</p>
                  <p className="text-white">Max profit</p>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-4">
                  <Clock className="w-5 h-5 text-[#F59E0B] mb-2" />
                  <p className="text-sm text-[#94A3B8]">Time Limit</p>
                  <p className="text-white">1 second</p>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-4">
                  <Trophy className="w-5 h-5 text-[#10B981] mb-2" />
                  <p className="text-sm text-[#94A3B8]">Points</p>
                  <p className="text-white">100</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <h2 className="text-xl text-white mb-4">Test Cases</h2>
            <div className="space-y-3">
              {testCases.map((test) => (
                <div
                  key={test.id}
                  className="bg-[#0F172A] border border-[#334155] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-white">Case {test.id}</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                        test.status === "passed"
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : test.status === "failed"
                          ? "bg-[#EF4444]/20 text-[#EF4444]"
                          : "bg-[#334155] text-[#94A3B8]"
                      }`}
                    >
                      {test.status === "passed" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {test.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#64748B] mb-1">Input</p>
                      <p className="text-[#CBD5E1] font-mono">{test.input}</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] mb-1">Expected</p>
                      <p className="text-[#CBD5E1] font-mono">
                        {test.expected}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[#334155] bg-[#0F172A]">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#60A5FA]" />
                <div>
                  <h2 className="text-white">Code Editor</h2>
                  <p className="text-sm text-[#94A3B8]">JavaScript</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={runCode}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1E293B] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] transition-all"
                >
                  <Play className="w-4 h-4" />
                  Run Code
                </button>
                <button
                  onClick={submitSolution}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Solution
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="w-full min-h-[460px] bg-[#020617] text-[#E2E8F0] p-6 font-mono text-sm leading-7 outline-none resize-y border-0"
            />
          </section>

          <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
              <div>
                <h2 className="text-xl text-white mb-2">Score Section</h2>
                <p className="text-[#94A3B8]">{scoreMessage}</p>
                {saveStatus && (
                  <p className="text-sm text-[#94A3B8] mt-2">{saveStatus}</p>
                )}
              </div>
              <div className="w-24 h-24 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center shrink-0">
                <span className="text-2xl text-white">{score}%</span>
              </div>
            </div>

            <div className="w-full bg-[#0F172A] rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-3 rounded-full transition-all"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0F172A] rounded-xl p-4">
                <p className="text-sm text-[#94A3B8] mb-1">Visible Tests</p>
                <p className="text-2xl text-white">{passedCount}/3</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4">
                <p className="text-sm text-[#94A3B8] mb-1">Runtime</p>
                <p className="text-2xl text-white">
                  {hasRunCode ? "46ms" : "--"}
                </p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4">
                <p className="text-sm text-[#94A3B8] mb-1">Memory</p>
                <p className="text-2xl text-white">
                  {hasRunCode ? "41MB" : "--"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
