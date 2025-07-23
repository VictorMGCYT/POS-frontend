import { toast } from "sonner";
import { userShema } from "./schemas";
import axios from "axios";
import { API_URL } from "@/global/variables/variables";
import type { UserDataInterface } from "./interfaces";
import { useTokenStore } from "@/global/states/tokenStore";

interface AddUserInterface {
    e: React.FormEvent<HTMLFormElement>;
    addUser: UserDataInterface;
    setAddUser: React.Dispatch<React.SetStateAction<UserDataInterface>>;
    fetchUsers: () => Promise<void>;
}

// ! Función para manejar el envío del formulario de agregar usuario
export const handleAddUser = async (
        handleAddUserProps: AddUserInterface 
    ) => {
    const { e, addUser, setAddUser, fetchUsers } = handleAddUserProps;
    const token = useTokenStore.getState().token;
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
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
