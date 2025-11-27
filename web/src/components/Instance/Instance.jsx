import "./Instance.css"
function Instance({ data }) {
  return (
    <div className="instance">

      <div className="instance-header">
        <h1>Ubuntu</h1>
      </div>

      <div className="instance-info-container">
        <div className="instance-info-box">
          <p>STATUS</p>
          <p>Running</p>
        </div>
        <div className="instance-info-box">
          <p>PRIVATE IP</p>
          <p>192.168.1.122</p>
        </div>
        <div className="instance-info-box">
          <p>PUBLIC IP</p>
          <p>53.222.1.212</p>
        </div>
        <div className="instance-info-box">
          <p>vCPU</p>
          <p>4 cors</p>
        </div>
        <div className="instance-info-box">
          <p>DISK</p>
          <p>50Gb</p>
        </div>
        <div className="instance-info-box">
          <p>Region</p>
          <p>Ptuj</p>
        </div>
        <div className="instance-info-box">
          <p>MEMORY</p>
          <p>8Gb</p>
        </div>
        <div className="instance-info-box">
          <p>NETWORK</p>
          <p>localhost</p>
        </div>
      </div>

      <div className="instance-action-container">
        <h1>Actions</h1>
        <button>Start</button>
        <button>Stop</button>
        <button>Reboot</button>
        <button>Delete</button>
      </div>

      <div className="instance-resource-container">
        <p>CPU</p>
        <p>RAM</p>
        <p>DISK</p>
      </div>

    </div>
  )
}

export default Instance
