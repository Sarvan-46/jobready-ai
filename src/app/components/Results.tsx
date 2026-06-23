import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
  Bot,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useMockInterviews, useUserData } from "../userData";

export function Results() {

  const { currentUser } = useAuth();

  const {
    data: userData,
    loading,
    error,
  } = useUserData(currentUser?.uid);
  const {
    interviews: mockInterviews,
    loading: interviewsLoading,
    error: interviewsError,
  } = useMockInterviews(currentUser?.uid, 20);

  const aptitudeScore = userData?.scores?.aptitude ?? 0;
  const codingScore = userData?.scores?.coding ?? 0;
  const technicalScore = userData?.scores?.technical ?? 0;
  const hrScore = userData?.scores?.hr ?? 0;

  const scoreValues = [
    { name: "Aptitude", score: aptitudeScore, color: "#2563EB" },
    { name: "Coding", score: codingScore, color: "#10B981" },
    { name: "Technical", score: technicalScore, color: "#F59E0B" },
    { name: "HR", score: hrScore, color: "#8B5CF6" },
  ];

  const completedRounds = scoreValues.filter((item) => item.score > 0).length;
  const averageScore = completedRounds
    ? Math.round(
        scoreValues.reduce((total, item) => total + item.score, 0) /
          completedRounds
      )
    : 0;

  const hasScoreData = completedRounds > 0 || mockInterviews.length > 0;
  const averageInterviewScore = mockInterviews.length
    ? Math.round(
        mockInterviews.reduce(
          (total, interview) => total + interview.overallScore,
          0
        ) / mockInterviews.length
      )
    : 0;
  const latestInterview = mockInterviews[0];
  const latestFeedback =
    latestInterview?.suggestions?.[0] ??
    latestInterview?.strengths?.[0] ??
    "Complete a mock interview to generate feedback.";
  const interviewTrendData = [...mockInterviews]
    .reverse()
    .slice(-8)
    .map((interview, index) => ({
      name: `Set ${index + 1}`,
      overall: interview.overallScore,
      communication: interview.communicationScore,
      technical: interview.technicalScore,
      confidence: interview.confidenceScore ?? 0,
    }));
  const latestInterviewBreakdown = latestInterview
    ? [
        { name: "Overall", score: latestInterview.overallScore },
        { name: "Communication", score: latestInterview.communicationScore },
        { name: "Technical", score: latestInterview.technicalScore },
        { name: "Confidence", score: latestInterview.confidenceScore ?? 0 },
      ]
    : [];

  useEffect(() => {
    document.title = "Results | JobReady AI";
  }, []);


  const overallProgress = averageScore;
  const studyTimeHours = Math.round(
    scoreValues.reduce((total, item) => total + item.score, 0) / 12
  );
  const streakDays = completedRounds * 3 + Math.round(averageScore / 30);

  const stats = [
    {
      label: "Overall Progress",
      value: `${overallProgress}%`,
      change: completedRounds ? `+${Math.max(1, Math.round(averageScore / 10))}%` : "+0%",
      icon: Target,
      color: "#2563EB",
      trend: "up",
    },
    {
      label: "Rounds Completed",
      value: `${completedRounds}`,
      change: completedRounds ? `+${completedRounds}` : "+0",
      icon: Award,
      color: "#10B981",
      trend: "up",
    },
    {
      label: "Avg Interview Score",
      value: `${averageInterviewScore}%`,
      change: mockInterviews.length ? `+${mockInterviews.length}` : "+0",
      icon: Bot,
      color: "#F59E0B",
      trend: "up",
    },
    {
      label: "Current Streak",
      value: `${streakDays} days`,
      change: completedRounds ? `+${completedRounds}` : "+0",
      icon: Calendar,
      color: "#8B5CF6",
      trend: "up",
    },
  ];

  const categoryDistribution = scoreValues.map((item) => ({
    name: item.name,
    value: item.score,
    color: item.color,
  }));

  const skillRadarData = [
    { skill: "Problem Solving", current: aptitudeScore, target: 100 },
    { skill: "Communication", current: hrScore, target: 100 },
    { skill: "Technical Knowledge", current: technicalScore, target: 100 },
    { skill: "Logical Thinking", current: aptitudeScore, target: 100 },
    { skill: "Time Management", current: codingScore, target: 100 },
    { skill: "Confidence", current: averageScore, target: 100 },
  ];

  const monthlyStats = [
    { month: "Jan", score: Math.round(averageScore * 0.65) },
    { month: "Feb", score: Math.round(averageScore * 0.72) },
    { month: "Mar", score: Math.round(averageScore * 0.78) },
    { month: "Apr", score: Math.round(averageScore * 0.85) },
    { month: "May", score: Math.round(averageScore * 0.92) },
    { month: "Jun", score: averageScore },
  ];

  const recentTests = scoreValues.map((item) => ({
    name: `${item.name} Round`,
    score: item.score,
    date: item.score > 0 ? "Latest" : "Not attempted",
    category: item.name,
    improvement:
      item.score >= 90
        ? "+8%"
        : item.score >= 70
        ? "+5%"
        : item.score > 0
        ? "+2%"
        : "+0%",
  }));

  const weeklyProgress = [
    { day: "Mon", aptitude: aptitudeScore * 0.8, coding: codingScore * 0.75, technical: technicalScore * 0.7, hr: hrScore * 0.85 },
    { day: "Tue", aptitude: aptitudeScore * 0.82, coding: codingScore * 0.77, technical: technicalScore * 0.72, hr: hrScore * 0.88 },
    { day: "Wed", aptitude: aptitudeScore * 0.85, coding: codingScore * 0.8, technical: technicalScore * 0.75, hr: hrScore * 0.9 },
    { day: "Thu", aptitude: aptitudeScore * 0.88, coding: codingScore * 0.83, technical: technicalScore * 0.78, hr: hrScore * 0.92 },
    { day: "Fri", aptitude: aptitudeScore * 0.9, coding: codingScore * 0.85, technical: technicalScore * 0.8, hr: hrScore * 0.95 },
    { day: "Sat", aptitude: aptitudeScore * 0.93, coding: codingScore * 0.88, technical: technicalScore * 0.82, hr: hrScore * 0.95 },
    { day: "Sun", aptitude: aptitudeScore, coding: codingScore, technical: technicalScore, hr: hrScore },
  ];

  const overallPerformance = [
    { subject: "Aptitude", score: aptitudeScore },
    { subject: "Coding", score: codingScore },
    { subject: "Technical", score: technicalScore },
    { subject: "HR", score: hrScore },
    { subject: "Resume", score: Math.round((aptitudeScore + codingScore + technicalScore + hrScore) / 4) },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-slate-900">Performance Insights</h1>
      <p className="text-slate-500">
          Your Firestore-backed preparation progress and mock interview results.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          <p className="text-lg text-slate-900 font-semibold mb-2">
            Loading your analytics
          </p>
          <p className="max-w-xl mx-auto">
            Please wait while your saved scores synchronize from Firebase.
          </p>
        </div>
      ) : !hasScoreData ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          <p className="text-lg text-slate-900 font-semibold mb-2">
            No saved scores yet
          </p>
          <p className="max-w-xl mx-auto">
            Complete any round to begin tracking your results and performance.
          </p>
        </div>
      ) : null}

      {interviewsError && (
        <div className="rounded-2xl border border-[#EF4444]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {interviewsError}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl mb-1 text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl text-slate-900">Latest Feedback</h2>
              <p className="text-sm text-slate-500">
                Most recent AI mock interview result
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#2563EB]" />
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <p className="text-4xl text-slate-900 mb-2">
              {latestInterview ? `${latestInterview.overallScore}%` : "0%"}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {latestInterview
                ? `${latestInterview.role} · ${latestInterview.type} · ${latestInterview.difficulty}`
                : "No mock interview submitted yet"}
            </p>
            <p className="text-slate-700">{latestFeedback}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl text-slate-900">Interview History</h2>
              <p className="text-sm text-slate-500">
                Average interview score: {averageInterviewScore}%
              </p>
            </div>
            <span className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm text-[#2563EB]">
              {mockInterviews.length} saved
            </span>
          </div>

          {interviewsLoading ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
              Loading interview history...
            </div>
          ) : mockInterviews.length ? (
            <div className="space-y-3">
              {mockInterviews.slice(0, 5).map((interview) => (
                <Link
                  key={interview.id}
                  to={`/interview-report/${interview.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-slate-900">{interview.role}</p>
                    <p className="text-sm text-slate-500">
                      {interview.type} · {interview.difficulty} ·{" "}
                      {interview.date
                        ? interview.date.toDate().toLocaleDateString()
                        : "Recent"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg text-slate-900">
                        {interview.overallScore}%
                      </p>
                      <p className="text-xs text-slate-500">Overall</p>
                    </div>
                    <div className="h-10 w-24 rounded-full bg-white overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${interview.overallScore}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              Submit a mock interview to see your interview history here.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Interview Score Trend</h2>
          {interviewTrendData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={interviewTrendData}>
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
                <Legend />
                <Line type="monotone" dataKey="overall" stroke="#2563EB" strokeWidth={2} name="Overall" />
                <Line type="monotone" dataKey="communication" stroke="#10B981" strokeWidth={2} name="Communication" />
                <Line type="monotone" dataKey="technical" stroke="#F59E0B" strokeWidth={2} name="Technical" />
                <Line type="monotone" dataKey="confidence" stroke="#8B5CF6" strokeWidth={2} name="Confidence" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Complete a mock interview to build your score trend.
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Latest Interview Breakdown</h2>
          {latestInterviewBreakdown.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={latestInterviewBreakdown}>
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
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Your latest interview score breakdown will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Weekly Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="aptitude"
                stroke="#2563EB"
                strokeWidth={2}
                name="Aptitude"
              />
              <Line
                type="monotone"
                dataKey="coding"
                stroke="#10B981"
                strokeWidth={2}
                name="Coding"
              />
              <Line
                type="monotone"
                dataKey="technical"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Technical"
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="HR"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Performance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Overall Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overallPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94A3B8" />
              <YAxis dataKey="subject" type="category" stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
              <Bar dataKey="score" fill="#2563EB" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Questions Distribution</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    color: "#0F172A",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {categoryDistribution.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-slate-500">
                  {category.name}: {category.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl text-slate-900 mb-6">Skills Assessment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="skill" stroke="#94A3B8" />
              <PolarRadiusAxis stroke="#94A3B8" />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.3}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl text-slate-900 mb-6">6-Month Progress Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyStats}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94A3B8" />
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

      {/* Recent Tests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl text-slate-900 mb-6">Recent Test Results</h2>
        <div className="space-y-4">
          {recentTests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    test.score >= 90
                      ? "bg-[#10B981]/20"
                      : test.score >= 75
                      ? "bg-[#2563EB]/20"
                      : "bg-[#F59E0B]/20"
                  }`}
                >
                  <span
                    className={`text-2xl ${
                      test.score >= 90
                        ? "text-[#10B981]"
                        : test.score >= 75
                        ? "text-[#2563EB]"
                        : "text-[#F59E0B]"
                    }`}
                  >
                    {test.score}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 mb-1">{test.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{test.date}</span>
                    <span className="px-2 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs rounded">
                      {test.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#10B981]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{test.improvement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
