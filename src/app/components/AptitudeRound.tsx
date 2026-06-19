import { useState } from "react";
import {
  Play,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Filter,
  Search,
} from "lucide-react";

const categories = [
  { name: "All Topics", count: 150, color: "bg-[#2563EB]" },
  { name: "Quantitative", count: 50, color: "bg-[#10B981]" },
  { name: "Logical Reasoning", count: 40, color: "bg-[#F59E0B]" },
  { name: "Verbal Ability", count: 35, color: "bg-[#8B5CF6]" },
  { name: "Data Interpretation", count: 25, color: "bg-[#EC4899]" },
];

const tests = [
  {
    title: "Number Series & Sequences",
    category: "Quantitative",
    questions: 20,
    duration: "30 min",
    difficulty: "Medium",
    completed: false,
    score: null,
  },
  {
    title: "Logical Deduction",
    category: "Logical Reasoning",
    questions: 25,
    duration: "35 min",
    difficulty: "Hard",
    completed: true,
    score: 92,
  },
  {
    title: "Reading Comprehension",
    category: "Verbal Ability",
    questions: 15,
    duration: "25 min",
    difficulty: "Easy",
    completed: true,
    score: 88,
  },
  {
    title: "Profit & Loss",
    category: "Quantitative",
    questions: 18,
    duration: "25 min",
    difficulty: "Medium",
    completed: false,
    score: null,
  },
  {
    title: "Blood Relations",
    category: "Logical Reasoning",
    questions: 20,
    duration: "30 min",
    difficulty: "Easy",
    completed: true,
    score: 95,
  },
  {
    title: "Graph Interpretation",
    category: "Data Interpretation",
    questions: 15,
    duration: "30 min",
    difficulty: "Hard",
    completed: false,
    score: null,
  },
];

const stats = [
  { label: "Total Tests", value: "150", icon: BookOpen, color: "#2563EB" },
  { label: "Completed", value: "128", icon: CheckCircle2, color: "#10B981" },
  { label: "Average Score", value: "87%", icon: Target, color: "#F59E0B" },
  { label: "Time Spent", value: "24h", icon: Clock, color: "#8B5CF6" },
];

export function AptitudeRound() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Aptitude & Logical Round</h1>
        <p className="text-[#94A3B8]">
          Master quantitative, logical, and verbal reasoning skills
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
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
              </div>
              <p className="text-2xl mb-1 text-white">{stat.value}</p>
              <p className="text-sm text-[#94A3B8]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl text-white mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-4 rounded-xl border transition-all ${
                selectedCategory === category.name
                  ? "bg-[#2563EB] border-[#2563EB] text-white"
                  : "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:border-[#2563EB]"
              }`}
            >
              <div className="text-2xl mb-2">{category.count}</div>
              <div className="text-sm">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#334155] rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] transition-all">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Tests Grid */}
      <div>
        <h2 className="text-xl text-white mb-4">Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, index) => (
            <div
              key={index}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all group"
            >
              {test.completed && (
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span className="text-sm text-[#10B981]">Completed</span>
                  <span className="ml-auto text-lg text-[#10B981]">
                    {test.score}%
                  </span>
                </div>
              )}
              <h3 className="text-white mb-3">{test.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded-full">
                  {test.category}
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    test.difficulty === "Easy"
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : test.difficulty === "Medium"
                      ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                      : "bg-[#EF4444]/20 text-[#EF4444]"
                  }`}
                >
                  {test.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {test.questions} questions
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {test.duration}
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                <Play className="w-4 h-4" />
                {test.completed ? "Retake Test" : "Start Test"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Tips */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6">
        <h3 className="text-xl text-white mb-4">💡 Practice Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="mb-2">Time Management</h4>
            <p className="text-sm text-blue-100">
              Allocate specific time for each question type
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="mb-2">Regular Practice</h4>
            <p className="text-sm text-blue-100">
              Solve at least 20 questions daily
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="mb-2">Review Mistakes</h4>
            <p className="text-sm text-blue-100">
              Analyze wrong answers to improve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
