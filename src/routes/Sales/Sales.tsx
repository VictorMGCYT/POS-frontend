import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, SearchIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { productsListInteface } from "./interfaces/products.interface";
import useProduct from "@/hooks/useProduct";
import useUser from "@/hooks/useUser";
import type { SaleInterface } from "./interfaces/sale.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Decimal from "decimal.js";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



export default function Sales(){
    // Con nuestro customhook extraemos los productos y su paginación de la base
    const products = useProduct();
    // Ahora con este customhook obtenemos el usuario y lo asignamos a Zustan
    // además de que con el validamos las credenciales e impedimos accesos inautorizados
    const user = useUser();
    const [stockData, setStockData] = useState<productsListInteface[]>([]);
    const [stockProducts, setStockProducts] = useState<productsListInteface[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [total, setTotal] = useState('0.00');
    const [change, setChange] = useState('0.00');
    const [payment, setPayment] = useState('0.00');
    const [weightInput, setWeightInput] = useState("");
    const [sale, setSale] = useState<SaleInterface>({
        userId: '',
        paymentMethod: 'efectivo',
        saleItems: []
    });
    

    // ** Efecto inicial para asignar productos
    useEffect(() => {
        if (products && products.products.length > 0) {
            setStockData(products.products);
            setStockProducts(products.products);
        }
    }, [products])

    // ** Efecto guardar usuario en la venta
    useEffect(() => {
        if (user) {
            setSale( prev => ({...prev, userId: user.id}));
        }
    }, [user])

    // ** Efecto para fitlrar los productos
    useEffect(() => {
        if (searchTerm.length === 0) {
            setStockProducts(stockData); 
        } else {
            const filteredProducts = stockData.filter(product => {
                return (
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.skuCode.toUpperCase().includes(searchTerm.toUpperCase())
                );
            });

            setStockProducts(filteredProducts);
        }
    }, [searchTerm, stockData]);

    // ** Efecto para ir calculando los totales.
    useEffect(() => {
        let total = new Decimal(0);
        for (const item of sale.saleItems) {
            const product = stockData.find(prod => prod.id === item.productId);
            if (product) {
                total = total.plus(new Decimal(item.quantity).mul(new Decimal(product.unitPrice)));
            }
        }
        setTotal(total.toFixed(2));
    }, [sale])

    // ** Efecto para calcular el cambio
    useEffect(() => {

        if(payment){
            setChange(new Decimal(new Decimal(payment).minus(new Decimal(total))).toFixed(2))
        } else{
            setChange('0.00')
        }

    },[payment])

    // ** Función para ir agregando los productos al carrito
    function addToCart(product: productsListInteface, quantity = 1) {
        setSearchTerm('');
        const productId = product.id;
        const one = new Decimal(quantity);

        // Verifica si ya existe en saleItems
        const existingItem = sale.saleItems.find(item => item.productId === productId);

        if(Number(product.stockQuantity) <= 0){
            toast.error('Advertencia', {
                description: 'No se cuenta con stock suficiente'
            })
        }else {
            // Si ya existe, sumamos 1 a la cantidad
            let updatedItems;
            if (existingItem) {
                updatedItems = sale.saleItems.map(item => {
                    if (item.productId === productId) {
                        const newQty = new Decimal(item.quantity).plus(one);
                        return { ...item, quantity: newQty.toFixed(2) };
                    }
                    return item;
                });
            } else {
                // Si no existe, lo agregamos
                updatedItems = [
                    ...sale.saleItems,
                    { productId, quantity: one.toFixed(2) }
                ];
            }

            // Ahora actualizamos el estado de la venta
            setSale(prev => ({
                ...prev,
                saleItems: updatedItems
            }));

            // Actualiza ambos estados
            setStockData(prev =>
                prev.map(prod =>
                    prod.id === productId
                        ? {
                            ...prod,
                            stockQuantity: new Decimal(prod.stockQuantity).minus(one).toFixed(2),
                        }
                        : prod
                )
            );


        }
    }

    // ** Función para incrementar la cantidad de items del carrito
    function increaseQty(productId: string) {
        const one = new Decimal(1);

        const product = stockData.find( producto => producto.id === productId);

        if (Number(product?.stockQuantity) <= 0) {
            toast.error('Advertencia', {
                description: 'No se cuenta con stock suficiente'
            })
        } else{
            setSale(prev => ({
                ...prev,
                saleItems: prev.saleItems.map(item =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: new Decimal(item.quantity).plus(one).toFixed(2),
                    }
                    : item
                ),
            }));

            setStockData(prev =>
                prev.map(prod =>
                prod.id === productId
                    ? {
                        ...prod,
                        stockQuantity: new Decimal(prod.stockQuantity).minus(one).toFixed(2),
                    }
                    : prod
                )
            );
        }
    }

    // ** Función para decrementar la cantidad de items del carrito
    function decreaseQty(productId: string) {
        const one = new Decimal(1);

        
        setSale(prev => ({
            ...prev,
            saleItems: prev.saleItems
            .map(item => {
                if (item.productId === productId) {
                const newQty = new Decimal(item.quantity).minus(one);
                return newQty.greaterThan(0)
                    ? { ...item, quantity: newQty.toString() }
                    : null;
                }
                return item;
            })
            .filter(Boolean) as typeof prev.saleItems,
        }));

        setStockData(prev =>
            prev.map(prod =>
            prod.id === productId
                ? {
                    ...prod,
                    stockQuantity: new Decimal(prod.stockQuantity).plus(one).toString(),
                }
                : prod
            )
        );

    }

    // ** Función para remover el item del carrito
    function removeFromCart(productId: string) {
        const item = sale.saleItems.find(i => i.productId === productId);
        if (!item) return;

        const quantity = new Decimal(item.quantity);

        // 1. Regresar la cantidad al stock
        setStockData(prev =>
            prev.map(p =>
            p.id === productId
                ? {
                    ...p,
                    stockQuantity: new Decimal(p.stockQuantity).plus(quantity).toString(),
                }
                : p
            )
        );

        // 2. Quitarlo del carrito
        setSale(prev => ({
            ...prev,
            saleItems: prev.saleItems.filter(i => i.productId !== productId),
        }));
    }

    // ** Función para el cambio de pago
    function handlePaymentChange(value: string) {
        setSale( prev => ({...prev, paymentMethod: value}));
    }

    // ** función para agregar cantidad por peso
    function handleAddByWeight(product: productsListInteface) {
        const quantity = Number(weightInput);

        if (quantity > Number(product.stockQuantity)) {
            toast.error('Advertencia', {
                description: 'La cantidad ingresada supera el stocks'
            })
        } else{
            if (quantity > 0) {
                addToCart(product, quantity);
                setWeightInput(""); // Limpia el input después
            } else {
                toast.error('Advertencia', {
                    description: 'El dato debe ser mayor a 0'
                });
            }
        }
    };

    // ** función para agregar el producto cuando hay exatamente 1 filtrado
    function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && stockProducts.length === 1) {
            const productToAdd = stockProducts[0];
            addToCart(productToAdd); // Usa la función que ya tienes
        }
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
                <Card className="max-h-[500px]">
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
                            value={searchTerm}
                            onKeyDown={handleSearchKeyDown}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="search" 
                            placeholder="Buscar producto por nombre o código de barras" 
                            className="w-full border-0 h-6 font-semibold" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full rounded-md border h-[300px] overflow-y-auto">
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
                                                                    className="w-[42px] text-center border h-[35px] rounded-md
                                                                    dark:bg-gray-900 dark:brightness-75 dark:hover:bg-gray-800 hover:cursor-pointer">
                                                                    +
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                    <AlertDialogTitle>Ingresar Peso</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        <p className="text-black dark:text-white text-lg font-medium">
                                                                            {product.name}
                                                                        </p>
                                                                        <p>Precio: ${product.unitPrice}/kg</p>
                                                                        <p>Stock Disponible: {product.stockQuantity}</p>
                                                                        <div className="mt-2">
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
                                                                        </div>
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
                        </div>
                    </CardFooter>
                </Card>
                
                <Card className={sale.saleItems.length === 0 ? '' : "h-[700px]"}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            Ticket de Venta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="dark:hover:bg-slate-900">
                                    <TableHead className="max-w-[120px] text-center">Producto</TableHead>
                                    <TableHead className="text-center">Cant./Peso</TableHead>
                                    <TableHead className="text-center">Precio</TableHead>
                                    <TableHead className="text-center">Subtotal</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sale.saleItems.map(item => {
                                    const product = stockData.find(p => p.id === item.productId);
                                    if (!product) return null;

                                    const quantity = new Decimal(item.quantity);
                                    const unitPrice = new Decimal(product.unitPrice);
                                    const subtotal = unitPrice.mul(quantity);

                                    // Retornar una cosa u otra dependiendo del tipo de producto
                                    if(product.isByWeight === false){
                                        return (
                                            <TableRow
                                                key={product.id}
                                                className="text-center hover:bg-slate-100 dark:hover:bg-slate-900"
                                            >
                                                <TableCell className="max-w-[120px] truncate">
                                                {product.name}
                                                </TableCell>

                                                {/* Cantidad con botones */}
                                                <TableCell className="flex justify-center items-center gap-2">
                                                <button
                                                    className="bg-slate-200 px-2 rounded hover:bg-slate-300
                                                    dark:bg-slate-900"
                                                    onClick={() => decreaseQty(product.id)}
                                                >
                                                    -
                                                </button>
                                                {quantity.toString()}
                                                <button
                                                    className="bg-slate-200 px-2 rounded hover:bg-slate-300
                                                    dark:bg-slate-900"
                                                    onClick={() => increaseQty(product.id)}
                                                >
                                                    +
                                                </button>
                                                </TableCell>

                                                <TableCell>${unitPrice.toFixed(2)}</TableCell>
                                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                                <TableCell>
                                                <Trash
                                                    size={15}
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => removeFromCart(product.id)}
                                                />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    } else {
                                        return (
                                            <TableRow
                                                key={product.id}
                                                className="text-center hover:bg-slate-100 dark:hover:bg-slate-900"
                                            >
                                                <TableCell className="max-w-[120px] truncate">
                                                {product.name}
                                                </TableCell>

                                                {/* Cantidad con botones */}
                                                <TableCell className="flex justify-center items-center gap-2">
                                                {quantity.toString()}
                                                </TableCell>

                                                <TableCell>${unitPrice.toFixed(2)}</TableCell>
                                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                                <TableCell>
                                                <Trash
                                                    size={15}
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => removeFromCart(product.id)}
                                                />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                })}

                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <div className="w-full grid grid-cols-[3fr_2fr] gap-2">
                            <div className="flex col-span-2 w-full bg-blue-50 
                                h-14 rounded-lg text-xl items-center font-semibold
                                justify-between p-4 dark:bg-slate-900">
                                    <p>Total:</p>
                                    <p>${total}</p>
                            </div>
                            {
                                sale.saleItems.length === 0 ? 
                                <></> :
                                <>
                                    <div className="grid grid-cols-2 col-span-2 pt-2 pb-2 gap-2">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Método de pago:
                                            </p>
                                            <div>
                                                <RadioGroup 
                                                    onValueChange={handlePaymentChange}
                                                    className="flex mt-2" 
                                                    defaultValue="efectivo">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="efectivo" id="efectivo" />
                                                        <Label htmlFor="efectivo">Efectivo</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="tarjeta" id="tarjeta" />
                                                        <Label htmlFor="tarjeta">Tarjeta</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className="col-span-2 grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Pago con:</Label>
                                            <Input 
                                            onKeyDown={(e) => {
                                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                                e.preventDefault();
                                                }
                                            }}
                                            onChange={e => setPayment(e.target.value)}
                                            type="number"
                                            placeholder="$0.00"
                                            className="text-right mt-1"/>
                                        </div>
                                        <div>
                                            <Label>Cambio:</Label>
                                            <Input 
                                            disabled={true}
                                            value={`$${change}`}
                                            placeholder="$0.00"
                                            className="text-right mt-1"/>
                                        </div>
                                    </div>
                                </>
                            }
                            <Button className="hover:cursor-pointer">
                                Completar Venta
                            </Button>
                            <Button className="hover:cursor-pointer">
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