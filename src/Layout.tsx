import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./hooks/useTheme";

export default function Layout() {

    const { theme, setTheme } = useTheme();

    return (
        <SidebarProvider>
        <AppSidebar />
        <main className='w-full'>
                <SidebarTrigger className='flex sticky top-0 h-[60px] rounded-[0] border-b border-b-gray-200 z-10'/>
                {/* Todo el content que no pertenezca al sidebar */}
                <Outlet /> {/* Aquí se renderizan las rutas hijas */}
            </main>
            <div 
            className='flex items-center justify-end right-4 
            fixed top-0 h-[60px] w-full border-b border-b-gray-200 gap-4 bg-white
            dark:bg-neutral-950'>
                {/* <Bell size={20}/> */}
                <button
                    className="px-4 text-sm py-2 bg-gray-200 dark:bg-gray-800 dark:text-white rounded"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Moon/> : <Sun/>}
                </button>
                <h3 className='font-medium'>
                    {"Rol de usuario"}
                </h3>
            </div>
        </SidebarProvider>
    )
}
