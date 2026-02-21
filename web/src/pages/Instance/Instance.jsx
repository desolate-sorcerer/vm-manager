import "./Instance.css"
import { FaArrowLeft } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa6";
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router";
import { PiPlaceholder } from "react-icons/pi";



function Instance() {
  const { machineName } = useParams()
  const [message, setMessage] = useState('');
  const [error, setError] = useState('')
  const [machine, setMachine] = useState({})
  const [name, setName] = useState('')

  let navigate = useNavigate()

  const getData = async (machineName) => {
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
        setMachine(data)
      }
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData(machineName)
  }, [machineName])



  const handleState = async (opt) => {
    try {
      const res = await fetch("http://localhost:5000/api/changeState", {
        method: 'POST',
        body: JSON.stringify({ name: machine.name, option: opt }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "error")
      }
      else {
        setMessage(data.msg)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }

  const goBack = () => {
    navigate('/')
  }

  const createFromTemplate = async (name) => {
    if (!name) {
      setError("Name is required")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/createFromTemplate", {
        method: 'POST',
        body: JSON.stringify({ template: machineName, name: name }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      }
      else {
        setMessage(data.message)
      }
    }
    catch (err) {
      setError(err.message)
    }
  }


  const ram = Math.floor(machine.ram / (1024 * 1024))
  return (
    <div className="instance">
      <div className="instance-header">
        <div className="instance-header-back" onClick={goBack}>
          <FaArrowLeft />
          <p>Go Back</p>
        </div>
        <h1>{machine.name}</h1>
      </div>

      <div className="instance-info-container">
        <div className="instance-info-box">
          <p>STATUS</p>
          <p>{machine.status}</p>
        </div>
        <div className="instance-info-box">
          <p>vCPU</p>
          <p>{machine.cpu} cores</p>
        </div>
        <div className="instance-info-box">
          <p>MEMORY</p>
          <p>{ram}GB</p>
        </div>
        <div className="instance-info-box">
          <p>NETWORK</p>
          <p>{machine.network}</p>
        </div>
      </div>

      <div className="instance-action-container">
        <h1>Actions</h1>

        <div className="instance-btn-container">
          <div className="instance-start-btn" onClick={() => handleState('start')}>
            <FaPlay />
            <button  >Start</button>
          </div>

          <div className="instance-normal-btn" onClick={() => handleState('suspend')}>
            <FaPause />
            <button>Stop</button>
          </div>

          <div className="instance-normal-btn">
            <FaArrowRotateLeft />
            <button >Reboot</button>
          </div>
          <div className="instance-delete-btn" onClick={() => handleState('shutdown')}>
            <FaRegSquare />
            <button >shutDown</button>
          </div>
        </div>
      </div>

      <div className="instance-template">
        <input type="text" placeholder="new_name" required value={name} onChange={e => setName(e.target.value)} />
        <button onClick={() => createFromTemplate(name)}>Create VM from template</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default Instance
