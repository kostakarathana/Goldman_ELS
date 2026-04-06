export default function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer flex items-center px-1"
      style={{ background: dark ? "#1A3B5C" : "#D9D5CC" }}
    >
      <span
        className="absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-xs"
        style={{ transform: dark ? "translateX(26px)" : "translateX(0px)" }}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
