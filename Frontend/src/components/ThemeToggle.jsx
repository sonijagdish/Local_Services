import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    // Initial state from document class or localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-700"
      aria-label="Toggle Theme"
    >
      {dark ? (
        <Sun size={20} className="" />
      ) : (
        <Moon size={20} className="" />
      )}
    </button>
  );
};

export default ThemeToggle;