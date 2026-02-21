import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function DashBoard() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  let navigate = useNavigate();

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
        navigate(`/instance/${machineName}`)
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };



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
      <div>
        <div className="page-header">
          <div>
            <h1>Virtual Machine Instances</h1>
            <p>Manage and monitor your virtual machines</p>
          </div>
          <div>
            <div className="page-header-button" onClick={() => navigate("/addInstance")}>Create Instance</div>
          </div>
        </div>
        <div className="page-items">
          <div className="DashBoard-menu">
            <div>Name</div>
            <div>Status</div>
            <div>vCPU</div>
            <div>Memory</div>
            <div>Network</div>
            <div>Actions</div>
          </div>
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
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
