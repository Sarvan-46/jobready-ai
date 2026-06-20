import { User } from "firebase/auth";
import {
  DocumentData,
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

export async function createUserProfile(user: User) {
  const profileRef = userDoc(user.uid);
  const profileSnapshot = await getDoc(profileRef);

  await setDoc(
    profileRef,
    {
      email: user.email ?? "",
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
