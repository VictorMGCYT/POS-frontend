import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { productsPagination } from "@/routes/Sales/interfaces/products.interface";


interface TableInventoryProps {
    productsPerPage: productsPagination | undefined;
    PaginationProducts: Function;
    currentPage: number;
    totalPages: number
}

export default function TableInventory(
    {
        productsPerPage,
        PaginationProducts,
        currentPage,
        totalPages
    }: TableInventoryProps) {
    

    return(
        <div className="col-span-2 rounded-lg border flex flex-col min-h-[300px] max-h-[400px] overflow-auto">
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
                                id,
                                name, 
                                skuCode, 
                                unitPrice, 
                                purchasePrice, 
                                stockQuantity,
                                isByWeight} = product;
                            return(
                                <TableRow key={id} className="dark:hover:bg-slate-800">
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
            <Pagination className="justify-end mt-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            className="hover:cursor-pointer"
                            onClick={() => PaginationProducts(currentPage, 'previous')}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem className="font-semibold">
                        Total: {totalPages}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            className="hover:cursor-pointer"
                            onClick={() => PaginationProducts(currentPage, 'next')}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )

}