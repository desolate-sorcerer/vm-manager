import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"
import { useState, useEffect } from "react";
import Error from "../Error/Error.jsx";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaCog } from "react-icons/fa";

const handleSubmit = () => {
}

function DashBoard() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [code, setCode] = useState();


  useEffect(() => {
    const getXML = (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/getDesc");
        const data = await res.json();
        setMachines(data)
        setLoading(false);
      }
      catch (err) {
        setError(true);
        setCode(err.message)
        console.log(err.message);
      }
    });
    getXML();
  }, []);


  return (
    <div>{error ? <Error code={code} /> :
      <div className="DashBoard">
        <div className="DashBoard-header">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="search..." className="DashBoard-search" />
          </form>
          <div className="DashBoard-header-icons">
            <div><FaCog /></div>
            <div><FaQuestionCircle /></div>
            <div><FaUser /></div>
          </div>
        </div>

        {loading ? <p>Loading...</p> :
          <div className="DashBoard-main">
            <div className="DashBoard-main-header">
              <div>
                <span>Name</span>
                <FaAngleUp />
              </div>
              <div>
                <span>Network</span>
                <FaAngleDown />
              </div>
              <div>
                <span>Status</span>
                <FaAngleDown />
              </div>
              <div>
                <span>Date</span>
                <FaAngleDown />
              </div>
            </div>
            {machines.map((x) => {
              return (
                x.map((i) => {
                  return (
                    <InstanceCard instance={i} />
                  )
                }))
            })}
          </div>
        }
      </div>
    }
    </div>
  )
}

export default DashBoard;
