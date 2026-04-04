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
              <a href="#/calculator" className="block text-gs-dark-gray mb-1 hover:text-gs-navy">Calculator</a>
              <a href="#/compare"    className="block text-gs-medium-gray mb-1 hover:text-gs-navy">Compare</a>
              <a href="#/portfolio"  className="block text-gs-medium-gray hover:text-gs-navy">Portfolio</a>
            </div>
            <div>
              <p className="text-xs text-gs-medium-gray uppercase tracking-wider mb-2">Resources</p>
              <a href="https://en.wikipedia.org/wiki/Capital_asset_pricing_model" target="_blank" rel="noreferrer" className="block text-gs-dark-gray mb-1 hover:text-gs-navy">CAPM Model</a>
              <a href="https://www.newtonanalytics.com/docs/api/modernportfolio.php" target="_blank" rel="noreferrer" className="block text-gs-dark-gray mb-1 hover:text-gs-navy">Newton API</a>
              <a href="https://www.marketwatch.com/tools/top-25-mutual-funds?gaa_at=eafs&gaa_n=AWEtsqc8okgZ1FNNFCKBqYURwHb8eoHO2tSiWun8maPBLFtJJvWKSNRb6AtNxSNm8k4%3D&gaa_ts=699b8318&gaa_sig=tE4rpxuY28AlEcSU3VASNoPDXU02mA61sjnX_piOvni3uRQtdGua331WPsgsNRHiIKD3Bl5ISYKmIjfiBTReeA%3D%3D" target="_blank" rel="noreferrer" className="block text-gs-dark-gray hover:text-gs-navy">MarketWatch</a>
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