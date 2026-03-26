export default function Header() {
  return (
    <header className="bg-gs-white border-b border-gs-border">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gs-navy rounded-sm flex items-center justify-center">
              <span className="text-gs-white text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>
                GS
              </span>
            </div>
            <div>
              <p className="text-[11px] text-gs-medium-gray tracking-widest uppercase m-0 leading-tight">
                Goldman Sachs
              </p>
              <p className="text-[11px] text-gs-medium-gray m-0 leading-tight">
                Emerging Leaders Series
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gs-dark-gray">
            <span className="border-b-2 border-gs-navy text-gs-navy pb-1 cursor-default">
              Calculator
            </span>
            <span className="text-gs-medium-gray cursor-default">Compare</span>
            <span className="text-gs-medium-gray cursor-default">Portfolio</span>
          </nav>
        </div>
      </div>
      {/* Navy accent line */}
      <div className="h-0.75 bg-gs-navy" />
    </header>
  );
}
