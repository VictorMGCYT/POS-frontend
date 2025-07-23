import { useTokenStore } from "@/global/states/tokenStore";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export interface User {
    id:              string;
    username:        string;
    firstName:       string;
    paternalSurname: string;
    maternalSurname: string;
    role:            string;
    createdAt:       Date;
}


export function useUsers() {
    const token = useTokenStore.getState().token;
    const [users, setUsers] = useState<User[]>([]);
    const url = API_URL;

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            
            setUsers(data)

        } catch (error) {
            toast.error("Error al obtener los usuarios", {
                description: "Por favor, inténtalo de nuevo más tarde.",
            });
        }
    };

    return { users, fetchUsers };
}