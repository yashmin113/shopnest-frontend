/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    container: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    iconClass: "text-emerald-400",
  },
  error: {
    icon: XCircle,
    container: "border-red-500/30 bg-red-500/10 text-red-200",
    iconClass: "text-red-400",
  },
  info: {
    icon: Info,
    container: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    iconClass: "text-sky-400",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => removeToast(id), 4500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:top-6 sm:w-96"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-2xl shadow-black/40 backdrop-blur ${style.container}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`} />
              <p className="min-w-0 flex-1 text-sm leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-current opacity-70 transition hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
