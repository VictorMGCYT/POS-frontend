import { useTokenStore } from "@/global/states/tokenStore";
import { useUserStore } from "@/global/states/userStore";
import { API_URL } from "@/global/variables/variables";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const url = API_URL;
export default function useUser() {
    const token = useTokenStore.getState().token;
    const navigate = useNavigate();
    
    useEffect(() => {
        async function loadUser() {
            try {
                const response = await axios.get(`${url}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const user = response.data;
                useUserStore.getState().setUser(user);
            } catch (error) {
                navigate('/')
            }
        }
        loadUser()
    }, [])

    return useUserStore((state) => state.user);
}