import "./InstanceCard.css"

function InstanceCard({ instance }) {
  const status = instance.status == 'shut off' ? 'shut-off' : instance.status == 'paused' ? 'paused' : instance.status == 'running' ? 'running' : "white";
  const classes = `InstanceCard-circle ${status}`
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-head">
        <h3>{instance.name}</h3>
        <p className="InstanceCard-card-net">[{instance.network}]</p>
      </div>
      <div className="InstanceCard-desc">
        <p>{instance.desc}</p>
        <div className={classes} ></div>
      </div>
    </div>
  )
}

export default InstanceCard;
