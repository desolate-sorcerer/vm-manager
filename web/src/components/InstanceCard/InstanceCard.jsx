import "./InstanceCard.css"

function InstanceCard({ instance, onClick }) {
  const status = instance.status == 'shut off' ? 'shut-off' : instance.status == 'paused' ? 'paused' : instance.status == 'running' ? 'running' : "white";
  const classes = `InstanceCard-status ${status}`
  const ram = Math.floor(instance.ram / 1000000)
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-link" onClick={onClick}>{instance.name}</div>
      <div className={classes}>{instance.status}</div>
      <div>Ptuj</div>
      <div>192.168.1.50</div>
      <div>42.118.4.52</div>
      <div>{instance.cpu}</div>
      <div>{ram}GB</div>
      <div>40GB</div>
      <div className="InstanceCard-link">{instance.network}</div>
      <div>:</div>
    </div>
  )
}

export default InstanceCard;
