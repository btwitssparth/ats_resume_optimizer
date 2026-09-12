import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ToastProvider } from "./contexts/ToastContext";
import { AppProvider } from "./contexts/AppContext";
import Toast from "./components/ui/Toast";
import AppShell from "./components/AppShell";
import LandingPage from "./views/LandingPage";

function App() {
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