import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './routes/Login/Login.tsx';
import Sales from './routes/Sales/Sales.tsx';
import ProtectRoutes from './ProtectedRoutes.tsx';
import Inventario from './routes/Inventario/Inventario.tsx';
import CashCut from './routes/Cash-cut/CashCut.tsx';
import { Reports } from './routes/Reports/Reports.tsx';
import QrCodeGenrator from './routes/Qr-Code/QrCodeGenerator.tsx';
import UsersModule from './routes/Users/Users.tsx';
import Layout from './Layout.tsx';
import { EditUserDialog } from './routes/Users/components/EditUserDialog.tsx';
import DialogEditProduct from './routes/Inventario/Components/DialogEditProduct.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    element: <Layout/>,
    children: [
      {
        path: "ventas",
        element: <Sales/>
      },
      {
        path: "inventario",
        element: <ProtectRoutes permitedRole="admin"><Inventario/></ProtectRoutes>,
        children: [
          {
            path: "editar-producto/:productId",
            element: <DialogEditProduct/>
          }
        ]
      },
      {
        path: "corte-de-caja",
        element: <CashCut/>
      },
      {
        path: "reportes",
        element: <ProtectRoutes permitedRole="admin"><Reports/></ProtectRoutes>
      },
      {
        path: "generador-qr",
        element: <ProtectRoutes permitedRole="admin"><QrCodeGenrator/></ProtectRoutes>
      },
      {
        path: "usuarios",
        element: <ProtectRoutes permitedRole="admin"><UsersModule/></ProtectRoutes>,
        children: [
          {
            path: "editar/:id",
            element: <EditUserDialog/>,
          }
        ]
      }
    ]

  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
      <Toaster richColors/>
  </StrictMode>,
)
