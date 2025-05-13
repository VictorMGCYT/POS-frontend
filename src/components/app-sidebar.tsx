import { ChartColumnIncreasing, Inbox, ShoppingCart, Users2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"

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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-black dark:text-white h-[50px]">
            TiendaPOS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
