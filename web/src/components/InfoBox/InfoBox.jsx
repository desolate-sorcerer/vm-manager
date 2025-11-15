import "./InfoBox.css"
import { useState } from "react"
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRegCirclePause } from "react-icons/fa6";
import { FaRegCircleStop } from "react-icons/fa6";

function InfoBox({ data }) {
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

  const ram = data.ram / 1000
  return (
    <div className="InfoBox">
      <div className="InfoBox-Specs">
        <div className="InfoBox-header">
          <div className="InfoBox-line">
            <p className="InfoBox-title">Device Name:</p>
            <p>{data.name}</p>
          </div>
        </div>
        <div className="InfoBox-line">
          <p className="InfoBox-title">RAM:</p>
          <p>{ram} Mb</p>
        </div>
        <div className="InfoBox-line">
          <p className="InfoBox-title">CPU:</p>
          <p>{data.cpu}</p>
        </div>
        <div className="InfoBox-line">
          <p className="InfoBox-title">Network:</p>
          <p>{data.network}</p>
        </div>
        <div>{message}</div>
      </div>
      <div className="InfoBox-button-container">
        <div className="InfoBox-button" onClick={() => handleState('start')}><FaRegCirclePlay /></div>
        <div className="InfoBox-button" onClick={() => handleState('suspend')}><FaRegCirclePause /></div>
        <div className="InfoBox-button" onClick={() => handleState('shutdown')}><FaRegCircleStop /></div>
      </div>
    </div>
  )
}

export default InfoBox;
