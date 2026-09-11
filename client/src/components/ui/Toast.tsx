import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useToast, ToastItem, ToastVariant } from "../../contexts/ToastContext";
import { useApp } from "../../contexts/AppContext";

const variantStyles: Record<
  ToastVariant,
  { border: string; icon: string; iconClass: string }
> = {
  success: {
    border: "border-[#2d4a30]",
    icon: "CheckCircle2",
    iconClass: "text-[#4ade80]",
  },
  error: {
    border: "border-[#3a2025]",
    icon: "AlertTriangle",
    iconClass: "text-[#f87171]",
  },
  info: {
    border: "border-[#17192a]",
    icon: "Info",
    iconClass: "text-[#5b8def]",
  },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const style = variantStyles[variant];
  const className = `w-5 h-5 flex-shrink-0 ${style.iconClass}`;
  switch (variant) {
    case "success":
      return <CheckCircle2 className={className} strokeWidth={2} />;
    case "error":
      return <AlertTriangle className={className} strokeWidth={2} />;
    case "info":
      return <Info className={className} strokeWidth={2} />;
  }
}

function getMotionProps(motionEnabled: boolean) {
  if (!motionEnabled) {
    return {
      initial: false,
      animate: undefined,
      exit: undefined,
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: -8, x: 16 },
    animate: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, x: 8, scale: 0.98 },
    transition: { duration: 0.2, ease: "easeOut" as const },
  };
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const { remove } = useToast();
  const { motionEnabled } = useApp();
  const style = variantStyles[toast.variant];
  const dismissible = toast.dismissible !== false;
  const defaultDuration = toast.variant === "error" && toast.action ? 0 : 4000;
  const duration = toast.duration !== undefined ? toast.duration : defaultDuration;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      remove(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, remove]);

  return (
    <motion.div
      {...getMotionProps(motionEnabled)}
      className={`relative bg-[#141416] border ${style.border} rounded-lg shadow-lg overflow-hidden`}
    >
      <div className="flex items-start gap-3 p-4">
        <ToastIcon variant={toast.variant} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#f5f5f7] leading-snug">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="mt-1 text-sm text-[#8a8f98] leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                remove(toast.id);
              }}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-[#f5f5f7] hover:bg-[#1f1f26] transition-colors duration-150"
            >
              {toast.action.label}
            </button>
          )}
          {dismissible && (
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="p-1.5 rounded-md text-[#6b7280] hover:text-[#f5f5f7] hover:bg-[#1f1f26] transition-colors duration-150"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed z-50 flex flex-col gap-2
        bottom-4 right-4 left-4 w-[calc(100%-2rem)] max-w-[calc(100%-2rem)]
        md:top-4 md:bottom-auto md:left-auto md:right-4 md:max-w-sm md:w-auto"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast: ToastItem) => (
          <div key={toast.id} className="w-full">
            <ToastCard toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
