import "./InfoBox.css"

function InfoBox({ data }) {
  const ram = data.ram / 1000
  return (
    <div className="InfoBox">
      <div className="InfoBox-header">
        <div className="InfoBox-line">
          <p className="InfoBox-title">Device Name:</p>
          <p>{data.name}</p>
        </div>
      </div>

      <div className="InfoBox-line">
        <p className="InfoBox-title">RAM:</p>
        <p>{ram} Mb</p>
      </div>
      <div className="InfoBox-line">
        <p className="InfoBox-title">CPU:</p>
        <p>{data.cpu}</p>
      </div>
      <div className="InfoBox-line">
        <p className="InfoBox-title">Network:</p>
        <p>{data.network}</p>
      </div>
    </div>
  )
}

export default InfoBox;
