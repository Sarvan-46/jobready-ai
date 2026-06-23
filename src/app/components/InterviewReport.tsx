import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Award,
  Bot,
  CheckCircle2,
  FileText,
  MessageSquareText,
  Target,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useMockInterviews } from "../userData";

export function InterviewReport() {
  const { interviewId } = useParams();
  const { currentUser } = useAuth();
  const { interviews, loading, error } = useMockInterviews(currentUser?.uid, 100);
  const report = interviews.find((interview) => interview.id === interviewId);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading interview report...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 text-sm text-[#2563EB]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Link>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <FileText className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
          <h1 className="text-2xl text-slate-900 mb-2">Report not found</h1>
          <p className="text-slate-500">
            {error ?? "This interview report is not available yet."}
          </p>
        </div>
      </div>
    );
  }

  const scoreCards = [
    ["Overall Interview Score", report.overallScore, Award],
    ["Communication Score", report.communicationScore, MessageSquareText],
    ["Technical Score", report.technicalScore, Bot],
    ["Confidence Score", report.confidenceScore ?? 0, Target],
  ] as const;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 text-sm text-[#2563EB] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Link>
          <h1 className="text-3xl text-slate-900 mb-2">Interview Report</h1>
          <p className="text-slate-500">
            {report.role} - {report.type} - {report.difficulty}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Set {report.questionSetId?.slice(0, 8) || "saved"} -{" "}
            {report.date
              ? report.date.toDate().toLocaleString()
              : report.questionSetTimestamp
              ? new Date(report.questionSetTimestamp).toLocaleString()
              : "Recent"}
          </p>
        </div>
        <div className="rounded-2xl bg-[#2563EB] px-7 py-5 text-center text-white shadow-lg shadow-[#2563EB]/20">
          <p className="text-sm opacity-80">Overall Score</p>
          <p className="text-4xl">{report.overallScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {scoreCards.map(([label, score, Icon]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#2563EB]" />
              </div>
              <span className="text-[#10B981] text-sm">Saved</span>
            </div>
            <p className="text-2xl text-slate-900 mb-1">{score}%</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          ["Strengths", report.strengths ?? []],
          ["Weaknesses", report.weaknesses ?? []],
          ["Suggestions", report.suggestions ?? []],
        ].map(([title, items]) => (
          <div key={title as string} className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl text-slate-900 mb-4">{title as string}</h2>
            <div className="space-y-3">
              {(items as string[]).map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl text-slate-900 mb-5">Answer-by-Answer Evaluation</h2>
        <div className="space-y-4">
          {report.answers.map((answer, index) => (
            <div
              key={`${answer.question}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <p className="text-sm text-[#2563EB] mb-1">Question {index + 1}</p>
                  <h3 className="text-slate-900">{answer.question}</h3>
                </div>
                <span className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm text-[#2563EB]">
                  {answer.score ?? 0}%
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Your Answer</p>
                  <p className="text-sm text-slate-700">{answer.answer || "No answer submitted."}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Suggested Answer</p>
                  <p className="text-sm text-slate-700">{answer.suggestedAnswer}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <p className="text-slate-900 mb-2">Strengths</p>
                  <p className="text-slate-500">{answer.strengths?.join(" ")}</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <p className="text-slate-900 mb-2">Weaknesses</p>
                  <p className="text-slate-500">{answer.weaknesses?.join(" ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl text-slate-900 mb-5">Interview History</h2>
        <div className="space-y-3">
          {interviews.slice(0, 5).map((interview) => (
            <Link
              key={interview.id}
              to={`/interview-report/${interview.id}`}
              className="flex flex-col gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 transition-all hover:border-[#2563EB] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-slate-900">{interview.role}</p>
                <p className="text-sm text-slate-500">
                  {interview.type} - {interview.difficulty}
                </p>
              </div>
              <p className="text-lg text-slate-900">{interview.overallScore}%</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
