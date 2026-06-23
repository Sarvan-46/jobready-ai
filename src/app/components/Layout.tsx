import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Brain,
  Code,
  Briefcase,
  BarChart3,
  FileText,
  Building2,
  Crown,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Sparkles,
  Bot,
  ClipboardList,
  Map,
  Bookmark,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/career-assistant", icon: Sparkles, label: "AI Career Assistant" },
  { path: "/aptitude", icon: Brain, label: "Aptitude" },
  { path: "/coding", icon: Code, label: "Coding Practice" },
  { path: "/mock-interview", icon: Bot, label: "AI Interview" },
  { path: "/resume", icon: FileText, label: "Resume Analyzer" },
  { path: "/hr-interview", icon: Briefcase, label: "HR Interview" },
  { path: "/companies", icon: Building2, label: "Company Prep" },
];

const upcomingNavItems = [
  { icon: ClipboardList, label: "Assignments" },
  { icon: Map, label: "Roadmap" },
  { path: "/results", icon: BarChart3, label: "Analytics" },
  { icon: Bookmark, label: "Bookmarks" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-900">
        Loading JobReady AI...
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2563EB]/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">JobReady AI</h1>
              <p className="text-xs text-slate-500">Premium Placement Prep</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/career-assistant"
            className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Link>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
            {upcomingNavItems.map((item) => {
              const Icon = item.icon;
              return item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link
            to="/premium"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#4338ca] to-[#2563EB] text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-medium">Upgrade to Pro</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics, companies, questions..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center shadow-lg shadow-[#2563EB]/15">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-slate-900">
                      {currentUser.email?.split("@")[0] ?? "Student"}
                    </p>
                    <p className="text-xs text-slate-500">Free Plan</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">
                        {currentUser.email?.split("@")[0] ?? "Student"}
                      </p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
