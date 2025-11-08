import "./SideBar.css"
import { Link } from "react-router"
import { useLocation } from "react-router";

function SideBar() {
  const pathname = useLocation().pathname
  return (
    <div className="SideBar">
      <div className="SideBar-button">
        VM-MANAGER
      </div>
      <div className="SideBar-navBar">
        <Link to="/" className="SideBar-link"><p className={`${pathname == '/' ? 'isActive' : ''}`}>Instances</p></Link>
        <Link to="/volume" className="SideBar-link"><p className={`${pathname == '/volume' ? 'isActive' : ''}`}>Volumes</p></Link>
        <Link to="/network" className="SideBar-link"><p className={`${pathname == '/network' ? 'isActive' : ''}`}>Network</p></Link>
        <Link to="/overview" className="SideBar-link"><p className={`${pathname == '/overview' ? 'isActive' : ''}`}>Overview</p></Link>
      </div>
      <div className="SideBar-profile">
      </div>
    </div>
  )
}

export default SideBar;
