import { useContext } from "react";
import { ThemeContext } from "../App";

export default function NotFound() {
  const { dark } = useContext(ThemeContext);

  return (
    <main className="max-w-7xl mx-auto px-8 py-20 text-center">
      <div className={`inline-block rounded-2xl px-16 py-14 ${dark ? "bg-[#0f1a2e] border border-[#1e3050]" : "bg-gs-white border border-gs-border shadow-sm"}`}>
        <p className={`text-8xl font-bold mb-4 ${dark ? "text-[#4A90D9]" : "text-gs-navy"}`} style={{ fontFamily: "Georgia, serif" }}>
          404
        </p>
        <h1 className={`text-2xl mb-3 ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>Page Not Found</h1>
        <p className={`text-sm mb-8 max-w-md mx-auto leading-relaxed ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
          The page you're looking for doesn't exist. It may have been moved or the URL may be incorrect.
        </p>
        <a
          href="#/calculator"
          className={`inline-block py-3 px-8 text-sm font-semibold tracking-wide rounded-lg transition-all shadow-md hover:shadow-lg ${
            dark ? "bg-[#4A90D9] text-white hover:bg-[#3a7bc8]" : "bg-gs-navy text-gs-white hover:bg-gs-navy-dark"
          }`}
        >
          Back to Calculator
        </a>
      </div>
    </main>
  );
}
