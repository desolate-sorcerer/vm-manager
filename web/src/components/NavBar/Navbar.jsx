import "./Navbar.css"
import { Link } from "react-router"
import { useLocation } from "react-router";
import { FaUser } from "react-icons/fa";


function SideBar() {
  const pathname = useLocation().pathname
  return (
    <div className="NavBar">
      <div className="NavBar-home">
        VM MANAGER
      </div>
      <div className="NavBar-links">
        <Link to="/" className="NavBar-link"><p className={`${pathname == '/' ? 'isActive' : ''}`}>Instances</p></Link>
        <Link to="/volume" className="NavBar-link"><p className={`${pathname == '/volume' ? 'isActive' : ''}`}>Volumes</p></Link>
        <Link to="/network" className="NavBar-link"><p className={`${pathname == '/network' ? 'isActive' : ''}`}>Network</p></Link>
        <Link to="/overview" className="NavBar-link"><p className={`${pathname == '/overview' ? 'isActive' : ''}`}>Overview</p></Link>
      </div>
      <div className="NavBar-profile">
        <div><FaUser /></div>
      </div>
    </div>
  )
}

export default SideBar;
