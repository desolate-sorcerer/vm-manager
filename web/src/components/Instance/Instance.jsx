import "./Instance.css"
import { FaArrowLeft } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa6";
import { useState } from 'react'



function Instance({ data, onClick }) {
  const [message, setMessage] = useState('default');

  const handleState = async (opt) => {
    try {
      const res = await fetch("http://localhost:5000/api/changeState", {
        method: 'POST',
        body: JSON.stringify({ name: data.name, option: opt }),
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

  const ram = Math.floor(data.ram / 1000000)
  return (
    <div className="instance">
      <div className="instance-header">
        <div className="instance-header-back" onClick={onClick}>
          <FaArrowLeft />
          <p>Go Back</p>
        </div>
        <h1>{data.name}</h1>
      </div>

      <div className="instance-info-container">
        <div className="instance-info-box">
          <p>STATUS</p>
          <p>{data.status}</p>
        </div>
        <div className="instance-info-box">
          <p>PRIVATE IP</p>
          <p>192.168.1.122</p>
        </div>
        <div className="instance-info-box">
          <p>PUBLIC IP</p>
          <p>53.222.1.212</p>
        </div>
        <div className="instance-info-box">
          <p>vCPU</p>
          <p>{data.cpu} cores</p>
        </div>
        <div className="instance-info-box">
          <p>DISK</p>
          <p>50GB</p>
        </div>
        <div className="instance-info-box">
          <p>REGION</p>
          <p>Ptuj</p>
        </div>
        <div className="instance-info-box">
          <p>MEMORY</p>
          <p>{ram}GB</p>
        </div>
        <div className="instance-info-box">
          <p>NETWORK</p>
          <p>{data.network}</p>
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

      <div className="instance-resource-container">
        <h3>Resource Usage</h3>
        <div className="resource-usage">
          <div className="resource-item">
            <p>CPU</p>
            <div className="resource-value">
              <div className="resource-bar1">
              </div>
            </div>
          </div>
          <div className="resource-item">
            <p>RAM</p>
            <div className="resource-value">
              <div className="resource-bar2">
              </div>
            </div>
          </div>
          <div className="resource-item">
            <p>DISK</p>
            <div className="resource-value">
              <div className="resource-bar3">
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Instance
