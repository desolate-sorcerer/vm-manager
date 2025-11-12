import "./DescBar.css"
import InfoBox from "../InfoBox/InfoBox"
import AccessBox from "../AccessBox/AccessBox";
import { useState } from "react"

function DescBar({ data }) {
  const [box, setBox] = useState('info');

  const changeBox = (name) => {
    setBox(name);
  }


  return (

    <div className="Desc-bar">
      <div className="Desc-bar-nav">
        <div className="Desc-bar-link" onClick={() => changeBox('info')}>Info</div>
        <div className="Desc-bar-link" onClick={() => changeBox('access')}>Acces</div>
        <div className="Desc-bar-link" onClick={() => changeBox('history')}>History</div>
        <div className="Desc-bar-link" onClick={() => changeBox('system')}>System</div>
      </div>
      {box == 'info' ? <InfoBox data={data} /> :
        box == 'access' ? <AccessBox uri={data.uri} /> :
          <div></div>
      }
    </div>
  )
}

export default DescBar;
