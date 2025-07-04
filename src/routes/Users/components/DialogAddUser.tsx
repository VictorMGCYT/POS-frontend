import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserDataInterface } from "../interfaces";

interface UserDataInterfaceProps {
    refAddUser: React.RefObject<HTMLButtonElement | null>;
    handleAddUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    setAddUser: React.Dispatch<React.SetStateAction<UserDataInterface>>;
    addUser: UserDataInterface;
}

export default function DialogAddUser( AddUserProps: UserDataInterfaceProps ){ 
    const { refAddUser, handleAddUser, addUser, setAddUser } = AddUserProps;
    
    return (
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
    )

}