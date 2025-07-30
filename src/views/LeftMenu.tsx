import { Home, Calendar, Users, Settings, BarChart, Menu } from "lucide-react";

interface LeftMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const menu = [
  { label: "Dashboard", icon: Home },
  { label: "Eventos", icon: Calendar },
  { label: "Usuarios", icon: Users },
  { label: "Reportes", icon: BarChart },
  { label: "Configuración", icon: Settings },
];

const LeftMenu = ({ menuOpen, setMenuOpen }: LeftMenuProps) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 rounded-md bg-background border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-6 py-4 text-xl font-bold tracking-tight">Panel</div>
        <nav className="flex-1 px-2 space-y-1">
          {menu.map((item) => (
            <a
              key={item.label}
              href="#"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default LeftMenu;
