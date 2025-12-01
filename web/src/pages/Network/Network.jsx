function Network() {
  return (
    <div className="Dashboard">
      {specs == null ? (
        <div>
          <div className="DashBoard-header">
            <div>
              <h1>Network</h1>
              <p>Manage and monitor all your network</p>
            </div>
            <div>
              <div className="DashBoard-header-button">Create Network</div>
            </div>
          </div>
          <div className="DashBoard-filters">
            <Filter />
          </div>
          <div className="DashBoard-instances">
            <div className="DashBoard-menu">
              <div>Name</div>
              <div>Status</div>
              <div>CIDR</div>
              <div>Actions</div>
            </div>
            <div className="DashBoard-cards">
              {machines.map((i) => {
                return (
                  <InstanceCard key={i.name} instance={i} onClick={() => handleClick(i.name)} />
                )
              })}
            </div>
          </div>
        </div>
      ) : <Instance data={specs} onClick={handleNetwork} />}
    </div>
  )
}

export default Network
