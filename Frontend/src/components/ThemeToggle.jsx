import React from "react";
import { useTheme } from "../features/theme/useTheme";

const labels = {
  light: "Light",
  dark: "Dark",
  system: "Auto",
};

const ThemeToggle = ({ className = "" }) => {
  const { preference, cycleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={cycleTheme}
      aria-label={`Theme: ${labels[preference]}. Click to change.`}
      title={`Theme: ${labels[preference]}`}
    >
      {preference === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21 14.3A9 9 0 1 1 9.7 3a7 7 0 1 0 11.3 11.3Z"
          />
        </svg>
      ) : preference === "light" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4h-1v-3h2v3h-1Zm0-19h-1V0h2v3h-1ZM4.2 5.6 2.8 4.2 4.2 2.8l1.4 1.4L4.2 5.6Zm15.6 0-1.4-1.4 1.4-1.4 1.4 1.4-1.4 1.4ZM0 13v-2h3v2H0Zm21 0v-2h3v2h-3ZM4.2 18.4l1.4 1.4-1.4 1.4-1.4-1.4 1.4-1.4Zm15.6 0 1.4 1.4-1.4 1.4-1.4-1.4 1.4-1.4Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 0 20V2Zm0 18a8 8 0 0 1 0-16v16Z"
          />
        </svg>
      )}
      <span className="theme-toggle-label">{labels[preference]}</span>
    </button>
  );
};

export default ThemeToggle;
