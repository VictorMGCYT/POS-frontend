import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { productsPagination } from "@/routes/Sales/interfaces/products.interface";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";
import { toast } from "sonner";
import type { AddProductInterface } from "../interfaces/Interfaces";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Outlet, useNavigate } from "react-router";
import { useTokenStore } from "@/global/states/tokenStore";


interface TableInventoryProps {
    productsPerPage: productsPagination | undefined;
    PaginationProducts: Function;
    currentPage: number;
    totalPages: number;
    setOrderProducts: React.Dispatch<React.SetStateAction<string>>;
    setStockOrder: React.Dispatch<React.SetStateAction<string>>;
    refetch: (limit?: number, orderName?: string) => Promise<void>
}

export default function TableInventory(
    {
        productsPerPage,
        PaginationProducts,
        currentPage,
        totalPages,
        setOrderProducts,
        setStockOrder,
        refetch
    }: TableInventoryProps) {
    const token = useTokenStore.getState().token;
        
    // ! Estados para manejar el producto a eliminar
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteProduct, setDeleteProduct] = useState<string>('');
    const refDeleteProduct = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    // Esta función 
    function handleEditProduct(product: string){
        if(!product) return;
        navigate(`/inventario/editar-producto/${product}`);
    }

    // ! Funciones para manejar la eliminación de productos
    function hanldeDeleteProduct(product: AddProductInterface) {
        if(!product.id) return;
        setDeleteProduct(product.id);
        refDeleteProduct.current?.click();
    }

    async function hanldeDeleteSubmit() {
        const url = API_URL;
        try {
            if(!deleteProduct) return;
            setLoading(true);
            await axios.delete(`${url}/products/delete/${deleteProduct}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Producto eliminado correctamente',{
                description: 'El producto se ha eliminado exitosamente.',
                position: 'bottom-left'
            });


            refetch(); // Refetch para actualizar la lista de productos
        } catch(error){
            toast.error('Error al eliminar el producto',{
                description: 'Por favor, intente nuevamente más tarde.',
                position: 'bottom-left'
            });
        } finally {
            setLoading(false);
            setDeleteProduct('');
        }
    }

    return(
        <>
            {/* Esto es simplemente para que react router renderice el outlet del diálogo de edición de producto */}
            <Outlet/>
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
                                            <Edit className="hover:cursor-pointer" onClick={() => handleEditProduct(product.id)} size={20}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" onClick={() => hanldeDeleteProduct(product)} size={20}/>
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

            {/* Díalogo para eliminar producto */}
            <AlertDialog>
                <AlertDialogTrigger 
                    ref={refDeleteProduct}
                    className="hidden">
                    Abrir
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>¿Seguro que deseas eliminar este producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no puede ser invertida.
                        El producto será eliminado permanentemente.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={hanldeDeleteSubmit}>
                        {loading ? 'Eliminando...' : 'Continuar'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            
        </>
    )
}