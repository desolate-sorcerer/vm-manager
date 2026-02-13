import DashboardContainer from "../../components/DashboardContainer/DashboardContainer";
function Overview() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Monitor your performance</p>
        </div>
      </div>
      <div className="DashBoard-containers">
        <DashboardContainer box={{ type: "Total Instances", data: "5" }} />
        <DashboardContainer box={{ type: "Running", data: "4" }} />
        <DashboardContainer box={{ type: "Stopped", data: "1" }} />
        <DashboardContainer box={{ type: "Total vCPU", data: "12" }} />
      </div>
    </div>
  )
}

export default Overview
