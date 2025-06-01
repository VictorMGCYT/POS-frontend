import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { productsPagination } from "@/routes/Sales/interfaces/products.interface";
import { ArrowUpDown, Edit, Trash } from "lucide-react";


interface TableInventoryProps {
    productsPerPage: productsPagination | undefined;
    PaginationProducts: Function;
    currentPage: number;
    totalPages: number;
    setOrderProducts: React.Dispatch<React.SetStateAction<string>>;
    setStockOrder: React.Dispatch<React.SetStateAction<string>>;
}

export default function TableInventory(
    {
        productsPerPage,
        PaginationProducts,
        currentPage,
        totalPages,
        setOrderProducts,
        setStockOrder
    }: TableInventoryProps) {
    

    return(
        <div className="col-span-2 rounded-lg border flex flex-col min-h-[300px] max-h-[400px] overflow-auto">
            <Table className="border-b">
                <TableHeader>
                    <TableRow className="dark:hover:bg-slate-800">
                        <TableHead 
                            onClick={() => setOrderProducts(prev => prev === 'asc' ? 'desc' : 'asc')} 
                            className="flex items-center whitespace-pre hover:cursor-pointer">
                            Nombre  <ArrowUpDown size={20}/>
                        </TableHead>
                        <TableHead>Código de barras</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Precio de Compra</TableHead>
                        <TableHead
                            onClick={() => setStockOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center whitespace-pre hover:cursor-pointer">
                            Stock  <ArrowUpDown size={20}/>
                        </TableHead>
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
                                    { Number(stockQuantity) <= 3 ? <TableCell><Badge variant={"destructive"}>{stockQuantity}</Badge></TableCell> : <TableCell>{stockQuantity}</TableCell>}
                                    <TableCell>{isByWeight === true ? <Badge>Por peso</Badge> : <Badge>Por unidad</Badge>}</TableCell>
                                    <TableCell className="flex items-center whitespace-pre">
                                        <Edit size={20}/>   |   <Trash className="stroke-red-500" size={20}/>
                                    </TableCell>
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