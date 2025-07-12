import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/hooks/useUsers";
import { Edit, Trash } from "lucide-react";
import { capitalizeWords } from "@/global/functions/capitalizeWords";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { userEditSchema } from "../schemas";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";

interface TableUsersPropsInterface {
    users: User[];
    fetchUsers: () => Promise<void>;
}

export default function TableUsers( TableUsersProps: TableUsersPropsInterface ){

    const { users, fetchUsers } = TableUsersProps;
    const refEditUser = useRef<HTMLButtonElement>(null);
    const [editUser, setEditUser] = useState<User>({
        id: "",
        username: "",
        firstName: "",
        paternalSurname: "",
        maternalSurname: "",
        role: "user", // Por defecto, el rol es 'user'
        createdAt: new Date(),
    });
    // Referencia y estados para eliminar usuario
    const refDeleteUser = useRef<HTMLButtonElement>(null);
    const [deleteUser, setDeleteUser] = useState<string>('')

    // ! funciones para abrir los diálogo
    const handleDialogEdit = (user: User) => {
        refEditUser.current?.click();
        setEditUser({...user});
    }
    async function handleDialogDelete(user: User) {
        refDeleteUser.current?.click();
        setDeleteUser(user.id);
    } 

    // ! Función para manejar el envío del formulario de edición de usuario
    async function handleEditUserSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        try {
            
            const result = userEditSchema.safeParse(editUser);

            // Validaciones del esquema
            if (!result.success) {
                result.error.errors.forEach((error) => {
                    toast.error("Error", {
                        description: error.message,
                    });
                })
                return;
            }
            const url = API_URL;
            await axios.patch(`${url}/auth/update-user/${editUser.id}`, {
                username: editUser.username,
                firstName: editUser.firstName,
                paternalSurname: editUser.paternalSurname,
                maternalSurname: editUser.maternalSurname,
                role: editUser.role
            }, {
                withCredentials: true
            })

            toast.success("Usuario editado correctamente", {
                description: "El usuario ha sido editado correctamente.",
            });

            // Reiniciar el formulario
            setEditUser({
                id: "",
                username: "",
                firstName: "",
                paternalSurname: "",
                maternalSurname: "",
                role: "user", // Por defecto, el rol es 'user'
                createdAt: new Date(),
            });

            // Refrescamos la lista de usuarios
            fetchUsers();
        } catch (error) {
            toast.error("Error al editar el usuario", {
                description: "Ha ocurrido un error al editar el usuario. Por favor, inténtalo de nuevo.",
            });
        }

        refEditUser.current?.click();
    }

    async function handleDeleteUserSubtim() {
        try {
            const url = API_URL;
            await axios.delete(`${url}/auth/delete-user/${deleteUser}`, {
                withCredentials: true
            });

            toast.success("Usuario eliminado correctamente", {
                description: "El usuario ha sido eliminado correctamente.",
            });

            // Refrescamos la lista de usuarios
            fetchUsers();
        } catch (error) {
            toast.error("Error al eliminar el usuario", {
                description: "Ha ocurrido un error al eliminar el usuario. Por favor, inténtalo de nuevo.",
            });
        }
    }


    return(
        <>

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
                                        <Edit className="hover:cursor-pointer" size={20} onClick={() => handleDialogEdit(user)}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" onClick={() => handleDialogDelete(user)} size={20}/>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>

            {/* Dialogo para editar un producto */}
            <Dialog>
                <DialogTrigger 
                    ref={refEditUser}
                    className="hidden">
                    Open
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>
                        Editar Usuario
                    </DialogTitle>
                    <DialogDescription>
                        Editar datos del usuario seleccionado.
                    </DialogDescription>
                    </DialogHeader>
                    <form 
                        onSubmit={(e) => handleEditUserSubmit(e)}
                        className="grid gap-2 grid-cols-2">
                        <Label htmlFor="username">
                            Nombre de Usuario:
                        </Label>
                        <Label htmlFor="first-name">
                            Nombre:
                        </Label>

                        <Input
                            id="username"
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                            value={editUser.username}
                            minLength={3}
                            maxLength={20}
                            type="text"
                        />
                        <Input
                            id="first-name"
                            onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                            value={editUser.firstName}
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
                            onChange={(e) => setEditUser({ ...editUser, paternalSurname: e.target.value })}
                            value={editUser.paternalSurname}
                            minLength={3}
                            maxLength={20}
                            type="text"
                        />
                        <Input
                            id="maternal-surname"
                            onChange={(e) => setEditUser({ ...editUser, maternalSurname: e.target.value })}
                            value={editUser.maternalSurname}
                            minLength={3}
                            maxLength={20}
                            type="text"
                        />
                        <Label htmlFor="role" className="col-span-2">
                            Rol:
                        </Label>
                        <Select 
                            defaultValue={editUser.role}
                            onValueChange={(value) => setEditUser({ ...editUser, role: value as "user" | "admin"}) }>
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
                            Editar Usuario
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Diálogo para eliminar un usuario */}
            <AlertDialog>
                <AlertDialogTrigger
                    ref={refDeleteUser}
                    className="hidden"
                > 

                    Open
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Seguro que deseas eliminar este usuario?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no puede ser invertida. 
                        El usuario será eliminado permanentemente.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="hover:cursor-pointer"
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="hover:cursor-pointer"
                            onClick={handleDeleteUserSubtim}
                        >
                            Eliminar Usuario
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )

}