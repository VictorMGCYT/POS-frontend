import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useProduct from "@/hooks/useProduct";
import type { productsListInteface, productsPagination } from "@/routes/Sales/interfaces/products.interface";
import { useEffect, useState } from "react";



export default function TableInventory() {
    const {products} = useProduct();
    const [productsData, setProductsData] = useState<productsPagination>();


    useEffect(()=> {
        
    }, [products])

    return(
        <div className="col-span-2 rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow className="dark:hover:bg-slate-800">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Código de barras</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Precio de Compra</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="dark:hover:bg-slate-800">
                        <TableCell>INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell>$250.00</TableCell>
                        <TableCell>$250.00</TableCell>
                        <TableCell>$250.00</TableCell>
                        <TableCell>$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )

}