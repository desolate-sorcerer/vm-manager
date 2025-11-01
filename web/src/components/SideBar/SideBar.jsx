import "./SideBar.css"
import { Link } from "react-router"

function SideBar() {
  return (
    <div className="SideBar">
      <div className="SideBar-button">
        CREATE
      </div>
      <div className="SideBar-navBar">
        <Link to="/" className="SideBar-link"><p>Instances</p></Link>
        <Link to="/volume" className="SideBar-link"><p>Volumes</p></Link>
        <Link to="/network" className="SideBar-link"><p>Network</p></Link>
        <Link to="/overview" className="SideBar-link"><p>Overview</p></Link>
      </div>
      <div className="SideBar-profile">
        <p>profile</p>
      </div>
    </div>
  )
}

export default SideBar;
