import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import { ToastProvider } from "./contexts/ToastContext";
import { AppProvider } from "./contexts/AppContext";
import Toast from "./components/ui/Toast";
import AppShell from "./components/AppShell";
import LoginPage from "./views/LoginPage";
import { useEffect, useState } from "react";

function SessionGuard() {\n  const { signOut } = useClerk();\n  const [message, setMessage] = useState<string | null>(null);\n\n  useEffect(() => {\n    const handler = async () => {\n      setMessage("Your session has expired. Please sign in again.");\n      try { await signOut(); } catch {}\n    };\n    window.addEventListener("ats:session-expired", handler);\n    return () => window.removeEventListener("ats:session-expired", handler);\n  }, [signOut]);\n\n  return message ? <LoginPage /> : <AppShell />;\n}\n\nfunction App() {
  return (
    <ToastProvider>
      <AppProvider>
        
        <SignedIn>
          <AppShell />
        </SignedIn>

        <SignedOut>
          <LandingPage />
        </SignedOut>

      </AppProvider>
      
      {/* Toast notifications render globally */}
      <Toast />
    </ToastProvider>
  );
}

export default App;