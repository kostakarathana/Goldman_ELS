import { createContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./pages/Calculator";
import Compare from "./pages/Compare";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import useTheme from "./hooks/useTheme";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });

function getCurrentRoute() {
  const route = window.location.hash.replace("#", "") || "/calculator";

  if (route === "/" || route === "") {
    return "/calculator";
  }

  return route;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
  const theme = useTheme();

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/calculator");
    }

    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const pageByRoute = {
    "/calculator": <Calculator />,
    "/compare": <Compare />,
    "/portfolio": <Portfolio />,
  };

  const page = pageByRoute[currentRoute] ?? <NotFound />;

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme.dark ? "bg-[#0d1b2a]" : "bg-gs-bg"}`}>
        <Header currentRoute={currentRoute} />
        <div className="flex-1">
          {page}
        </div>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: theme.dark
              ? { background: "#1a2a3e", color: "#d4d8dd", border: "1px solid #2a3a4e" }
              : { background: "#fff", color: "#2C2C2C", border: "1px solid #D9D5CC" },
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
