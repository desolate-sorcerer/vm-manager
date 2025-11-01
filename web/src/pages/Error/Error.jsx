import "./Error.css"

function Error({ code }) {
  return (
    <div>
      <div className="error-container">
        <h1>{code}</h1>
      </div>
    </div>
  )
}

export default Error;
