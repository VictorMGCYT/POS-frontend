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

interface TableUsersPropsInterface {
    users: User[];
}

export default function TableUsers( TableUsersProps: TableUsersPropsInterface ){

    const { users } = TableUsersProps;
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

    // Función para abrir el diálogo de edición de usuario
    const handleEditUser = (user: User) => {
        refEditUser.current?.click();
        setEditUser(user);
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
                                        <Edit className="hover:cursor-pointer" size={20} onClick={() => handleEditUser(user)}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" size={20}/>
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
                        //onSubmit={(e) => handleEditUser(e)}
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
                            Crear Usuario
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )

}