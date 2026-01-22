import DashBoard from './pages/DashBoard/DashBoard'
import Network from './pages/Network/Network'
import AddNetwork from './pages/AddNetwork/AddNetwork'
import Pool from './pages/Pool/Pool'
import Volume from './pages/Volume/Volume'
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
        <Route path='/pool' element={<Pool />} />
        <Route path='/pool/:pool/volumes' element={<Volume />} />
      </Routes>
    </>
  )
}

export default App

