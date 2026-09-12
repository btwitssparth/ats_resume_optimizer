import { ToastProvider } from "./contexts/ToastContext";
import { AppProvider } from "./contexts/AppContext";
import Toast from "./components/ui/Toast";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRoutes />
        <Toast />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
