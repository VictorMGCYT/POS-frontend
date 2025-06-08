import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import Decimal from "decimal.js";
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  role: string;
} | null

export interface SaleInterface {
    saleItems:     SaleItem[];
    userId:        string;
    paymentMethod: string;
}

export interface SaleItem {
    productId: string;
    quantity:  string;
}


// ** Función para hacer el envío de la venta al backend
export async function handleSendSale(
        user: User,
        payment: string,
        total: string,
        sale: SaleInterface,
        refetch: () => Promise<void>,
        setSale: React.Dispatch<React.SetStateAction<SaleInterface>>
    ) {
    const url = API_URL;

    try {

        // el usuario debería existir, pero en caso de que no
        // por si las dudas enviamos una exception
        if(!user) throw new Error();
        if (sale.paymentMethod === 'Efectivo') {
            const pagoCon = new Decimal(payment);
            const totalPago = new Decimal(total);

            // Verificamos que se haya ingresado a una cantidad a pagar
            if (pagoCon.lessThan(totalPago)) {
                toast.warning("Advertencia", {
                    description: `Ingresa la cantidad con la que pagó el cliente,
                    tiene que ser mayor al total de la compra`,
                    position: 'bottom-left'
                })
                return
            }
        }
        
        // realizamos el envío de la compra al backend
        await axios.post(`${url}/sales/create`, {
            userId: sale.userId,
            paymentMethod: sale.paymentMethod,
            saleItems: sale.saleItems
        },{
            withCredentials: true
        })

        toast.success("Venta realizada!", {
            description: 'Se ha realizado la venta con exito',
            position: 'bottom-left'
        })


        // Recargamos los produtos del backend para asegurar consistencia de datos
        await refetch();

        // reiniciamos el estado de Sale para limpiar el ticket
        setSale({
            userId: user.id,
            paymentMethod: 'Efectivo',
            saleItems: []
        })

    } catch (error) {
        toast.error("Error", {
            description: 'No se pudo completar la venta, intentalo de nuevo'
        })
    }
}