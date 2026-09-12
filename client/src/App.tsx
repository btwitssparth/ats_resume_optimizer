\import { ToastProvider } from "./contexts/ToastContext";
import Toast from "./components/ui/Toast";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
      <Toast />
    </ToastProvider>
  );
}

export default App;