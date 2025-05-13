import { ChartColumnIncreasing, ClipboardList, Inbox, ShoppingCart, Users2 } from "lucide-react"

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
import { Link, useLocation } from "react-router"
import { Button } from "./ui/button";

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
  }
]

export function AppSidebar() {
  const location = useLocation();


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
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className={isActive ? 
                      "bg-blue-600 text-white h-9 pl-4 hover:bg-blue-800 hover:text-white" : 
                      "h-9 pl-4"}
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
      <SidebarFooter>
        <Button 
          className="bg-transparent border border-red-500 text-red-500
          hover:bg-red-100 hover:cursor-pointer">
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
