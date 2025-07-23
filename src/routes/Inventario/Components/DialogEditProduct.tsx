import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { AddProductInterface } from "../interfaces/Interfaces";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import useProduct from "@/hooks/useProduct";
import { API_URL } from "@/global/variables/variables";
import { SkeletonForms } from "@/components/ui/skeleton-forms";
import { loaderProducts } from "@/loaders-params-react-router/LoaderProducts";
import { useTokenStore } from "@/global/states/tokenStore";


export default function DialogEditProduct() {
    const token = useTokenStore.getState().token;
    const {refetch} = useProduct();
    // parametro extraido por react-router
    const {productId} = useParams();
    const [editProduct, setEditProduct] = useState<AddProductInterface | undefined>();

    useEffect(() => {
        (async () => {
            // Llamamos al loader que nos trae el producto
            const product: AddProductInterface = await loaderProducts({productId: productId});
            // lo asignamos al estado
            setEditProduct(product);
        })()
    }, [])

    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    function handleClose() {
        setOpen(false);
        navigate("/inventario");
    }

    // Función para manejar el envío del formulario de edición desde el dialog
    async function handleEditSubmit() {
        if(!editProduct) return;
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            toast.success('Producto editado correctamente',{
                description: 'El producto se ha editado exitosamente.',
                position: 'bottom-left'
            });

            // Reiniciar el formulario
            setEditProduct({
                id: '',
                name: '',
                skuCode: '',
                isByWeight: false,
                unitPrice: '',
                purchasePrice: '',
                stockQuantity: ''
            })

            refetch(); // Refetch para actualizar la lista de productos

        } catch (error) {
            toast.error('Error al editar el producto',{
                description: 'Por favor, intente nuevamente más tarde.',
                position: 'bottom-left'
            });
        } finally{
            setLoading(false);
        }
        setOpen(false);
        navigate("/inventario");
        window.location.reload()
    }

    return(
        <>
            {
                !editProduct ? (
                    <SkeletonForms/>
                )
                :
                (
                    <Dialog open={open} onOpenChange={handleClose}>
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
                )
            }
        </>
    )

}