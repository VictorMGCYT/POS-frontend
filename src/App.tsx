import { Route, Routes } from "react-router"
import Login from "./routes/Login/Login"
import Layout from "./Layout";
import Sales from "./routes/Sales/Sales";
import Inventario from "./routes/Inventario/Inventario";
import ProtectRoutes from "./ProtectedRoutes";
import CashCut from "./routes/Cash-cut/CashCut";
import UsersModule from "./routes/Users/Users";
import { Reports } from "./routes/Reports/Reports";

function App() {

  return (
    <Routes>
      
      <Route index element={<Login/>}/>

      <Route path="/" element={<Layout/>}>
        <Route path="ventas" element={<Sales/>}/>
        <Route path="inventario" element={<ProtectRoutes permitedRole="admin"><Inventario/></ProtectRoutes>}/>
        <Route path="corte-de-caja" element={<CashCut/>}/>
        <Route path="usuarios" element={<ProtectRoutes permitedRole="admin"><UsersModule/></ProtectRoutes>}/>
        <Route path="reportes" element={<ProtectRoutes permitedRole="admin"><Reports/></ProtectRoutes>}/>

      </Route>
      
    </Routes>
  )
}

export default App
