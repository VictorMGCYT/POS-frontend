import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/hooks/useUsers";
import { Edit, Trash } from "lucide-react";
import { capitalizeWords } from "@/global/functions/capitalizeWords";
import { useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";
import { useNavigate } from "react-router";

interface TableUsersPropsInterface {
    users: User[];
    fetchUsers: () => Promise<void>;
}

export default function TableUsers( TableUsersProps: TableUsersPropsInterface ){

    const { users, fetchUsers } = TableUsersProps;
    // Referencia y estados para eliminar usuario
    const refDeleteUser = useRef<HTMLButtonElement>(null);
    const [deleteUser, setDeleteUser] = useState<string>('')
    const navigate = useNavigate();

    // ! Esto llama a navigate de react-router para abir EditUserDialog
    const handleDialogEdit = (user: string) => {
        // Abrir el componente <EditUserDialog />
        navigate(`/usuarios/editar/${user}`);
    }


    async function handleDialogDelete(user: User) {
        refDeleteUser.current?.click();
        setDeleteUser(user.id);
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
                                        <Edit className="hover:cursor-pointer" size={20} onClick={() => handleDialogEdit(user.id)}/>   |   <Trash className="stroke-red-500 hover:cursor-pointer" onClick={() => handleDialogDelete(user)} size={20}/>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>           

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