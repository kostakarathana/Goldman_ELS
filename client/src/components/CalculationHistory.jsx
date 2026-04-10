import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "../App";

function formatCurrency(value, maximumFractionDigits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  });
}

function formatDateTime(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CalculationHistory({ items, loading }) {
  const { dark } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return expanded ? items : items.slice(0, 5);
  }, [items, expanded]);

  const hasMore = Array.isArray(items) && items.length > 5;

  const cardCls = dark
    ? "bg-[#0f1a2e] border-[#1e3050]"
    : "bg-gs-white border-gs-border";
  const labelCls = dark ? "text-[#6a8aaa]" : "text-gs-dark-gray";
  const mutedCls = dark ? "text-[#5a7a96]" : "text-gs-medium-gray";

  return (
    <div className={`mt-6 rounded-xl border p-5 ${cardCls}`}>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h3 className={`text-sm font-semibold tracking-wide ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>
          Calculation History
        </h3>
        <span className={`text-xs ${mutedCls}`}>
          {Array.isArray(items) ? `${items.length} total` : ""}
        </span>
      </div>

      {loading ? (
        <div className={`text-sm ${mutedCls}`}>Loading history…</div>
      ) : !Array.isArray(items) || items.length === 0 ? (
        <div className={`text-sm ${mutedCls}`}>No calculations yet. Run one to see it here.</div>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((row) => (
              <div
                key={row.id}
                className={`rounded-lg border px-4 py-3 ${dark ? "border-[#1e3050] bg-[#0b1426]" : "border-gs-border bg-gs-bg"}`}
              >
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>
                      {row.fund_ticker}
                      {row.fund_name ? (
                        <span className={`ml-2 font-normal ${labelCls}`}>{row.fund_name}</span>
                      ) : null}
                    </div>
                    <div className={`text-xs mt-1 ${mutedCls}`}>
                      {formatDateTime(row.created_at)} • {Number(row.duration_days)} days
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs ${labelCls}`}>Principal</div>
                    <div className={`text-sm font-semibold ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>
                      {formatCurrency(row.principal, 0)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-3">
                  <div className={`text-xs ${labelCls}`}>Future Value</div>
                  <div className={`text-sm font-semibold ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>
                    {formatCurrency(row.future_value, 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={`mt-4 text-sm font-semibold underline underline-offset-4 ${
                dark ? "text-[#7fb3e0] hover:text-white" : "text-gs-navy hover:text-gs-navy-dark"
              }`}
            >
              {expanded ? "View less" : "View more"}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

