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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";


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
    // ! Estados para manejar el producto a editar
    // Referencia para el botón de editar producto
    const refEditProduct = useRef<HTMLButtonElement>(null);
    // Estado para manejar el producto que se va a editar
    const [editProduct, setEditProduct] = useState<AddProductInterface>({
        name: '',
        skuCode: '',
        isByWeight: false,
        unitPrice: '',
        purchasePrice: '',
        stockQuantity: ''
    });
    const [loading, setLoading] = useState<boolean>(false);

    // ! Estados para manejar el producto a eliminar

    const [deleteProduct, setDeleteProduct] = useState<string>('');
    const refDeleteProduct = useRef<HTMLButtonElement>(null);

    // ! Funciones para manejar la edición de productos
    // Con esta función seteamos el producto que se va a editar y abrimos el diálogo de edición
    function handleEditProduct(product: AddProductInterface){
        refEditProduct.current?.click();
        setEditProduct(product);
    }

    // Función para manejar el envío del formulario de edición desde el dialog
    async function handleEditSubmit() {
        const url = API_URL;
        try {
            setLoading(true);
            await axios.patch(`${url}/products/update/${editProduct.id}`,{
                name: editProduct.name,
                skuCode: editProduct.skuCode,
                isByWeight: editProduct.isByWeight,
                unitPrice: editProduct.unitPrice,
                purchasePrice: editProduct.purchasePrice,
                stockQuantity: editProduct.stockQuantity
            },{
                withCredentials: true
            })

            toast.success('Producto editado correctamente',{
                description: 'El producto se ha editado exitosamente.',
                position: 'bottom-left'
            });

            refetch(); // Refetch para actualizar la lista de productos

        } catch (error) {
            toast.error('Error al editar el producto',{
                description: 'Por favor, intente nuevamente más tarde.',
                position: 'bottom-left'
            });
        } finally{
            setLoading(false);
        }
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
                withCredentials: true
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
                                            <Edit className="hover:cursor-pointer" onClick={() => handleEditProduct(product)} size={20}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" onClick={() => hanldeDeleteProduct(product)} size={20}/>
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

            {/* Díalogo para edita producto */}

            <Dialog>
                <DialogTrigger className="hidden"
                    ref={refEditProduct}
                    >
                    + Agregar Producto
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>
                        Completa los campos para editar el producto en el inventario.
                    </DialogDescription>
                    </DialogHeader>
                    {/* El form se dejó afuera del description porque este genera una etiqueta <P></P> 
                    y no se puede anidar un form dentro de un P */}
                    <form className="flex flex-col space-y-2">
                        
                        <Label htmlFor="name">
                            Nombre del Producto:
                        </Label>
                        <Input
                            id="name"
                            onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                            value={editProduct?.name}
                            minLength={3}
                            type="text"/>
                        <Label htmlFor="sku-code">
                            Código de Barras:
                        </Label>
                        <Input
                            id="sku-code"
                            onChange={(e) => setEditProduct({...editProduct, skuCode: e.target.value}) }
                            value={editProduct?.skuCode}
                            minLength={3}
                            type="text"/>
                        <span className="flex items-center space-x-2 mt-2 mb-2">
                            <Switch 
                                checked={editProduct?.isByWeight}
                                onCheckedChange={(checked) => setEditProduct({...editProduct, isByWeight: checked})}
                            />
                            <Label>Producto vendido por peso</Label>
                        </span>
                        <span className="grid grid-cols-2 gap-4">
                            <span className="flex flex-col space-y-2">
                                <Label htmlFor="unit-price">
                                    Precio de venta:
                                </Label>
                                <Input 
                                    className="text-right"
                                    id="unit-price"
                                    onChange={(e) => setEditProduct({...editProduct, unitPrice: e.target.value})}
                                    value={editProduct?.unitPrice}
                                    type="number" 
                                    step="0.01" 
                                    min={0}/>
                            </span>
                            <span className="flex flex-col space-y-2">
                                <Label htmlFor="purchase-price">
                                    Precio de compra:
                                </Label>
                                <Input 
                                    className="text-right"
                                    id="purchase-price"
                                    onChange={(e) => setEditProduct({...editProduct, purchasePrice: e.target.value})}
                                    value={editProduct?.purchasePrice}
                                    type="number" 
                                    step="0.01" 
                                    min={0}/>
                            </span>
                        </span>
                        <Label htmlFor="stock-quantity">
                            Stock Inicial (unidades):
                        </Label>
                        <Input 
                            className="text-right"
                            id="stock-quantity"
                            value={editProduct?.stockQuantity}
                            onChange={(e) => setEditProduct({...editProduct, stockQuantity: e.target.value})}
                            type="number" 
                            step="1"
                            min={0}/>
                        <Button 
                            disabled={loading}
                            onClick={handleEditSubmit}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-800
                            hover:cursor-pointer dark:text-white">
                            {loading ? 'Guardando...' : 'Editar Producto'}
                        </Button>
                    
                    </form>
                </DialogContent>
            </Dialog>   
        </>
    )
}