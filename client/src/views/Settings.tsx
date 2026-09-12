import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-600" /> Profile Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AI Tone</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                <option>Professional & Direct</option>
                <option>Creative & Dynamic</option>
                <option>Executive</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}