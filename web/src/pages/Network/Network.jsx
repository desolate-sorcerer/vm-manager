import NetworkCard from "../../components/NetworkCard/NetworkCard"
import { useNavigate } from "react-router"

import { useEffect, useState } from "react"
import "./Network.css"

function Network() {

  const [networks, setNetworks] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  let navigate = useNavigate()

  const getNetworks = (async () => {
    try {
      const res = await fetch("http://localhost:5000/getNetworks")
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        console.log(data.error)
      }
      else {
        setNetworks(data)
        changeMessage(data.message)
      }
    }
    catch (err) {
      setError(err.message)
      console.log(err.message)
    }
  })

  const handleClick = async (network) => {
    try {
      const res = await fetch("http://localhost:5000/delNetwork", {
        method: 'POST',
        body: JSON.stringify({ name: network }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        console.log(data.error)
      }
      else {
        getNetworks()
        changeMessage(data.message)
      }
    }
    catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  }

  const changeMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }


  useEffect(() => {
    getNetworks()
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Network</h1>
          <p>Manage and monitor all your network</p>
        </div>
        <div>
          <div className="page-header-button" onClick={() => navigate('/network/add')}>add Network</div>
        </div>
      </div>
      <div className="page-items">
        <div className="Network-menu">
          <div>NAME</div>
          <div>STATUS</div>
          <div></div>
          <div>ACTIONS</div>
        </div>
        <div>
          {networks.map((i) => {
            return (
              <NetworkCard key={i.name} network={i} onClick={() => handleClick(i.name)} />
            )
          })}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default Network

