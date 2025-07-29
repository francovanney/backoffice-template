import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  email?: string;
}

const Header = ({ email }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-6 bg-background border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="w-5 h-5" />
        <span className="font-bold text-lg tracking-tight">Admin</span>
      </div>
      <div className="flex items-center gap-8">
        <span>Bienvenido: {email ? email.split("@")[0] : ""}</span>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="w-5 h-5 flex items-center justify-center">
              <ThemeToggle />
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="bottom"
            sideOffset={8}
            className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg"
          >
            Cambiar tema
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label="Cerrar sesión"
              className="hover:text-red-500 transition"
              onClick={() => {
                const auth = getAuth();
                signOut(auth);
              }}
            >
              <LogOut />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="bottom"
            sideOffset={8}
            className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg"
          >
            Cerrar sesión
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </header>
  );
};

export default Header;
