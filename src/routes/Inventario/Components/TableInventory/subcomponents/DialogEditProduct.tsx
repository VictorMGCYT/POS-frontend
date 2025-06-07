import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AddProductInterface } from "@/routes/Inventario/interfaces/Interfaces";

interface EditProductProps {
    refEditProduct: React.RefObject<HTMLButtonElement | null>;
    editProduct: AddProductInterface;
    setEditProduct: React.Dispatch<React.SetStateAction<AddProductInterface>>
    handleEditSubmit: () => Promise<void>;
    loading: boolean;
}
export default function EditProduct({
        refEditProduct,
        editProduct,
        setEditProduct,
        handleEditSubmit,
        loading
    }: EditProductProps) {



    return(
        <Dialog>
            <DialogTrigger className="hidden"
                ref={refEditProduct}
                >
                + Agregar Producto
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Agregar Producto</DialogTitle>
                {/* El form se dejó afuera del description porque este genera una etiqueta <P></P> 
                y no se puede anidar un form dentro de un P */}
                    <form>
                        <DialogDescription className="flex flex-col space-y-2">
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
                        </DialogDescription>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>   
    )
}