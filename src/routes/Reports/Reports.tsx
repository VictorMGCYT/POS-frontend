import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";



// Simulación de funciones para cada reporte (reemplaza por tus fetch reales)
const fetchBestProducts = async () => {

    try {
        const url = API_URL;
        const response = await axios.post(`${url}/reports/best-products`, 
            {
                "username": "Víctor Manuel González Cabrera",
	            "daydate": "Sat Jul 05 2025 16:22:54 GMT-0600 (GMT-06:00)"
            }, 
            {
                withCredentials: true,
                responseType: "blob"
            }
        );

        const data: Blob = response.data;
        return data;
    } catch (error) {

    }

  return [{ nombre: "Producto 1", ventas: 100 }, { nombre: "Producto 2", ventas: 80 }];
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

    const [selectedReport, setSelectedReport] = useState<string>("best-products");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [reportData, setReportData] = useState<Blob>(new Blob());

    const fetchers: Record<string, () => Promise<any>> = {
        "best-products": fetchBestProducts,
        "worst-products": fetchWorstProducts,
        "no-sales": fetchNoSales,
        "stock-report": fetchStock,
        "sales-report": fetchSales,
    }

    useEffect(() => {
        (async () => {
            const data: Blob = await fetchers[selectedReport]();
            setReportData(data);
        })()
    }, [selectedReport])

    useEffect(() => {
        if(reportData){
            const url = URL.createObjectURL(reportData);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url); // Limpia la URL cuando cambie el blob o se desmonte el componente
        } else {
            setPdfUrl(null);
        }
    }, [reportData])

    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Reportes de Ventas
                    </h2>
                </div>
            </div>

           <div className="grid p-4 grid-cols-1 gap-4 w-full">
               <Select 
                    defaultValue={selectedReport}
                    onValueChange={(value) => setSelectedReport(value)}>
                    <SelectTrigger className="w-[250px]">
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
                            <p className="text-gray-500">Cargando reporte...</p>
                        }
                    </CardContent>
                </Card>
            </div>
        </>
    )

}