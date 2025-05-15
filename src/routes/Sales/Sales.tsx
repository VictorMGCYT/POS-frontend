import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, SearchIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { productsListInteface } from "./products.interface";
import useProduct from "@/hooks/useProduct";



export default function Sales(){
    // Con nuestro customhook extraemos los productos y su paginación de la base
    const products= useProduct();
    const [originalProducts, setOriginalProducts] = useState<productsListInteface[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<productsListInteface[]>([]);

    // ** Efecto inicial para asignar productos
    useEffect(() => {
        if (products && products.products.length > 0) {
            setOriginalProducts(products.products);
            setFilteredProducts(products.products);
        }
    }, [products])

    // ** Efecto para filtrar los productos por nombre o código de barras
    useEffect(() => {
        if (searchTerm.length === 0) {
            setFilteredProducts(originalProducts);
        } else {
            const filterProducts = originalProducts.filter(product => {
                return (
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.skuCode.toUpperCase().includes(searchTerm.toUpperCase())
                );
            });
            setFilteredProducts(filterProducts);
        }
    }, [searchTerm, originalProducts]);

    // TODO agregar al carrito
    function addToCart(product: productsListInteface) {
        console.log(product);
    }

    return(
        <>
             <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Punto de Venta
                    </h2>
                    {/* <p className="text-gray-500">
                        Visualiza y gestiona tu información personal y profesional
                    </p> */}
                </div>
            </div>
            <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            Buscar Productos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div 
                            className="flex items-center w-full space-x-2 rounded-lg border 
                            dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-3.5 py-2">
                            <SearchIcon className="h-4 w-4" />
                            <Input 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="search" 
                            placeholder="Buscar producto por nombre o código de barras" 
                            className="w-full border-0 h-6 font-semibold" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full rounded-md border h-[46vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="dark:hover:bg-slate-900">
                                        <TableHead className="max-w-[120px]">Producto</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead className="text-center">Stock</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {   
                                        filteredProducts.map( (product) => {
                                            const {id, name, unitPrice, stockQuantity, isByWeight} = product;
                                            return(
                                                <TableRow key={id} className="dark:hover:bg-slate-900">
                                                    <TableCell className="max-w-[120px] font-medium truncate">
                                                        {name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {unitPrice}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {
                                                            Number(stockQuantity) >= 4 ?
                                                            (isByWeight ? Number(stockQuantity).toFixed(2) : Number(stockQuantity).toFixed(0)) 
                                                            :
                                                            <Badge
                                                                variant={"destructive"}>
                                                                {(isByWeight ? Number(stockQuantity).toFixed(2) : Number(stockQuantity).toFixed(0))}
                                                            </Badge>
                                                        }
                                                    </TableCell>
                                                    <TableCell> 
                                                        {
                                                            isByWeight ?
                                                            <Badge variant={"secondary"}>Por Peso</Badge> :
                                                            <Badge variant={"secondary"}>Por Unidad</Badge>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            className="hover:cursor-pointer"
                                                            onClick={() => addToCart(product)}
                                                            variant={"outline"}>
                                                            +
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            Ticket de Venta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                                <TableHeader>
                                    <TableRow className="dark:hover:bg-slate-900">
                                        <TableHead className="max-w-[120px]">Producto</TableHead>
                                        <TableHead>Cant./Peso</TableHead>
                                        <TableHead className="text-center">Precio</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>1</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell><Trash/></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <div className="w-full grid grid-cols-[3fr_2fr] gap-2">
                            <Button>
                                Completar Venta
                            </Button>
                            <Button>
                                <Printer/>
                                Imprimir
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}