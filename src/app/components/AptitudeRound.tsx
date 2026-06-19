import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Trophy,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
};

const questions: Question[] = [
  {
    question: "If 18 workers can complete a project in 12 days, how many days will 24 workers take to complete the same project?",
    options: ["6 days", "8 days", "9 days", "10 days"],
    answerIndex: 2,
  },
  {
    question: "Find the next number in the series: 3, 8, 15, 24, 35, ?",
    options: ["42", "46", "48", "50"],
    answerIndex: 2,
  },
  {
    question: "A shopkeeper marks an item at Rs. 800 and gives a 10% discount. If the cost price is Rs. 600, what is the profit percentage?",
    options: ["15%", "18%", "20%", "25%"],
    answerIndex: 2,
  },
  {
    question: "Choose the word that is closest in meaning to 'Diligent'.",
    options: ["Lazy", "Careful", "Hardworking", "Confused"],
    answerIndex: 2,
  },
  {
    question: "Pointing to a photograph, Ravi says, 'She is the daughter of my father's only son.' How is the girl related to Ravi?",
    options: ["Sister", "Daughter", "Niece", "Cousin"],
    answerIndex: 1,
  },
  {
    question: "If A is coded as 1, B as 2, and so on, what is the value of the word CAT?",
    options: ["22", "24", "27", "30"],
    answerIndex: 1,
  },
  {
    question: "A train running at 60 km/h crosses a pole in 18 seconds. What is the length of the train?",
    options: ["250 m", "280 m", "300 m", "320 m"],
    answerIndex: 2,
  },
  {
    question: "In a class of 40 students, 60% are boys. How many girls are there?",
    options: ["12", "14", "16", "18"],
    answerIndex: 2,
  },
  {
    question: "Which number should replace the question mark? 5, 11, 23, 47, ?",
    options: ["82", "89", "95", "101"],
    answerIndex: 2,
  },
  {
    question: "If all Bloops are Razzies and all Razzies are Lazzies, which statement must be true?",
    options: [
      "All Lazzies are Bloops",
      "All Bloops are Lazzies",
      "No Bloops are Lazzies",
      "Some Razzies are not Lazzies",
    ],
    answerIndex: 1,
  },
];

export function AptitudeRound() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const score = useMemo(
    () =>
      selectedAnswers.reduce(
        (total, selectedAnswer, index) =>
          selectedAnswer === questions[index].answerIndex ? total + 1 : total,
        0
      ),
    [selectedAnswers]
  );

  const answeredCount = selectedAnswers.filter(
    (answer) => answer !== null
  ).length;
  const question = questions[currentQuestion];
  const percentage = Math.round((score / questions.length) * 100);

  const selectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;

    setSelectedAnswers((answers) =>
      answers.map((answer, index) =>
        index === currentQuestion ? optionIndex : answer
      )
    );
  };

  const goToPrevious = () => {
    setCurrentQuestion((questionIndex) => Math.max(questionIndex - 1, 0));
  };

  const goToNext = () => {
    setCurrentQuestion((questionIndex) =>
      Math.min(questionIndex + 1, questions.length - 1)
    );
  };

  const resetTest = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setCurrentQuestion(0);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8">
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-blue-100">JobReady AI</span>
            </div>
            <h1 className="text-3xl mb-2 text-white">Aptitude Test</h1>
            <p className="text-blue-100 max-w-2xl">
              Answer 10 multiple-choice questions across quantitative aptitude,
              logical reasoning, and verbal ability.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[220px]">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{answeredCount}/10</p>
              <p className="text-sm text-blue-100">Answered</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl text-white">{currentQuestion + 1}/10</p>
              <p className="text-sm text-blue-100">Question</p>
            </div>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#10B981]/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-[#10B981]" />
              </div>
              <div>
                <h2 className="text-2xl text-white mb-1">Test Submitted</h2>
                <p className="text-[#94A3B8]">
                  Your final score has been calculated.
                </p>
              </div>
            </div>
            <button
              onClick={resetTest}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0F172A] rounded-xl p-5">
              <p className="text-sm text-[#94A3B8] mb-2">Score</p>
              <p className="text-3xl text-white">
                {score}/{questions.length}
              </p>
            </div>
            <div className="bg-[#0F172A] rounded-xl p-5">
              <p className="text-sm text-[#94A3B8] mb-2">Percentage</p>
              <p className="text-3xl text-white">{percentage}%</p>
            </div>
            <div className="bg-[#0F172A] rounded-xl p-5">
              <p className="text-sm text-[#94A3B8] mb-2">Attempted</p>
              <p className="text-3xl text-white">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((testQuestion, index) => {
              const selectedAnswer = selectedAnswers[index];
              const isCorrect = selectedAnswer === testQuestion.answerIndex;

              return (
                <div
                  key={testQuestion.question}
                  className="bg-[#0F172A] border border-[#334155] rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="text-white mb-2">
                        {index + 1}. {testQuestion.question}
                      </p>
                      <p className="text-sm text-[#94A3B8]">
                        Your answer:{" "}
                        <span
                          className={
                            isCorrect ? "text-[#10B981]" : "text-[#EF4444]"
                          }
                        >
                          {selectedAnswer === null
                            ? "Not answered"
                            : testQuestion.options[selectedAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-[#10B981] mt-1">
                          Correct answer:{" "}
                          {testQuestion.options[testQuestion.answerIndex]}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                        isCorrect
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : "bg-[#EF4444]/20 text-[#EF4444]"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-[#94A3B8] mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <h2 className="text-2xl text-white leading-snug">
                  {question.question}
                </h2>
              </div>
              <div className="hidden sm:flex w-12 h-12 bg-[#2563EB]/20 rounded-xl items-center justify-center shrink-0">
                <ClipboardCheck className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>

            <div className="w-full bg-[#0F172A] rounded-full h-2 mb-8">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;

                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(index)}
                    className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "bg-[#2563EB] border-[#2563EB] text-white"
                        : "bg-[#0F172A] border-[#334155] text-[#CBD5E1] hover:border-[#2563EB] hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#1E293B] text-[#94A3B8]"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-white ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F172A] border border-[#334155] text-white rounded-lg hover:border-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={goToNext}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg hover:shadow-lg hover:shadow-[#10B981]/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 h-fit">
            <h3 className="text-white mb-4">Question Map</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => {
                const isCurrent = index === currentQuestion;
                const isAnswered = selectedAnswers[index] !== null;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`h-10 rounded-lg text-sm transition-all ${
                      isCurrent
                        ? "bg-[#2563EB] text-white"
                        : isAnswered
                        ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:border-[#2563EB]"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Answered</span>
                <span className="text-white">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Remaining</span>
                <span className="text-white">
                  {questions.length - answeredCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Total Questions</span>
                <span className="text-white">{questions.length}</span>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitted(true)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Test
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
