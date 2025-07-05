import Decimal from "decimal.js";
import type { productsListInteface } from "./interfaces/products.interface";
import type { SaleInterface } from "./interfaces/sale.interface";
import { toast } from "sonner";



type SetSale = React.Dispatch<React.SetStateAction<SaleInterface>>;
type SetProducts = React.Dispatch<React.SetStateAction<productsListInteface[]>>;
type SetStr = React.Dispatch<React.SetStateAction<string>>;
type SetWeightInput = React.Dispatch<React.SetStateAction<string>>

// ** Función para ir agregando los productos al carrito
export function addToCart(
        product: productsListInteface,
        sale: SaleInterface,
        setSale: SetSale,
        setStockData: SetProducts,
        setSearchTerm: SetStr,
        quantity = 1
    ) {
    setSearchTerm('');
    const productId = product.id;
    const one = new Decimal(quantity);

    // Verifica si ya existe en saleItems
    const existingItem = sale.saleItems.find(item => item.productId === productId);

    if(Number(product.stockQuantity) <= 0){
        toast.error('Advertencia', {
            description: 'No se cuenta con stock suficiente',
            position: 'bottom-left'
        })
    }else {
        // Si ya existe, sumamos 1 a la cantidad
        let updatedItems;
        if (existingItem) {
            updatedItems = sale.saleItems.map(item => {
                if (item.productId === productId) {
                    const newQty = new Decimal(item.quantity).plus(one);
                    return { ...item, quantity: newQty.toFixed(2) };
                }
                return item;
            });
        } else {
            // Si no existe, lo agregamos
            updatedItems = [
                ...sale.saleItems,
                { productId, quantity: one.toFixed(2) }
            ];
        }

        // Ahora actualizamos el estado de la venta
        setSale(prev => ({
            ...prev,
            saleItems: updatedItems
        }));

        // Actualiza ambos estados
        setStockData(prev =>
            prev.map(prod =>
                prod.id === productId
                    ? {
                        ...prod,
                        stockQuantity: new Decimal(prod.stockQuantity).minus(one).toFixed(2),
                    }
                    : prod
            )
        );


    }
}


// ** Función para incrementar la cantidad de items del carrito
export function increaseQty(
        productId: string,
        stockData: productsListInteface[],
        setSale: SetSale,
        setStockData: SetProducts
    ) {
    const one = new Decimal(1);

    const product = stockData.find( producto => producto.id === productId);

    if (Number(product?.stockQuantity) <= 0) {
        toast.error('Advertencia', {
            description: 'No se cuenta con stock suficiente',
            position: 'bottom-left'
        })
    } else{
        setSale(prev => ({
            ...prev,
            saleItems: prev.saleItems.map(item =>
            item.productId === productId
                ? {
                    ...item,
                    quantity: new Decimal(item.quantity).plus(one).toFixed(2),
                }
                : item
            ),
        }));

        setStockData(prev =>
            prev.map(prod =>
            prod.id === productId
                ? {
                    ...prod,
                    stockQuantity: new Decimal(prod.stockQuantity).minus(one).toFixed(2),
                }
                : prod
            )
        );
    }
}


// ** Función para decrementar la cantidad de items del carrito
export function decreaseQty(
        productId: string,
        setSale: SetSale,
        setStockData: SetProducts
    ) {
    const one = new Decimal(1);

    
    setSale(prev => ({
        ...prev,
        saleItems: prev.saleItems
        .map(item => {
            if (item.productId === productId) {
            const newQty = new Decimal(item.quantity).minus(one);
            return newQty.greaterThan(0)
                ? { ...item, quantity: newQty.toFixed(2) }
                : null;
            }
            return item;
        })
        .filter(Boolean) as typeof prev.saleItems,
    }));

    setStockData(prev =>
        prev.map(prod =>
        prod.id === productId
            ? {
                ...prod,
                stockQuantity: new Decimal(prod.stockQuantity).plus(one).toFixed(2),
            }
            : prod
        )
    );

}


// ** Función para remover el item del carrito
export function removeFromCart(
        productId: string,
        sale: SaleInterface,
        setStockData: SetProducts,
        setSale: SetSale
    ) {
    const item = sale.saleItems.find(i => i.productId === productId);
    if (!item) return;

    const quantity = new Decimal(item.quantity);

    // 1. Regresar la cantidad al stock
    setStockData(prev =>
        prev.map(p =>
        p.id === productId
            ? {
                ...p,
                stockQuantity: new Decimal(p.stockQuantity).plus(quantity).toString(),
            }
            : p
        )
    );

    // 2. Quitarlo del carrito
    setSale(prev => ({
        ...prev,
        saleItems: prev.saleItems.filter(i => i.productId !== productId),
    }));
}


// ** función para agregar cantidad por peso
export function handleAddByWeight(
        product: productsListInteface,
        weightInput: string,
        setWeightInput: SetWeightInput,
        sale: SaleInterface,
        setStockData: SetProducts,
        setSale: SetSale,
        setSearchTerm: SetStr
    ) {
    const quantity = Number(weightInput);

    if (quantity > Number(product.stockQuantity)) {
        toast.error('Advertencia', {
            description: 'La cantidad ingresada supera el stocks',
            position: 'bottom-left'
        })
    } else{
        if (quantity > 0) {
            addToCart(product, sale, setSale, setStockData, setSearchTerm, quantity)
            setWeightInput(""); // Limpia el input después
        } else {
            toast.error('Advertencia', {
                description: 'El dato debe ser mayor a 0',
                position: 'bottom-left'
            });
        }
    }
};