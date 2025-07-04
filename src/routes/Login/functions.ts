import { toast } from "sonner";
import { isAxiosError } from "axios";

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