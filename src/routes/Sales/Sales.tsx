import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon } from "lucide-react";



export default function Sales(){


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
                        <div className="flex items-center w-full space-x-2 rounded-lg border dar:border-slate-700 bg-gray-50 dark:bg-slate-950 px-3.5 py-2">
                            <SearchIcon className="h-4 w-4" />
                            <Input 
                            type="search" 
                            placeholder="Buscar producto por nombre o código de barras" 
                            className="w-full border-0 h-6 font-semibold" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="dark:hover:bg-slate-900">
                                        <TableHead className="w-[100px]">Producto</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="dark:hover:bg-slate-900">
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>Credit Card</TableCell>
                                        <TableCell>$250.00</TableCell>
                                        <TableCell>
                                            <Button variant={"outline"}>
                                                +
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardFooter>
                </Card>
                
                <p>
                    dos
                </p>
            </div>
        </>
    )
}