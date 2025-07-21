import { Home, Calendar, Users, Settings, BarChart } from "lucide-react";

const menu = [
  { label: "Dashboard", icon: Home },
  { label: "Eventos", icon: Calendar },
  { label: "Usuarios", icon: Users },
  { label: "Reportes", icon: BarChart },
  { label: "Configuración", icon: Settings },
];

const LeftMenu = () => {
  return (
    <aside className="h-screen w-full bg-background border-r flex flex-col">
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
  );
};

export default LeftMenu;
