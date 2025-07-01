import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalizeWords } from "@/global/functions/capitalizeWords";
import { useUsers } from "@/hooks/useUsers";
import { Edit, Trash } from "lucide-react";
import { useEffect } from "react";



export default function UsersModule(){

    const {users, fetchUsers} = useUsers();

    // Cargar los usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [])

    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                    <p className="text-gray-500">Administra los usuarios de la aplicación.</p>
                </div>
                {/* Aquí puedes agregar más contenido relacionado con la gestión de usuarios */}
                <Button className="bg-blue-600 hover:bg-blue-800
                    hover:cursor-pointer dark:text-white">
                    Agregar Usuario
                </Button>

                
            </div>
            {/* Card de usuarios */}
            <div className="flex w-full p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Usuarios
                        </CardTitle>
                        <CardDescription>Lista de usuarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Nombre
                                    </TableHead>
                                    <TableHead>
                                        Nombre de Usuario
                                    </TableHead>
                                    <TableHead>
                                        Rol
                                    </TableHead>
                                    <TableHead>
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>                                
                                {
                                    users.map((user) => {
                                        
                                        const fullName = `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`;
                                        const formattedName = capitalizeWords(fullName);

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    {
                                                        formattedName
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {user.username}
                                                </TableCell>
                                                <TableCell>
                                                    {user.role}
                                                </TableCell>
                                                <TableCell className="flex items-center whitespace-pre">
                                                    <Edit className="hover:cursor-pointer" size={20}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" size={20}/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>
            </div>
        </>

    );

}