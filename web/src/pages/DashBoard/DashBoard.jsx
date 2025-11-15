import InstanceCard from "../../components/InstanceCard/InstanceCard";
import DescBar from "../../components/DescBar/DescBar"
import "./DashBoard.css"
import { useState, useEffect } from "react";
import Error from "../Error/Error.jsx";
import { FaUser } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";

const handleSubmit = () => {
}

function DashBoard() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [code, setCode] = useState();
  const [specs, setSpecs] = useState(null);

  const getXML = (async () => {
    setLoading(true);
    try {
      const store = await fetch("http://localhost:5000/api/storeDesc");
      const done = await store.json();
      if (done) {
        const res = await fetch("http://localhost:5000/api/getAllData");
        const data = await res.json();
        setMachines(data)
      }
      setLoading(false);
    }
    catch (err) {
      setError(true);
      setCode(err.message)
      console.log(err.message);
      setLoading(false);
    }
  });

  useEffect(() => {
    getXML()
  }, [])

  const handleRefresh = () => {
    getXML()
  }

  const handleClick = async (machineName) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/getData", {
        method: 'POST',
        body: JSON.stringify({ name: machineName }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      setSpecs(data);
      setLoading(false)
    }
    catch (err) {
      setError(true);
      setCode(err.message);
      console.log(err.message);
      setLoading(false)
    }
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
            <div className="DashBoard-main">
              <div className="DashBoard-refresh" onClick={() => handleRefresh()}><FaArrowsRotate /></div>
              {machines.map((i) => {
                return (
                  <InstanceCard key={i.name} instance={i} onClick={() => handleClick(i.name)} />
                )
              })}
            </div>
          </div>
          {specs ? (
            <div className="DashBoard-right">
              <DescBar data={specs} />
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
      </div>
    }
    </div>
  )
}

export default DashBoard;
