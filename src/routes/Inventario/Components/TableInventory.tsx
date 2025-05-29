import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useProduct from "@/hooks/useProduct";
import type { productsListInteface, productsPagination } from "@/routes/Sales/interfaces/products.interface";
import { useEffect, useState } from "react";



export default function TableInventory() {
    // El hook solo lo usamos para la primera llamada a la API
    const {products} = useProduct();
    const [productsPerPage, setProductsPerPage] = useState<productsPagination>();
    const [offset, setOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCuerrentPage] = useState(1);


    useEffect(()=> {
        if (products) {
            setProductsPerPage(products);
            setTotalPages(products.totalPages);
            setCuerrentPage(products.currentPage);
        }
    }, [products])

    return(
        <div className="col-span-2 rounded-lg border flex flex-col">
            <Table className="border-b">
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
                    {
                        productsPerPage?.products.map((product) => {
                            const {
                                name, 
                                skuCode, 
                                unitPrice, 
                                purchasePrice, 
                                stockQuantity,
                                isByWeight} = product;
                            return(
                                <TableRow className="dark:hover:bg-slate-800">
                                    <TableCell>{name}</TableCell>
                                    <TableCell>{skuCode}</TableCell>
                                    <TableCell>${unitPrice}</TableCell>
                                    <TableCell>${purchasePrice}</TableCell>
                                    <TableCell>{stockQuantity}</TableCell>
                                    <TableCell>{isByWeight === true ? <Badge>Por peso</Badge> : <Badge>Por unidad</Badge>}</TableCell>
                                    <TableCell>Editar / Borrar</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <Pagination className="justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem className="font-semibold">
                        Total: {totalPages}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )

}