import { useState } from "react";
import LeftMenu from "./LeftMenu";
import TableUI from "./TableUI";

const GlobalLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full h-full flex pt-20">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border rounded p-2 shadow"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div
        className={`
          w-[70vw] max-w-xs min-w-0 h-full fixed top-0 left-0 z-40 bg-white shadow-lg transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:sticky md:top-0 md:left-0 md:w-[15vw] md:max-w-[15vw] md:translate-x-0 md:z-10
        `}
        style={{ minHeight: "100vh" }}
      >
        <LeftMenu />
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="flex-1 h-full overflow-y-auto md:w-[85vw] md:max-w-[85vw]">
        <TableUI />
      </div>
    </div>
  );
};

export default GlobalLayout;
