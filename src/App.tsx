import Login from './routes/Login/Login';
import Sales from './routes/Sales/Sales';
import ProtectRoutes from './ProtectedRoutes';
import Inventario from './routes/Inventario/Inventario';
import CashCut from './routes/Cash-cut/CashCut';
import { Reports } from './routes/Reports/Reports';
import QrCodeGenrator from './routes/Qr-Code/QrCodeGenerator';
import UsersModule from './routes/Users/Users';
import Layout from './Layout';
import { EditUserDialog } from './routes/Users/components/EditUserDialog';
import DialogEditProduct from './routes/Inventario/Components/DialogEditProduct';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="ventas" element={<Sales />} />
        <Route
          path="inventario"
          element={
            <ProtectRoutes permitedRole="admin">
              <Inventario />
            </ProtectRoutes>
          }
        >
          <Route path="editar-producto/:productId" element={<DialogEditProduct />} />
        </Route>
        <Route path="corte-de-caja" element={<CashCut />} />
        <Route
          path="reportes"
          element={
            <ProtectRoutes permitedRole="admin">
              <Reports />
            </ProtectRoutes>
          }
        />
        <Route
          path="generador-qr"
          element={
            <ProtectRoutes permitedRole="admin">
              <QrCodeGenrator />
            </ProtectRoutes>
          }
        />
        <Route
          path="usuarios"
          element={
            <ProtectRoutes permitedRole="admin">
              <UsersModule />
            </ProtectRoutes>
          }
        >
          <Route path="editar/:id" element={<EditUserDialog />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
