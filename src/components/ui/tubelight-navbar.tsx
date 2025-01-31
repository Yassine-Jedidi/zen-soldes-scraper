import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-auto sm:top-auto left-1/2 z-50 -translate-x-1/2 mb-6 sm:pt-6",
        className
      )}
    >
      <div className="flex items-center gap-3 bg-white/5 border border-neutral-200 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg dark:bg-neutral-950/5 dark:border-neutral-800">
        {/* Zen Logo with automatic color reversal in dark mode */}
        <a
          href="/" // Link to home or any other URL
          className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <img
            src="https://images.zen.com.tn/medias/images/logo_zen.png"
            alt="Zen Logo"
            className={cn(
              "w-8 h-8 object-contain",
              theme === "dark" && "invert" // Apply invert filter in dark mode
            )}
          />
        </a>

        {/* Rest of the navigation items */}
        {items.map((item) => {
          // Hide "Done By Yassine" on mobile
          if (isMobile && item.name === "Done By Yassine") {
            return null;
          }

          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <a
              key={item.name}
              // Conditional check for "Done By Yassine" to make it not clickable
              href={item.name === "Done By Yassine" ? "#" : item.url}
              onClick={() =>
                item.name !== "Done By Yassine" && setActiveTab(item.name)
              }
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-neutral-950/80 hover:text-neutral-900 dark:text-neutral-50/80 dark:hover:text-neutral-50",
                isActive &&
                  "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-neutral-900/5 rounded-full -z-10 dark:bg-neutral-50/5"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-neutral-900 rounded-t-full dark:bg-neutral-50">
                    <div className="absolute w-12 h-6 bg-neutral-900/20 rounded-full blur-md -top-2 -left-2 dark:bg-neutral-50/20" />
                    <div className="absolute w-8 h-6 bg-neutral-900/20 rounded-full blur-md -top-1 dark:bg-neutral-50/20" />
                    <div className="absolute w-4 h-4 bg-neutral-900/20 rounded-full blur-sm top-0 left-2 dark:bg-neutral-50/20" />
                  </div>
                </motion.div>
              )}
            </a>
          );
        })}
        <ModeToggle />
      </div>
    </div>
  );
}
