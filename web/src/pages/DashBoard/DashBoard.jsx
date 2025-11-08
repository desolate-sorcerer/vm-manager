import InstanceCard from "../../components/InstanceCard/InstanceCard";
import DescBar from "../../components/DescBar/DescBar"
import "./DashBoard.css"
import { useState, useEffect } from "react";
import Error from "../Error/Error.jsx";
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
  const [desc, setDesc] = useState([]);


  useEffect(() => {
    const getXML = (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/storeDesc");
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

  const handleClick = (e) => {
    const getSpecs = (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/getData", {
          method: 'POST',
          body: JSON.stringify({ name: e }),
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        console.log(data)
        setLoading(false)
      }
      catch (err) {
        setError(true);
        setCode(err.message);
        console.log(err.message);
      }
    });
    getSpecs();
  }


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

        <div className="DashBoard-menu">
          <div className="DashBoard-left">
            {loading ? <p>Loading...</p> :
              <div className="DashBoard-main">
                {machines.map((i) => {
                  return (
                    <InstanceCard instance={i} onClick={() => handleClick(i.name)} />
                  )
                })}
              </div>
            }
          </div>
          <div className="DashBoard-right">
            <DescBar />
          </div>
        </div>
      </div>
    }
    </div>
  )
}

export default DashBoard;
