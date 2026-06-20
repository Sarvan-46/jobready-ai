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
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useUserData } from "../userData";

// Dynamic data will be calculated in component

// Dynamic data will be calculated in component

const categoryDistribution = [
  { name: "Aptitude", value: 128, color: "#2563EB" },
  { name: "Coding", value: 68, color: "#10B981" },
  { name: "Technical", value: 58, color: "#F59E0B" },
  { name: "HR", value: 45, color: "#8B5CF6" },
];

const skillRadarData = [
  { skill: "Problem Solving", current: 85, target: 90 },
  { skill: "Communication", current: 90, target: 95 },
  { skill: "Technical Knowledge", current: 72, target: 85 },
  { skill: "Logical Thinking", current: 88, target: 90 },
  { skill: "Time Management", current: 75, target: 85 },
  { skill: "Confidence", current: 82, target: 90 },
];

const monthlyStats = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
  { month: "Jun", score: 87 },
];

const stats = [
  {
    label: "Overall Progress",
    value: "82%",
    change: "+12%",
    icon: Target,
    color: "#2563EB",
    trend: "up",
  },
  {
    label: "Tests Completed",
    value: "299",
    change: "+45",
    icon: Award,
    color: "#10B981",
    trend: "up",
  },
  {
    label: "Study Time",
    value: "42h",
    change: "+8h",
    icon: Clock,
    color: "#F59E0B",
    trend: "up",
  },
  {
    label: "Current Streak",
    value: "24 days",
    change: "+4",
    icon: Calendar,
    color: "#8B5CF6",
    trend: "up",
  },
];

const recentTests = [
  {
    name: "Logical Reasoning Advanced",
    score: 92,
    date: "2 hours ago",
    category: "Aptitude",
    improvement: "+5%",
  },
  {
    name: "Array Problems - Medium",
    score: 85,
    date: "5 hours ago",
    category: "Coding",
    improvement: "+3%",
  },
  {
    name: "System Design Basics",
    score: 78,
    date: "Yesterday",
    category: "Technical",
    improvement: "+8%",
  },
  {
    name: "Behavioral Questions",
    score: 95,
    date: "2 days ago",
    category: "HR",
    improvement: "+2%",
  },
];

export function Results() {

  const { currentUser } = useAuth();

  const {
    data: userData,
    loading,
    error,
  } = useUserData(currentUser?.uid);

  const aptitudeScore = userData?.scores?.aptitude ?? 0;
  const codingScore = userData?.scores?.coding ?? 0;
  const technicalScore = userData?.scores?.technical ?? 0;
  const hrScore = userData?.scores?.hr ?? 0;

  // Generate dynamic weekly progress based on actual scores
  const weeklyProgress = [
    { day: "Mon", aptitude: aptitudeScore * 0.8, coding: codingScore * 0.75, technical: technicalScore * 0.7, hr: hrScore * 0.85 },
    { day: "Tue", aptitude: aptitudeScore * 0.82, coding: codingScore * 0.77, technical: technicalScore * 0.72, hr: hrScore * 0.88 },
    { day: "Wed", aptitude: aptitudeScore * 0.85, coding: codingScore * 0.8, technical: technicalScore * 0.75, hr: hrScore * 0.9 },
    { day: "Thu", aptitude: aptitudeScore * 0.88, coding: codingScore * 0.83, technical: technicalScore * 0.78, hr: hrScore * 0.92 },
    { day: "Fri", aptitude: aptitudeScore * 0.9, coding: codingScore * 0.85, technical: technicalScore * 0.8, hr: hrScore * 0.95 },
    { day: "Sat", aptitude: aptitudeScore * 0.93, coding: codingScore * 0.88, technical: technicalScore * 0.82, hr: hrScore * 0.95 },
    { day: "Sun", aptitude: aptitudeScore, coding: codingScore, technical: technicalScore, hr: hrScore },
  ];

  // Generate dynamic overall performance based on actual scores
  const overallPerformance = [
    { subject: "Aptitude", score: aptitudeScore },
    { subject: "Coding", score: codingScore },
    { subject: "Technical", score: technicalScore },
    { subject: "HR", score: hrScore },
    { subject: "Resume", score: hrScore > 0 ? Math.round((aptitudeScore + codingScore + technicalScore + hrScore) / 4) : 0 },
  ];

  const totalScore = aptitudeScore + codingScore + hrScore;
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2 text-white">Results & Analytics</h1>
        <p className="text-[#94A3B8]">
          Track your progress and analyze your performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
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
                <span
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl mb-1 text-white">{stat.value}</p>
              <p className="text-sm text-[#94A3B8]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl text-white mb-6">Weekly Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
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
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl text-white mb-6">Overall Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overallPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94A3B8" />
              <YAxis dataKey="subject" type="category" stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
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
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl text-white mb-6">Questions Distribution</h2>
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
                    backgroundColor: "#1E293B",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
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
                <span className="text-sm text-[#94A3B8]">
                  {category.name}: {category.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Radar */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl text-white mb-6">Skills Assessment</h2>
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
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">6-Month Progress Trend</h2>
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
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#ffffff",
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
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl text-white mb-6">Recent Test Results</h2>
        <div className="space-y-4">
          {recentTests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors"
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
                  <h4 className="text-white mb-1">{test.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#94A3B8]">{test.date}</span>
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
