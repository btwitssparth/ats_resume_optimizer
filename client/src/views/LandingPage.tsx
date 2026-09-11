import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 border border-indigo-100">
          <Sparkles className="w-4 h-4" /> Powered by Gemini AI
        </div>
        <h2 className="text-4xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Optimize Your Resume for the Modern ATS
        </h2>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto">
          Sign in to securely analyze your resume against target job descriptions, discover missing keywords, and automatically rewrite your experience to land more interviews.
        </p>
        <SignInButton mode="modal">
          <button className="flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold py-4 px-8 rounded-xl shadow-sm hover:shadow-md">
            Get Started Securely <ArrowRight className="w-5 h-5" />
          </button>
        </SignInButton>
      </div>
    </div>
  );
}