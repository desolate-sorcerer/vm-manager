import "./InstanceCard.css"
import { FaComputer } from "react-icons/fa6";

function InstanceCard({ instance }) {
  const status = instance.status == 'shut off' ? 'shut-off' : instance.status == 'paused' ? 'paused' : instance.status == 'running' ? 'running' : "white";
  const classes = `InstanceCard-circle ${status}`
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-name">
        <FaComputer />
        <span> {instance.name}</span>
      </div>
      <div>
        <p>{instance.network}</p>
      </div>
      <div>
        <span className={classes}></span>
        <span> {status}</span>
      </div>
      <div>
        <p>12-12-2014</p>
      </div>
    </div>
  )
}

export default InstanceCard;
