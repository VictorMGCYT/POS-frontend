import { OFFSET_PRODUCTS } from "@/global/variables/variables";
import { toast } from "sonner";

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

