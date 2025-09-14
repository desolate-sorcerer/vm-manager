import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"
import { useState, useEffect } from "react";


const handleSubmit = () => {
}

function DashBoard() {

  const [machines, setMachines] = useState({ name: "", desc: "" });

  useEffect(() => {
    const getXML = (async () => {
      try {
        const res = await fetch("http://localhost:3000/getXML");
        const xml = await res.json();
        const card = { name: xml.name, desc: xml.desc }
        setMachines(card);
      }
      catch (err: any) {
        console.log(err.message);
      }
    });
    getXML();
  }, []);

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
        <InstanceCard instance={machines} />
        <InstanceCard instance={machines} />
        <InstanceCard instance={machines} />
        <InstanceCard instance={machines} />
      </div>
    </div>
  )
}

export default DashBoard;
