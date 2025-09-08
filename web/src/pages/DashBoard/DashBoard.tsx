import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"

const test_card: { name: string, ip: string, date: string, os: string, version: string } = {
  name: 'arch',
  ip: '10.0.1.12',
  date: '12.12.2000',
  os: 'archlinux',
  version: '6.14.4'
};

const handleSubmit = () => {
}

function DashBoard() {
  return (
    <div className="DashBoard">
      <div className="DashBoard-header">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="search..." className="DashBoard-search" />
          <div>
            <input type="submit" value="filter" className="DashBoard-submit" />
          </div>
        </form>
      </div>
      <div className="DashBoard-main">
        <InstanceCard instance={test_card} />
        <InstanceCard instance={test_card} />
        <InstanceCard instance={test_card} />
        <InstanceCard instance={test_card} />
      </div>
    </div>
  )
}

export default DashBoard;
