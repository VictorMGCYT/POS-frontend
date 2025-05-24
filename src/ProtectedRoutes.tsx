import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import useUser from "./hooks/useUser";
import { toast } from "sonner";



export default function ProtectRoutes({children, permitedRole}: {children: ReactNode, permitedRole: string}) {
    
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const roleUser = user.role;
            console.log(`Este es el protector ${user.role}`)
            if (roleUser != permitedRole) {
                
                setTimeout(() => {
                    toast.warning('Advertencia', {
                        description: 'No tienes permitido entrar a esta dirección'
                    })
                }, 500);
                navigate('/');
            }
        }
    }, [user])

    return(
        <>
            {children}
        </>
    )
}