import DashBoard from './pages/DashBoard/DashBoard'
import Network from "./pages/Network/Network"
import AddNetwork from './pages/addNetwork/AddNetwork'
import NavBar from "./components/NavBar/Navbar"
import { Routes, Route } from "react-router"
import "./App.css"
function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/network" element={<Network />} />
        <Route path="/network/add" element={<AddNetwork />} />
      </Routes>
    </>
  )
}

export default App

