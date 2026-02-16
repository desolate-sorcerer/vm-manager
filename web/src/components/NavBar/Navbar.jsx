import "./Navbar.css"
import { Link } from "react-router"
import { useLocation } from "react-router";
import { FaUser } from "react-icons/fa";
import { FaNetworkWired } from "react-icons/fa6";
import { FaServer } from "react-icons/fa6";
import { FaHardDrive } from "react-icons/fa6";

function SideBar() {
  const pathname = useLocation().pathname
  return (
    <div className="NavBar">
      <div className="NavBar-home">
        <div>
          VM MANAGER
        </div>
      </div>
      <div className="NavBar-links">
        <Link to="/" className={`${pathname == '/' ? 'isActive NavBar-link' : 'NavBar-link'}`}>
          <FaServer /><p>Instances</p>
        </Link>
        <Link to="/pool" className={`${pathname == '/pool' ? 'isActive NavBar-link' : 'NavBar-link'}`}>
          <FaHardDrive /><p>Volumes</p>
        </Link>
        <Link to="/network" className={`${pathname == '/network' ? 'isActive NavBar-link' : 'NavBar-link'}`}>
          <FaNetworkWired /><p>Network</p>
        </Link>
      </div>
      <div className="NavBar-profile">
        <div><FaUser /></div>
      </div>
    </div>
  )
}

export default SideBar;
