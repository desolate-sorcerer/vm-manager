import "./PoolCard.css"

function PoolCard({ pool, onClick }) {
  let start = pool.autostart == 1 ? "true" : "false"
  return (
    <div className="PoolCard-card">
      <div className="PoolCard-link" onClick={onClick}>{pool.name}</div>
      <div>{start}</div>
      <div>{pool.volumes}</div>
      <div>{pool.capacity} GB</div>
      <div>{pool.available} GB</div>
      <div>:</div>
    </div>
  )
}

export default PoolCard
