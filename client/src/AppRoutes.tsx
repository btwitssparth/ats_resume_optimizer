import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "./contexts/AppContext";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: 0.4,
};

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="bg-[#141416] border border-[#23232a] rounded-2xl p-8 sm:p-12">
      <h1 className="text-2xl font-bold text-[#f5f5f7] mb-4 tracking-tight">{title}</h1>
      <p className="text-[#8a8f98]">Under construction page</p>
    </div>
  );
}

export default function AppRoutes() {
  const { path, navigate } = useApp();

  useEffect(() => {
    const known = [
      "/app/dashboard",
      "/app/resume/analyzer",
      "/app/resume/builder",
      "/app/resume/versions",
      "/app/matcher",
      "/app/history",
      "/app/settings",
    ];
    if (!known.includes(path)) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [path, navigate]);

  let content;
  switch (path) {
    case "/app/dashboard":
      content = <PlaceholderCard title="Dashboard" />;
      break;
    case "/app/resume/analyzer":
      content = <PlaceholderCard title="Resume Analyzer" />;
      break;
    case "/app/resume/builder":
      content = <PlaceholderCard title="Resume Builder" />;
      break;
    case "/app/resume/versions":
      content = <PlaceholderCard title="Resume Versions" />;
      break;
    case "/app/matcher":
      content = <PlaceholderCard title="Job Matcher" />;
      break;
    case "/app/history":
      content = <PlaceholderCard title="History" />;
      break;
    case "/app/settings":
      content = <PlaceholderCard title="Settings" />;
      break;
    default:
      content = null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
