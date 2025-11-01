import InstanceCard from "../../components/InstanceCard/InstanceCard";
import "./DashBoard.css"
import { useState, useEffect } from "react";
import Error from "../Error/Error.jsx";


const handleSubmit = () => {
}

function DashBoard() {

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [code, setCode] = useState();

  useEffect(() => {
    const getXML = (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/getDesc");
        const data = await res.json();
        setMachines(data)
        setLoading(false);
      }
      catch (err) {
        setError(true);
        setCode(err.message)
        console.log(err.message);
      }
    });
    getXML();
  }, []);

  return (
    <div>{error ? <Error code={code} /> :
      <div className="DashBoard">
        <div className="DashBoard-header">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="search..." className="DashBoard-search" />
            <div>
              <input type="submit" value="filter" className="DashBoard-submit" />
            </div>
          </form>
        </div>

        {loading ? <p>Loading...</p> :
          <div className="DashBoard-main">
            {machines.map((x) => {
              return (
                x.map((i) => {
                  return (
                    <InstanceCard instance={i} />
                  )
                }))
            })}
          </div>
        }
      </div>
    }
    </div>
  )
}

export default DashBoard;
