import { API_URL } from "@/global/variables/apiUrl";
import type { productsPagination } from "@/routes/Sales/interfaces/products.interface";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";



export default function useProduct() {
    const [products, setProducts] = useState<productsPagination>();
    const url = API_URL;

     const fetchProducts = useCallback(async () => {
        try {
            // TODO aquí debe de traer absolutamente todos los productos
            const response = await axios.get(`${url}/products/get-all`, {
                withCredentials: true
            });
            setProducts(response.data);
        } catch (error) {
            // TODO validar mejor los errores
            console.log(error)
        }
    }, [url])

        
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])


    return {products, refetch: fetchProducts};

}