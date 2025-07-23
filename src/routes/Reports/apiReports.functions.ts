import { useTokenStore } from "@/global/states/tokenStore";
import { useUserStore } from "@/global/states/userStore";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { toast } from "sonner";

const url = API_URL;

// Simulación de funciones para cada reporte (reemplaza por tus fetch reales)
export const fetchBestProducts = async (date: Date, period: string): Promise<Blob | undefined> => {
    const token = useTokenStore.getState().token;
    try {
        const response = await axios.post(`${url}/reports/best-products`, 
            {
                userId: useUserStore.getState().user?.id || "defaultUser",
	            daydate: date,
                period: period// Puedes cambiar esto según el periodo seleccionado
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
    const token = useTokenStore.getState().token;
    try {
        const response = await axios.post(`${url}/reports/worst-products`, {
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: date,
            period: period
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const token = useTokenStore.getState().token;
    try {
        const response = await axios.post(`${url}/reports/no-sales`,{
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: date,
            period: period
        },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const fetchStock = async (): Promise<Blob | undefined> => {
    const token = useTokenStore.getState().token;
    try {
        const response = await axios.post(`${url}/reports/stock`, {
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: new Date(),
        },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob'
        })
        const data: Blob = response.data;
        return data
    } catch (error) {
        toast.error("Error al generar el reporte de stock.", {
            description: "Por favor, inténtelo de nuevo más tarde.",
        });
        return;
    }
};

export const fetchEarns = async (date: Date, period: string): Promise<Blob | undefined> => {
    const token = useTokenStore.getState().token;
    try {
        const response = await axios.post(`${url}/reports/earns`, {
            userId: useUserStore.getState().user?.id || "defaultUser",
            daydate: date,
            period: period
        },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob'
        })
        const data: Blob = response.data;
        return data;
    } catch (error) {
        toast.error("Error al generar el reporte de ganancias.", {
        description: "Por favor, inténtelo de nuevo más tarde.",
        });
        return;
     }
};
