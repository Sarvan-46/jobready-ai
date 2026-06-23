import { Link } from "react-router";
import {
  Brain,
  Code,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Clock,
  Target,
  Award,
  ArrowRight,
  Zap,
  CheckCircle2,
  Bot,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../AuthContext";
import { useMockInterviews, useUserData } from "../userData";

const baseRounds = [
  {
    title: "Aptitude & Logical",
    icon: Brain,
    questions: 150,
    path: "/aptitude",
    color: "from-[#2563EB] to-[#1D4ED8]",
    scoreKey: "aptitude",
  },
  {
    title: "Coding Round",
    icon: Code,
    questions: 100,
    path: "/coding",
    color: "from-[#10B981] to-[#059669]",
    scoreKey: "coding",
  },
  {
    title: "Technical Interview",
    icon: MessageSquare,
    questions: 80,
    path: "/technical",
    color: "from-[#F59E0B] to-[#D97706]",
    scoreKey: "technical",
  },
  {
    title: "HR Interview",
    icon: Briefcase,
    questions: 50,
    path: "/hr-interview",
    color: "from-[#8B5CF6] to-[#7C3AED]",
    scoreKey: "hr",
  },
];

export function Dashboard() {
  const { currentUser } = useAuth();
  const { data: userData, loading: userDataLoading, error } = useUserData(
    currentUser?.uid
  );
  const { interviews: mockInterviews } = useMockInterviews(currentUser?.uid, 10);

  const aptitudeScore = userData?.scores.aptitude ?? 0;
  const codingScore = userData?.scores.coding ?? 0;
  const technicalScore = userData?.scores.technical ?? 0;
  const hrScore = userData?.scores.hr ?? 0;
  const savedScores = [aptitudeScore, codingScore, technicalScore, hrScore];
  const completedRounds = savedScores.filter((score) => score > 0).length;
  const averageScore = completedRounds
    ? Math.round(
        savedScores.reduce((total, score) => total + score, 0) /
          completedRounds
      )
    : 0;
  const overallProgress = Math.round(
    (aptitudeScore + codingScore + hrScore) / 3
  );
  const displayName = currentUser?.email?.split("@")[0] ?? "Student";
  const mockInterviewsTaken = mockInterviews.length;
  const bestInterviewScore = mockInterviewsTaken
    ? Math.max(...mockInterviews.map((interview) => interview.overallScore))
    : 0;
  const latestInterview = mockInterviews[0];

  const progressData = [
    { name: "Aptitude", score: aptitudeScore },
    { name: "Coding", score: codingScore },
    { name: "HR", score: hrScore },
  ];

  const roundPerformance = [
    { name: "Aptitude", score: aptitudeScore },
    { name: "Coding", score: codingScore },
    { name: "Technical", score: technicalScore },
    { name: "HR", score: hrScore },
  ];

  const rounds = baseRounds.map((round) => {
    const score =
      round.scoreKey === "aptitude"
        ? aptitudeScore
        : round.scoreKey === "coding"
        ? codingScore
        : round.scoreKey === "hr"
        ? hrScore
        : 0;

    return {
      ...round,
      progress: score,
      completed: Math.round((round.questions * score) / 100),
    };
  });

  const recentActivity = [
    {
      action: "Saved Aptitude Score",
      score: `${aptitudeScore}%`,
      time: aptitudeScore ? "Synced from Firestore" : "Not attempted",
    },
    {
      action: "Saved Coding Score",
      score: `${codingScore}%`,
      time: codingScore ? "Synced from Firestore" : "Not attempted",
    },
    {
      action: "Saved HR Interview Score",
      score: `${hrScore}%`,
      time: hrScore ? "Synced from Firestore" : "Not attempted",
    },
    {
      action: "Recent Mock Interview Result",
      score: latestInterview ? `${latestInterview.overallScore}%` : "0%",
      time: latestInterview
        ? `${latestInterview.role} · ${latestInterview.difficulty}`
        : "Not attempted",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="bg-slate-50 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/80 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl mb-2 text-slate-900">
            Welcome back, {displayName}!
          </h1>
          <p className="text-slate-500 mb-6">
            {userDataLoading
              ? "Loading your saved preparation data..."
              : "Your latest Firebase-synced preparation progress is ready."}
          </p>
          {error && (
            <div className="mb-6 rounded-lg border border-[#EF4444]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
              {error}
            </div>
          )}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-2xl text-slate-900">{overallProgress}%</p>
                <p className="text-sm text-slate-500">Overall Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-2xl text-slate-900">{averageScore}%</p>
                <p className="text-sm text-slate-500">Average Score</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl text-slate-900">{completedRounds}</p>
                <p className="text-sm text-slate-500">Scores Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#2563EB]" />
            </div>
            <span className="text-[#10B981] text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Live
            </span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{completedRounds}/3</p>
          <p className="text-sm text-slate-500">Rounds Attempted</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
            </div>
            <span className="text-[#10B981] text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Saved
            </span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{averageScore}%</p>
          <p className="text-sm text-slate-500">Average Score</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <span className="text-[#10B981] text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Sync
            </span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{aptitudeScore}%</p>
          <p className="text-sm text-slate-500">Aptitude Score</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <span className="text-[#10B981] text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Sync
            </span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{hrScore}%</p>
          <p className="text-sm text-slate-500">HR Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#2563EB]" />
            </div>
            <span className="text-[#2563EB] text-sm">Mock AI</span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{mockInterviewsTaken}</p>
          <p className="text-sm text-slate-500">Mock Interviews Taken</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#10B981]" />
            </div>
            <span className="text-[#10B981] text-sm">Best</span>
          </div>
          <p className="text-2xl mb-1 text-slate-900">{bestInterviewScore}%</p>
          <p className="text-sm text-slate-500">Best Interview Score</p>
        </div>

        <Link
          to="/mock-interview"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <ArrowRight className="w-5 h-5 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-2xl mb-1 text-slate-900">
            {latestInterview ? `${latestInterview.overallScore}%` : "Start"}
          </p>
          <p className="text-sm text-slate-500">Recent Interview Result</p>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-slate-900">Preparation Rounds</h2>
          <Link
            to="/results"
            className="text-sm text-[#2563EB] hover:text-[#3B82F6] flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rounds.map((round) => {
            const Icon = round.icon;
            return (
              <Link
                key={round.path}
                to={round.path}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${round.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-slate-900 mb-2">{round.title}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl text-slate-900">{round.progress}%</span>
                  <span className="text-sm text-slate-500">
                    {round.completed}/{round.questions} completed
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div
                    className={`bg-gradient-to-r ${round.color} h-2 rounded-full transition-all`}
                    style={{ width: `${round.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2563EB] group-hover:gap-3 transition-all">
                  Continue Practice
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-slate-900 mb-6">Saved Score Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-slate-900 mb-6">Round Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roundPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
              <Bar dataKey="score" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.action}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
              <span className="text-[#10B981]">{activity.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
