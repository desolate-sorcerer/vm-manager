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

  const listVolumes = async (pool) => {
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
        setVolumes(data)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    listVolumes(pool)
  }, [pool])

  const handleClick = () => {

  }

  return (
    <div>
      <div className="Dashboard">
        <div className="DashBoard-header">
          <div>
            <h1>Volumes</h1>
            <p>Manage your volumes</p>
          </div>
          <div>
            <div className="DashBoard-header-button" onClick={() => navigate(`/pool/${pool}/volumes/add`)}>add Volume</div>
          </div>
        </div>
        <div className="DashBoard-filters">
        </div>
        <div className="DashBoard-instances">
          <div className="volume-menu">
            <div>NAME</div>
            <div>ACTIONS</div>
          </div>
          <div className="DashBoard-cards">
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
