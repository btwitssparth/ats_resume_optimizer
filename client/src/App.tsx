import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import LandingPage from "./views/LandingPage";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 font-sans">
      <Navbar />
      
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}

export default App;