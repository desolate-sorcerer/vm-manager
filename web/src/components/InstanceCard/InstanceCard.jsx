import "./InstanceCard.css"
import { FaComputer } from "react-icons/fa6";

function InstanceCard({ instance, onClick }) {
  const status = instance.status == 'shut off' ? 'shut-off' : instance.status == 'paused' ? 'paused' : instance.status == 'running' ? 'running' : "white";
  const classes = `InstanceCard-circle ${status}`
  return (
    <div className="InstanceCard-card" onClick={onClick}>
      <div className="InstanceCard-name">
        <span className={classes}></span>
        <FaComputer />
        <span> {instance.name} ({instance.network})</span>
      </div>
    </div>
  )
}

export default InstanceCard;
