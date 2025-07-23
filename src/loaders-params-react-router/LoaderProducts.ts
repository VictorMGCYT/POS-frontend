import { useTokenStore } from "@/global/states/tokenStore";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { toast } from "sonner";

interface loaderProductsParams {
    productId: string | undefined;
}

export async function loaderProducts( params: loaderProductsParams) {
    const token = useTokenStore.getState().token;
    const { productId } = params;

    try {
        const url = API_URL;
        const response = await axios.get(`${url}/products/product/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        toast.error("Error al cargar el producto", {
            description: "Ha ocurrido un error al cargar los datos del producto. Por favor, inténtalo de nuevo.",
        });
        return undefined;
    }
}