import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { AddProductInterface } from "../interfaces/Interfaces";

interface DialogAddProductProps {
    refAddProduct: React.RefObject<HTMLButtonElement | null>;
    addProduct: AddProductInterface;
    setAddProduct: React.Dispatch<React.SetStateAction<AddProductInterface>>;
    refetch: (limit?: number, orderName?: string) => Promise<void>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddProduct: Function
}

export default function DialogAddProduct({
    refAddProduct, 
    addProduct, 
    setAddProduct, 
    isLoading, 
    handleAddProduct
}: DialogAddProductProps) {

    return(
        <>
            <Dialog>
                <DialogTrigger className="hidden"
                    ref={refAddProduct}>
                    + Agregar Producto
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Producto</DialogTitle>
                        <DialogDescription>
                            Completa los campos para agregar un nuevo producto al inventario.
                        </DialogDescription>
                    </DialogHeader>
                    {/* El form se dejó afuera del description porque este genera una etiqueta <P></P> 
                    y no se puede anidar un form dentro de un P */}
                    <form onSubmit={(e) => handleAddProduct(e)} className="flex flex-col space-y-2">
                        
                        <Label htmlFor="name">
                            Nombre del Producto:
                        </Label>
                        <Input
                            id="name"
                            onChange={(e) => setAddProduct({...addProduct, name: e.target.value})}
                            value={addProduct.name}
                            minLength={3}
                            type="text"/>
                        <Label htmlFor="sku-code">
                            Código de Barras:
                        </Label>
                        <Input
                            id="sku-code"
                            onChange={(e) => setAddProduct({...addProduct, skuCode: e.target.value}) }
                            value={addProduct.skuCode}
                            minLength={3}
                            type="text"/>
                        <span className="flex items-center space-x-2 mt-2 mb-2">
                            <Switch 
                                checked={addProduct.isByWeight}
                                onCheckedChange={(checked) => setAddProduct({...addProduct, isByWeight: checked})}/>
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
                                    onChange={(e) => setAddProduct({...addProduct, unitPrice: e.target.value})}
                                    value={addProduct.unitPrice}
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
                                    onChange={(e) => setAddProduct({...addProduct, purchasePrice: e.target.value})}
                                    value={addProduct.purchasePrice}
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
                            value={addProduct.stockQuantity}
                            onChange={(e) => setAddProduct({...addProduct, stockQuantity: e.target.value})}
                            type="number" 
                            step="1"
                            min={0}/>
                        <Button 
                            disabled={isLoading}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-800
                            hover:cursor-pointer dark:text-white">
                            {isLoading ? 'Agregando...' : 'Agregar Producto'}
                        </Button>
                    
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}