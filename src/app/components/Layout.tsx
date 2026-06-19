import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Brain,
  Code,
  MessageSquare,
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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/aptitude", icon: Brain, label: "Aptitude & Logical" },
  { path: "/coding", icon: Code, label: "Coding Round" },
  { path: "/technical", icon: MessageSquare, label: "Technical Interview" },
  { path: "/hr-interview", icon: Briefcase, label: "HR Interview" },
  { path: "/results", icon: BarChart3, label: "Results & Analytics" },
  { path: "/resume", icon: FileText, label: "Resume Analyzer" },
  { path: "/companies", icon: Building2, label: "Company Prep" },
];

export function Layout() {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-[#1E293B]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-white">JobReady AI</h1>
              <p className="text-xs text-[#64748B]">Placement Prep</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
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
                      : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          <Link
            to="/premium"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white hover:shadow-lg hover:shadow-[#F59E0B]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5" />
              <span className="text-sm">Upgrade to Pro</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search topics, companies, questions..."
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-[#1E293B] rounded-lg transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm text-white">Sarah Johnson</p>
                    <p className="text-xs text-[#64748B]">Free Plan</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-[#334155]">
                      <p className="text-sm text-white">Sarah Johnson</p>
                      <p className="text-xs text-[#64748B]">
                        sarah.j@example.com
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-[#94A3B8] hover:bg-[#0F172A] hover:text-white rounded-lg transition-all">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-[#94A3B8] hover:bg-[#0F172A] hover:text-white rounded-lg transition-all">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-[#334155]">
                      <Link
                        to="/login"
                        className="w-full flex items-center gap-3 px-3 py-2 text-[#EF4444] hover:bg-[#0F172A] rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </Link>
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
