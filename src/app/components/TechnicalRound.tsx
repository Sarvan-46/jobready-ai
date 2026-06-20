import { useState } from "react";
import {
  MessageSquare,
  Play,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  Video,
  Mic,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useUserData } from "../userData";
import { saveRoundScore } from "../userData";

const topics = [
  {
    name: "Operating Systems",
    questions: 45,
    completed: 32,
    icon: "💻",
    color: "from-[#2563EB] to-[#1D4ED8]",
  },
  {
    name: "Database Management",
    questions: 40,
    completed: 28,
    icon: "🗄️",
    color: "from-[#10B981] to-[#059669]",
  },
  {
    name: "Computer Networks",
    questions: 38,
    completed: 25,
    icon: "🌐",
    color: "from-[#F59E0B] to-[#D97706]",
  },
  {
    name: "System Design",
    questions: 30,
    completed: 18,
    icon: "🏗️",
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
  {
    name: "OOP Concepts",
    questions: 35,
    completed: 30,
    icon: "🎯",
    color: "from-[#EC4899] to-[#DB2777]",
  },
  {
    name: "Web Technologies",
    questions: 42,
    completed: 35,
    icon: "🌍",
    color: "from-[#14B8A6] to-[#0D9488]",
  },
];

const mockInterviews = [
  {
    title: "Full Stack Developer - Mock Interview",
    duration: "45 min",
    difficulty: "Medium",
    rating: 4.8,
    participants: 1250,
    type: "AI Powered",
  },
  {
    title: "Backend Engineer - System Design",
    duration: "60 min",
    difficulty: "Hard",
    rating: 4.9,
    participants: 890,
    type: "AI Powered",
  },
  {
    title: "Frontend Developer - Technical Round",
    duration: "40 min",
    difficulty: "Medium",
    rating: 4.7,
    participants: 1580,
    type: "AI Powered",
  },
];

const recentQuestions = [
  {
    question: "Explain the difference between process and thread",
    topic: "Operating Systems",
    difficulty: "Easy",
    answered: true,
  },
  {
    question: "What is normalization in databases?",
    topic: "Database Management",
    difficulty: "Medium",
    answered: true,
  },
  {
    question: "Explain the OSI model layers",
    topic: "Computer Networks",
    difficulty: "Medium",
    answered: false,
  },
  {
    question: "Design a URL shortening service",
    topic: "System Design",
    difficulty: "Hard",
    answered: false,
  },
];

export function TechnicalRound() {
  const [activeTab, setActiveTab] = useState("topics");
  const [technicalScore, setTechnicalScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const { currentUser } = useAuth();
  const { data: userData } = useUserData(currentUser?.uid);

  const calculateScore = async () => {
    // Calculate score based on topics completion (completed/questions * 100)
    const topicScores = topics.map(topic => Math.round((topic.completed / topic.questions) * 100));
    const avgScore = Math.round(topicScores.reduce((a, b) => a + b, 0) / topicScores.length);
    setTechnicalScore(avgScore);
    
    try {
      setSaveStatus("Saving technical score...");
      await saveRoundScore("technical", avgScore);
      setSaveStatus("Technical score saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("Error saving score. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Technical Interview Round</h1>
        <p className="text-[#94A3B8]">
          Master technical concepts and ace your interviews
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-[#2563EB]" />
          </div>
          <p className="text-2xl mb-1 text-white">230</p>
          <p className="text-sm text-[#94A3B8]">Total Questions</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          </div>
          <p className="text-2xl mb-1 text-white">168</p>
          <p className="text-sm text-[#94A3B8]">Completed</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <p className="text-2xl mb-1 text-white">8</p>
          <p className="text-sm text-[#94A3B8]">Mock Interviews</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl mb-1 text-white">4.6/5</p>
          <p className="text-sm text-[#94A3B8]">Avg. Performance</p>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`rounded-xl p-4 text-center border ${
          saveStatus.includes("successfully")
            ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]"
            : "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]"
        }`}>
          <p className="font-semibold">{saveStatus}</p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={calculateScore}
          className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all font-semibold"
        >
          Calculate & Save Technical Score
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#334155]">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("topics")}
            className={`pb-4 px-2 transition-all ${
              activeTab === "topics"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Topics & Questions
          </button>
          <button
            onClick={() => setActiveTab("mock")}
            className={`pb-4 px-2 transition-all ${
              activeTab === "mock"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Mock Interviews
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      {activeTab === "topics" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const progress = (topic.completed / topic.questions) * 100;
              return (
                <div
                  key={topic.name}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center text-2xl`}
                    >
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white">{topic.name}</h3>
                      <p className="text-sm text-[#94A3B8]">
                        {topic.questions} questions
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#94A3B8]">Progress</span>
                      <span className="text-sm text-white">
                        {topic.completed}/{topic.questions}
                      </span>
                    </div>
                    <div className="w-full bg-[#0F172A] rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${topic.color} h-2 rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#1D4ED8] hover:border-transparent transition-all">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recent Questions */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <h2 className="text-xl text-white mb-6">Recent Questions</h2>
            <div className="space-y-4">
              {recentQuestions.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {item.answered ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-1" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-[#334155] rounded-full mt-1"></div>
                    )}
                    <div className="flex-1">
                      <p className="text-white mb-2">{item.question}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#94A3B8]">
                          {item.topic}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.difficulty === "Easy"
                              ? "bg-[#10B981]/20 text-[#10B981]"
                              : item.difficulty === "Medium"
                              ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                              : "bg-[#EF4444]/20 text-[#EF4444]"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                    {item.answered ? "Review" : "Answer"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mock Interviews */}
      {activeTab === "mock" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-white mb-2">
                  AI-Powered Mock Interviews
                </h3>
                <p className="text-blue-100">
                  Practice with our advanced AI interviewer and get instant
                  feedback
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockInterviews.map((interview, index) => (
              <div
                key={index}
                className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white mb-2">{interview.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded-full">
                        {interview.type}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          interview.difficulty === "Medium"
                            ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                            : "bg-[#EF4444]/20 text-[#EF4444]"
                        }`}
                      >
                        {interview.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-6 text-sm text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {interview.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#F59E0B]" />
                    {interview.rating}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {interview.participants.toLocaleString()}
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/50 transition-all">
                  <Video className="w-4 h-4" />
                  Start Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
