import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { productsListInteface } from "../interfaces/products.interface";

interface PropsTableProducts {
    stockProducts: productsListInteface[];
    addToCart: Function,
    weightInput: string;
    setWeightInput: React.Dispatch<React.SetStateAction<string>>;
    handleAddByWeight: Function;
    refInputWeight: React.RefObject<HTMLButtonElement | null>
}

export default function TableProducts({
    stockProducts, 
    addToCart, 
    weightInput,
    setWeightInput,
    handleAddByWeight,
    refInputWeight}: PropsTableProducts) {
    
    return (
        <>
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
                    stockProducts.map( (product) => {
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
                                    {
                                        isByWeight === false ?
                                        <Button 
                                        className="hover:cursor-pointer"
                                        onClick={() => addToCart(product)}
                                        variant={"outline"}>
                                        +
                                        </Button>
                                        :
                                        <AlertDialog>
                                            <AlertDialogTrigger
                                                ref={refInputWeight}
                                                className="w-[42px] text-center border h-[35px] rounded-md
                                                dark:bg-gray-900 dark:brightness-75 dark:hover:bg-gray-800 hover:cursor-pointer">
                                                +
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Ingresar Peso</AlertDialogTitle>
                                                    <AlertDialogDescription className="flex flex-col">
                                                        <span className="text-black dark:text-white text-lg font-medium">
                                                            {product.name}
                                                        </span>
                                                        <span>Precio: ${product.unitPrice}/kg</span>
                                                        <span>Stock Disponible: {product.stockQuantity}</span>
                                                        <span className="mt-2">
                                                            <Label 
                                                                htmlFor="quantity-weight"
                                                                className="mb-2 text-black dark:text-white">
                                                                Peso en Kilogramos:
                                                            </Label>
                                                            <Input 
                                                            className="text-black dark:text-white text-right"
                                                            value={weightInput}
                                                            onChange={(e) => setWeightInput(e.target.value)}
                                                            onKeyDown={(key) => {
                                                                if (key.key === "Enter") {
                                                                    handleAddByWeight(product)
                                                                }
                                                            }}
                                                            min="0.01"
                                                            step="0.01"
                                                            id="quantity-weight"
                                                            type="number"/>
                                                        </span>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="hover:cursor-pointer">
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction 
                                                    className="bg-blue-600 hover:bg-blue-800
                                                    dark:text-white hover:cursor-pointer"
                                                    onClick={() => handleAddByWeight(product)}>
                                                        Agregar al Carrito
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
        </>
    )

}