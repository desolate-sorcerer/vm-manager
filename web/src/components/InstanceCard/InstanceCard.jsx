import "./InstanceCard.css"

function InstanceCard({ instance }) {
  return (
    <div className="InstanceCard-card">
      <div className="InstanceCard-head">
        <h3>{instance.name}</h3>
      </div>
      <div className="InstanceCard-desc">
        <p>{instance.desc}</p>
      </div>
    </div>
  )
}

export default InstanceCard;
