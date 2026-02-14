import "./NetworkCard.css"
import { FaTrashAlt } from "react-icons/fa";

function NetworkCard({ network, onClick }) {
  return (
    <div className="NetworkCard-card">
      <div>{network.name}</div>
      <div className="NetworkCard-status">{network.status}</div>
      <div></div>
      <div className="InstanceCard-del" onClick={onClick}><FaTrashAlt /></div>
    </div>
  )
}

export default NetworkCard
