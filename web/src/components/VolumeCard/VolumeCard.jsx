import "./VolumeCard.css"

function VolumeCard({ volume }) {
  return (
    <div className="VolumeCard-card">
      <div>{volume.name}</div>
      <div>:</div>
    </div>
  )
}

export default VolumeCard
