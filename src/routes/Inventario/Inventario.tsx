import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import TableInventory from "./Components/TableInventory";


export default function Inventario() {
    

    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Control de Inventario
                    </h2>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-800
                    hover:cursor-pointer dark:text-white">
                    + Agregar Producto
                </Button>
            </div>
            <div className="flex w-full p-4">
                <div className="grid grid-cols-[4fr_1fr] w-full p-4 border rounded-lg gap-4">
                    <h2 className="text-2xl font-medium ">
                        Productos
                    </h2>
                    <Select>
                        <SelectTrigger className="ml-auto hover:cursor-pointer">
                            <SelectValue placeholder="Seleccione el Tipo" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-950">
                            <SelectItem className="hover:cursor-pointer" value="light">Todos</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="dark">Por unidad</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="system">Por peso</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Barra de busqueda */}
                    <div 
                        className="flex items-center w-full space-x-2 rounded-lg border 
                        dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-3.5 py-2
                        col-span-2">
                        <SearchIcon className="h-4 w-4" />
                        <Input
                        placeholder="Buscar producto por nombre o código de barras" 
                        className="w-full border-0 h-6 font-semibold" />
                    </div>
                    <TableInventory/>
                </div>
                
            </div>
        </>
    )
}