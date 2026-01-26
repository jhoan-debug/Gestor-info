import { Home, Users, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sidebar: botones de navegación y control de cierre de sesión.
export default function Sidebar({ setVista, handleLogout }) {
  return (
    <div className="h-screen w-64 bg-black text-yellow-400 border-r border-yellow-500 flex flex-col justify-between shadow-[0_0_15px_rgba(255,215,0,0.4)]">
      <div>
        <div className="p-6 text-center font-bold text-2xl border-b border-yellow-500">
         Gestor Óptica
        </div>

        <nav className="mt-6 flex flex-col space-y-2 px-4">
          <Button variant="ghost" className="justify-start text-yellow-400 hover:bg-yellow-600/20" onClick={() => setVista("dashboard")}>
            <Home className="mr-2 h-5 w-5" /> Inicio
          </Button>
          <Button variant="ghost" className="justify-start text-yellow-400 hover:bg-yellow-600/20" onClick={() => setVista("clientes")}>
            <Users className="mr-2 h-5 w-5" /> Clientes
          </Button>
          <Button variant="ghost" className="justify-start text-yellow-400 hover:bg-yellow-600/20" onClick={() => setVista("reportes")}>
            <FileText className="mr-2 h-5 w-5" /> Reportes
          </Button>
          <Button variant="ghost" className="justify-start text-yellow-400 hover:bg-yellow-600/20" onClick={() => setVista("configuracion")}>
            <Settings className="mr-2 h-5 w-5" /> Configuración
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t border-yellow-500">
        <Button variant="destructive" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" /> Salir
        </Button>
      </div>
    </div>
  );
}