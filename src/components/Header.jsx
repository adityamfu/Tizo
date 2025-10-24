import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky md:fixed top-0 md:top-4 md:left-1/2 transform md:-translate-x-1/2 z-50 p-3 flex justify-between items-center max-w-7xl w-full md:rounded-2xl bg-neutral-900/80 backdrop-blur-xl shadow-lg md:border border-neutral-800">
      <h1 className="text-2xl font-bold text-white tracking-wide ms-3">Tizo</h1>

      <nav className="flex gap-2">
        <Button
          variant={location.pathname === "/" ? "default" : "outline"}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        <Button
          variant={location.pathname === "/calculator" ? "default" : "outline"}
          onClick={() => navigate("/calculator")}
        >
          Calculator
        </Button>
      </nav>
    </header>
  );
}
