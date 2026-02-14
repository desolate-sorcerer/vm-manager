import "./InstanceCard.css"
import { FaTrashAlt } from "react-icons/fa";

function InstanceCard({ instance, onClick, del }) {
  const status = instance.status == 'shut off' ? 'shut-off' : instance.status == 'paused' ? 'paused' : instance.status == 'running' ? 'running' : "white";
  const classes = `InstanceCard-status ${status}`
  const ram = Math.floor(instance.ram / 1000000)
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-link" onClick={onClick}>{instance.name}</div>
      <div className={classes}>{instance.status}</div>
      <div>{instance.cpu}</div>
      <div>{ram}GB</div>
      <div>{instance.network}</div>
      <div onClick={del} className="InstanceCard-del"><FaTrashAlt /></div>
    </div>
  )
}

export default InstanceCard;
