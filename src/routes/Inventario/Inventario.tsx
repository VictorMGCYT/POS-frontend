import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import TableInventory from "./Components/TableInventory/TableInventory";
import { API_URL, OFFSET_PRODUCTS } from "@/global/variables/variables";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import useProduct from "@/hooks/useProduct";
import type { productsPagination } from "../Sales/interfaces/products.interface";
import axios from "axios";
import type { AddProductInterface } from "./interfaces/Interfaces";
import { handleAddProduct } from "./apiFunctions";
import { PaginationProducts } from "./functions";
import DialogAddProduct from "./Components/DialogAddProduct";


export default function Inventario() {

    // El hook solo lo usamos para la primera llamada a la API
    const {products, refetch} = useProduct();
    const [productsPerPage, setProductsPerPage] = useState<productsPagination>();
    const [offset, setOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCuerrentPage] = useState(1);
    const [typeProducts, setTypeProducts] = useState<string>('all');
    const [orderProducts, setOrderProducts] = useState<string>('asc');
    const [stockOrder, setStockOrder] = useState<string>('desc');
    const [searchValue, setSearchValue] = useState<string>('');
    const refButtonSearch = useRef<HTMLButtonElement>(null);
    const refAddProduct = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [addProduct, setAddProduct] = useState<AddProductInterface>({
        name: '',
        skuCode: '',
        isByWeight: false,
        unitPrice: '',
        purchasePrice: '',
        stockQuantity: ''
    });

    useEffect(() => {
        refetch(OFFSET_PRODUCTS);
    }, [])

    // ** Efecto para inicializar los productos y la paginación
    useEffect(()=> {
        if (products) {
            setProductsPerPage(products);
            setTotalPages(products.totalPages);
            setCuerrentPage(products.currentPage);
        }
    }, [products])

    // ** Efecto para hacer la llamada a la API con la paginación
    useEffect(() => {
        setStockOrder('desc'); // Reseteamos el orden del orden del stock
        // Función auto ejecutable para obtener los productos paginados
        ( async () => {
            try {
                const url = API_URL;
                const response = await axios.get(`${url}/products/get-all?offset=${offset}&productsTipe=${typeProducts}&orderProducts=${orderProducts}`,{
                    withCredentials: true,
                });
                const data: productsPagination = response.data;
                if (data.products.length > 0) {
                    setProductsPerPage(data);
                    setTotalPages(data.totalPages);
                    setCuerrentPage(data.currentPage);
                }
            } catch (error) {
                toast.error('Error al obtener los productos', {
                    description: 'Por favor, inténtelo de nuevo más tarde.',
                });
            }
        })()

    }, [offset, typeProducts, orderProducts]);

    // ** Efecto PARA ORDENAR POR STOCK
    useEffect(() => {
        
        // Función auto ejecutable para obtener los productos paginados
        ( async () => {
            try {
                const url = API_URL;
                const response = await axios.get(`${url}/products/get-all?offset=${offset}&productsTipe=${typeProducts}&stockOrder=${stockOrder}`,{
                    withCredentials: true,
                });
                const data: productsPagination = response.data;
                if (data.products.length > 0) {
                    setProductsPerPage(data);
                    setTotalPages(data.totalPages);
                    setCuerrentPage(data.currentPage);
                }
            } catch (error) {
                toast.error('Error al obtener los productos', {
                    description: 'Por favor, inténtelo de nuevo más tarde.',
                });
            }
        })()

    }, [stockOrder]);

    // ** Función para manejar la búsqueda de productos
    async function handleSearchValue() {
        try {
            const url = API_URL;
            const response = await axios.get(`${url}/products/get-all?search=${searchValue}&orderProducts=${orderProducts}`,{
                withCredentials: true,
            });
            const data: productsPagination = response.data;
            console.log(data);
            if (data.products.length > 0) {
                setProductsPerPage(data);
                setTotalPages(data.totalPages);
                setCuerrentPage(data.currentPage);
            }else{
                toast.error('No se encontraron productos con ese criterio de búsqueda', {
                    description: 'Por favor, intente con otro término de búsqueda.',
                });
            }
        } catch (error) {
            toast.error('Error al obtener los productos', {
                description: 'Por favor, inténtelo de nuevo más tarde.',
            });
        }
    }

    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Control de Inventario
                    </h2>
                </div>
                <Button 
                    onClick={() => refAddProduct.current?.click()}
                    className="bg-blue-600 hover:bg-blue-800
                    hover:cursor-pointer dark:text-white">
                    + Agregar Producto
                </Button>
                <DialogAddProduct
                    addProduct={addProduct}
                    isLoading={isLoading}
                    refAddProduct={refAddProduct}
                    setAddProduct={setAddProduct}
                    setIsLoading={setIsLoading}
                    refetch={refetch}
                    // ! Esta función se encarga de manejar el evento de agregar un producto
                    handleAddProduct={(e: React.FormEvent<HTMLFormElement>) => 
                        handleAddProduct(e, addProduct, setAddProduct, refetch, setIsLoading)
                    }/>
            </div>
            <div className="flex w-full p-4">
                <div className="grid grid-cols-[4fr_1fr] w-full p-4 border rounded-lg gap-4">
                    <h2 className="text-2xl font-medium ">
                        Productos
                    </h2>
                    <Select onValueChange={(value) => setTypeProducts(value)}>
                        <SelectTrigger 
                            className="ml-auto hover:cursor-pointer">
                            <SelectValue placeholder="Seleccione el Tipo" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-950">
                            <SelectItem className="hover:cursor-pointer" value="all">Todos</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="unit">Por unidad</SelectItem>
                            <SelectItem className="hover:cursor-pointer" value="weight">Por peso</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Barra de busqueda */}
                    <div 
                        className="flex items-center w-full space-x-2 rounded-lg border 
                        dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-3.5 py-2
                        col-span-2">
                        <SearchIcon className="h-4 w-4" />
                        <Input
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    refButtonSearch.current?.click();
                                }
                            }}
                            value={searchValue}
                            placeholder="Buscar producto por nombre o código de barras" 
                            className="w-full border-0 h-6 font-semibold" />
                        <Button
                            className="hover:cursor-pointer"
                            onClick={handleSearchValue}
                            ref={refButtonSearch}>
                            Buscar
                        </Button>
                    </div>
                    <TableInventory
                        PaginationProducts={(currentpage: number, action: 'next' | 'previous') => 
                            PaginationProducts(currentpage, action, totalPages, setOffset, offset)
                        }
                        currentPage={currentPage}
                        productsPerPage={productsPerPage}
                        totalPages={totalPages}
                        setOrderProducts={setOrderProducts}
                        setStockOrder={setStockOrder}
                        refetch={refetch}
                    />
                </div>
                
            </div>
        </>
    )
}