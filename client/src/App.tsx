import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import LandingPage from "./views/LandingPage";
import { AppProvider } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastViewport } from "./components/ui/Toast";
import AppShell from "./components/AppShell";

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

function App() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-[#0a0a0b] text-[#f5f5f7]">
          <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <Navbar />
            <AnimatePresence mode="wait">
              <motion.div
                key="landing-page"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LandingPage />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <AppProvider>
          <ToastProvider>
            <ToastViewport />
            <AppShell />
          </ToastProvider>
        </AppProvider>
      </SignedIn>
    </>
  );
}

export default App;
