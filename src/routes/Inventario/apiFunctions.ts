import axios from "axios";
import { validateDataProduct } from "./functions";
import { toast } from "sonner";
import type { AddProductInterface } from "./interfaces/Interfaces";
import { API_URL, OFFSET_PRODUCTS } from "@/global/variables/variables";

export async function handleAddProduct(
        e: React.FormEvent<HTMLFormElement>,
        addProduct: AddProductInterface,
        setAddProduct: React.Dispatch<React.SetStateAction<AddProductInterface>>,
        refetch:  (limit?: number, orderName?: string) => Promise<void>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) {
        // prevenimos la recarga del formulario 
        e.preventDefault();

        try {
            const { name, skuCode, unitPrice, purchasePrice, stockQuantity, isByWeight } = addProduct;

            const validate = validateDataProduct(addProduct);
            if (validate) return; // Si hay un error en la validación, no continuamos
            
            setIsLoading(true);
            const url = API_URL;
            await axios.post(`${url}/products/create`, {
                name: name,
                skuCode: skuCode,
                isByWeight: isByWeight,
                unitPrice: unitPrice,
                purchasePrice: purchasePrice,
                stockQuantity: stockQuantity
            },
            {
                withCredentials: true
            })

            toast.success('Producto agregado correctamente');
            setAddProduct({
                name: '',
                skuCode: '',
                isByWeight: false,
                unitPrice: '',
                purchasePrice: '',
                stockQuantity: ''
            });
            refetch(OFFSET_PRODUCTS); // Refetch para actualizar la lista de productos
        } catch (error) {
            toast.error('Error al agregar el producto', {
                description: 'Por favor, inténtelo de nuevo más tarde.',
            });
        } finally {
            setIsLoading(false);
        }
    }