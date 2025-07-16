import { API_URL } from "@/global/variables/variables";
import axios from "axios";


export async function LoaderProducts(params: any) {
    try {
        const url = API_URL;
        const response = await axios.get(`${url}/products/product/${params.productId}`, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
     throw new Error("Error al cargar los datos del producto");
    }
}