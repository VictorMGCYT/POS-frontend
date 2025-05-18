import { toast } from "sonner";
import type { InterfaceLoginData } from "./interfaces/loginData.interface";
import { isAxiosError } from "axios";


export function validateLogin(loginData: InterfaceLoginData): boolean {
    const {password, username} = loginData;

    if(!password || !username){
        toast.error("Error", {
          description: "No puede haber campos vacíos",
        });
        throw new Error("Username and password is required");
    }
    if(username.length < 3 || username.length>255){
        toast.error("Error", {
          description: "El nombre de usuario debe tener entre 3 y 255 caracteres",
        });
        throw new Error("Username isn't valid");
    }
    if (password.length < 6) {
        toast.error("Error", {
          description: "La contraseñá debe tener al menos 6 carcteres",
        });
        throw new Error("Password must be contained at least 6 characteres");
    }
    if (!/[a-z]/.test(password)) {
        toast.error("Error", {
        description: "La contraseñá debe tener al menos 1 minúscula",
    });
        throw new Error("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
        toast.error("Error", {
        description: "La contraseñá debe tener al menos 1 mayúscula",
    });
        throw new Error("Password must contain at least one uppercase letter.");
    }
    if (!/\d/.test(password)) {
        toast.error("Error", {
        description: "La contraseñá debe tener al menos 1 número",
    });
        throw new Error("Password must contain at least one number.");
    }

    return true;
}

export function handleErrors(error: any) {
    if(isAxiosError(error)){
        if (error.status === 400) {
          toast.error("Error", {
            description: "Nombre de usuario o contraseña incorrectos"
          })
        }else{
        toast.error("Error", {
          description: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde"
        })
      }
      }else{
        toast.error("Error", {
          description: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde"
        })
      }
}