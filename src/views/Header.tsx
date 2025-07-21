import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-background border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="w-5 h-5" />
        <span className="font-bold text-lg tracking-tight">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
