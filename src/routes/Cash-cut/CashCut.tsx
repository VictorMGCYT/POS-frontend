import { CalendarSelect } from "@/components/ui/calendar-select";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useSales from "@/hooks/useSales";
import { BanknoteIcon, CreditCard, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";



export default function CashCut() {
    const {sales, refetch} = useSales();
    const [date, setDate] = useState<Date | undefined>(new Date());
    // Estados de fechas en formato UTC, o sea +6:00 horas que es la zona horaria de México
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    // ** Efecto para cargar las fechas de inicio y fin del día
    useEffect(() => {
        if(date){
            const start = date.setHours(0, 0, 0, 0);
            const end = date.setHours(23, 59, 59, 999);
            
            setStartDate(new Date(start).toISOString());
            setEndDate(new Date(end).toISOString());
        }
    }, [date])

    // ** Efecto para cargar las ventas del día
    useEffect(() => {
        if(startDate && endDate){
            refetch(startDate, endDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        console.log(sales);
    }, [sales])
    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">
                        Corte de Caja
                    </h2>
                    <p className="text-gray-500">
                        Visualiza las ganacias y gastos del día, así como el total de ventas.
                    </p>
                </div>
                <CalendarSelect
                    className="items-end"
                    date={date}
                    setDate={setDate}
                />
            </div>
            <div className="grid p-4 grid-cols-[1fr_1fr_1fr] gap-4">
                <Card className="row-span-2">
                    <CardHeader>
                        <CardTitle>Ganancias totales</CardTitle>
                        <CardAction><CreditCard size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            ${sales?.resul.totalProfit}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            Este es el total de ganancias del día, considerando tanto las ventas en efectivo como con tarjeta.
                            Se obtiene restando el costo de los productos al precio de venta.
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0 col-span-2">
                    <CardHeader>
                        <CardTitle>Total Vendido</CardTitle>
                        <CardAction><DollarSign size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${sales?.resul.totalAmount}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSales} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader>
                        <CardTitle>Ventas en efectivo</CardTitle>
                        <CardAction><BanknoteIcon size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${sales?.resul.totalCash}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSalesCash} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader>
                        <CardTitle>Ventas con tarjeta</CardTitle>
                        <CardAction><CreditCard size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${sales?.resul.totalCard}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSalesCard} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

