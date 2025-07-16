import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useRef, useState } from "react";
import type { UserDataInterface } from "./interfaces";
import DialogAddUser from "./components/DialogAddUser";
import TableUsers from "./components/TableUsers";
import { handleAddUser } from "./apiFunctions";
import { Outlet } from "react-router";



export default function UsersModule(){

    const {users, fetchUsers} = useUsers();
    const refAddUser = useRef<HTMLButtonElement>(null);
    const [addUser, setAddUser] = useState<UserDataInterface>({
        username: "",
        firstName: "",
        paternalSurname: "",
        maternalSurname: "",
        password: "",
        confirmPassword: "",
        role: "user" // Por defecto, el rol es 'user'
    })

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
                <Button 
                    onClick={() => refAddUser.current?.click()}
                    className="bg-blue-600 hover:bg-blue-800
                    hover:cursor-pointer dark:text-white">
                    Agregar Usuario
                </Button>

                {/* diálogo de agregar usuario */}
                <DialogAddUser
                    refAddUser={refAddUser}
                    addUser={addUser}
                    setAddUser={setAddUser}
                    handleAddUser={(e: React.FormEvent<HTMLFormElement>) => 
                        handleAddUser({e, addUser, setAddUser, fetchUsers})
                    }
                />
                
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
                        {/* Tabla con los usuario */}
                        <TableUsers
                            users={users}
                            fetchUsers={fetchUsers}
                        />
                    </CardContent>
                </Card>
            </div>
            <Outlet/>
        </>

    );

}