import { API_URL } from "@/global/variables/variables";
import axios from "axios";

export interface UserData {
    id:              string;
    username:        string;
    firstName:       string;
    paternalSurname: string;
    maternalSurname: string;
    role:            string;
    createdAt:       Date;
    deletedAt:       null;
}


export async function LoaderUser(params: any) {
    try {
        const url = API_URL;
        const response = await axios.get(`${url}/auth/user/${params.id}`, {
            withCredentials: true
        });

        const data: UserData = response.data;

        return data;
    } catch (error) {
        throw new Response("Error al cargar el usuario");
    }
}