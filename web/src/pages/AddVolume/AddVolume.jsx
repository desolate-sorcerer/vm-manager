import { useParams } from "react-router";
import { useState, useEffect } from "react"
import "./Addvolume.css"

function AddVolume() {
  const { pool } = useParams()
  const [label, setLabel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/createVolume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pool,
          label,
          capacity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="add-volume-form">
        <h2>Create Storage Volume</h2>

        <input
          type="text"
          className="add-volume-input"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />

        <input
          type="text"
          className="add-volume-input"
          placeholder="Capacity (GB)"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />

        <button type="submit" className="add-volume-submit">Create</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default AddVolume
