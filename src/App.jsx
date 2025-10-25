import { Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Calculator from "@/pages/CalculatorZ";
import FloatingCredit from "./components/FloatingCredit";
import WorldMapTimezones from "./pages/WorldMapTimezones";

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center gap-0 md:gap-12 p-0 md:p-4">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/world-map" element={<WorldMapTimezones />} />
        {/* Jika route tidak cocok, redirect ke home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingCredit />
    </div>
  );
}

export default App;
