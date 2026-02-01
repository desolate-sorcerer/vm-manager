import { useNavigate, useParams } from "react-router"
import { useState, useEffect } from "react"
import VolumeCard from "../../components/VolumeCard/VolumeCard"
import "./Volume.css"

function Volume() {
  const { pool } = useParams()
  const [volumes, setVolumes] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const listVolumes = async (poolName) => {
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
        setError(data.error || "Failed to fetch volumes")
        console.error(data.error)
      } else {
        setVolumes(data)
      }
    } catch (err) {
      setError(err.message)
      console.error(err.message)
    }
  }

  useEffect(() => {
    if (pool) {
      listVolumes(pool)
    }
  }, [pool])

  const handleClick = async (volumeName) => {
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/deleteVolume", {
        method: "POST",
        body: JSON.stringify({ name: volumeName, pool: pool }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        console.error(data.error)
      } else {
        changeMessage(data.message)
        await listVolumes(pool)
      }
    } catch (err) {
      setError(err.message)
      console.error(err.message)
    }
  }

  const changeMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div>
      <div>
        <div className="page-header">
          <div>
            <h1>Volumes</h1>
            <p>Manage your volumes</p>
          </div>
          <div>
            <div className="page-header-button" onClick={() => navigate(`/pool/${pool}/volumes/add`)}>add Volume</div>
          </div>
        </div>
        <div className="page-items">
          <div className="volume-menu">
            <div>NAME</div>
            <div>ACTIONS</div>
          </div>
          <div>
            {volumes.map((i) => {
              return (
                <VolumeCard key={i.name} volume={i} onClick={() => handleClick(i.name)} />
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

export default Volume
