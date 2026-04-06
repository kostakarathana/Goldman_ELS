import { useContext } from "react";
import { ThemeContext } from "../App";
import toast from "react-hot-toast";

const fmt = (n) =>
  Number.isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "N/A";
const pct = (n) => (Number.isFinite(Number(n)) ? (Number(n) * 100).toFixed(2) + "%" : "N/A");

export default function PDFExport({ result, ticker, investment, duration }) {
  const { dark } = useContext(ThemeContext);

  if (!result) return null;

  const handleExport = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const principal = Number(investment);
      const futureValue = Number(result.futureValue);
      const gain = futureValue - principal;
      const gainPctVal = ((gain / principal) * 100).toFixed(1);
      const days = Number(duration);
      const years = days / 365;

      // Header
      doc.setFillColor(26, 59, 92);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Goldman Sachs — Investment Report", 14, 16);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, 26);

      // Fund info
      doc.setTextColor(26, 59, 92);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${result.fundName || ticker} (${ticker})`, 14, 48);

      // Summary table
      autoTable(doc, {
        startY: 55,
        head: [["Metric", "Value"]],
        body: [
          ["Initial Investment", fmt(principal)],
          ["Future Value", fmt(futureValue)],
          ["Total Gain", `+${fmt(gain)} (${gainPctVal}%)`],
          ["Duration", `${years.toFixed(1)} years (${days} days)`],
          ["CAPM Rate (r)", pct(result.rate)],
          ["Beta (β)", Number(result.beta).toFixed(4)],
          ["Expected Return", pct(result.expectedReturn)],
          ["Risk-Free Rate", pct(result.riskFreeRate)],
        ],
        headStyles: { fillColor: [26, 59, 92], fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [247, 247, 245] },
        margin: { left: 14, right: 14 },
      });

      // Year-by-year growth table
      const rate = Number(result.rate);
      const maxYears = Math.ceil(years);
      const yearlyData = [];
      for (let y = 1; y <= Math.max(maxYears, 1); y++) {
        const fv = principal * Math.pow(1 + rate, y);
        yearlyData.push([
          `Year ${y}`,
          fmt(fv),
          `+${fmt(fv - principal)}`,
          `${((fv - principal) / principal * 100).toFixed(1)}%`,
        ]);
      }

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setTextColor(26, 59, 92);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Year-by-Year Growth", 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Year", "Value", "Gain", "Return %"]],
        body: yearlyData,
        headStyles: { fillColor: [26, 59, 92], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [247, 247, 245] },
        margin: { left: 14, right: 14 },
      });

      // Disclaimer
      const disclaimerY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(
        "This report is for educational purposes only. Past performance does not guarantee future results.",
        14,
        disclaimerY
      );
      doc.text("© 2026 Goldman Sachs Emerging Leaders Series — Group 5", 14, disclaimerY + 4);

      doc.save(`GS_Investment_Report_${ticker}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Investment report downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
        dark
          ? "bg-[#1a2a3e] text-[#7fb3e0] border border-[#2a3a4e] hover:bg-[#243a52]"
          : "bg-gs-white text-gs-navy border border-gs-border hover:bg-gs-light-gray hover:shadow-sm"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export PDF
    </button>
  );
}
