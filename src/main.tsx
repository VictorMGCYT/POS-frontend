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
import { LoaderUser } from './loaders-react-router/LoaderUser.ts';
import DialogEditProduct from './routes/Inventario/Components/DialogEditProduct.tsx';
import { LoaderProducts } from './loaders-react-router/LoaderProducts.ts';

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
            element: <DialogEditProduct/>,
            loader: async ({params}) => {
              return LoaderProducts(params);
            }
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
            path: ":id",
            element: <EditUserDialog/>,
            loader: async ({ params }) => {
              return LoaderUser(params);
            }
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
