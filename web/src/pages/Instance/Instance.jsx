import "./Instance.css"
import { FaArrowLeft } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa6";
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router";



function Instance({ onClick }) {
  const { machineName } = useParams()
  const [message, setMessage] = useState('');
  const [error, setError] = useState('')
  const [machine, setMachine] = useState({})

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
  }, [])



  const handleState = async (opt) => {
    try {
      const res = await fetch("http://localhost:5000/api/changeState", {
        method: 'POST',
        body: JSON.stringify({ name: machine.name, option: opt }),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const result = await res.json()
      if (res.ok) {
        setMessage(result.msg)
      }
    }
    catch (error) {
      setMessage({ error })
    }
  }

  const goBack = () => {
    navigate('/')
  }


  const ram = Math.floor(machine.ram / 1000000)
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
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default Instance
