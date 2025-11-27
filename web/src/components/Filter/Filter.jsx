import "./Filter.css"

function Filter() {
  return (
    <div className="filter">
      <div className="filter-bar">
        <div>Name</div>
        <div>Status</div>
        <div>Region</div>
      </div>

      <div className="filter-inputs">
        <div className="filter-search">
          <input type="text" className="filter-search-input" placeholder="Search..." />
        </div>

        <div className="filter-options">
          <select className="filter-select">
            <option value="">All</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="paused">Paused</option>
          </select>

          <select className="filter-select">
            <option value="">All</option>
            <option value="us-west">Ptuj</option>
            <option value="us-east">Maribor</option>
            <option value="europe">Ljubljana</option>
          </select>
        </div>

      </div>
    </div>
  )
}

export default Filter
