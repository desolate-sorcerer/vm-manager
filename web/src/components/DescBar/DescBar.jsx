import "./DescBar.css"

function DescBar({ data }) {
  const ram = data.ram / 1000
  return (
    <div className="Desc-bar">

      <div className="Desc-bar-header">
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">Device Name:</p>
          <p>{data.name}</p>
        </div>
      </div>

      <div className="Desc-bar-container">
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">RAM:</p>
          <p>{ram} Mb</p>
        </div>
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">CPU:</p>
          <p>{data.cpu}</p>
        </div>
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">Network:</p>
          <p>{data.network}</p>
        </div>
      </div>
    </div>
  )
}

export default DescBar;
