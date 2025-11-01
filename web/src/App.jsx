import DashBoard from './pages/DashBoard/DashBoard'
import SideBar from "./components/SideBar/SideBar"
import { Routes, Route } from "react-router"
import "./App.css"

function App() {

  return (
    <>
      <SideBar />
      <Routes>
        <Route path="/" element={<DashBoard />} />
      </Routes>
    </>
  )
}

export default App
