import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

const GlobalMessageContext = createContext(null);
const MESSAGE_LIMIT = 3;
const DEFAULT_DURATION = 3000;

const MESSAGE_META = {
  success: { icon: "mdi:check-circle" },
  error: { icon: "mdi:alert-circle" },
  warning: { icon: "mdi:alert" },
  info: { icon: "mdi:information" },
};

export function useGlobalMessage() {
  const context = useContext(GlobalMessageContext);
  if (!context) {
    throw new Error("useGlobalMessage must be used within GlobalMessageProvider");
  }
  return context;
}

function GlobalMessageViewport({ messages, onClose }) {
  if (typeof document === "undefined" || messages.length === 0) return null;

  return createPortal(
    <div className="global-message-viewport" aria-live="polite" aria-atomic="true">
      {messages.map((item) => {
        const meta = MESSAGE_META[item.type] || MESSAGE_META.info;
        return (
          <div className={`global-message global-message--${item.type}`} role={item.type === "error" ? "alert" : "status"} key={item.id}>
            <Icon className="global-message__icon" icon={meta.icon} aria-hidden="true" />
            <div className="global-message__body">
              {item.title ? <strong>{item.title}</strong> : null}
              <span>{item.message}</span>
            </div>
            <button className="global-message__close" type="button" onClick={() => onClose(item.id)} aria-label="关闭提示">
              <Icon icon="mdi:close" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

export function GlobalMessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    setMessages([]);
  }, []);

  const show = useCallback((type, message, options = {}) => {
    if (!message) return null;

    const id = idRef.current + 1;
    idRef.current = id;
    const nextMessage = {
      id,
      type: MESSAGE_META[type] ? type : "info",
      message: String(message),
      title: options.title || "",
    };
    const duration = Number.isFinite(Number(options.duration)) ? Number(options.duration) : DEFAULT_DURATION;

    setMessages((prev) => {
      const next = [...prev, nextMessage];
      const overflow = next.slice(0, Math.max(0, next.length - MESSAGE_LIMIT));
      overflow.forEach((item) => {
        const timer = timersRef.current.get(item.id);
        if (timer) window.clearTimeout(timer);
        timersRef.current.delete(item.id);
      });
      return next.slice(-MESSAGE_LIMIT);
    });

    if (duration > 0) {
      timersRef.current.set(id, window.setTimeout(() => remove(id), duration));
    }

    return id;
  }, [remove]);

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const value = useMemo(() => ({
    show,
    clear,
    success: (message, options) => show("success", message, options),
    error: (message, options) => show("error", message, options),
    warning: (message, options) => show("warning", message, options),
    info: (message, options) => show("info", message, options),
  }), [clear, show]);

  return (
    <GlobalMessageContext.Provider value={value}>
      {children}
      <GlobalMessageViewport messages={messages} onClose={remove} />
    </GlobalMessageContext.Provider>
  );
}
