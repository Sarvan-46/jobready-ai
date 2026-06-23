import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  Lock,
  Mail,
  MessageSquareText,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
} from "lucide-react";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { firebaseDebugConfig, isFirebaseConfigured } from "../firebase";
import { useAuth } from "../AuthContext";

const featureCards = [
  { label: "AI Guidance", icon: Sparkles },
  { label: "Skill Analytics", icon: BarChart3 },
  { label: "Mock Interviews", icon: MessageSquareText },
  { label: "Job Match", icon: Target },
];

const socialButtons = [
  { label: "Google", icon: null },
  { label: "Microsoft", icon: PanelsTopLeft },
  { label: "LinkedIn", icon: Linkedin },
  { label: "GitHub", icon: Github },
];

type AuthMode = "login" | "register";

function logLoginDebug(
  label: string,
  payload: Record<string, unknown>
) {
  if (import.meta.env.DEV) {
    console.debug(`[Login] ${label}`, payload);
  }
}

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Authentication failed. Please try again.";
  }

  switch (error.code) {
    case "auth/user-not-found":
      return "User not found";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Wrong password";
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/too-many-requests":
      return "Too many requests";
    case "auth/email-already-in-use":
      return "An account already exists with this email";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    default:
      return error.message;
  }
}

function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  const switchMode = () => {
    setError("");
    navigate(isRegister ? "/login" : "/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim();
    setError("");

    if (isRegister && !normalizedFullName) {
      setError("Full name is required");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values to .env.");
      }

      logLoginDebug("Submitting credentials", {
        email: normalizedEmail,
        mode,
        role,
        firebaseProjectId: firebaseDebugConfig.projectId,
        firebaseAuthDomain: firebaseDebugConfig.authDomain,
        firebaseConfig: firebaseDebugConfig,
      });

      if (isRegister) {
        await signup(normalizedEmail, password, normalizedFullName);
      } else {
        await login(normalizedEmail, password);
      }

      toast.success(isRegister ? "Account created successfully" : "Signed in successfully");
      navigate("/");
    } catch (authError) {
      if (authError instanceof FirebaseError) {
        logLoginDebug("Firebase error", {
          email: normalizedEmail,
          code: authError.code,
          message: authError.message,
          firebaseProjectId: firebaseDebugConfig.projectId,
          firebaseAuthDomain: firebaseDebugConfig.authDomain,
        });
      }

      setError(getAuthErrorMessage(authError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#07111f] text-slate-950">
      <section className="relative hidden h-screen w-[55%] overflow-hidden bg-slate-950 lg:block">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center transition duration-700"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#06152c]/95 via-[#0c1e42]/82 to-[#111827]/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.36),transparent_28%),radial-gradient(circle_at_78%_60%,rgba(79,70,229,0.32),transparent_34%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between px-8 py-7 xl:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] shadow-2xl shadow-blue-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                Aspiro AI
              </p>
              <p className="text-xs font-medium uppercase text-blue-200/80">
                Career Intelligence
              </p>
            </div>
          </div>

          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-white xl:text-6xl">
              Unlock Your
              <br />
              Dream{" "}
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#2563EB] to-[#A5B4FC] bg-clip-text text-transparent">
                Career
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              AI-driven preparation, interviews, assignments and opportunities
              &mdash; all in one platform.
            </p>

            <div className="mt-7 grid max-w-4xl grid-cols-4 gap-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className="group rounded-2xl border border-blue-300/25 bg-white/10 p-3 text-white shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-300/70 hover:bg-white/15 hover:shadow-blue-500/20"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-100 ring-1 ring-blue-300/30 transition group-hover:bg-blue-500/35">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold leading-tight xl:text-sm">
                      {feature.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="relative h-36 w-72 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-2xl shadow-blue-950/40 backdrop-blur">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"
                alt="User working at laptop"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
            </div>
            <div className="mb-2 flex items-center gap-2 rounded-full border border-blue-300/25 bg-white/12 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl xl:text-sm">
              <Users className="h-4 w-4 text-blue-200" />
              Trusted by 10,000+ students and professionals
            </div>
          </div>
        </div>
      </section>

      <section className="flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-4 lg:w-[45%] lg:px-6">
        <div className="w-full max-w-[540px] rounded-[1.75rem] border border-white bg-white/95 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur sm:p-6 xl:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] shadow-lg shadow-blue-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-950">
                  Aspiro AI
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="hidden text-slate-500 sm:block">
                {isRegister ? "Already onboarded?" : "New to Aspiro AI?"}
              </span>
              <button
                type="button"
                onClick={switchMode}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-semibold text-[#2563EB] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </div>
          </div>

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] shadow-2xl shadow-blue-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {isRegister
                ? "Start your AI-powered career journey"
                : "Sign in to continue your journey"}
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-100 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  role === "student"
                    ? "bg-white text-[#2563EB] shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Student / Professional
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  role === "recruiter"
                    ? "bg-white text-[#2563EB] shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Recruiter / Company
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {isRegister && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    title={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 bg-white text-[#2563EB] focus:ring-blue-300 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-500">Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#2563EB] transition hover:text-[#4F46E5]"
                >
                  Forgot Password
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-3 font-semibold text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In Securely"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[#2563EB] transition hover:text-[#4F46E5]"
            >
              {isRegister ? "Login" : "Sign Up"}
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {socialButtons.map((button) => {
                const Icon = button.icon;

                return (
                  <button
                    key={button.label}
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-slate-950 hover:shadow-md"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-amber-400 text-[10px] font-bold text-white">
                        G
                      </span>
                    )}
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Enterprise Grade Security
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ISO 27001 Certified
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    Encrypted Data Protection
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400">
            <button type="button" className="transition hover:text-[#2563EB]">
              Terms of Service
            </button>
            <button type="button" className="transition hover:text-[#2563EB]">
              Privacy Policy
            </button>
            <button type="button" className="transition hover:text-[#2563EB]">
              Support
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}

export function Login() {
  return <AuthPage mode="login" />;
}

export function Register() {
  return <AuthPage mode="register" />;
}
