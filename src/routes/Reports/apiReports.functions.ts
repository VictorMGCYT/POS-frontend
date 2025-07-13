import { useUserStore } from "@/global/states/userStore";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { toast } from "sonner";

const url = API_URL;

// Simulación de funciones para cada reporte (reemplaza por tus fetch reales)
export const fetchBestProducts = async (date: Date, period: string): Promise<Blob | undefined> => {
    try {
        const response = await axios.post(`${url}/reports/best-products`, 
            {
                userId: useUserStore.getState().user?.id || "defaultUser",
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

export const fetchWorstProducts = async (date: Date, period: string): Promise<Blob | undefined> => {
  
    try {
        const response = await axios.post(`${url}/reports/worst-products`, {
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: date,
            period: period
        }, {
            withCredentials: true,
            responseType: "blob"
        })

        const data: Blob = response.data;
        return data;
    } catch (error) {
        toast.error("Error al generar el reporte de productos menos vendidos.", {
            description: "Por favor, inténtelo de nuevo más tarde.",
        });
        return;
    }

};

export const fetchNoSales = async (date: Date, period: string): Promise<Blob | undefined> => {
    try {
        const response = await axios.post(`${url}/reports/no-sales`,{
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: date,
            period: period
        },{
            withCredentials: true,
            responseType: 'blob'
        })
        const data: Blob = response.data;
        return data;
    } catch (error) {
        toast.error("Error al generar el reporte de productos sin ventas.", {
            description: "Por favor, inténtelo de nuevo más tarde.",
        });
        return;
    }
};

export const fetchStock = async () => {
  return [{ nombre: "Producto 7", stock: 50 }, { nombre: "Producto 8", stock: 30 }];
};

export const fetchSales = async () => {
  return [{ fecha: "2025-07-01", total: 500 }, { fecha: "2025-07-02", total: 300 }];
};
