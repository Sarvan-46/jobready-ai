import { useState } from "react";
import {
  Code,
  Play,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Trophy,
  BookOpen,
} from "lucide-react";

const difficultyLevels = [
  { name: "Easy", count: 45, color: "text-[#10B981]", bg: "bg-[#10B981]/20" },
  { name: "Medium", count: 38, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/20" },
  { name: "Hard", count: 17, color: "text-[#EF4444]", bg: "bg-[#EF4444]/20" },
];

const topics = [
  { name: "Arrays", solved: 28, total: 35 },
  { name: "Strings", solved: 22, total: 30 },
  { name: "Trees", solved: 15, total: 25 },
  { name: "Dynamic Programming", solved: 8, total: 20 },
  { name: "Graphs", solved: 12, total: 20 },
  { name: "Linked Lists", solved: 18, total: 22 },
];

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    acceptance: "48%",
    solved: true,
    companies: ["Google", "Amazon", "Microsoft"],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    acceptance: "33%",
    solved: false,
    companies: ["Amazon", "Bloomberg"],
  },
  {
    id: 3,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    acceptance: "62%",
    solved: true,
    companies: ["Facebook", "Microsoft"],
  },
  {
    id: 4,
    title: "Coin Change",
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: "41%",
    solved: false,
    companies: ["Amazon", "Google"],
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    acceptance: "40%",
    solved: true,
    companies: ["Google", "Amazon"],
  },
  {
    id: 6,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: "59%",
    solved: true,
    companies: ["Microsoft", "Apple"],
  },
];

const stats = [
  { label: "Problems Solved", value: "68", icon: CheckCircle2, color: "#10B981" },
  { label: "Current Streak", value: "12 days", icon: Flame, color: "#F59E0B" },
  { label: "Success Rate", value: "78%", icon: Target, color: "#2563EB" },
  { label: "Rank", value: "#2,456", icon: Trophy, color: "#8B5CF6" },
];

export function CodingRound() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Coding Round</h1>
        <p className="text-[#94A3B8]">
          Practice data structures and algorithms problems
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl mb-1 text-white">{stat.value}</p>
              <p className="text-sm text-[#94A3B8]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Progress by Difficulty</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyLevels.map((level) => (
            <div
              key={level.name}
              className={`${level.bg} border border-[#334155] rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => setSelectedDifficulty(level.name)}
            >
              <div className={`text-3xl mb-2 ${level.color}`}>
                {level.count}
              </div>
              <div className="text-white mb-1">{level.name}</div>
              <div className="text-sm text-[#94A3B8]">Problems</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Progress */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Topics Progress</h2>
        <div className="space-y-4">
          {topics.map((topic) => {
            const progress = (topic.solved / topic.total) * 100;
            return (
              <div key={topic.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{topic.name}</span>
                  <span className="text-[#94A3B8] text-sm">
                    {topic.solved}/{topic.total}
                  </span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problems List */}
      <div>
        <h2 className="text-xl text-white mb-4">Practice Problems</h2>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F172A] border-b border-[#334155]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Acceptance
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Companies
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-[#94A3B8]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-[#0F172A] transition-colors"
                  >
                    <td className="px-6 py-4">
                      {problem.solved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#334155] rounded-full"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white">{problem.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          problem.difficulty === "Easy"
                            ? "bg-[#10B981]/20 text-[#10B981]"
                            : problem.difficulty === "Medium"
                            ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                            : "bg-[#EF4444]/20 text-[#EF4444]"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">
                      {problem.category}
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">
                      {problem.acceptance}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {problem.companies.slice(0, 2).map((company) => (
                          <span
                            key={company}
                            className="px-2 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded"
                          >
                            {company}
                          </span>
                        ))}
                        {problem.companies.length > 2 && (
                          <span className="px-2 py-1 bg-[#334155] text-[#94A3B8] text-xs rounded">
                            +{problem.companies.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                        <Code className="w-4 h-4" />
                        Solve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Study Plan */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl text-white mb-2">
              📚 Suggested Study Plan
            </h3>
            <p className="text-green-100 mb-4">
              Follow this plan to master coding interviews
            </p>
            <ul className="space-y-2 text-white">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Complete 2-3 easy problems daily
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Focus on one topic per week
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Review solutions and time complexity
              </li>
            </ul>
          </div>
          <BookOpen className="w-16 h-16 text-white opacity-30" />
        </div>
      </div>
    </div>
  );
}
