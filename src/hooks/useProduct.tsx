import { useTokenStore } from "@/global/states/tokenStore";
import { API_URL } from "@/global/variables/variables";
import type { productsPagination } from "@/routes/Sales/interfaces/products.interface";
import axios from "axios";
import { useCallback, useState } from "react";



export default function useProduct() {
    const token = useTokenStore.getState().token;
    const [products, setProducts] = useState<productsPagination>();
    const url = API_URL;

     const fetchProducts = useCallback(async (limit = 5000, orderName = 'asc') => {
        try {
            // ! Si no se pasa límite, se traen hasta 5000 productos por defecto
            const response = await axios.get(`${url}/products/get-all?limit=${limit}&orderProducts=${orderName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
        } catch (error: any) {
            // TODO validar mejor los errores
        }
    }, [url])

    // Se quitó porque causaba muchos problemas 
    // useEffect(() => {
    //     fetchProducts()
    // }, [fetchProducts])


    return {products, refetch: fetchProducts};

}