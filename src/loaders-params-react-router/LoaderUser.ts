import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { toast } from "sonner";


export async function loaderUser({id}: { id: string | undefined }) {
    try {
        const url = API_URL;
        const response = await axios.get(`${url}/auth/user/${id}`, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        toast.error("Error al cargar el usuario", {
            description: "Ha ocurrido un error al cargar los datos del usuario. Por favor, inténtalo de nuevo.",
        });
        return undefined;
    }
}