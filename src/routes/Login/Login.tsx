import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { handleErrors, validateLogin } from "./validateData"
import axios from 'axios'
import { API_URL } from "@/global/variables/apiUrl"
import { useNavigate } from "react-router"
import { useTheme } from "@/hooks/useTheme"



function Login() {
  // Invocamos el hook para poder cargar el estado del dark mode
  useTheme();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    // función para validar los datos, está en validateData.ts
    const isValid = validateLogin(loginData);

    if(!isValid) return;

    try {
      const url = API_URL;
      setLoading(true);
      await axios.post(`${url}/auth/login`, {
        "username": loginData.username,
        "password": loginData.password
      });

      // Redirigimos a la pantalla principal de ventas
      navigate('/ventas');
    } catch (error: any) {
      // Función para manejar errores, está en validateData.ts
      handleErrors(error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <div className='flex flex-col w-full h-screen items-center justify-center'>
        <h1 className="text-4xl font-bold mb-8">
          Tienda POS
        </h1>
        <Card className="w-[90%] max-w-[500px] shadow-2xl dark:bg-slate-950">
          <CardHeader>
            <CardTitle className="text-2xl">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Label>
                Nombre de usuario:
              </Label>
              <Input
                onChange={ e => setLoginData( prev => ({...prev, username: e.target.value}))}
              />
              <Label>
                Contraseña:
              </Label>
              <Input
                onChange={ e => setLoginData(prev => ({...prev, password: e.target.value}))}
              />
              <Button 
                disabled={loading}
                className="mt-4 bg-blue-600 hover:bg-blue-800 hover:cursor-pointer dark:text-white"
                type="submit">
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center w-full">
            <p className="text-gray-500">
              @Ventry todos los derechos reservados.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default Login
