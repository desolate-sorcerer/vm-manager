import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"
import { useState, useEffect } from "react";


const handleSubmit = () => {
}

function DashBoard() {

  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const getXML = (async () => {
      try {
        const res = await fetch("http://localhost:3000/getXML");
        const data = await res.json();
        setMachines(data)
      }
      catch (err) {
        console.log(err.message);
      }
    });
    getXML();
  }, []);

  return (
    <div className="DashBoard">
      <div className="DashBoard-header">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="search..." className="DashBoard-search" />
          <div>
            <input type="submit" value="filter" className="DashBoard-submit" />
          </div>
        </form>
      </div>
      <div className="DashBoard-main">
        {machines.map((x) => {
          return (
            <InstanceCard instance={x} />
          )
        })}
      </div>
    </div>
  )
}

export default DashBoard;
