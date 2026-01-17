import NetworkCard from "../../components/NetworkCard/NetworkCard"
import NetworkInfo from "../../components/NetworkInfo/NetworkInfo"

import { useEffect, useState } from "react"
import "./Network.css"

function Network() {

  const [info, setInfo] = useState(null)
  const [networks, setNetworks] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
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
    getNetworks()
  }, [])

  return (
    <div className="Dashboard">
      {info == null ? (
        <div>
          <div className="DashBoard-header">
            <div>
              <h1>Network</h1>
              <p>Manage and monitor all your network</p>
            </div>
            <div>
              <div className="DashBoard-header-button">add Network</div>
            </div>
          </div>
          <div className="DashBoard-filters">
          </div>
          <div className="DashBoard-instances">
            <div className="DashBoard-menu">
              <div>Name</div>
              <div>Status</div>
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
      ) : <NetworkInfo data={info} onClick={handleNetwork} />}
    </div>
  )
}

export default Network

