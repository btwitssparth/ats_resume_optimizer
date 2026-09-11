import { SignedIn, UserButton } from "@clerk/clerk-react";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ATS Optimizer Pro</h1>
      </div>
      <SignedIn>
        <div className="border border-slate-200 rounded-full p-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </header>
  );
}