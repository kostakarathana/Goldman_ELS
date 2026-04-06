import { useContext } from "react";
import { ThemeContext } from "../App";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Calculator", href: "#/calculator", route: "/calculator" },
  { label: "Compare", href: "#/compare", route: "/compare" },
  { label: "Portfolio", href: "#/portfolio", route: "/portfolio" },
];

export default function Header({ currentRoute }) {
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <header className={`border-b transition-colors duration-300 ${dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-gs-white border-gs-border"}`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${dark ? "bg-[#4A90D9]" : "bg-gs-navy"}`}>
              <span className="text-gs-white text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>
                GS
              </span>
            </div>
            <div>
              <p className={`text-[11px] tracking-widest uppercase m-0 leading-tight ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
                Goldman Sachs
              </p>
              <p className={`text-[11px] m-0 leading-tight ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
                Emerging Leaders Series
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className={`flex items-center gap-6 text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
              {navItems.map((item) => {
                const isActive = currentRoute === item.route;

                return (
                  <a
                    key={item.route}
                    href={item.href}
                    className={`pb-1 transition-colors ${
                      isActive
                        ? dark
                          ? "border-b-2 border-[#4A90D9] text-[#7fb3e0]"
                          : "border-b-2 border-gs-navy text-gs-navy"
                        : dark
                          ? "text-[#6a8aaa] hover:text-[#7fb3e0]"
                          : "text-gs-medium-gray hover:text-gs-dark-gray"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <ThemeToggle dark={dark} toggle={toggle} />
          </div>
        </div>
      </div>
      {/* Navy accent line */}
      <div className={`h-[3px] ${dark ? "bg-[#4A90D9]" : "bg-gs-navy"}`} />
    </header>
  );
}
