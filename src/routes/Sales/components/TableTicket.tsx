
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Decimal from "decimal.js";
import { Trash } from "lucide-react";
import type { SaleInterface } from "../interfaces/sale.interface";
import type { productsListInteface } from "../interfaces/products.interface";


interface PropsTableTicket {
    sale: SaleInterface;
    stockData: productsListInteface[];
    decreaseQty: Function;
    increaseQty: Function;
    removeFromCart: Function
}

export default function TableTicket(
    {
        sale,
        stockData,
        decreaseQty,
        increaseQty,
        removeFromCart
    }: PropsTableTicket) {

    return (
        <Table>
            <TableHeader>
                <TableRow className="dark:hover:bg-slate-900">
                    <TableHead className="max-w-[120px] text-center">Producto</TableHead>
                    <TableHead className="text-center">Cant./Peso</TableHead>
                    <TableHead className="text-center">Precio</TableHead>
                    <TableHead className="text-center">Subtotal</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sale.saleItems.map(item => {
                    const product = stockData.find(p => p.id === item.productId);
                    if (!product) return null;

                    const quantity = new Decimal(item.quantity);
                    const unitPrice = new Decimal(product.unitPrice);
                    const subtotal = unitPrice.mul(quantity);

                    // Retornar una cosa u otra dependiendo del tipo de producto
                    if(product.isByWeight === false){
                        return (
                            <TableRow
                                key={product.id}
                                className="text-center hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                                <TableCell className="max-w-[120px] truncate">
                                {product.name}
                                </TableCell>

                                {/* Cantidad con botones */}
                                <TableCell className="flex justify-center items-center gap-2">
                                <button
                                    className="bg-slate-200 px-2 rounded hover:bg-slate-300
                                    dark:bg-slate-900"
                                    onClick={() => decreaseQty(product.id)}
                                >
                                    -
                                </button>
                                {quantity.toString()}
                                <button
                                    className="bg-slate-200 px-2 rounded hover:bg-slate-300
                                    dark:bg-slate-900"
                                    onClick={() => increaseQty(product.id)}
                                >
                                    +
                                </button>
                                </TableCell>

                                <TableCell>${unitPrice.toFixed(2)}</TableCell>
                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                <TableCell>
                                <Trash
                                    size={15}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => removeFromCart(product.id)}
                                />
                                </TableCell>
                            </TableRow>
                        );
                    } else {
                        return (
                            <TableRow
                                key={product.id}
                                className="text-center hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                                <TableCell className="max-w-[120px] truncate">
                                {product.name}
                                </TableCell>

                                {/* Cantidad con botones */}
                                <TableCell className="flex justify-center items-center gap-2">
                                {quantity.toString()}
                                </TableCell>

                                <TableCell>${unitPrice.toFixed(2)}</TableCell>
                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                <TableCell>
                                <Trash
                                    size={15}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => removeFromCart(product.id)}
                                />
                                </TableCell>
                            </TableRow>
                        )
                    }
                })}

            </TableBody>
        </Table>
       
    )

}