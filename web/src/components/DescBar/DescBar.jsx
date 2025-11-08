import "./DescBar.css"

function DescBar() {
  return (
    <div className="Desc-bar">

      <div className="Desc-bar-header">
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">Device Name:</p>
          <p>ubuntu-linux</p>
        </div>
      </div>

      <div className="Desc-bar-container">
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">IP address:</p>
          <p>192.168.100.12</p>
        </div>
      </div>

      <div className="Desc-bar-container">
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">RAM:</p>
          <p>16Gb</p>
        </div>
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">CPU:</p>
          <p>AMD ryzen 3600</p>
        </div>
        <div className="Desc-bar-line">
          <p className="Desc-bar-title">OS:</p>
          <p>Linux</p>
        </div>
      </div>

      <div className="Desc-bar-container">
        <p className="Desc-bar-title">Description:</p>
        <p>second ubuntu machine</p>
      </div>

    </div>
  )
}

export default DescBar;
