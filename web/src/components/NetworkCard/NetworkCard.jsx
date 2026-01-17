function NetworkCard({ network, onClick }) {
  return (
    <div>
      <div>{network.name}</div>
      <div>{network.status}</div>
    </div>
  )
}

export default NetworkCard
