import { Route, Routes } from "react-router"
import Login from "./routes/Login/Login"
import Layout from "./Layout";
import Sales from "./routes/Sales/Sales";

function App() {

  return (
    <Routes>
      
      <Route index element={<Login/>}/>

      <Route path="/" element={<Layout/>}>
        <Route path="ventas" element={<Sales/>}/>
      </Route>
      
    </Routes>
  )
}

export default App
