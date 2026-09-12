import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export default function Builder() {
  return (
    <div className="w-full py-2 sm:py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resume Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Build and maintain your master resume.</p>
      </div>
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
          <Wrench className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="font-semibold text-slate-900">Builder is not available yet</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          The builder UI is still under development. No placeholder resume data is shown so you do not mistake demo content for your own data.
        </p>
      </motion.section>
    </div>
  );
}
