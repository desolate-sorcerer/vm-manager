import "./InstanceCard.css"

function InstanceCard({ instance }: any) {
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-head">
        <h3>{instance.name}</h3>
        <p>IP: {instance.ip}</p>
      </div>
      <div className="InstanceCard-desc">
        <p>{instance.date}/{instance.os}/{instance.version}</p>
      </div>
    </div>
  )
}

export default InstanceCard;
