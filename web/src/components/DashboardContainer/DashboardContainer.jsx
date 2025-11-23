import "./DashboardContainer.css"
function DashboardContainer({ box }) {
  return (
    <div className="DashboardContainer">
      <p className="DashboardContainer-name">{box.type}</p>
      <p>{box.data}</p>
    </div>
  )
}

export default DashboardContainer;
