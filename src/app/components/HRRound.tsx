import { useState } from "react";
import {
  Briefcase,
  Play,
  CheckCircle2,
  MessageSquare,
  Users,
  TrendingUp,
  Video,
  FileText,
} from "lucide-react";

const categories = [
  {
    name: "Behavioral Questions",
    count: 35,
    completed: 32,
    icon: Users,
    color: "from-[#2563EB] to-[#1D4ED8]",
  },
  {
    name: "Situational Questions",
    count: 25,
    completed: 22,
    icon: MessageSquare,
    color: "from-[#10B981] to-[#059669]",
  },
  {
    name: "Career Goals",
    count: 20,
    completed: 18,
    icon: TrendingUp,
    color: "from-[#F59E0B] to-[#D97706]",
  },
  {
    name: "Company Research",
    count: 30,
    completed: 28,
    icon: Briefcase,
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
];

const commonQuestions = [
  {
    question: "Tell me about yourself",
    category: "Introduction",
    practiced: true,
    tip: "Use the present-past-future framework",
  },
  {
    question: "What are your strengths and weaknesses?",
    category: "Self-Assessment",
    practiced: true,
    tip: "Be honest and show self-awareness",
  },
  {
    question: "Why do you want to work here?",
    category: "Company Research",
    practiced: false,
    tip: "Research the company culture and values",
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    practiced: false,
    tip: "Align your goals with the company's vision",
  },
  {
    question: "Tell me about a challenging situation you faced",
    category: "Behavioral",
    practiced: true,
    tip: "Use the STAR method",
  },
  {
    question: "Why should we hire you?",
    category: "Closing",
    practiced: false,
    tip: "Highlight your unique value proposition",
  },
];

const mockInterviews = [
  {
    title: "Entry Level - General HR Round",
    duration: "30 min",
    questions: 15,
    difficulty: "Easy",
    completed: 2,
  },
  {
    title: "Mid Level - Behavioral Interview",
    duration: "45 min",
    questions: 20,
    difficulty: "Medium",
    completed: 1,
  },
  {
    title: "Senior Level - Leadership Interview",
    duration: "60 min",
    questions: 25,
    difficulty: "Hard",
    completed: 0,
  },
];

const tips = [
  {
    title: "Research the Company",
    description: "Know their mission, values, and recent achievements",
    icon: "🔍",
  },
  {
    title: "Prepare STAR Stories",
    description: "Situation, Task, Action, Result for behavioral questions",
    icon: "⭐",
  },
  {
    title: "Ask Questions",
    description: "Prepare thoughtful questions about the role and company",
    icon: "❓",
  },
  {
    title: "Practice Body Language",
    description: "Maintain eye contact and positive posture",
    icon: "🤝",
  },
];

export function HRRound() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">HR Interview Round</h1>
        <p className="text-[#94A3B8]">
          Master behavioral questions and ace your HR interviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-[#2563EB]" />
          </div>
          <p className="text-2xl mb-1 text-white">110</p>
          <p className="text-sm text-[#94A3B8]">Total Questions</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          </div>
          <p className="text-2xl mb-1 text-white">100</p>
          <p className="text-sm text-[#94A3B8]">Practiced</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <p className="text-2xl mb-1 text-white">3</p>
          <p className="text-sm text-[#94A3B8]">Mock Interviews</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl mb-1 text-white">90%</p>
          <p className="text-sm text-[#94A3B8]">Completion Rate</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl text-white mb-6">Question Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const progress = (category.completed / category.count) * 100;
            return (
              <div
                key={category.name}
                className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white mb-2">{category.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-sm text-[#94A3B8]">
                    {category.completed}/{category.count} completed
                  </span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Questions */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Most Common HR Questions</h2>
        <div className="space-y-4">
          {commonQuestions.map((item, index) => (
            <div
              key={index}
              className="bg-[#0F172A] rounded-lg p-6 hover:bg-[#1E293B] transition-colors"
            >
              <div className="flex items-start gap-4">
                {item.practiced ? (
                  <CheckCircle2 className="w-6 h-6 text-[#10B981] mt-1 flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 border-2 border-[#334155] rounded-full mt-1 flex-shrink-0"></div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white mb-2">{item.question}</h3>
                      <span className="px-3 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                      {item.practiced ? "Review" : "Practice"}
                    </button>
                  </div>
                  <div className="flex items-start gap-2 mt-4 p-4 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg">
                    <span className="text-lg">💡</span>
                    <p className="text-sm text-[#94A3B8]">{item.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interviews */}
      <div>
        <h2 className="text-xl text-white mb-6">AI Mock Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockInterviews.map((interview, index) => (
            <div
              key={index}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all"
            >
              <h3 className="text-white mb-4">{interview.title}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">Duration</span>
                  <span className="text-white">{interview.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">Questions</span>
                  <span className="text-white">{interview.questions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">Difficulty</span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      interview.difficulty === "Easy"
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : interview.difficulty === "Medium"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                        : "bg-[#EF4444]/20 text-[#EF4444]"
                    }`}
                  >
                    {interview.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">Completed</span>
                  <span className="text-white">{interview.completed}x</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                <Play className="w-4 h-4" />
                Start Interview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Interview Success Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h3 className="text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-purple-100">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Templates */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-white">Answer Templates & Examples</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors">
            <FileText className="w-4 h-4" />
            View All Templates
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0F172A] rounded-lg p-5">
            <h4 className="text-white mb-2">STAR Method Template</h4>
            <p className="text-sm text-[#94A3B8] mb-3">
              Structure your behavioral answers effectively
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-[#2563EB]">S:</span>
                <span className="text-[#94A3B8]">Situation - Set the scene</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#2563EB]">T:</span>
                <span className="text-[#94A3B8]">Task - Describe the challenge</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#2563EB]">A:</span>
                <span className="text-[#94A3B8]">Action - Explain your steps</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#2563EB]">R:</span>
                <span className="text-[#94A3B8]">Result - Share the outcome</span>
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] rounded-lg p-5">
            <h4 className="text-white mb-2">Elevator Pitch Template</h4>
            <p className="text-sm text-[#94A3B8] mb-3">
              Perfect your self-introduction
            </p>
            <div className="space-y-2 text-sm text-[#94A3B8]">
              <p>• Present: Current role/education</p>
              <p>• Past: Relevant experience</p>
              <p>• Future: Career goals & interest</p>
              <p>• Value: What you bring to the table</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
