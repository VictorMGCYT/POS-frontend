import { OFFSET_PRODUCTS } from "@/global/variables/variables";
import { toast } from "sonner";

interface DataProduct {
    name: string;
    skuCode: string;
    unitPrice: string;
    purchasePrice: string;
    stockQuantity: string;
    isByWeight: boolean;
}

// ** Función para validar los datos del producto
export function validateDataProduct({ name, skuCode, unitPrice, purchasePrice, stockQuantity }: DataProduct) {
    if (name.trim().length < 3) {
        toast.error('El nombre debe tener al menos 3 caracteres.');
        return true;
    }

    if (skuCode.trim().length < 3) {
        toast.error('El código SKU debe tener al menos 3 caracteres.');
        return true;
    }

    const unitPriceNumber = parseFloat(unitPrice);
    const purchasePriceNumber = parseFloat(purchasePrice);
    const stockQuantityNumber = parseFloat(stockQuantity);

    if (isNaN(unitPriceNumber) || unitPriceNumber <= 0) {
        toast.error('El precio unitario debe ser un número mayor a 0.');
        return true;
    }

    if (isNaN(purchasePriceNumber) || purchasePriceNumber <= 0) {
        toast.error('El precio de compra debe ser un número mayor a 0.');
        return true;
    }

    if (isNaN(stockQuantityNumber) || stockQuantityNumber <= 0) {
        toast.error('La cantidad en stock debe ser un número mayor a 0.');
        return true;
    }
}

// ** Función para manejar la paginación de productos

export function PaginationProducts(
    paginaActual: number, 
    action:  'next' | 'previous',
    totalPages: number,
    setOffset: React.Dispatch<React.SetStateAction<number>>,
    offset: number,
) {

    const saltoProductos = OFFSET_PRODUCTS; 

    if (action === 'next') {
        if (paginaActual >= totalPages) {
            toast.warning('No hay más productos para mostrar', {
                position: 'bottom-left'
            });
            return;
        }
        setOffset(prev => prev + saltoProductos);
    } else if (action === 'previous') {
        if (offset > 0) {
            setOffset(prev => prev - saltoProductos);
        }else{
            toast.warning('No hay más productos para mostrar', {
                position: 'bottom-left'
            });
            return;
        }
    }

}

