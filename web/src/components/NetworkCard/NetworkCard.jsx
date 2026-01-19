import "./NetworkCard.css"

function NetworkCard({ network, onClick }) {
  return (
    <div className="NetworkCard-card">
      <div>{network.name}</div>
      <div className="NetworkCard-status">{network.status}</div>
      <div></div>
      <div className="NetworkCard-link" onClick={onClick}>del</div>
    </div>
  )
}

export default NetworkCard
