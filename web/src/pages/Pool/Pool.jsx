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
    setError("");
    try {
      const res = await fetch("http://localhost:5000/listAllPools");
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to fetch pools")
        console.error(data.error)
      } else {
        setPool(data)
      }
    } catch (err) {
      setError(err.message)
      console.error(err.message)
    }
  }

  useEffect(() => {
    listAllPools()
  }, [])

  const handleClick = async (poolName) => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/listVolumes", {
        method: "POST",
        body: JSON.stringify({ name: poolName }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to list volumes")
        console.error(data.error)
      } else {
        navigate(`/pool/${poolName}/volumes`)
      }
    } catch (err) {
      setError(err.message)
      console.error(err.message)
    }
  }

  return (
    <div>
      <div>
        <div className="page-header">
          <div>
            <h1>Pools</h1>
            <p>Manage your pools</p>
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <div className="page-items">
          <div className="pool-menu">
            <div>NAME</div>
            <div>AUTOSTART</div>
            <div>VOLUMES</div>
            <div>CAPACITY</div>
            <div>AVAILABLE</div>
            <div>ACTIONS</div>
          </div>
          <div>
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
