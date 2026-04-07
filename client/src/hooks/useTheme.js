import { useState, useEffect } from "react";

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("gs-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("gs-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}
