import DashBoard from './pages/DashBoard/DashBoard'
import NavBar from "./components/NavBar/Navbar"
import { Routes, Route } from "react-router"
import "./App.css"
function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DashBoard />} />
      </Routes>
    </>
  )
}

export default App
