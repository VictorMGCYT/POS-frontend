import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";



export default function Sales(){


    return(
        <>
             <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Punto de Venta
                    </h2>
                    {/* <p className="text-gray-500">
                        Visualiza y gestiona tu información personal y profesional
                    </p> */}
                </div>
            </div>
            <div className="grid p-4 grid-cols-1 md:grid-cols-2">
                <p>
                    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border dar:border-slate-700 bg-gray-50 dark:bg-slate-950 px-3.5 py-2">
                        <SearchIcon className="h-4 w-4" />
                        <Input type="search" placeholder="Buscar" className="w-full border-0 h-6 font-semibold" />
                    </div>
                </p>
                <p>
                    dos
                </p>
            </div>
        </>
    )
}