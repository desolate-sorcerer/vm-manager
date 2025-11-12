import "./DescBar.css"
import InfoBox from "../InfoBox/InfoBox"

function DescBar({ data }) {
  return (
    <div className="Desc-bar">
      <div className="Desc-bar-nav">
        <div>Info</div>
        <div>Config</div>
        <div>Acces</div>
        <div>History</div>
        <div>System</div>
      </div>
      <InfoBox data={data} />
    </div>
  )
}

export default DescBar;
