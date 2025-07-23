import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { userEditSchema } from "../schemas";
import { toast } from "sonner";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { useUsers, type User } from "@/hooks/useUsers";
import { SkeletonForms } from "@/components/ui/skeleton-forms";
import { loaderUser } from "@/loaders-params-react-router/LoaderUser";
import { useTokenStore } from "@/global/states/tokenStore";


export function EditUserDialog(){
    const token = useTokenStore.getState().token;
    const {fetchUsers} = useUsers();
    // este hook ya traer la información que obtuvo el loader que
    // nos trajo hasta aquí
    const { id } = useParams();
    const [editUser, setEditUser] = useState<User | undefined>();

    useEffect(() => {
        (async () => {
            // Llamamos al loader que nos trae el producto
            const user: User | undefined = await loaderUser({id: id});
            // lo asignamos al estado
            setEditUser(user);
        })()
    }, [])
    
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    function handleClose() {
        setOpen(false);
        navigate("/usuarios");
    }

    // ! Función para manejar el envío del formulario de edición de usuario
    async function handleEditUserSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!editUser) return;
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        setOpen(false);
        navigate("/usuarios");
        window.location.reload();
    }

    return(
        <>
            {
                !editUser ? (  
                    <SkeletonForms/> 
                ) 
                : 
                (
                    <Dialog open={open} onOpenChange={handleClose}>
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

                )
                
            }
        </>
    )
}