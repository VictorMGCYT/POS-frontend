import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/hooks/useUsers";
import { Edit, Trash } from "lucide-react";
import { capitalizeWords } from "@/global/functions/capitalizeWords";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TableUsersPropsInterface {
    users: User[];
}

export default function TableUsers( TableUsersProps: TableUsersPropsInterface ){

    const { users } = TableUsersProps;

    return(
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

            <Dialog>
                <DialogTrigger>
                    Open
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>
                        Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </Table>
    )

}