import { useNavigate } from "react-router"
import PoolCard from "../../components/PoolCard/PoolCard"
import "./Pool.css"

import { useState, useEffect } from "react"

function Pool() {
  const [pool, setPool] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  let navigate = useNavigate()

  const listAllPools = async () => {
    try {
      const res = await fetch("http://localhost:5000/listAllPools");
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        console.log(data.error)
      }
      else {
        setPool(data)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    listAllPools()
  }, [])

  const handleClick = async (pool) => {
    try {
      const res = await fetch("http://localhost:5000/listVolumes", {
        method: "POST",
        body: JSON.stringify({ name: pool }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        console.log(data.error)
      }
      else {
        navigate(`/pool/${pool}/volumes`)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="Dashboard">
        <div className="DashBoard-header">
          <div>
            <h1>Pools</h1>
            <p>Manage your pools</p>
          </div>
          <div>
            <div className="DashBoard-header-button" onClick={() => navigate('/pool/add')}>add Pool</div>
          </div>
        </div>
        <div className="DashBoard-filters">
        </div>
        <div className="DashBoard-instances">
          <div className="pool-menu">
            <div>NAME</div>
            <div>AUTOSTART</div>
            <div>VOLUMES</div>
            <div>CAPACITY</div>
            <div>AVAILABLE</div>
            <div>ACTIONS</div>
          </div>
          <div className="DashBoard-cards">
            {pool.map((i) => {
              return (
                <PoolCard key={i.name} pool={i} onClick={() => handleClick(i.name)} />
              )
            })}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </div>
    </div>
  )
}

export default Pool
