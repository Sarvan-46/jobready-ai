from pathlib import Path

files = [
    "src/app/components/Login.tsx",
    "src/app/components/Dashboard.tsx",
    "src/app/components/Results.tsx",
    "src/app/components/Premium.tsx",
    "src/app/components/ResumeAnalyzer.tsx",
    "src/app/components/CompanyPreparation.tsx",
    "src/app/components/AptitudeRound.tsx",
    "src/app/components/CodingRound.tsx",
    "src/app/components/TechnicalRound.tsx",
    "src/app/components/HRRound.tsx",
]

replacements = [
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-6", "bg-white border border-slate-200 rounded-2xl p-6"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-5", "bg-white border border-slate-200 rounded-2xl p-5"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-4", "bg-white border border-slate-200 rounded-2xl p-4"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-8", "bg-white border border-slate-200 rounded-2xl p-8"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden", "bg-white border border-slate-200 rounded-2xl overflow-hidden"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden",
     "bg-white border border-slate-200 rounded-2xl overflow-hidden"),
    ("bg-[#1E293B] rounded-xl border border-[#334155] p-6", "bg-white rounded-2xl border border-slate-200 p-6"),
    ("bg-[#1E293B] rounded-xl p-6", "bg-white rounded-2xl p-6"),
    ("bg-[#1E293B] rounded-xl border border-[#334155] p-6", "bg-white rounded-2xl border border-slate-200 p-6"),
    ("bg-[#1E293B] rounded-xl border border-[#334155] p-8", "bg-white rounded-2xl border border-slate-200 p-8"),
    ("bg-[#1E293B] rounded-xl p-8", "bg-white rounded-2xl p-8"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all group", "bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all group"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all group", "bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all group"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#2563EB] transition-all", "bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#2563EB] transition-all"),
    ("bg-[#1E293B] rounded-xl p-12", "bg-white rounded-3xl p-12"),
    ("bg-[#1E293B] border border-[#334155] rounded-xl p-12", "bg-white border border-slate-200 rounded-3xl p-12"),
    ("bg-[#1E293B] rounded-xl p-6", "bg-white rounded-2xl p-6"),
    ("bg-[#0F172A] border border-[#334155] rounded-xl p-4", "bg-slate-50 border border-slate-200 rounded-2xl p-4"),
    ("bg-[#0F172A] rounded-xl p-5", "bg-slate-50 rounded-2xl p-5"),
    ("bg-[#0F172A] rounded-xl border border-[#334155] p-5", "bg-slate-50 rounded-2xl border border-slate-200 p-5"),
    ("bg-[#0F172A] rounded-full border border-[#334155]", "bg-slate-50 rounded-full border border-slate-200"),
    ("bg-[#0F172A] border border-[#334155] rounded-xl p-6 h-fit", "bg-slate-50 border border-slate-200 rounded-2xl p-6 h-fit"),
    ("bg-[#0F172A] border border-[#334155] rounded-xl p-8", "bg-slate-50 border border-slate-200 rounded-2xl p-8"),
    ("text-[#94A3B8]", "text-slate-500"),
    ("text-[#64748B]", "text-slate-500"),
    ("text-[#CBD5E1]", "text-slate-500"),
    ("bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white hover:bg-[#1E293B] transition-colors", "bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"),
    ("bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white hover:bg-[#1E293B] transition-colors", "bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"),
    ("bg-[#0F172A] border border-[#334155] rounded-xl p-4", "bg-slate-50 border border-slate-200 rounded-2xl p-4"),
]

for file in files:
    path = Path(file)
    if not path.exists():
        print(f"MISSING: {file}")
        continue
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f"updated {file}")
