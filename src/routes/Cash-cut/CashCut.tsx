import { CalendarSelect } from "@/components/ui/calendar-select";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useSales from "@/hooks/useSales";
import useUser from "@/hooks/useUser";
import { BanknoteIcon, CreditCard, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";



export default function CashCut() {
    useUser();
    const {sales, refetch} = useSales();
    const [date, setDate] = useState<Date | undefined>(new Date());
    // Estados de fechas en formato UTC, o sea +6:00 horas que es la zona horaria de México
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    // ** Efecto para cargar las fechas de inicio y fin del día
    useEffect(() => {
        if(date){
            // Diferencia en minutos entre local y UTC (ejemplo: -360 para CDMX)
            const offsetMinutes = date.getTimezoneOffset();
            // Convertimos a horas (ejemplo: -360 / 60 = -6)
            const offsetHours = offsetMinutes / 60;
            // generamos la hora en UTC a partir de la fecha que hemos seleccionado
            // basada en nuestro horario actual
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            const day = date.getDate();
            // ! Aquí no debería de ser más 6 solamente, porque eso es solo horario centro de mexico
            const startUTC = new Date(Date.UTC(year, month, day, offsetHours, 0, 0));

            // Sumar 23h 59m 59.999s en milisegundos
            const endUTC = new Date(startUTC.getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000) + 999);
            
            setStartDate(new Date(startUTC).toISOString());
            setEndDate(new Date(endUTC).toISOString());
        }
    }, [date])

    // ** Efecto para cargar las ventas del día
    useEffect(() => {
        if(startDate && endDate){
            refetch(startDate, endDate);
        }
    }, [startDate, endDate]);

    // ** efecto solo para ver los items obtenidos:
    useEffect(() => {
        console.log(`cantidad de ventas :${sales?.totalItems}`)
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
            <div className="grid p-4 grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
                <Card className="md:row-span-2">
                    <CardHeader>
                        <CardTitle>Ganancias totales</CardTitle>
                        <CardAction><CreditCard size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        {
                            sales?.totalItems !== undefined 
                            ? 
                            <p className="text-4xl font-bold">
                                ${sales.resul.totalProfit}
                            </p>
                            : 
                            <p className="text-gray-500">
                                No hay nada por mostrar
                            </p>
                        }
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            Este es el total de ganancias del día, considerando tanto las ventas en efectivo como con tarjeta.
                            Se obtiene restando el costo de los productos al precio de venta.
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Total Vendido</CardTitle>
                        <CardAction><DollarSign size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        {
                            sales?.totalItems !== undefined 
                            ? 
                            <p className="text-2xl font-bold">
                                ${sales.resul.totalAmount}
                            </p>
                            : 
                            <p className="text-gray-500">
                                No hay nada por mostrar
                            </p>
                        }
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSales ?? 0} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader>
                        <CardTitle>Ventas en efectivo</CardTitle>
                        <CardAction><BanknoteIcon size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        {
                            sales?.totalItems !== undefined 
                            ? 
                            <p className="text-2xl font-bold">
                                ${sales.resul.totalCash}
                            </p>
                            : 
                            <p className="text-gray-500">
                                No hay nada por mostrar
                            </p>
                        }
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSalesCash ?? 0} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader>
                        <CardTitle>Ventas con tarjeta</CardTitle>
                        <CardAction><CreditCard size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        {
                            sales?.totalItems !== undefined 
                            ? 
                            <p className="text-2xl font-bold">
                                ${sales.resul.totalCard}
                            </p>
                            : 
                            <p className="text-gray-500">
                                No hay nada por mostrar
                            </p>
                        }
                    </CardContent>
                    <CardFooter>
                        <p className="text-gray-500 text-sm">
                            {sales?.resul.totalSalesCard ?? 0} ventas realizadas
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

