import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./pages/Calculator";

function App() {
  return (
    <div className="min-h-screen bg-gs-bg flex flex-col">
      <Header />
      <div className="flex-1">
        <Calculator />
      </div>
      <Footer />
    </div>
  );
}

export default App;
