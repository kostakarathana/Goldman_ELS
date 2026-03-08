export default function Footer() {
  return (
    <footer className="border-t border-gs-border bg-gs-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gs-navy rounded-sm flex items-center justify-center">
                <span className="text-gs-white text-[10px] font-bold" style={{ fontFamily: "Georgia, serif" }}>
                  GS
                </span>
              </div>
              <span className="text-xs text-gs-medium-gray tracking-wider uppercase">
                Goldman Sachs
              </span>
            </div>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="text-xs text-gs-medium-gray uppercase tracking-wider mb-2">Product</p>
              <p className="text-gs-dark-gray mb-1">Calculator</p>
              <p className="text-gs-medium-gray mb-1">Compare</p>
              <p className="text-gs-medium-gray">Portfolio</p>
            </div>
            <div>
              <p className="text-xs text-gs-medium-gray uppercase tracking-wider mb-2">Resources</p>
              <p className="text-gs-dark-gray mb-1">CAPM Model</p>
              <p className="text-gs-dark-gray mb-1">Newton API</p>
              <p className="text-gs-dark-gray">MarketWatch</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gs-border pt-4">
          <p className="text-[11px] text-gs-medium-gray leading-relaxed">
            Emerging Leaders Series — Group 5 — 2026. This application is for educational purposes only.
            Projections are based on historical data and the Capital Asset Pricing Model.
            Past performance does not guarantee future results.
          </p>
          <p className="text-[11px] text-gs-medium-gray mt-2">
            © 2026 Goldman Sachs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
