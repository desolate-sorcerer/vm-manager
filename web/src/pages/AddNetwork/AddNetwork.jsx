import { useState } from "react"

function AddNetwork() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Network name is required");
      return;
    }

    try {
      const response = await fetch("/api/addNetwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add network");
      } else {
        changeMessage(data.message);
        setName("");
      }
    } catch (err) {
      setError("Server not reachable");
    }
  };


  const changeMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div>
      <form className="add-form" onSubmit={handleSubmit}>
        <h2 className="add-form-header">Add New Network</h2>
        <div>
          <p className="add-form-label">Network name</p>
          <input
            className="add-form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button className="add-form-submit" type="submit">
          Add Network
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default AddNetwork
