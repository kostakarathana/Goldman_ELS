import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./pages/Calculator";
import Compare from "./pages/Compare";
import Portfolio from "./pages/Portfolio";

function getCurrentRoute() {
  const route = window.location.hash.replace("#", "") || "/calculator";

  if (route === "/" || route === "") {
    return "/calculator";
  }

  return route;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);

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

  return (
    <div className="min-h-screen bg-gs-bg flex flex-col">
      <Header currentRoute={currentRoute} />
      <div className="flex-1">
        {pageByRoute[currentRoute] ?? <Calculator />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
