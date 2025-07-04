import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Printer, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { productsListInteface } from "./interfaces/products.interface";
import useProduct from "@/hooks/useProduct";
import useUser from "@/hooks/useUser";
import type { SaleInterface } from "./interfaces/sale.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Decimal from "decimal.js";
import TableProducts from "./components/TableProducts";
import TableTicket from "./components/TableTicket";
import { 
    addToCart, 
    decreaseQty, 
    handleAddByWeight, 
    increaseQty, 
    removeFromCart 
} from "./functions";
import { handleSendSale } from "./apiFunctions";
import { LIMIT_PRODUCTS_SALE } from "@/global/variables/variables";



export default function Sales(){
    // Con nuestro customhook extraemos los productos y su paginación de la base
    const {products, refetch} = useProduct();
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
        paymentMethod: 'Efectivo',
        saleItems: []
    });
    // Referencia para productos por Peso
    const refInputWeight = useRef<HTMLButtonElement>(null);
    
    // ** Efecto para inicializar el ticket de venta
    useEffect(() => {
        refetch();
    },[])

    // ** Efecto inicial para asignar productos
    useEffect(() => {
        console.log(products)
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
            const filteredProducts = stockData.filter((product) => {                
                return (
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.skuCode.toUpperCase().includes(searchTerm.toUpperCase())
                );
            }).slice(0, LIMIT_PRODUCTS_SALE); // Limitar a 10 productos

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

    },[payment, total])

    // ** Función para el cambio de pago
    function handlePaymentChange(value: string) {
        setSale( prev => ({...prev, paymentMethod: value}));
    }

    // ** función para agregar el producto cuando hay exatamente 1 filtrado
    function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && stockProducts.length === 1) {
            const productToAdd = stockProducts[0];

            if (productToAdd.isByWeight === true) {
                setTimeout(() => {
                    refInputWeight.current?.click();
                }, 10)
            } else{
                addToCart(productToAdd, sale, setSale, setStockData, setSearchTerm); 
            }
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
                            {/* Subcomponente para generar la tabla con todos los productos */}
                            <TableProducts
                                stockProducts={stockProducts}
                                addToCart={(product: productsListInteface, quantity = 1) =>
                                    addToCart(product, sale, setSale, setStockData, setSearchTerm, quantity)
                                }
                                weightInput={weightInput}
                                setWeightInput={setWeightInput}
                                handleAddByWeight={(product: productsListInteface) => 
                                    handleAddByWeight(product, weightInput, setWeightInput, sale, setStockData, setSale, setSearchTerm)
                                }
                                refInputWeight={refInputWeight}
                            />
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
                        {/* Tabla con el contenido del ticket */}
                        <TableTicket
                            sale={sale}
                            stockData={stockData}
                            decreaseQty={(productId: string) => {
                                decreaseQty(productId, setSale, setStockData)
                            }}
                            increaseQty={(productId: string) => 
                                increaseQty(productId, stockData, setSale, setStockData)
                            }
                            removeFromCart={ (productId: string) => 
                                removeFromCart(productId, sale, setStockData, setSale)
                            }
                        />
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
                                                    defaultValue="Efectivo">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Efectivo" id="Efectivo" />
                                                        <Label htmlFor="Efectivo">Efectivo</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Tarjeta" id="Tarjeta" />
                                                        <Label htmlFor="Tarjeta">Tarjeta</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className="col-span-2 grid grid-cols-2 gap-2">
                                        {
                                            sale.paymentMethod === 'Efectivo' ?
                                            <>
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
                                            </>
                                            :
                                            <span></span>
                                        }
                                    </div>
                                </>
                            }
                            <Button 
                                onClick={() => 
                                    handleSendSale(user, payment, total, sale, refetch, setSale)
                                }
                                className="hover:cursor-pointer">
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