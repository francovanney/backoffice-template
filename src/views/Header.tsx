import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ConfirmationModal from "@/components/ConfirmationModal";

interface HeaderProps {
  email?: string;
}

const Header = ({ email }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="w-full py-4 px-6 bg-background border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="w-5 h-5" />
          <span className="font-bold text-lg tracking-tight">Admin</span>
        </div>
        <div className="flex items-center gap-8">
          <span>Bienvenido: {email ? email.split("@")[0] : ""}</span>
          {/*           <Tooltip.Root>
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
          </Tooltip.Root> */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                aria-label="Cerrar sesión"
                className="hover:text-red-500 transition"
                onClick={() => setShowLogoutModal(true)}
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

      <ConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="¿Estás seguro que deseas cerrar sesión?"
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        buttonsAlignment="center"
        equalWidthButtons={true}
      />
    </>
  );
};

export default Header;
