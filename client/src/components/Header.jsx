const navItems = [
  { label: "Calculator", href: "#/calculator", route: "/calculator" },
  { label: "Compare", href: "#/compare", route: "/compare" },
  { label: "Portfolio", href: "#/portfolio", route: "/portfolio" },
];

export default function Header({ currentRoute }) {
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
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;

              return (
                <a
                  key={item.route}
                  href={item.href}
                  className={`pb-1 transition-colors ${
                    isActive
                      ? "border-b-2 border-gs-navy text-gs-navy"
                      : "text-gs-medium-gray hover:text-gs-dark-gray"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Navy accent line */}
      <div className="h-0.75 bg-gs-navy" />
    </header>
  );
}
