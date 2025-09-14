import "./InstanceCard.css"

function InstanceCard({ instance }: any) {
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-head">
        <h3>{instance.name}</h3>
        <p>IP: 127.0.0.1</p>
      </div>
      <div className="InstanceCard-desc">
        <p>{instance.desc}</p>
      </div>
    </div>
  )
}

export default InstanceCard;
