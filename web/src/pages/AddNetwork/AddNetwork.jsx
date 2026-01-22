import "./AddNetwork.css"
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
      const response = await fetch("http://localhost:5000/addNetwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add network");
      } else {
        changeMessage(data.msg);
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
    <div className="add-network-container">
      <h2>Add New Network</h2>

      <form className="add-network-form" onSubmit={handleSubmit}>
        <input
          className="add-network-input"
          type="text"
          placeholder="Enter network name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="add-network-button" type="submit">
          Add Network
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default AddNetwork
