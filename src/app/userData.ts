import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  DocumentData,
  limit,
  orderBy,
  query,
  Timestamp,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";

export type RoundKey = "aptitude" | "coding" | "technical" | "hr";

export type UserScores = Partial<Record<RoundKey, number>>;

export type InterviewAnswer = {
  question: string;
  answer: string;
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestedAnswer?: string;
  feedback?: string;
};

export type VoiceInterviewMetric = {
  questionIndex: number;
  transcript: string;
  answerLength: number;
  wordsSpoken: number;
  speakingDurationSeconds: number;
  updatedAt?: string;
};

export type MockInterviewRecord = {
  id?: string;
  questionSetId?: string;
  questionSetTimestamp?: string;
  role: string;
  type: string;
  difficulty: string;
  date?: Timestamp;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore?: number;
  problemSolvingScore?: number;
  askedQuestions?: string[];
  answers: InterviewAnswer[];
  voiceMetrics?: VoiceInterviewMetric[];
  questionCategories?: string[];
  aiModel?: string;
  questionSource?: "openai" | "local";
  evaluationSource?: "openai" | "local";
  skills?: string;
  resumeHighlights?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
};

export type JobReadyUserData = {
  email: string;
  scores: UserScores;
  attempts?: Partial<Record<RoundKey, number>>;
  lastUpdated?: Timestamp;
};

const defaultScores: UserScores = {
  aptitude: 0,
  coding: 0,
  technical: 0,
  hr: 0,
};

const userDoc = (uid: string) => doc(db, "users", uid);
const mockInterviewsCollection = (uid: string) =>
  collection(db, "users", uid, "mockInterviews");

export async function createUserProfile(user: User, fullName?: string) {
  const profileRef = userDoc(user.uid);
  const profileSnapshot = await getDoc(profileRef);

  await setDoc(
    profileRef,
    {
      email: user.email ?? "",
      ...(fullName ? { fullName } : {}),
      ...(profileSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveRoundScore(round: RoundKey, score: number) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to save scores.");
  }

  await setDoc(
    userDoc(user.uid),
    {
      email: user.email ?? "",
      scores: {
        [round]: score,
      },
      attempts: {
        [round]: increment(1),
      },
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveMockInterview(
  interview: Omit<MockInterviewRecord, "id" | "date">
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to save mock interviews.");
  }

  const interviewRef = await addDoc(mockInterviewsCollection(user.uid), {
    ...interview,
    date: serverTimestamp(),
  });

  await setDoc(
    userDoc(user.uid),
    {
      email: user.email ?? "",
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );

  return interviewRef.id;
}

export function useUserData(uid?: string) {
  const [data, setData] = useState<JobReadyUserData | null>(null);
  const [loading, setLoading] = useState(Boolean(uid));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    return onSnapshot(
      userDoc(uid),
      (snapshot) => {
        const documentData = snapshot.data() as DocumentData | undefined;
        setData(
          documentData
            ? {
                email: documentData.email ?? "",
                scores: { ...defaultScores, ...documentData.scores },
                attempts: documentData.attempts ?? {},
                lastUpdated: documentData.lastUpdated,
              }
            : null
        );
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
  }, [uid]);

  return { data, loading, error };
}

export function useMockInterviews(uid?: string, maxItems = 20) {
  const [interviews, setInterviews] = useState<MockInterviewRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(uid));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setInterviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const interviewsQuery = query(
      mockInterviewsCollection(uid),
      orderBy("date", "desc"),
      limit(maxItems)
    );

    return onSnapshot(
      interviewsQuery,
      (snapshot) => {
        setInterviews(
          snapshot.docs.map((document) => {
            const documentData = document.data() as DocumentData;

            return {
              id: document.id,
              questionSetId: documentData.questionSetId ?? "",
              questionSetTimestamp: documentData.questionSetTimestamp ?? "",
              role: documentData.role ?? "",
              type: documentData.type ?? "",
              difficulty: documentData.difficulty ?? "",
              date: documentData.date,
              overallScore: documentData.overallScore ?? 0,
              technicalScore: documentData.technicalScore ?? 0,
              communicationScore: documentData.communicationScore ?? 0,
              confidenceScore: documentData.confidenceScore ?? 0,
              problemSolvingScore: documentData.problemSolvingScore ?? 0,
              askedQuestions: documentData.askedQuestions ?? [],
              answers: (documentData.answers ?? []).map((answer: DocumentData) => ({
                question: answer.question ?? "",
                answer: answer.answer ?? "",
                score: answer.score ?? 0,
                strengths: answer.strengths ?? [],
                weaknesses: answer.weaknesses ?? [],
                suggestedAnswer: answer.suggestedAnswer ?? "",
                feedback: answer.feedback ?? "",
              })),
              voiceMetrics: (documentData.voiceMetrics ?? []).map(
                (metric: DocumentData) => ({
                  questionIndex: metric.questionIndex ?? 0,
                  transcript: metric.transcript ?? "",
                  answerLength: metric.answerLength ?? 0,
                  wordsSpoken: metric.wordsSpoken ?? 0,
                  speakingDurationSeconds: metric.speakingDurationSeconds ?? 0,
                  updatedAt: metric.updatedAt ?? "",
                })
              ),
              questionCategories: documentData.questionCategories ?? [],
              aiModel: documentData.aiModel ?? "",
              questionSource: documentData.questionSource ?? "local",
              evaluationSource: documentData.evaluationSource ?? "local",
              skills: documentData.skills ?? "",
              resumeHighlights: documentData.resumeHighlights ?? "",
              strengths: documentData.strengths ?? [],
              weaknesses: documentData.weaknesses ?? [],
              suggestions: documentData.suggestions ?? [],
            };
          })
        );
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
  }, [maxItems, uid]);

  return { interviews, loading, error };
}
