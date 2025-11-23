import InstanceCard from "../../components/InstanceCard/InstanceCard";
import DashboardContainer from "../../components/DashboardContainer/DashboardContainer";
import Filter from "../../components/Filter/Filter"
import "./DashBoard.css"
import { useState, useEffect } from "react";



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
        const res = await fetch("http://localhost:5000/api/getDesc");
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
    <div className="DashBoard">
      <div className="DashBoard-header">
        <div>
          <h1>Virtual Machine Intances</h1>
          <p>Manage and monitor all your virtual machine instances</p>
        </div>
        <div>
          <div className="DashBoard-header-button">Create Instance</div>
        </div>
      </div>
      <div className="DashBoard-filters">
        <Filter />
      </div>
      <div className="DashBoard-instances">
        <div className="DashBoard-menu">
          <div>Name</div>
          <div>Status</div>
          <div>Region</div>
          <div>Private IP</div>
          <div>Public IP</div>
          <div>vCPU</div>
          <div>Memory</div>
          <div>Disk</div>
          <div>Network</div>
          <div>Actions</div>
        </div>
        <div className="DashBoard-cards">
          {machines.map((i) => {
            return (
              <InstanceCard key={i.name} instance={i} onClick={() => handleClick(i.name)} />
            )
          })}
        </div>
      </div>
      <div className="DashBoard-containers">
        <DashboardContainer box={{ type: "Total Instances", data: "5" }} />
        <DashboardContainer box={{ type: "Running", data: "0" }} />
        <DashboardContainer box={{ type: "Stopped", data: "1" }} />
        <DashboardContainer box={{ type: "Total vCPU", data: "15" }} />
      </div>
    </div>
  )
}

export default DashBoard;
