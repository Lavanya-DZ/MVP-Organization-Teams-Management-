import { useState } from "react";

function PasswordInput({ value, onChange, placeholder, hideLabel, showLabel }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        className="w-full rounded-lg border border-slate-500/60 bg-slate-900/40 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setIsVisible((previous) => !previous)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
        aria-label={isVisible ? hideLabel : showLabel}
      >
        {isVisible ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 102.8 2.8" />
            <path d="M9.9 5.1A10.9 10.9 0 0112 5c5 0 9.3 3.1 11 7-1 2.2-2.7 4-4.8 5.2" />
            <path d="M6.7 6.7C4.6 8 2.9 9.8 2 12c1.7 3.9 6 7 10 7 1.2 0 2.3-.2 3.4-.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;