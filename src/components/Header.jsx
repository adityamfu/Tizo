/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 md:top-4 z-50 p-3 flex justify-between items-center max-w-7xl w-full md:rounded-2xl bg-neutral-900/80 backdrop-blur-xl shadow-lg md:border border-neutral-800">
      {/* Logo */}
      <a href="/">
        <h1 className="text-2xl font-bold text-white tracking-wide ms-3">
          Tizo
        </h1>
      </a>

      {/* ✅ Desktop Navigation */}
      <nav className="hidden sm:flex gap-2">
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
        <Button
          variant={location.pathname === "/world-map" ? "default" : "outline"}
          onClick={() => navigate("/world-map")}
        >
          World Map
        </Button>
      </nav>

      {/* ✅ Mobile Dropdown with Animation */}
      <div className="sm:hidden relative">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <AnimatePresence>
            {open && (
              <DropdownMenuContent
                asChild
                align="end"
                className="border-neutral-700 bg-neutral-900 text-neutral-100"
              >
                <motion.div
                  key="dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/calculator")}>
                    Calculator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/world-map")}>
                    World Map
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </div>
    </header>
  );
}
