import { FirebaseError } from "firebase/app";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, firebaseDebugConfig } from "./firebase";
import { createUserProfile } from "./userData";

type AuthContextValue = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function logAuthDebug(label: string, payload: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.debug(`[Firebase Auth] ${label}`, payload);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      logAuthDebug("onAuthStateChanged", {
        currentUser: user
          ? {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
            }
          : null,
        projectId: auth.app.options.projectId,
      });

      setCurrentUser(user);
      if (user) {
        createUserProfile(user).catch(console.error);
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      login: async (email, password) => {
        const normalizedEmail = normalizeEmail(email);

        logAuthDebug("signInWithEmailAndPassword request", {
          email: normalizedEmail,
          auth,
          projectId: auth.app.options.projectId,
          authDomain: auth.config.authDomain,
          loadedConfig: firebaseDebugConfig,
        });

        try {
          const credential = await signInWithEmailAndPassword(
            auth,
            normalizedEmail,
            password
          );

          logAuthDebug("signInWithEmailAndPassword success", {
            email: credential.user.email,
            uid: credential.user.uid,
            currentUser: auth.currentUser
              ? {
                  uid: auth.currentUser.uid,
                  email: auth.currentUser.email,
                  emailVerified: auth.currentUser.emailVerified,
                }
              : null,
            projectId: auth.app.options.projectId,
          });
        } catch (error) {
          if (error instanceof FirebaseError) {
            logAuthDebug("signInWithEmailAndPassword error", {
              email: normalizedEmail,
              auth,
              code: error.code,
              message: error.message,
              currentUser: auth.currentUser,
              projectId: auth.app.options.projectId,
              loadedConfig: firebaseDebugConfig,
            });
          }

          throw error;
        }
      },
      signup: async (email, password, fullName) => {
        const normalizedEmail = normalizeEmail(email);
        const normalizedName = fullName?.trim();

        logAuthDebug("createUserWithEmailAndPassword request", {
          email: normalizedEmail,
          auth,
          projectId: auth.app.options.projectId,
          authDomain: auth.config.authDomain,
          loadedConfig: firebaseDebugConfig,
        });

        const credential = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

        if (normalizedName) {
          await updateProfile(credential.user, { displayName: normalizedName });
        }

        await createUserProfile(credential.user, normalizedName);
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
