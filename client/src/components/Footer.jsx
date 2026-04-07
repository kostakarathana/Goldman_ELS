import { useContext } from "react";
import { ThemeContext } from "../App";

export default function Footer() {
  const { dark } = useContext(ThemeContext);

  return (
    <footer className={`border-t mt-16 transition-colors duration-300 ${dark ? "bg-[#0f1a2e] border-[#1e3050]" : "border-gs-border bg-gs-white"}`}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${dark ? "bg-[#4A90D9]" : "bg-gs-navy"}`}>
                <span className="text-gs-white text-[10px] font-bold" style={{ fontFamily: "Georgia, serif" }}>
                  GS
                </span>
              </div>
              <span className={`text-xs tracking-wider uppercase ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
                Goldman Sachs
              </span>
            </div>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className={`text-xs uppercase tracking-wider mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>Product</p>
              <a href="#/calculator" className={`block mb-1 ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>Calculator</a>
              <a href="#/compare" className={`block mb-1 ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>Compare</a>
              <a href="#/portfolio" className={`block ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>Portfolio</a>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>Resources</p>
              <a href="https://en.wikipedia.org/wiki/Capital_asset_pricing_model" target="_blank" rel="noreferrer" className={`block mb-1 ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>CAPM Model</a>
              <a href="https://www.newtonanalytics.com/docs/api/modernportfolio.php" target="_blank" rel="noreferrer" className={`block mb-1 ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>Newton API</a>
              <a href="https://www.marketwatch.com/tools/top-25-mutual-funds" target="_blank" rel="noreferrer" className={`block ${dark ? "text-[#8aa8c4] hover:text-[#7fb3e0]" : "text-gs-dark-gray hover:text-gs-navy"}`}>MarketWatch</a>
            </div>
          </div>
        </div>
        <div className={`border-t pt-4 ${dark ? "border-[#1e3050]" : "border-gs-border"}`}>
          <p className={`text-[11px] leading-relaxed ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
            Emerging Leaders Series — Group 5 — 2026. This application is for educational purposes only.
            Projections are based on historical data and the Capital Asset Pricing Model.
            Past performance does not guarantee future results.
          </p>
          <p className={`text-[11px] mt-2 ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
            © 2026 Goldman Sachs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}