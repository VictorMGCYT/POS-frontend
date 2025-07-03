import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalizeWords } from "@/global/functions/capitalizeWords";
import { useUsers } from "@/hooks/useUsers";
import { Label } from "@radix-ui/react-label";
import { Edit, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UserDataInterface } from "./interfaces";
import { userShema } from "./schemas";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";



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
                result.error.errors.forEach(err => {
                    // Puedes mostrar los mensajes con toast o como prefieras
                    toast.error('Error', {
                        description: err.message,
                    });
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

                <Dialog>
                    <DialogTrigger
                        className="hidden"
                        ref={refAddUser}>
                        Open
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Agregar Usuario</DialogTitle>
                        <DialogDescription>
                            Completa los campos para agregar un nuevo usuario.
                        </DialogDescription>
                        </DialogHeader>
                        <form 
                            onSubmit={(e) => handleAddUser(e)}
                            className="grid gap-2 grid-cols-2">
                             <Label htmlFor="username">
                                Nombre de Usuario:
                            </Label>
                            <Label htmlFor="first-name">
                                Nombre:
                            </Label>

                            <Input
                                id="username"
                                onChange={(e) => setAddUser({ ...addUser, username: e.target.value })}
                                value={addUser.username}
                                minLength={3}
                                maxLength={20}
                                type="text"
                            />
                            <Input
                                id="first-name"
                                onChange={(e) => setAddUser({ ...addUser, firstName: e.target.value })}
                                value={addUser.firstName}
                                minLength={3}
                                maxLength={40}
                                type="text"
                            />

                            <Label htmlFor="paternal-surname">
                                Apellido Paterno:
                            </Label>
                            <Label htmlFor="maternal-surname">
                                Apellido Materno:
                            </Label>
                            <Input
                                id="paternal-surname"
                                onChange={(e) => setAddUser({ ...addUser, paternalSurname: e.target.value })}
                                value={addUser.paternalSurname}
                                minLength={3}
                                maxLength={20}
                                type="text"
                            />
                            <Input
                                id="maternal-surname"
                                onChange={(e) => setAddUser({ ...addUser, maternalSurname: e.target.value })}
                                value={addUser.maternalSurname}
                                minLength={3}
                                maxLength={20}
                                type="text"
                            />

                            <Label className="col-span-2" htmlFor="password">
                                Contraseña:
                            </Label>
                            <Input
                                className="col-span-2"
                                id="password"
                                onChange={(e) => setAddUser({ ...addUser, password: e.target.value })}
                                value={addUser.password}
                                minLength={6}
                                maxLength={40}
                                type="password"
                            />
                            <Label className="col-span-2" htmlFor="confirm-password">
                                Confirmar Contraseña:
                            </Label>
                            <Input
                                className="col-span-2"
                                id="confirm-password"
                                onChange={(e) => setAddUser({ ...addUser, confirmPassword: e.target.value })}
                                value={addUser.confirmPassword}
                                minLength={6}
                                maxLength={40}
                                type="password"
                            />
                            <Label htmlFor="role" className="col-span-2">
                                Rol:
                            </Label>
                            <Select onValueChange={(value) => setAddUser({ ...addUser, role: value as "user" | "admin"}) }>
                                <SelectTrigger className="col-span-2 w-full">
                                    <SelectValue placeholder="user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">user</SelectItem>
                                    <SelectItem value="admin">admin</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-800 text-white
                                col-span-2 mt-4 hover:cursor-pointer">
                                Crear Usuario
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
                
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