import { Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Calculator from "@/pages/CalculatorZ";
import FloatingCredit from "./components/FloatingCredit";

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center gap-0 md:gap-12">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        {/* Jika route tidak cocok, redirect ke home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingCredit />
    </div>
  );
}

export default App;
