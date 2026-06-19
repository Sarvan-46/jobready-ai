import { useState } from "react";
import {
  Building2,
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  ExternalLink,
  BookOpen,
  Target,
} from "lucide-react";

const companies = [
  {
    name: "Google",
    logo: "🔍",
    category: "Tech Giant",
    difficulty: "Hard",
    questions: 450,
    salary: "$120K - $180K",
    openings: 1250,
    rating: 4.8,
    color: "from-[#4285F4] to-[#34A853]",
  },
  {
    name: "Microsoft",
    logo: "🪟",
    category: "Tech Giant",
    difficulty: "Hard",
    questions: 380,
    salary: "$115K - $175K",
    openings: 890,
    rating: 4.7,
    color: "from-[#00A4EF] to-[#0078D4]",
  },
  {
    name: "Amazon",
    logo: "📦",
    category: "E-commerce",
    difficulty: "Medium",
    questions: 520,
    salary: "$110K - $160K",
    openings: 2150,
    rating: 4.5,
    color: "from-[#FF9900] to-[#FF6600]",
  },
  {
    name: "Meta",
    logo: "👍",
    category: "Social Media",
    difficulty: "Hard",
    questions: 340,
    salary: "$125K - $190K",
    openings: 650,
    rating: 4.6,
    color: "from-[#0668E1] to-[#1877F2]",
  },
  {
    name: "Apple",
    logo: "🍎",
    category: "Tech Giant",
    difficulty: "Hard",
    questions: 290,
    salary: "$120K - $185K",
    openings: 780,
    rating: 4.7,
    color: "from-[#555555] to-[#000000]",
  },
  {
    name: "Netflix",
    logo: "🎬",
    category: "Entertainment",
    difficulty: "Hard",
    questions: 180,
    salary: "$140K - $200K",
    openings: 320,
    rating: 4.5,
    color: "from-[#E50914] to-[#B20710]",
  },
  {
    name: "Adobe",
    logo: "🎨",
    category: "Software",
    difficulty: "Medium",
    questions: 220,
    salary: "$105K - $155K",
    openings: 450,
    rating: 4.6,
    color: "from-[#FF0000] to-[#CC0000]",
  },
  {
    name: "Salesforce",
    logo: "☁️",
    category: "Cloud",
    difficulty: "Medium",
    questions: 210,
    salary: "$100K - $150K",
    openings: 890,
    rating: 4.5,
    color: "from-[#00A1E0] to-[#0070D2]",
  },
];

const topicsCovered = [
  { name: "Data Structures & Algorithms", count: 89 },
  { name: "System Design", count: 45 },
  { name: "Behavioral Questions", count: 67 },
  { name: "Coding Challenges", count: 156 },
  { name: "Technical Concepts", count: 98 },
];

const interviewProcess = [
  {
    stage: "Online Assessment",
    duration: "90 min",
    topics: ["DSA", "Problem Solving"],
  },
  { stage: "Phone Screen", duration: "45 min", topics: ["Coding", "Technical"] },
  {
    stage: "Technical Rounds",
    duration: "4-5 hours",
    topics: ["DSA", "System Design"],
  },
  {
    stage: "Behavioral Round",
    duration: "45 min",
    topics: ["Leadership", "Culture Fit"],
  },
  { stage: "HR Round", duration: "30 min", topics: ["Expectations", "Salary"] },
];

const recentExperiences = [
  {
    company: "Google",
    role: "Software Engineer",
    date: "2 days ago",
    rounds: 5,
    result: "Offer",
    difficulty: "Hard",
  },
  {
    company: "Amazon",
    role: "SDE-2",
    date: "5 days ago",
    rounds: 4,
    result: "In Progress",
    difficulty: "Medium",
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    date: "1 week ago",
    rounds: 5,
    result: "Offer",
    difficulty: "Hard",
  },
];

export function CompanyPreparation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Company Preparation</h1>
        <p className="text-[#94A3B8]">
          Prepare for top companies with curated questions and insights
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-[#2563EB]" />
          </div>
          <p className="text-2xl mb-1 text-white">150+</p>
          <p className="text-sm text-[#94A3B8]">Companies</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-[#10B981]" />
          </div>
          <p className="text-2xl mb-1 text-white">5,000+</p>
          <p className="text-sm text-[#94A3B8]">Interview Questions</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <p className="text-2xl mb-1 text-white">12,500</p>
          <p className="text-sm text-[#94A3B8]">Interview Experiences</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl mb-1 text-white">8,900</p>
          <p className="text-sm text-[#94A3B8]">Active Openings</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1E293B] border border-[#334155] rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
        />
      </div>

      {/* Companies Grid */}
      <div>
        <h2 className="text-xl text-white mb-6">Top Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all cursor-pointer group"
              onClick={() => setSelectedCompany(company.name)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${company.color} rounded-xl flex items-center justify-center text-3xl`}
                >
                  {company.logo}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    company.difficulty === "Hard"
                      ? "bg-[#EF4444]/20 text-[#EF4444]"
                      : "bg-[#F59E0B]/20 text-[#F59E0B]"
                  }`}
                >
                  {company.difficulty}
                </span>
              </div>
              <h3 className="text-white mb-2">{company.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-4">{company.category}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Questions</span>
                  <span className="text-white">{company.questions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Openings</span>
                  <span className="text-white">{company.openings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Salary</span>
                  <span className="text-white">{company.salary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Rating</span>
                  <span className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    {company.rating}
                  </span>
                </div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                Start Preparing
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Process */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">
          Typical Interview Process (FAANG)
        </h2>
        <div className="space-y-4">
          {interviewProcess.map((stage, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center text-white flex-shrink-0">
                  {index + 1}
                </div>
                {index < interviewProcess.length - 1 && (
                  <div className="w-0.5 h-12 bg-[#334155] my-2"></div>
                )}
              </div>
              <div className="flex-1 bg-[#0F172A] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">{stage.stage}</h4>
                  <span className="text-sm text-[#94A3B8]">{stage.duration}</span>
                </div>
                <div className="flex gap-2">
                  {stage.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Covered */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Topics Covered</h2>
        <div className="space-y-4">
          {topicsCovered.map((topic) => (
            <div key={topic.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">{topic.name}</span>
                <span className="text-[#94A3B8]">{topic.count} questions</span>
              </div>
              <div className="w-full bg-[#0F172A] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-2 rounded-full"
                  style={{ width: `${(topic.count / 200) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interview Experiences */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-white">Recent Interview Experiences</h2>
          <button className="flex items-center gap-2 text-[#2563EB] hover:text-[#3B82F6] transition-colors">
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {recentExperiences.map((experience, index) => (
            <div
              key={index}
              className="bg-[#0F172A] rounded-lg p-5 hover:bg-[#1E293B] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white mb-1">
                    {experience.company} - {experience.role}
                  </h4>
                  <p className="text-sm text-[#94A3B8]">{experience.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    experience.result === "Offer"
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : "bg-[#F59E0B]/20 text-[#F59E0B]"
                  }`}
                >
                  {experience.result}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                <span>{experience.rounds} rounds</span>
                <span>•</span>
                <span
                  className={
                    experience.difficulty === "Hard"
                      ? "text-[#EF4444]"
                      : "text-[#F59E0B]"
                  }
                >
                  {experience.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6">
        <h2 className="text-xl text-white mb-4">📚 Preparation Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <BookOpen className="w-8 h-8 text-white mb-3" />
            <h4 className="text-white mb-2">Company Guides</h4>
            <p className="text-sm text-blue-100">
              Detailed preparation guides for each company
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <TrendingUp className="w-8 h-8 text-white mb-3" />
            <h4 className="text-white mb-2">Success Stories</h4>
            <p className="text-sm text-blue-100">
              Learn from candidates who got offers
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Target className="w-8 h-8 text-white mb-3" />
            <h4 className="text-white mb-2">Practice Tests</h4>
            <p className="text-sm text-blue-100">
              Company-specific mock interviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
