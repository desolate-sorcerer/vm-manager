import "./Navbar.css"
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaNetworkWired } from "react-icons/fa6";
import { FaServer } from "react-icons/fa6";
import { FaHardDrive } from "react-icons/fa6";
import { useState, useEffect, useRef } from 'react'
import { useAuth } from "../../context/AuthContext";


function SideBar() {
  const [open, setOpen] = useState(false)
  const pathname = useLocation().pathname
  const { logout } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="NavBar-profile" ref={menuRef}>
        <div onClick={() => setOpen(!open)}>
          <FaUser />
        </div>

        {open && (
          <div className="dropdown">
            <button onClick={handleChangePassword}>
              Change Password
            </button>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar;
