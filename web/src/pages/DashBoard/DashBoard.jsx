import InstanceCard from "../../components/InstanceCard/InstanceCard";
import DashboardContainer from "../../components/DashboardContainer/DashboardContainer";
import Filter from "../../components/Filter/Filter"
import Instance from "../../components/Instance/Instance"
import "./DashBoard.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function DashBoard() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [specs, setSpecs] = useState(null);

  const getXML = async () => {
    setError("");
    try {
      const store = await fetch("http://localhost:5000/api/storeDesc");
      const storeData = await store.json();

      if (!store.ok) {
        setError(storeData.error);
        return;
      }

      const res = await fetch("http://localhost:5000/api/getDesc");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setMachines(data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  useEffect(() => {
    getXML();
  }, []);

  const handleClick = async (machineName) => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/getData", {
        method: 'POST',
        body: JSON.stringify({ name: machineName }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSpecs(data);
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  function handleInstance() {
    setSpecs(null);
    setError("");
  }

  let navigate = useNavigate();

  const deleteVM = async (name) => {
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/rmInstance", {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setMessage(data.message);
        await getXML();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>


      {specs == null ? (
        <div>
          <div className="page-header">
            <div>
              <h1>Virtual Machine Instances</h1>
              <p>Manage and monitor all your virtual machine instances</p>
            </div>
            <div>
              <div className="page-header-button" onClick={() => navigate("/addInstance")}>Create Instance</div>
            </div>
          </div>
          <div className="DashBoard-filters">
            <Filter />
          </div>

          <div className="page-items">
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
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <div>
              {machines.map((i) => {
                return (
                  <InstanceCard
                    key={i.name}
                    instance={i}
                    onClick={() => handleClick(i.name)}
                    del={() => deleteVM(i.name)}
                  />
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
      ) : <Instance data={specs} onClick={handleInstance} />}
    </div>
  );
}

export default DashBoard;
