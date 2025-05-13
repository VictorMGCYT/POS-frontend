import { Route, Routes } from "react-router"
import Login from "./routes/Login/Login"
import Layout from "./Layout";

function App() {

  return (
    <Routes>
      
      <Route index element={<Login/>}/>

      {/* TODO agregar más rutas */}
      <Route path="/" element={<Layout/>}>
        <Route path="ventas" element={<div>Hola</div>}/>
      </Route>
      
    </Routes>
  )
}

export default App
