import DashBoard from './pages/DashBoard/DashBoard'
import Network from './pages/Network/Network'
import AddNetwork from './pages/AddNetwork/AddNetwork'
import Pool from './pages/Pool/Pool'
import Volume from './pages/Volume/Volume'
import NavBar from "./components/NavBar/Navbar"
import AddVolume from './pages/AddVolume/AddVolume'
import AddInstance from './pages/AddInstance/AddInstance'
import { Routes, Route } from "react-router"
import "./App.css"
function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/addInstance" element={<AddInstance />} />
        <Route path="/network" element={<Network />} />
        <Route path="/network/add" element={<AddNetwork />} />
        <Route path='/pool' element={<Pool />} />
        <Route path='/pool/:pool/volumes' element={<Volume />} />
        <Route path='/pool/:pool/volumes/add' element={<AddVolume />} />
      </Routes>
    </>
  )
}

export default App

