import { API_URL } from "@/global/variables/apiUrl";
import type { productsPagination } from "@/routes/Sales/products.interface";
import axios from "axios";
import { useEffect, useState } from "react";



export default function useProduct() {
    const [products, setProducts] = useState<productsPagination>();
    const url = API_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${url}/products/get-all`, {
                    withCredentials: true
                });
                setProducts(response.data);
            } catch (error) {
                // TODO validar mejor los errores
                console.log(error)
            }
        }

        fetchProducts()
    }, [])


    return products;

}