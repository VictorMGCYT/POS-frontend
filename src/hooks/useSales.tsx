import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function useSales() {

    const [sales, setSales] = useState<SaleInteface>();

    // Debe de recibir dos parametros obligatorios, el primero la fecha inicial y el segundo la fecha final
    const fetchSales = async (start: string, end: string) => {
        try {
            const url = API_URL;
            const response = await axios.get<SaleInteface>(`${url}/sales/get?startDate=${start}&endDate=${end}`,
                {
                    withCredentials: true
                }
            );
            setSales(response.data);
            toast.success("Ventas obtenidas correctamente", {
                description: "Las ventas se han cargado exitosamente."
            });
        } catch (error: any) {
            if(axios.isAxiosError(error)){
                if(error.response){
                    const status = error.response.status;
                    if (status === 404) {
                        toast.error("No se encontraron ventas en el rango de fechas seleccionado", {
                            description: "Por favor, intenta con un rango de fechas diferente."
                        });
                    }else {
                        toast.error("Error inesperado al obtener ventas",{
                        description: "Por favor, intenta de nuevo más tarde."
                    })
                    }
                }
            } else {
                toast.error("Error inesperado al obtener ventas",{
                    description: "Por favor, intenta de nuevo más tarde."
                })
            }
        }
    }

    return { sales, refetch: fetchSales };

}

interface SaleInteface {
    totalItems:   number;
    currentPage:  number;
    totalPages:   number;
    itemsPerPage: number;
    resul:        Resul;
    sales:        Sale[];
}

export interface Resul {
    totalSales:  string;
    totalAmount: string;
    totalProfit: string;
    totalCash:   string;
    totalCard:   string;
    totalSalesCash: string;
    totalSalesCard: string;
}

export interface Sale {
    id:            string;
    user:          User;
    totalAmount:   string;
    totalProfit:   string;
    paymentMethod: string;
    saleDate:      Date;
}

export interface User {
    id:       string;
    username: string;
    role:     string;
}
