import { motion } from "framer-motion";
import { Wrench, Plus } from "lucide-react";

export default function Builder() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Resume Builder</h2>
        <p className="text-sm text-slate-500 mt-1">Manually construct or edit your master resume data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">Work Experience</h3>
              <button className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-800">Senior Software Engineer</p>
                <p className="text-xs text-slate-500">TechCorp • 2020 - Present</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 p-8 shadow-sm"
          >
            <Wrench className="w-10 h-10 mb-4 opacity-50" />
            <p className="font-medium text-slate-500">Live Preview</p>
            <p className="text-sm mt-2 text-center max-w-sm">Your resume preview will render here as you edit the sections on the left. (Backend persistence pending).</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}