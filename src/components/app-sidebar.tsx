import { ChartColumnIncreasing, ClipboardList, DoorOpenIcon, FileText, Inbox, ShoppingCart, Users2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router"
import { Button } from "./ui/button";
import { useUserStore } from "@/global/states/userStore";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";

// Menu items.
const items = [
  {
    title: "Ventas",
    url: "/ventas",
    icon: ShoppingCart,
  },
  {
    title: "Inventario",
    url: "/inventario",
    icon: Inbox,
  },
  {
    title: "Corte de Caja",
    url: "/corte-de-caja",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Usuarios",
    url: "/usuarios",
    icon: Users2,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: FileText,
  }
]

export function AppSidebar() {
  const user = useUserStore((state) => state.user)
  const location = useLocation();
  const navigate = useNavigate();
  const url = API_URL;

  async function handleLogout() {
    try {
      await axios.post(`${url}/auth/logout`, 
        {},
        {
          withCredentials: true
        }
      );
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center border-b
        text-xl font-bold text-black dark:text-white h-[60px] ml-2">
        <ClipboardList/>
        TiendaPOS
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => {
              const isActive = location.pathname === item.url;
              const userRole = user?.role;
              if(userRole === 'user' && item.title === 'Inventario') return
              if(userRole === 'user' && item.title === 'Usuarios') return
              if(userRole === 'user' && item.title === 'Reportes') return
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className={isActive ? 
                      "bg-blue-600 text-white h-9 pl-4 hover:bg-blue-800 hover:text-white" : 
                      "h-9 pl-4 dark:hover:bg-slate-800"}
                    asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Button 
          onClick={handleLogout}
          variant={"outline"}
          className="mb-2 mt-2 hover:cursor-pointer dark:bg-slate-950">
          <DoorOpenIcon/>
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
