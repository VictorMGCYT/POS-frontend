import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useRef, useState } from "react";
import type { UserDataInterface } from "./interfaces";
import { userShema } from "./schemas";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";
import DialogAddUser from "./components/DialogAddUser";
import TableUsers from "./components/TableUsers";



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

    // ! Función para manejar el envío del formulario de agregar usuario
    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        // Prevenimos el comportamiento por defecto del formulario
        e.preventDefault();
        try {
            
            const result = userShema.safeParse(addUser);

            if (!result.success) {
                // Hay errores de validación
                result.error.errors.forEach((err, index) => {
                    // Mostrar solo un error
                    if(index === 0) {
                        toast.error("Error al crear el usuario", {
                            description: err.message,
                        });
                    }
                });
                return;
            }

            const url = API_URL;
            await axios.post(`${url}/auth/create`, {
                username: addUser.username,
                firstName: addUser.firstName,
                paternalSurname: addUser.paternalSurname,
                maternalSurname: addUser.maternalSurname,
                password: addUser.password,
                role: addUser.role
            },{
                withCredentials: true
            })

            toast.success("Usuario creado exitosamente", {
                description: "El usuario ha sido creado correctamente.",
            });
            // Volvemos a cargar los usuarios
            fetchUsers();   
            // Limpiamos el formulario
            setAddUser({
                username: "",
                firstName: "",
                paternalSurname: "",
                maternalSurname: "",
                password: "",
                confirmPassword: "",
                role: "user"
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if(error.status === 400){
                    toast.error("Error al crear el usuario", {
                        description: "El nombre de usuario ya se encuntra en uso.",
                    });
                } else {
                    toast.error("Error al crear el usuario", {
                        description: "Ha ocurrido un error al crear el usuario. Por favor, inténtalo de nuevo más tarde.",
                    });
                }
            }
        }
    }

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
                    handleAddUser={handleAddUser}
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
                        />

                    </CardContent>
                </Card>
            </div>
        </>

    );

}