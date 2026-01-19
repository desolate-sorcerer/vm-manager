import NetworkCard from "../../components/NetworkCard/NetworkCard"
import { useNavigate } from "react-router"

import { useEffect, useState } from "react"
import "./Network.css"

function Network() {

  const [networks, setNetworks] = useState([])
  const [error, setError] = useState(false)
  let navigate = useNavigate()

  const getNetworks = (async () => {
    try {
      const res = await fetch("http://localhost:5000/getNetworks")
      const data = await res.json()
      if (data) {
        setNetworks(data)
      }
      else {
        console.log("cant get data")
      }
    }
    catch (err) {
      setError(true)
    }
  })

  const handleClick = async (network) => {
    try {
      fetch("http://localhost:5000/delNetwork", {
        method: 'POST',
        body: JSON.stringify({ name: network }),
        headers: {
          "Content-Type": "application/json",
        }
      });
    }
    catch (err) {
      setError(true);
      console.log(err.message);
    }
  }

  useEffect(() => {
    getNetworks()
  }, [])

  return (
    <div className="Dashboard">
      <div className="DashBoard-header">
        <div>
          <h1>Network</h1>
          <p>Manage and monitor all your network</p>
        </div>
        <div>
          <div className="DashBoard-header-button" onClick={() => navigate('/network/add')}>add Network</div>
        </div>
      </div>
      <div className="DashBoard-filters">
      </div>
      <div className="DashBoard-instances">
        <div className="Network-menu">
          <div>Name</div>
          <div>Status</div>
          <div></div>
          <div>Actions</div>
        </div>
        <div className="DashBoard-cards">
          {networks.map((i) => {
            return (
              <NetworkCard key={i.name} network={i} onClick={() => handleClick(i.name)} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Network

