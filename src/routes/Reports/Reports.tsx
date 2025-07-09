import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { CalendarIcon, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



// Simulación de funciones para cada reporte (reemplaza por tus fetch reales)
const fetchBestProducts = async (date: Date, period: string): Promise<Blob | undefined> => {
    try {
        const url = API_URL;
        const response = await axios.post(`${url}/reports/best-products`, 
            {
                username: "Víctor Manuel González Cabrera",
	            daydate: date,
                period: period// Puedes cambiar esto según el periodo seleccionado
            }, 
            {
                withCredentials: true,
                responseType: "blob"
            }
        );

        const data: Blob = response.data;
        return data;
    } catch (error) {
        toast.error("Error al generar el reporte de productos más vendidos.", {
            description: "Por favor, inténtelo de nuevo más tarde.",
        });
        return;
    }
};

const fetchWorstProducts = async () => {
  return [{ nombre: "Producto 3", ventas: 2 }, { nombre: "Producto 4", ventas: 1 }];
};

const fetchNoSales = async () => {
  return [{ nombre: "Producto 5" }, { nombre: "Producto 6" }];
};

const fetchStock = async () => {
  return [{ nombre: "Producto 7", stock: 50 }, { nombre: "Producto 8", stock: 30 }];
};

const fetchSales = async () => {
  return [{ fecha: "2025-07-01", total: 500 }, { fecha: "2025-07-02", total: 300 }];
};

export function Reports(){

    // Estado para la fecha seleccionada
    const [date, setDate] = useState<Date>(new Date())
    // estado para el Periodo
    const [period, setPeriod] = useState<string>("day");

    const [selectedReport, setSelectedReport] = useState<string>("best-products");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [reportData, setReportData] = useState<Blob | undefined>();

    const fetchers: Record<string, (date: Date, period: string) => Promise<Blob | undefined>>  = {
        "best-products": async (date: Date, period: string): Promise<Blob | undefined> => await fetchBestProducts(date, period),
        // "worst-products": fetchWorstProducts,
        // "no-sales": fetchNoSales,
        // "stock-report": fetchStock,
        // "sales-report": fetchSales,
    }

    useEffect(() => {
        if(reportData){
            const url = URL.createObjectURL(reportData);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url); // Limpia la URL cuando cambie el blob o se desmonte el componente
        } else {
            setPdfUrl(null);
        }
    }, [reportData])


    async function fetchReport() {
        if(!date) {
            toast.warning("Por favor, selecciona una fecha antes de generar el reporte.",{
                duration: 3000,
                position: "bottom-left",
            });
            return;
        }
        (async () => {
            const data: Blob | undefined = await fetchers[selectedReport](date, period);
            setReportData(data);
        })()
    }

    return(
        <>
            <div className="grid items-center pl-4 pr-4 pt-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Reportes de Ventas
                    </h2>
                </div>
            </div>

           <div className="grid pl-4 pr-4 pt-4 grid-cols-2 gap-4 w-full">
               <Select 
                    defaultValue={selectedReport}
                    onValueChange={(value) => setSelectedReport(value)}>
                    <SelectTrigger className="w-[250px] hover:cursor-pointer">
                        <SelectValue placeholder="Selecciona el tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-950">
                        <SelectItem 
                            className="dark:hover:bg-slate-900 dark:bg-slate-950" 
                            value="best-products">
                                Productos más vendidos
                        </SelectItem>
                        <SelectItem 
                            className="dark:hover:bg-slate-900 dark:bg-slate-950" 
                            value="worst-products">
                                Productos menos vendidos
                        </SelectItem>
                        <SelectItem 
                            className="dark:hover:bg-slate-900 dark:bg-slate-950"
                            value="no-sales">
                                Productos sin ventas
                        </SelectItem>
                        <SelectItem 
                            className="dark:hover:bg-slate-900 dark:bg-slate-950"
                            value="stock-report">
                                Reporte de Stock
                        </SelectItem>
                        <SelectItem 
                            className="dark:hover:bg-slate-900 dark:bg-slate-950"
                            value="sales-report">
                                Reporte de Ventas
                        </SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center justify-end gap-4">
                    <Select
                        onValueChange={(value) => setPeriod(value)}
                        defaultValue={period}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day" className="hover:dark:bg-slate-900 dark:bg-slate-950">Día</SelectItem>
                            <SelectItem value="week" className="hover:dark:bg-slate-900 dark:bg-slate-950">Semana</SelectItem>
                            <SelectItem value="month" className="hover:dark:bg-slate-900 dark:bg-slate-950">Mes</SelectItem>
                        </SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger className="hover:cursor-pointer" asChild>
                            <Button
                            variant="outline"
                            data-empty={!date}
                            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                            >
                            <CalendarIcon />
                                {date ? date.toLocaleDateString() : <span>Selecciona una Fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar required={true} mode="single" selected={date} onSelect={setDate} className="dark:bg-slate-900" />
                        </PopoverContent>
                    </Popover>
                    <Button 
                        onClick={fetchReport}
                        className="hover:cursor-pointer">
                        Generar Reporte
                    </Button>
                </div>
           </div>

           <div className="grid p-4 grid-cols-1 gap-4 w-full">
                <Card>
                    <CardHeader>
                        <CardTitle
                            className="text-3xl font-bold flex gap-2 items-center">
                            <FileText size={30}/> {selectedReport === "best-products" && "Productos más vendidos"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            pdfUrl ? 
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="500px"
                                title="Reporte de Ventas"
                            /> : 
                            <div className="flex flex-col justify-center items-center gap-3">
                                <FileText size={100} className="text-gray-500" />
                                <h2 className="text-gray-500 text-2xl font-bold">
                                    No hay datos para mostrar
                                </h2>
                            </div>
                        }
                    </CardContent>
                </Card>
            </div>
        </>
    )

}