import { Home, Store, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LeftMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const menu = [
  { label: "Eventos", icon: Home, path: "/events" },
  { label: "Negocios", icon: Store, path: "/negocios" },
];

const LeftMenu = ({ menuOpen, setMenuOpen }: LeftMenuProps) => {
  const location = useLocation();

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
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default LeftMenu;
