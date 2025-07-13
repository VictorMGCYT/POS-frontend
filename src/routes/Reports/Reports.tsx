import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchBestProducts, fetchNoSales, fetchStock, fetchWorstProducts } from "./apiReports.functions";




export function Reports(){

    // Estado para la fecha seleccionada
    const [date, setDate] = useState<Date>(new Date())
    // estado para el Periodo
    const [period, setPeriod] = useState<string>("day");

    const [selectedReport, setSelectedReport] = useState<string>("best-products");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [reportData, setReportData] = useState<Blob | undefined>();

    // lo dejé cómo Any porque siento que queda más entendible xd
    // básicamente cada método del objeto ejecuta una función asincrónica anónima, que devuelve una promesa de tipo binario
    // o undefined en caso de que falle, los parametros de la función anónima son los estados de la fecha y periodo
    const fetchers: any  = {
        "best-products": async (date: Date, period: string): Promise<Blob | undefined> => await fetchBestProducts(date, period),
        "worst-products": async (date: Date, period: string): Promise<Blob | undefined> => await fetchWorstProducts(date, period),
        "no-sales": async (date: Date, period: string): Promise<Blob | undefined> => await fetchNoSales(date, period),
        "stock-report": async (): Promise<Blob | undefined> => await fetchStock(),
        // "earns-report": fetchSales,
    }

    // efecto para generar la url del PDF y mostrarlo en pantalla
    useEffect(() => {
        if(reportData){
            const url = URL.createObjectURL(reportData);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url); // Limpia la URL cuando cambie el blob o se desmonte el componente
        } else {
            setPdfUrl(null);
        }
    }, [reportData])

    // manejador de petición del reporte
    async function fetchReport() {
        if(!date) {
            toast.warning("Por favor, selecciona una fecha antes de generar el reporte.",{
                duration: 3000,
                position: "bottom-left",
            });
            return;
        }
        const data: Blob | undefined = await fetchers[selectedReport](date, period);
        console.log(data);
        setReportData(data);
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

           <div className="grid pl-4 pr-4 pt-4 grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 w-full">
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
                            value="earns-report">
                                Reporte de Ganancias
                        </SelectItem>
                    </SelectContent>
                </Select>

                <div className="grid grid-cols-1 justify-end gap-2 lg:grid-cols-[1fr_1fr_1fr]">
                    <Select
                        onValueChange={(value) => setPeriod(value)}
                        defaultValue={period}>
                        <SelectTrigger className="w-full">
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
                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
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
                            className="text-xl font-bold flex gap-2 items-center">
                            <FileText size={20}/> 
                            {selectedReport === "best-products" && "Productos más vendidos"}
                            {selectedReport === "worst-products" && "Productos menos vendidos"}
                            {selectedReport === "no-sales" && "Productos sin ventas"}
                            {selectedReport === "stock-report" && "Stock del inventario"}
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